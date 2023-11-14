import {Canvas} from './Canvas';

export class ImageSVG {
  private _image: HTMLImageElement;
  private _maskQueue: Array<(canvas: Canvas) => Promise<void>> = [];
  private _useQueue: Array<(canvas: Canvas) => Promise<void>> = [];

  constructor(image: HTMLImageElement) {
    this._image = image;
  }

  private enqueueMask(mask: () => Promise<void>): this {
    this._maskQueue.push(mask);
    return this;
  }

  private async processMaskQueue(canvas: Canvas): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const processNext = (index: number) => {
        if (index >= this._maskQueue.length) {
          resolve();
          return;
        }
        const promiseFn = this._maskQueue[index];
        promiseFn(canvas)
            .then(() => {
              processNext(index + 1);
            })
            .catch((error) => {
              reject(error);
            });
      };
      processNext(0);
    });
    this._maskQueue = [];
  }

  private enqueueUse(use: () => Promise<void>): this {
    this._useQueue.push(use);
    return this;
  }

  private async processUseQueue(canvas: Canvas): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const processNext = (index: number) => {
        if (index >= this._useQueue.length) {
          resolve();
          return;
        }
        const promiseFn = this._useQueue[index];
        promiseFn(canvas)
            .then(() => {
              processNext(index + 1);
            })
            .catch((error) => {
              reject(error);
            });
      };
      processNext(0);
    });
    this._useQueue = [];
  }

  mask(mask: () => Promise<void>) {
    this.enqueueMask(mask);
  }

  use(filter: () => Promise<void>) {
    this.enqueueUse(filter);
  }

  compose(canvas: Canvas, x, y, width, height): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const performCompose = async () => {
        try {
          const imageElement = this.imageElement();
          const htmlCanvas = canvas.htmlCanvas();

          htmlCanvas.getContext('2d').drawImage(
              imageElement,
              x * -1 * (imageElement.width / width),
              y * -1 * (imageElement.height / height),
              htmlCanvas.width * (imageElement.width / width),
              htmlCanvas.height * (imageElement.width / width),
              0,
              0,
              htmlCanvas.width,
              htmlCanvas.height
          );

          await this.processMaskQueue(canvas);

          await this.processUseQueue(canvas);

          resolve();
        } catch (error) {
          reject(error);
        }
      };
      performCompose();
    });
  }

  imageElement(): HTMLImageElement {
    return this._image;
  }
}
