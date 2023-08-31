"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBase64 = exports.CanvasImageEditor = void 0;
const CanvasImageEditorLogger_1 = require("./CanvasImageEditorLogger");
const Canvas_1 = require("./Canvas");
const ElementImage_1 = require("./ElementImage");
const Layer_1 = require("./Layer");
const ComposeResult_1 = require("./ComposeResult");
const TargetQuality_1 = require("./TargetQuality");
class CanvasImageEditor {
    constructor() {
        this._showErrors = false;
        this._errorStack = [];
        this._promiseQueue = [];
        this.setLogger(CanvasImageEditorLogger_1.ConsoleLogger);
        this.createCanvas();
    }
    enqueuePromise(promiseFn) {
        this._promiseQueue.push(promiseFn);
        return this;
    }
    async processPromiseQueue() {
        return new Promise((resolve, reject) => {
            const processNext = (index) => {
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
    compose(targetFunction = toBase64('image/png')) {
        return new Promise((resolve, reject) => {
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
            }
            catch (error) {
                reject(error);
            }
        });
    }
    fitCanvasToContent() {
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
    createCanvas() {
        this._canvas = new Canvas_1.Canvas(0, 0);
        this.resetLayers();
        return this;
    }
    resetLayers() {
        this.enqueuePromise(async () => {
            this._layers = [];
        });
        return this;
    }
    setLogger(logger) {
        this._logger = logger;
        return this;
    }
    toggleErrors(showErrors) {
        this._showErrors = showErrors;
        return this;
    }
    placeImage(URL, x = 0, y = 0) {
        this.enqueuePromise(async () => {
            const image = new Image();
            const loadImagePromise = new Promise((resolve, reject) => {
                image.addEventListener('load', () => {
                    resolve();
                });
                image.addEventListener('error', (error) => {
                    reject(error);
                });
            });
            image.src = URL.toString();
            await loadImagePromise;
            const imageElement = new ElementImage_1.ElementImage(image);
            const width = image.width;
            const height = image.height;
            const layerIndex = this._layers.length;
            const layer = new Layer_1.Layer(imageElement, x, y, width, height, layerIndex);
            this._layers.push(layer);
            this.fitCanvasToContent();
        });
        return this;
    }
    resizeToWidth(newCanvasWidth) {
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
    resizeToHeight(newCanvasHeight) {
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
    slice(x, y, width, height) {
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
    crop(aspectRatio) {
        this.enqueuePromise(async () => {
            const canvasWidth = this._canvas.width();
            const canvasHeight = this._canvas.height();
            const imageAspectRatio = canvasWidth / canvasHeight;
            let x;
            let y;
            let width;
            let height;
            if (imageAspectRatio < aspectRatio) {
                width = this._canvas.width();
                height = this._canvas.width() / aspectRatio;
                x = 0;
                y = (this._canvas.height() - height) / 2;
            }
            else {
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
            }
            else {
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
exports.CanvasImageEditor = CanvasImageEditor;
function toBase64(mimetype, quality) {
    return (canvas) => {
        const targetQuality = new TargetQuality_1.TargetQuality(quality);
        const base64Data = canvas.toDataURL(mimetype, targetQuality.value);
        const composeResult = new ComposeResult_1.ComposeResult(base64Data, mimetype, 'base64');
        return composeResult;
    };
}
exports.toBase64 = toBase64;
//# sourceMappingURL=CanvasImageEditor.js.map