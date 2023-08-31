"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanvasEdge = void 0;
class CanvasEdge {
    constructor(value) {
        this._value = value;
    }
    set value(newValue) {
        const min = 1;
        const max = 300000;
        if (newValue >= min && newValue <= max) {
            this._value = newValue;
        }
        else {
            throw new Error(`Edge ou of expected range (min: ${min}, max: ${max}) ` +
                `given ${newValue}`);
        }
    }
    get value() {
        return this._value;
    }
}
exports.CanvasEdge = CanvasEdge;
//# sourceMappingURL=CanvasEdge.js.map