"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createImageEditor = void 0;
const CanvasImageEditor_1 = require("./CanvasImageEditor");
function createImageEditor() {
    const editor = new CanvasImageEditor_1.CanvasImageEditor();
    return editor;
}
exports.createImageEditor = createImageEditor;
if (typeof window !== 'undefined') {
    window.toBase64 = CanvasImageEditor_1.toBase64;
}
//# sourceMappingURL=index.js.map