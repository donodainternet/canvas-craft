"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Canvas = void 0;
const CanvasEdge_1 = require("./CanvasEdge");
class Canvas {
    constructor(width, height) {
        this._width = new CanvasEdge_1.CanvasEdge(width);
        this._height = new CanvasEdge_1.CanvasEdge(height);
    }
    createHTMLCanvas() {
        this._htmlcanvas = document.createElement('canvas');
        this._htmlcanvas.width = this.width();
        this._htmlcanvas.height = this.height();
        return this;
    }
    compose() {
        this.createHTMLCanvas();
        return this;
    }
    htmlCanvas() {
        return this._htmlcanvas;
    }
    resize(resizeProportion) {
        this.width(this.width() * resizeProportion);
        this.height(this.height() * resizeProportion);
        return this;
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
exports.Canvas = Canvas;
//# sourceMappingURL=Canvas.js.map