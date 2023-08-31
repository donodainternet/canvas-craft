import {CanvasEdge} from './CanvasEdge';

export class Canvas {
  private _htmlcanvas: HTMLCanvasElement;
  private _width: CanvasEdge;
  private _height: CanvasEdge;

  constructor(width: number, height: number) {
    this._width = new CanvasEdge(width);
    this._height = new CanvasEdge(height);
  }

  private createHTMLCanvas(): Canvas {
    this._htmlcanvas = document.createElement('canvas');
    this._htmlcanvas.width = this.width();
    this._htmlcanvas.height = this.height();
    return this;
  }

  compose(): Canvas {
    this.createHTMLCanvas();
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
