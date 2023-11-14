/* eslint-disable max-len */
import {
  ComposeTargetFunction,
  Logger,
  ProcessingError,
  CoordinatePoint,
} from './typings/CanvasImageEditor';
import {ConsoleLogger} from './CanvasImageEditorLogger';
import {Canvas} from './Canvas';
import {ImageBitmap} from './ImageBitmap';
import {Layer} from './Layer';
import {ComposeResult} from './ComposeResult';
import {toPNG} from './composes/toPNG';
import {ImageSVG} from './ImageSVG';
import {drawArbitraryQuadImage, FILL_METHOD} from 'canvas-arbitrary-quads';

export class CanvasImageEditor {
  private _canvas: Canvas;
  private _layers: Array<Layer>;
  private _logger: Logger;
  private _showErrors: boolean = false;
  private _errorStack: Array<ProcessingError> = [];
  private _promiseQueue: Array<() => Promise<void>> = [];

  constructor() {
    this.setLogger(ConsoleLogger);
    this.createCanvas();
  }

  private enqueuePromise(promiseFn: () => Promise<void>): this {
    this._promiseQueue.push(promiseFn);
    return this;
  }

  private async processPromiseQueue(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const processNext = (index: number) => {
        if (index >= this._promiseQueue.length) {
          resolve();
          return;
        }
        const promiseFn = this._promiseQueue[index];
        promiseFn()
            .then(() => {
              processNext(index + 1);
            })
            .catch((error) => {
              reject(error);
            });
      };
      processNext(0);
    });

    this._promiseQueue = [];
  }

  compose(targetFunction:
      ComposeTargetFunction = toPNG()):
            Promise<[ComposeResult, HTMLCanvasElement]> {
    return new Promise<[ComposeResult, HTMLCanvasElement]>((resolve, reject) =>{
      try {
        this.processPromiseQueue()
            .then(() => {
              this._canvas.compose();
              const composePromises = this._layers.map(
                  (layer) => {
                    return layer.compose(this._canvas);
                  });
              return Promise.all(composePromises);
            })
            .then(() => {
              this._canvas.end();
              const htmlCanvas = this._canvas.htmlCanvas();
              const composeResult = targetFunction(htmlCanvas);
              resolve([composeResult, htmlCanvas]);
            })
            .catch((error) => {
              reject(error);
            });
      } catch (error) {
        reject(error);
      }
    });
  }

  private fitCanvasToContent(): this {
    let maxWidth = 0;
    let maxHeight = 0;
    this._layers.forEach((layer) => {
      maxWidth = Math.max(maxWidth, layer.offsetX() + layer.width());
      maxHeight = Math.max(maxHeight, layer.offsetY() + layer.height());
    });
    this._canvas.width(maxWidth);
    this._canvas.height(maxHeight);
    return this;
  }

  private createCanvas(): this {
    this._canvas = new Canvas(0, 0);
    this.resetLayers();
    return this;
  }

  resetLayers(): this {
    this.enqueuePromise(async () => {
      this._layers = [];
    });
    return this;
  }

  setLogger(logger: Logger): this {
    this._logger = logger;
    return this;
  }

  toggleErrors(showErrors: boolean): this {
    this._showErrors = showErrors;
    return this;
  }

  mask(mask: () => Promise<void>): this {
    this.enqueuePromise(async () => {
      this._layers.forEach((layer) => {
        layer.mask(mask);
      });
    });
    return this;
  }

  use(filter: () => Promise<void>): this {
    this.enqueuePromise(async () => {
      this._layers.forEach((layer) => {
        layer.use(filter);
      });
    });
    return this;
  }

  text(
      svgContent: string,
      fontCssUrl: URL[],
      x: number = 0,
      y: number = 0,
      boundaryWidth?: number,
      boundaryHeight?: number): this {
    this.enqueuePromise(async () => {
      function convertFontsFilesToBase64Data(fontCssUrl) {
        return new Promise((resolve, reject) => {
          if (Object.keys(fontCssUrl).length) {
            let svgCss = null;

            fontCssUrl.reduce((chain, url) => {
              return chain
                  .then(() => fetch(url))
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(`Failed to load ${url}`);
                    }
                    return response.text();
                  })
                  .then((fontCss) => {
                    svgCss += fontCss;
                  })
                  .catch((error) => {
                    console.error('Error loading font CSS:', error);
                  });
            }, Promise.resolve())

                .then(() => {
                  const fontUrl = Array.from(svgCss.matchAll(/url\(([^)]+)\)/g), (m) => m[1]);
                  return Promise.all(
                      fontUrl.map((url) => {
                        return fetch(url)
                            .then(async (response) => {
                              if (!response.ok) {
                                throw new Error(`Failed to load ${url}`);
                              }
                              return {url, response: await response.arrayBuffer()};
                            });
                      }));
                })

                .then((fontContents) => {
                  const urlDataPromises = fontContents.map((fontContent) => {
                    const uint8Array = new Uint8Array(fontContent.response);
                    let binary = '';
                    uint8Array.forEach((byte) => {
                      binary += String.fromCharCode(byte);
                    });
                    const base64 = btoa(binary);
                    return {url: fontContent.url, base64};
                  });
                  return Promise.all(urlDataPromises);
                })

                .then((base64Fonts) => {
                  return Promise.all(base64Fonts.map(({url, base64}) => {
                    svgCss = svgCss.replace(new RegExp(url, 'g'), `'data:font/woff2;base64,${base64}'`);
                  }));
                })

                .then(() => {
                  resolve(svgCss);
                })

                .catch((error) => {
                  reject(error);
                });
          } else {
            resolve('');
          }
        });
      }

      await convertFontsFilesToBase64Data(fontCssUrl)

          .then((svgCss) => {
            const svgData =
              `<svg xmlns="http://www.w3.org/2000/svg" text-anchor="middle" x="0" y="0" width="${this._canvas.width()}" height="${this._canvas.height()}" viewbox="0 0 ${this._canvas.width()} ${this._canvas.height()}">
              <defs>
                <style type="text/css">
                  ${svgCss}
                </style>
              </defs>
                ${svgContent}
              </svg>`;
            return new Promise<HTMLImageElement>((resolve, reject) => {
              const image = new Image();
              image.addEventListener('load', () => {
                resolve(image);
              });
              image.addEventListener('error', (error) => {
                reject(error);
              });
              image.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
            });
          })

          .then((image) => {
            let layerWidth = image.width;
            let layerHeight = image.height;
            let boundaryAspectRatio;
            let imageAspectRatio;
            if (boundaryWidth !== undefined && boundaryHeight !== undefined) {
              boundaryAspectRatio = boundaryWidth / boundaryHeight;
              imageAspectRatio = layerWidth / layerHeight;
              if (boundaryAspectRatio > imageAspectRatio) {
                layerHeight = Math.min(boundaryHeight, layerHeight);
                layerWidth = layerHeight * imageAspectRatio;
              } else {
                layerWidth = Math.min(boundaryWidth, layerWidth);
                layerHeight = layerWidth / imageAspectRatio;
              }
            }
            if ((x < 0 || y < 0) &&
                (!this._canvas.width() || !this._canvas.height())) {
              throw new Error(`The first image on the canvas ` +
                              `should not have negative x or y coordinates.`);
            }
            if (x < 0) {
              x = this._canvas.width() - (layerWidth + x * -1);
            }
            if (y < 0) {
              y = this._canvas.height() - (layerHeight + y * -1);
            }
            const imageElement = new ImageSVG(image);
            const layerIndex = this._layers.length;
            const layer = new Layer(
                imageElement,
                x, y,
                layerWidth, layerHeight,
                layerIndex);
            this._layers.push(layer);
            if (!this._canvas.width() || !this._canvas.height()) {
              this.fitCanvasToContent();
            }
          })
          .catch((error) => {
            console.error('Erro ao carregar a imagem:', error);
          });
    });

    return this;
  }

  placeVector(
      svgContent: string,
      x: number = 0,
      y: number = 0,
      boundaryWidth?: number,
      boundaryHeight?: number): this {
    this.enqueuePromise(async () => {
      const svgData =
      `<svg xmlns="http://www.w3.org/2000/svg" text-anchor="middle" x="0" y="0" width="${this._canvas.width()}" height="${this._canvas.height()}" viewbox="0 0 ${this._canvas.width()} ${this._canvas.height()}">
        ${svgContent}
      </svg>`;
      const image = new Image();
      const loadImagePromise = new Promise<void>((resolve, reject) => {
        image.addEventListener('load', () => {
          resolve();
        });
        image.addEventListener('error', (error) => {
          reject(error);
        });
      });

      image.src = `data:image/svg+xml;base64,${btoa(svgData)}`;

      await loadImagePromise;

      let layerWidth = image.width;
      let layerHeight = image.height;
      let boundaryAspectRatio;
      let imageAspectRatio;

      if (boundaryWidth !== undefined && boundaryHeight !== undefined) {
        boundaryAspectRatio = boundaryWidth / boundaryHeight;
        imageAspectRatio = layerWidth / layerHeight;
        if (boundaryAspectRatio > imageAspectRatio) {
          layerHeight = Math.min(boundaryHeight, layerHeight);
          layerWidth = layerHeight * imageAspectRatio;
        } else {
          layerWidth = Math.min(boundaryWidth, layerWidth);
          layerHeight = layerWidth / imageAspectRatio;
        }
      }

      if ((x < 0 || y < 0) &&
          (!this._canvas.width() || !this._canvas.height())) {
        throw new Error(`The first image on the canvas ` +
                        `should not have negative x or y coordinates.`);
      }

      if (x < 0) {
        x = this._canvas.width() - (layerWidth + x * -1);
      }
      if (y < 0) {
        y = this._canvas.height() - (layerHeight + y * -1);
      }

      const imageElement = new ImageSVG(image);
      const layerIndex = this._layers.length;
      const layer = new Layer(
          imageElement,
          x, y,
          layerWidth, layerHeight,
          layerIndex);
      this._layers.push(layer);
      if (!this._canvas.width() || !this._canvas.height()) {
        this.fitCanvasToContent();
      }
    });

    return this;
  }

  placeSVG(URL: URL,
      x: number = 0,
      y: number = 0,
      boundaryWidth?: number,
      boundaryHeight?: number): this {
    this.enqueuePromise(async () => {
      let svgContent = null;
      const loadSVGPromise = new Promise<void>((resolve, reject) => {
        fetch(URL.toString())
            .then((response) => {
              if (!response.ok) {
                throw new Error('Failed to fetch SVG file');
              }
              return response.text();
            })
            .then((fileContent) => {
              svgContent = fileContent;
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
      });

      await loadSVGPromise;

      const parser = new DOMParser();
      const svgDoc = parser
          .parseFromString(
              svgContent,
              'image/svg+xml');

      const viewBox = svgDoc.documentElement.getAttribute('viewBox');
      const [, , width, height] = viewBox.split(' ').map(parseFloat);

      svgDoc.documentElement.setAttribute('width', width.toString());
      svgDoc.documentElement.setAttribute('height', height.toString());

      const correctedSVG = new XMLSerializer()
          .serializeToString(svgDoc.documentElement);

      const base64SVG = btoa(correctedSVG);

      const image = new Image();
      image.src = `data:image/svg+xml;base64,${base64SVG}`;
      image.width = width;
      image.height = height;

      let layerWidth = image.width;
      let layerHeight = image.height;

      let boundaryAspectRatio;
      let imageAspectRatio;

      if (boundaryWidth !== undefined && boundaryHeight !== undefined) {
        boundaryAspectRatio = boundaryWidth / boundaryHeight;
        imageAspectRatio = layerWidth / layerHeight;
        if (boundaryAspectRatio > imageAspectRatio) {
          layerHeight = Math.min(boundaryHeight, layerHeight);
          layerWidth = layerHeight * imageAspectRatio;
        } else {
          layerWidth = Math.min(boundaryWidth, layerWidth);
          layerHeight = layerWidth / imageAspectRatio;
        }
      }

      if ((x < 0 || y < 0) &&
          (!this._canvas.width() || !this._canvas.height())) {
        throw new Error(`The first image on the canvas ` +
                        `should not have negative x or y coordinates.`);
      }

      if (x < 0) {
        x = this._canvas.width() - (layerWidth + x * -1);
      }
      if (y < 0) {
        y = this._canvas.height() - (layerHeight + y * -1);
      }

      const imageElement = new ImageSVG(image);
      const layerIndex = this._layers.length;
      const layer = new Layer(
          imageElement,
          x, y,
          layerWidth, layerHeight,
          layerIndex);
      this._layers.push(layer);
      if (!this._canvas.width() || !this._canvas.height()) {
        this.fitCanvasToContent();
      }
    });

    return this;
  }

  placeImage(URL: URL,
      x: number = 0,
      y: number = 0,
      boundaryWidth?: number,
      boundaryHeight?: number): this {
    this.enqueuePromise(async () => {
      const image = new Image();
      const loadImagePromise = new Promise<void>((resolve, reject) => {
        image.addEventListener('load', () => {
          resolve();
        });
        image.addEventListener('error', (error) => {
          reject(error);
        });
      });

      image.src = URL.toString();

      await loadImagePromise;

      let layerWidth = image.width;
      let layerHeight = image.height;
      let boundaryAspectRatio;
      let imageAspectRatio;

      if (boundaryWidth !== undefined && boundaryHeight !== undefined) {
        boundaryAspectRatio = boundaryWidth / boundaryHeight;
        imageAspectRatio = layerWidth / layerHeight;
        if (boundaryAspectRatio > imageAspectRatio) {
          layerHeight = Math.min(boundaryHeight, layerHeight);
          layerWidth = layerHeight * imageAspectRatio;
        } else {
          layerWidth = Math.min(boundaryWidth, layerWidth);
          layerHeight = layerWidth / imageAspectRatio;
        }
      }

      if ((x < 0 || y < 0) &&
          (!this._canvas.width() || !this._canvas.height())) {
        throw new Error(`The first image on the canvas ` +
                        `should not have negative x or y coordinates.`);
      }

      if (x < 0) {
        x = this._canvas.width() - (layerWidth + x * -1);
      }
      if (y < 0) {
        y = this._canvas.height() - (layerHeight + y * -1);
      }

      const imageElement = new ImageBitmap(image);
      const layerIndex = this._layers.length;
      const layer = new Layer(
          imageElement,
          x, y,
          layerWidth, layerHeight,
          layerIndex);
      this._layers.push(layer);
      if (!this._canvas.width() || !this._canvas.height()) {
        this.fitCanvasToContent();
      }
    });

    return this;
  }

  resizeToWidth(newCanvasWidth: number): this {
    this.enqueuePromise(async () => {
      const canvasWidth = this._canvas.width();
      const resizeProportion = newCanvasWidth / canvasWidth;
      this._canvas.resize(resizeProportion);
      this._layers.forEach((layer) => {
        layer.resize(resizeProportion);
      });
    });
    return this;
  }

  resizeToHeight(newCanvasHeight: number): this {
    this.enqueuePromise(async () => {
      const canvasHeight = this._canvas.height();
      const resizeProportion = newCanvasHeight / canvasHeight;
      this._canvas.resize(resizeProportion);
      this._layers.forEach((layer) => {
        layer.resize(resizeProportion);
      });
    });
    return this;
  }

  slice(x?: number, y?: number, width?: number, height?: number): this {
    this.enqueuePromise(async () => {
      const canvasWidth = this._canvas.width();
      const canvasHeight = this._canvas.height();
      if (x !== undefined && x > -1 && x < 1) {
        x = canvasWidth * x;
      }
      if (y !== undefined && y > -1 && y < 1) {
        y = canvasHeight * y;
      }
      if (width !== undefined && width > 0 && width < 1) {
        width = canvasWidth * width;
      }
      if (height !== undefined && height > 0 && height < 1) {
        height = canvasHeight * height;
      }
      if ([x, y, width, height].every((value) => value === undefined)) {
        throw new Error(`Invalid slice parameters. ` +
                        `At least one must be defined.`);
      }
      if (x === undefined) {
        x = 0;
      }
      if (y === undefined) {
        y = 0;
      }
      if (width === undefined) {
        width = canvasWidth - Math.abs(x);
      }
      if (height === undefined) {
        height = canvasHeight - Math.abs(y);
      }
      if (width + Math.abs(x) > canvasWidth ||
          height + Math.abs(y) > canvasHeight) {
        throw new Error('Sliced area is outside the canvas boundaries.');
      }
      this._canvas.width(width);
      this._canvas.height(height);
      this._layers.forEach((layer) => {
        // layer.width(width);
        // layer.height(height);
        if (x > 0) {
          layer.offsetX(layer.offsetX() - x);
        }
        if (y > 0) {
          layer.offsetY(layer.offsetY() - y);
        }
      });
    });
    return this;
  }

  transform(a: CoordinatePoint, b: CoordinatePoint, c: CoordinatePoint, d: CoordinatePoint): this {
    this.enqueuePromise(async () => {
      const canvasWidth = this._canvas.width();
      const canvasHeight = this._canvas.height();
      const canvas = document.createElement('canvas');
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const context = canvas.getContext('2d');

      const srcPoints = [
        {x: 0, y: 0},
        {x: 0, y: canvasHeight},
        {x: canvasWidth, y: canvasHeight},
        {x: canvasWidth, y: 0},
      ];

      const dstPoints = [
        {x: a.x, y: a.y},
        {x: d.x, y: d.y},
        {x: c.x, y: c.y},
        {x: canvasWidth - b.x, y: canvasHeight - b.y},
      ];

      drawArbitraryQuadImage(context, canvas, srcPoints, dstPoints, FILL_METHOD.BILINEAR);
    });
    return this;
  }

  crop(aspectRatio?: number): this {
    this.enqueuePromise(async () => {
      const canvasWidth = this._canvas.width();
      const canvasHeight = this._canvas.height();
      const imageAspectRatio = canvasWidth / canvasHeight;
      let x: number;
      let y: number;
      let width: number;
      let height: number;
      if (imageAspectRatio < aspectRatio) {
        width = this._canvas.width();
        height = this._canvas.width() / aspectRatio;
        x = 0;
        y = (this._canvas.height() - height) / 2;
      } else {
        width = this._canvas.height() * aspectRatio;
        height = this._canvas.height();
        x = (this._canvas.width() - width) / 2;
        y = 0;
      }
      if (width === undefined ||
          height === undefined ||
          x === undefined ||
          y === undefined) {
        throw new Error('Invalid crop parameters.');
      } else {
        this._canvas.width(width);
        this._canvas.height(height);
        this._layers.forEach((layer) => {
          layer.offsetX(layer.offsetX() - x);
          layer.offsetY(layer.offsetY() - y);
        });
      }
    });
    return this;
  }
}
