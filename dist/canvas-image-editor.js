/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dist/Canvas.js":
/*!************************!*\
  !*** ./dist/Canvas.js ***!
  \************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Canvas = void 0;\nconst CanvasEdge_1 = __webpack_require__(/*! ./CanvasEdge */ \"./dist/CanvasEdge.js\");\nclass Canvas {\n    constructor(width, height) {\n        this._width = new CanvasEdge_1.CanvasEdge(width);\n        this._height = new CanvasEdge_1.CanvasEdge(height);\n    }\n    createHTMLCanvas() {\n        this._htmlcanvas = document.createElement('canvas');\n        this._htmlcanvas.width = this.width();\n        this._htmlcanvas.height = this.height();\n        return this;\n    }\n    compose() {\n        this.createHTMLCanvas();\n        return this;\n    }\n    htmlCanvas() {\n        return this._htmlcanvas;\n    }\n    resize(resizeProportion) {\n        this.width(this.width() * resizeProportion);\n        this.height(this.height() * resizeProportion);\n        return this;\n    }\n    width(width) {\n        if (width) {\n            this._width = new CanvasEdge_1.CanvasEdge(width);\n        }\n        return this._width.value;\n    }\n    height(height) {\n        if (height) {\n            this._height = new CanvasEdge_1.CanvasEdge(height);\n        }\n        return this._height.value;\n    }\n}\nexports.Canvas = Canvas;\n//# sourceMappingURL=Canvas.js.map\n\n//# sourceURL=webpack://CanvasImageEditor/./dist/Canvas.js?");

/***/ }),

/***/ "./dist/CanvasEdge.js":
/*!****************************!*\
  !*** ./dist/CanvasEdge.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.CanvasEdge = void 0;\nclass CanvasEdge {\n    constructor(value) {\n        this._value = value;\n    }\n    set value(newValue) {\n        const min = 1;\n        const max = 300000;\n        if (newValue >= min && newValue <= max) {\n            this._value = newValue;\n        }\n        else {\n            throw new Error(`Edge ou of expected range (min: ${min}, max: ${max}) ` +\n                `given ${newValue}`);\n        }\n    }\n    get value() {\n        return this._value;\n    }\n}\nexports.CanvasEdge = CanvasEdge;\n//# sourceMappingURL=CanvasEdge.js.map\n\n//# sourceURL=webpack://CanvasImageEditor/./dist/CanvasEdge.js?");

/***/ }),

/***/ "./dist/CanvasImageEditor.js":
/*!***********************************!*\
  !*** ./dist/CanvasImageEditor.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.toBase64 = exports.CanvasImageEditor = void 0;\nconst CanvasImageEditorLogger_1 = __webpack_require__(/*! ./CanvasImageEditorLogger */ \"./dist/CanvasImageEditorLogger.js\");\nconst Canvas_1 = __webpack_require__(/*! ./Canvas */ \"./dist/Canvas.js\");\nconst ElementImage_1 = __webpack_require__(/*! ./ElementImage */ \"./dist/ElementImage.js\");\nconst Layer_1 = __webpack_require__(/*! ./Layer */ \"./dist/Layer.js\");\nconst ComposeResult_1 = __webpack_require__(/*! ./ComposeResult */ \"./dist/ComposeResult.js\");\nconst TargetQuality_1 = __webpack_require__(/*! ./TargetQuality */ \"./dist/TargetQuality.js\");\nclass CanvasImageEditor {\n    constructor() {\n        this._showErrors = false;\n        this._errorStack = [];\n        this._promiseQueue = [];\n        this.setLogger(CanvasImageEditorLogger_1.ConsoleLogger);\n        this.createCanvas();\n    }\n    enqueuePromise(promiseFn) {\n        this._promiseQueue.push(promiseFn);\n        return this;\n    }\n    async processPromiseQueue() {\n        return new Promise((resolve, reject) => {\n            const processNext = (index) => {\n                if (index >= this._promiseQueue.length) {\n                    resolve();\n                    return;\n                }\n                const promiseFn = this._promiseQueue[index];\n                promiseFn()\n                    .then(() => {\n                    processNext(index + 1);\n                })\n                    .catch((error) => {\n                    reject(error);\n                });\n            };\n            processNext(0);\n        });\n        // for (const promiseFn of this._promiseQueue) {\n        //   await promiseFn();\n        // }\n        this._promiseQueue = [];\n    }\n    compose(targetFunction = toBase64('image/png')) {\n        return new Promise((resolve, reject) => {\n            try {\n                this.processPromiseQueue()\n                    .then(() => {\n                    this._canvas.compose();\n                    const htmlCanvas = this._canvas.htmlCanvas();\n                    this._layers.forEach((layer) => {\n                        layer.compose(htmlCanvas);\n                    });\n                    const composeResult = targetFunction(this._canvas.htmlCanvas());\n                    resolve(composeResult);\n                })\n                    .catch((error) => {\n                    reject(error);\n                });\n            }\n            catch (error) {\n                reject(error);\n            }\n        });\n    }\n    fitCanvasToContent() {\n        let maxWidth = 0;\n        let maxHeight = 0;\n        this._layers.forEach((layer) => {\n            maxWidth = Math.max(maxWidth, layer.offsetX() + layer.width());\n            maxHeight = Math.max(maxHeight, layer.offsetY() + layer.height());\n        });\n        this._canvas.width(maxWidth);\n        this._canvas.height(maxHeight);\n        return this;\n    }\n    createCanvas() {\n        this._canvas = new Canvas_1.Canvas(0, 0);\n        this.resetLayers();\n        return this;\n    }\n    resetLayers() {\n        this.enqueuePromise(async () => {\n            this._layers = [];\n        });\n        return this;\n    }\n    setLogger(logger) {\n        this._logger = logger;\n        return this;\n    }\n    toggleErrors(showErrors) {\n        this._showErrors = showErrors;\n        return this;\n    }\n    placeImage(URL, x = 0, y = 0) {\n        this.enqueuePromise(async () => {\n            const image = new Image();\n            const loadImagePromise = new Promise((resolve, reject) => {\n                image.addEventListener('load', () => {\n                    resolve();\n                });\n                image.addEventListener('error', (error) => {\n                    reject(error);\n                });\n            });\n            image.src = URL.toString();\n            await loadImagePromise;\n            const imageElement = new ElementImage_1.ElementImage(image);\n            const width = image.width;\n            const height = image.height;\n            const layerIndex = this._layers.length;\n            const layer = new Layer_1.Layer(imageElement, x, y, width, height, layerIndex);\n            this._layers.push(layer);\n            this.fitCanvasToContent();\n        });\n        return this;\n    }\n    resizeToWidth(newCanvasWidth) {\n        this.enqueuePromise(async () => {\n            const canvasWidth = this._canvas.width();\n            const resizeProportion = newCanvasWidth / canvasWidth;\n            this._canvas.resize(resizeProportion);\n            this._layers.forEach((layer) => {\n                layer.resize(resizeProportion);\n            });\n        });\n        return this;\n    }\n    resizeToHeight(newCanvasHeight) {\n        this.enqueuePromise(async () => {\n            const canvasHeight = this._canvas.height();\n            const resizeProportion = newCanvasHeight / canvasHeight;\n            this._canvas.resize(resizeProportion);\n            this._layers.forEach((layer) => {\n                layer.resize(resizeProportion);\n            });\n        });\n        return this;\n    }\n    slice(x, y, width, height) {\n        this.enqueuePromise(async () => {\n            const canvasWidth = this._canvas.width();\n            const canvasHeight = this._canvas.height();\n            if (x !== undefined && x > -1 && x < 1) {\n                x = canvasWidth * x;\n            }\n            if (y !== undefined && y > -1 && y < 1) {\n                y = canvasHeight * y;\n            }\n            if (width !== undefined && width > 0 && width < 1) {\n                width = canvasWidth * width;\n            }\n            if (height !== undefined && height > 0 && height < 1) {\n                height = canvasHeight * height;\n            }\n            if ([x, y, width, height].every((value) => value === undefined)) {\n                throw new Error(`Invalid slice parameters. ` +\n                    `At least one must be defined.`);\n            }\n            if (x === undefined) {\n                x = 0;\n            }\n            if (y === undefined) {\n                y = 0;\n            }\n            if (width === undefined) {\n                width = canvasWidth - Math.abs(x);\n            }\n            if (height === undefined) {\n                height = canvasHeight - Math.abs(y);\n            }\n            if (width + Math.abs(x) > canvasWidth ||\n                height + Math.abs(y) > canvasHeight) {\n                throw new Error('Sliced area is outside the canvas boundaries.');\n            }\n            this._canvas.width(width);\n            this._canvas.height(height);\n            this._layers.forEach((layer) => {\n                if (x > 0) {\n                    // layer.width(width);\n                    // layer.height(height);\n                    layer.offsetX(layer.offsetX() - x);\n                }\n                if (y > 0) {\n                    layer.offsetY(layer.offsetY() - y);\n                }\n            });\n        });\n        return this;\n    }\n    crop(aspectRatio) {\n        this.enqueuePromise(async () => {\n            const canvasWidth = this._canvas.width();\n            const canvasHeight = this._canvas.height();\n            const imageAspectRatio = canvasWidth / canvasHeight;\n            let x;\n            let y;\n            let width;\n            let height;\n            if (imageAspectRatio < aspectRatio) {\n                width = this._canvas.width();\n                height = this._canvas.width() / aspectRatio;\n                x = 0;\n                y = (this._canvas.height() - height) / 2;\n            }\n            else {\n                width = this._canvas.height() * aspectRatio;\n                height = this._canvas.height();\n                x = (this._canvas.width() - width) / 2;\n                y = 0;\n            }\n            if (width === undefined ||\n                height === undefined ||\n                x === undefined ||\n                y === undefined) {\n                throw new Error('Invalid crop parameters.');\n            }\n            else {\n                this._canvas.width(width);\n                this._canvas.height(height);\n                this._layers.forEach((layer) => {\n                    layer.offsetX(layer.offsetX() - x);\n                    layer.offsetY(layer.offsetY() - y);\n                });\n            }\n        });\n        return this;\n    }\n}\nexports.CanvasImageEditor = CanvasImageEditor;\nfunction toBase64(mimetype, quality) {\n    return (canvas) => {\n        const targetQuality = new TargetQuality_1.TargetQuality(quality);\n        const base64Data = canvas.toDataURL(mimetype, targetQuality.value);\n        const composeResult = new ComposeResult_1.ComposeResult(base64Data, mimetype, 'base64');\n        return composeResult;\n    };\n}\nexports.toBase64 = toBase64;\n//# sourceMappingURL=CanvasImageEditor.js.map\n\n//# sourceURL=webpack://CanvasImageEditor/./dist/CanvasImageEditor.js?");

/***/ }),

/***/ "./dist/CanvasImageEditorLogger.js":
/*!*****************************************!*\
  !*** ./dist/CanvasImageEditorLogger.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ConsoleLogger = void 0;\nexports.ConsoleLogger = {\n    debug: (message) => console.debug(message),\n    info: (message) => console.info(message),\n    warn: (message) => console.warn(message),\n    error: (message) => console.error(message),\n};\n//# sourceMappingURL=CanvasImageEditorLogger.js.map\n\n//# sourceURL=webpack://CanvasImageEditor/./dist/CanvasImageEditorLogger.js?");

/***/ }),

/***/ "./dist/ComposeResult.js":
/*!*******************************!*\
  !*** ./dist/ComposeResult.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ComposeResult = void 0;\nclass ComposeResult {\n    constructor(data, mimetype, resulttype) {\n        this._data = data;\n        this._mimetype = mimetype;\n        this._resulttype = resulttype;\n        this.validateResult();\n    }\n    validateResult() {\n        const regex = `^data:${this._mimetype};base64,[A-Za-z0-9+/=]+$`;\n        const base64Regex = new RegExp(regex);\n        if (!base64Regex.test(this._data)) {\n            throw new Error(`Invalid base64 string`);\n        }\n    }\n    get data() {\n        return this._data;\n    }\n    get mimetype() {\n        return this._mimetype;\n    }\n    get resulttype() {\n        return this._resulttype;\n    }\n    toString() {\n        return this.data;\n    }\n}\nexports.ComposeResult = ComposeResult;\n//# sourceMappingURL=ComposeResult.js.map\n\n//# sourceURL=webpack://CanvasImageEditor/./dist/ComposeResult.js?");

/***/ }),

/***/ "./dist/ElementImage.js":
/*!******************************!*\
  !*** ./dist/ElementImage.js ***!
  \******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.ElementImage = void 0;\nclass ElementImage {\n    constructor(image) {\n        this._image = image;\n    }\n    compose() {\n        return this;\n    }\n    imageElement() {\n        return this._image;\n    }\n}\nexports.ElementImage = ElementImage;\n//# sourceMappingURL=ElementImage.js.map\n\n//# sourceURL=webpack://CanvasImageEditor/./dist/ElementImage.js?");

/***/ }),

/***/ "./dist/Layer.js":
/*!***********************!*\
  !*** ./dist/Layer.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.Layer = void 0;\nconst CanvasEdge_1 = __webpack_require__(/*! ./CanvasEdge */ \"./dist/CanvasEdge.js\");\nconst LayerIndex_1 = __webpack_require__(/*! ./LayerIndex */ \"./dist/LayerIndex.js\");\nclass Layer {\n    constructor(element, x, y, width, height, index) {\n        this._element = element;\n        this._x = new CanvasEdge_1.CanvasEdge(x);\n        this._y = new CanvasEdge_1.CanvasEdge(y);\n        this._width = new CanvasEdge_1.CanvasEdge(width);\n        this._height = new CanvasEdge_1.CanvasEdge(height);\n        this._index = new LayerIndex_1.LayerIndex(index);\n    }\n    // compose(canvas: HTMLCanvasElement) {\n    //   this._element.compose();\n    //   const imageElement = this._element.imageElement();\n    //   canvas.getContext('2d')\n    //       // .drawImage(imageElement, 52, 0, 172, 172, 0, 0, 48, 48);\n    //       .drawImage(\n    //           imageElement,\n    //           this.offsetX() * -1 * (imageElement.width / this.width()),\n    //           this.offsetY() * -1 * (imageElement.height / this.height()),\n    //           (this.width() + 2 * this.offsetX()) *\n    //             (imageElement.width/this.width()),\n    //           (this.height() + 2 * this.offsetY()) *\n    //             (imageElement.height/this.height()),\n    //           0,\n    //           0,\n    //           this.width() + 2 * this.offsetX(),\n    //           this.height() + 2 * this.offsetY());\n    //   return this;\n    // }\n    compose(canvas) {\n        this._element.compose();\n        const imageElement = this._element.imageElement();\n        canvas.getContext('2d').drawImage(imageElement, this.offsetX() * -1 * (imageElement.width / this.width()), this.offsetY() * -1 * (imageElement.height / this.height()), (this.width() + 2 * this.offsetX()) * (imageElement.width / this.width()), (this.height() + 2 * this.offsetY()) * (imageElement.height / this.height()), 0, 0, this.width() + 2 * this.offsetX(), this.height() + 2 * this.offsetY());\n        return this;\n    }\n    resize(resizeProportion) {\n        this.width(this.width() * resizeProportion);\n        this.height(this.height() * resizeProportion);\n        this.offsetX(this.offsetX() * resizeProportion);\n        this.offsetY(this.offsetY() * resizeProportion);\n        return this;\n    }\n    offsetX(offsetX) {\n        if (offsetX) {\n            this._x = new CanvasEdge_1.CanvasEdge(offsetX);\n        }\n        return this._x.value;\n    }\n    offsetY(offsetY) {\n        if (offsetY) {\n            this._y = new CanvasEdge_1.CanvasEdge(offsetY);\n        }\n        return this._y.value;\n    }\n    width(width) {\n        if (width) {\n            this._width = new CanvasEdge_1.CanvasEdge(width);\n        }\n        return this._width.value;\n    }\n    height(height) {\n        if (height) {\n            this._height = new CanvasEdge_1.CanvasEdge(height);\n        }\n        return this._height.value;\n    }\n}\nexports.Layer = Layer;\n//# sourceMappingURL=Layer.js.map\n\n//# sourceURL=webpack://CanvasImageEditor/./dist/Layer.js?");

/***/ }),

/***/ "./dist/LayerIndex.js":
/*!****************************!*\
  !*** ./dist/LayerIndex.js ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.LayerIndex = void 0;\nclass LayerIndex {\n    constructor(value) {\n        this._value = value;\n    }\n    set value(newValue) {\n        const min = 1;\n        const max = 100000;\n        if (newValue >= min && newValue <= max) {\n            this._value = newValue;\n        }\n        else {\n            throw new Error(`Layer index ou of ` +\n                `expected range (min: ${min}, max: ${max}) ` +\n                `given ${newValue}`);\n        }\n    }\n    get value() {\n        return this._value;\n    }\n}\nexports.LayerIndex = LayerIndex;\n//# sourceMappingURL=LayerIndex.js.map\n\n//# sourceURL=webpack://CanvasImageEditor/./dist/LayerIndex.js?");

/***/ }),

/***/ "./dist/TargetQuality.js":
/*!*******************************!*\
  !*** ./dist/TargetQuality.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.TargetQuality = void 0;\nclass TargetQuality {\n    constructor(value) {\n        this._value = value;\n    }\n    set value(newValue) {\n        const min = 0.1;\n        const max = 1;\n        if (newValue >= min && newValue <= max) {\n            this._value = newValue;\n        }\n        else {\n            throw new Error(`Quality ou of expected range ` +\n                `(min: ${min}, max: ${max}) ` +\n                `given ${newValue}`);\n        }\n    }\n    get value() {\n        return this._value;\n    }\n}\nexports.TargetQuality = TargetQuality;\n//# sourceMappingURL=TargetQuality.js.map\n\n//# sourceURL=webpack://CanvasImageEditor/./dist/TargetQuality.js?");

/***/ }),

/***/ "./dist/index.js":
/*!***********************!*\
  !*** ./dist/index.js ***!
  \***********************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.createImageEditor = void 0;\nconst CanvasImageEditor_1 = __webpack_require__(/*! ./CanvasImageEditor */ \"./dist/CanvasImageEditor.js\");\nfunction createImageEditor() {\n    const editor = new CanvasImageEditor_1.CanvasImageEditor();\n    return editor;\n}\nexports.createImageEditor = createImageEditor;\nif (typeof window !== 'undefined') {\n    window.toBase64 = CanvasImageEditor_1.toBase64;\n}\n//# sourceMappingURL=index.js.map\n\n//# sourceURL=webpack://CanvasImageEditor/./dist/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./dist/index.js");
/******/ 	window.CanvasImageEditor = __webpack_exports__;
/******/ 	
/******/ })()
;