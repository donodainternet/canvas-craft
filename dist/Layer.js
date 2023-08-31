"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer = void 0;
const CanvasEdge_1 = require("./CanvasEdge");
const LayerIndex_1 = require("./LayerIndex");
class Layer {
    constructor(element, x, y, width, height, index) {
        this._element = element;
        this._x = new CanvasEdge_1.CanvasEdge(x);
        this._y = new CanvasEdge_1.CanvasEdge(y);
        this._width = new CanvasEdge_1.CanvasEdge(width);
        this._height = new CanvasEdge_1.CanvasEdge(height);
        this._index = new LayerIndex_1.LayerIndex(index);
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
    compose(canvas) {
        this._element.compose();
        const imageElement = this._element.imageElement();
        canvas.getContext('2d').drawImage(imageElement, this.offsetX() * -1 * (imageElement.width / this.width()), this.offsetY() * -1 * (imageElement.height / this.height()), (this.width() + 2 * this.offsetX()) * (imageElement.width / this.width()), (this.height() + 2 * this.offsetY()) * (imageElement.height / this.height()), 0, 0, this.width() + 2 * this.offsetX(), this.height() + 2 * this.offsetY());
        return this;
    }
    resize(resizeProportion) {
        this.width(this.width() * resizeProportion);
        this.height(this.height() * resizeProportion);
        this.offsetX(this.offsetX() * resizeProportion);
        this.offsetY(this.offsetY() * resizeProportion);
        return this;
    }
    offsetX(offsetX) {
        if (offsetX) {
            this._x = new CanvasEdge_1.CanvasEdge(offsetX);
        }
        return this._x.value;
    }
    offsetY(offsetY) {
        if (offsetY) {
            this._y = new CanvasEdge_1.CanvasEdge(offsetY);
        }
        return this._y.value;
    }
    width(width) {
        if (width) {
            this._width = new CanvasEdge_1.CanvasEdge(width);
        }
        return this._width.value;
    }
    height(height) {
        if (height) {
            this._height = new CanvasEdge_1.CanvasEdge(height);
        }
        return this._height.value;
    }
}
exports.Layer = Layer;
//# sourceMappingURL=Layer.js.map