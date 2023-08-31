import {CanvasEdge} from './CanvasEdge';
import {LayerIndex} from './LayerIndex';
import {ElementImage} from './ElementImage';

export class Layer {
  private _element: ElementImage;
  private _x: CanvasEdge;
  private _y: CanvasEdge;
  private _index: LayerIndex;
  private _width: CanvasEdge;
  private _height: CanvasEdge;
  private _originalAspectRatio: CanvasEdge;

  constructor(
      element: ElementImage,
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

  // compose(canvas: HTMLCanvasElement) {
  //   this._element.compose();
  //   const imageElement = this._element.imageElement();
  //   canvas.getContext('2d')
  //       // .drawImage(imageElement, 52, 0, 172, 172, 0, 0, 48, 48);
  //       .drawImage(
  //           imageElement,
  //           this.offsetX() * -1 * (imageElement.width / this.width()),
  //           this.offsetY() * -1 * (imageElement.height / this.height()),
  //           (this.width() + 2 * this.offsetX()) *
  //             (imageElement.width/this.width()),
  //           (this.height() + 2 * this.offsetY()) *
  //             (imageElement.height/this.height()),
  //           0,
  //           0,
  //           this.width() + 2 * this.offsetX(),
  //           this.height() + 2 * this.offsetY());
  //   return this;
  // }

  compose(canvas: HTMLCanvasElement) {
    this._element.compose();
    const imageElement = this._element.imageElement();
    canvas.getContext('2d').drawImage(
        imageElement,
        this.offsetX() * -1 * (imageElement.width / this.width()),
        this.offsetY() * -1 * (imageElement.height / this.height()),
        (this.width() +2*this.offsetX()) * (imageElement.width/this.width()),
        (this.height() +2*this.offsetY()) * (imageElement.height/this.height()),
        0,
        0,
        this.width() + 2 * this.offsetX(),
        this.height() + 2 * this.offsetY()
    );
    return this;
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
