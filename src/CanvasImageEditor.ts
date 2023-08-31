import {
  ComposeTargetFunction,
  Logger,
  ProcessingError,
  TargetMimetype,
} from './typings/CanvasImageEditor';
import {ConsoleLogger} from './CanvasImageEditorLogger';
import {Canvas} from './Canvas';
import {ElementImage} from './ElementImage';
import {Layer} from './Layer';
import {ComposeResult} from './ComposeResult';
import {TargetQuality} from './TargetQuality';

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
    // for (const promiseFn of this._promiseQueue) {
    //   await promiseFn();
    // }
    this._promiseQueue = [];
  }

  compose(targetFunction:
      ComposeTargetFunction = toBase64('image/png')): Promise<ComposeResult> {
    return new Promise<ComposeResult>((resolve, reject) => {
      try {
        this.processPromiseQueue()
            .then(() => {
              this._canvas.compose();
              const htmlCanvas = this._canvas.htmlCanvas();
              this._layers.forEach((layer) => {
                layer.compose(htmlCanvas);
              });
              const composeResult = targetFunction(this._canvas.htmlCanvas());
              resolve(composeResult);
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

  placeImage(URL: URL, x: number = 0, y: number = 0): this {
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

      const imageElement = new ElementImage(image);
      const width = image.width;
      const height = image.height;
      const layerIndex = this._layers.length;
      const layer = new Layer(imageElement, x, y, width, height, layerIndex);
      this._layers.push(layer);
      this.fitCanvasToContent();
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
        if (x > 0) {
          // layer.width(width);
          // layer.height(height);
          layer.offsetX(layer.offsetX() - x);
        }
        if (y > 0) {
          layer.offsetY(layer.offsetY() - y);
        }
      });
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

export function toBase64(
    mimetype?: TargetMimetype,
    quality?: number): ComposeTargetFunction {
  return (canvas) => {
    const targetQuality = new TargetQuality(quality);
    const base64Data = canvas.toDataURL(mimetype, targetQuality.value);
    const composeResult = new ComposeResult(base64Data, mimetype, 'base64');
    return composeResult;
  };
}
