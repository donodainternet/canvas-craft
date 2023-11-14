import {CanvasEdge} from './constrains/CanvasEdge';
import {CanvasRotation} from './constrains/CanvasRotation';
export class Canvas {
  private _htmlcanvas: HTMLCanvasElement;
  private _width: CanvasEdge;
  private _height: CanvasEdge;
  private _rotationValue: CanvasRotation;

  constructor(width: number, height: number) {
    this._width = new CanvasEdge(width);
    this._height = new CanvasEdge(height);
  }

  compose(): Canvas {
    this._htmlcanvas = document.createElement('canvas');
    this._htmlcanvas.width = this.width();
    this._htmlcanvas.height = this.height();

    // const context = this._htmlcanvas.getContext('2d');

    // if (this._rotationValue) {
    //   [this._htmlcanvas.width, this._htmlcanvas.height] =
    //       [this._htmlcanvas.height, this._htmlcanvas.width];
    //   context.save();
    //   const centerX = this._htmlcanvas.width / 2;
    //   const centerY = 0;
    //   // console.log(centerX + 90);
    //   context.translate(centerX + 90, centerY);
    //   context.rotate(this._rotationValue.value * Math.PI);
    // }

    return this;
  }

  end(): Canvas {
    return this;
  }

  htmlCanvas(): HTMLCanvasElement {
    return this._htmlcanvas;
  }

  resize(resizeProportion: number): Canvas {
    this.width(this.width() * resizeProportion);
    this.height(this.height() * resizeProportion);
    return this;
  }

  width(width?: number): number {
    if (width) {
      this._width = new CanvasEdge(width);
    }
    return this._width.value;
  }

  height(height?: number): number {
    if (height) {
      this._height = new CanvasEdge(height);
    }
    return this._height.value;
  }
}
