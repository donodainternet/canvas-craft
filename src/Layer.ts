import {CanvasEdge} from './constrains/CanvasEdge';
import {LayerIndex} from './constrains/LayerIndex';
import {ImageBitmap} from './ImageBitmap';
import {Canvas} from './Canvas';
import {ImageSVG} from './ImageSVG';

export class Layer {
  private _element: ImageBitmap | ImageSVG;
  private _x: CanvasEdge;
  private _y: CanvasEdge;
  private _index: LayerIndex;
  private _width: CanvasEdge;
  private _height: CanvasEdge;
  private _originalAspectRatio: CanvasEdge;

  constructor(
      element: ImageBitmap | ImageSVG,
      x: number,
      y: number,
      width: number,
      height: number,
      index: number) {
    this._element = element;
    this._x = new CanvasEdge(x);
    this._y = new CanvasEdge(y);
    this._width = new CanvasEdge(width);
    this._height = new CanvasEdge(height);
    this._index = new LayerIndex(index);
  }

  use(filter: () => Promise<void>) {
    this._element.use(filter);
  }

  mask(mask: () => Promise<void>) {
    this._element.mask(mask);
  }

  compose(canvas: Canvas): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this._element
            .compose(
                canvas,
                this.offsetX(),
                this.offsetY(),
                this.width(),
                this.height())
            .then(() => {
              resolve();
            })
            .catch((error) => {
              reject(error);
            });
      } catch (error) {
        reject(error);
      }
    });
  }

  resize(resizeProportion: number) {
    this.width(this.width() * resizeProportion);
    this.height(this.height() * resizeProportion);
    this.offsetX(this.offsetX() * resizeProportion);
    this.offsetY(this.offsetY() * resizeProportion);
    return this;
  }

  offsetX(offsetX?: number) {
    if (offsetX) {
      this._x = new CanvasEdge(offsetX);
    }
    return this._x.value;
  }

  offsetY(offsetY?: number) {
    if (offsetY) {
      this._y = new CanvasEdge(offsetY);
    }
    return this._y.value;
  }

  width(width?: number) {
    if (width) {
      this._width = new CanvasEdge(width);
    }
    return this._width.value;
  }

  height(height?: number) {
    if (height) {
      this._height = new CanvasEdge(height);
    }
    return this._height.value;
  }
}
