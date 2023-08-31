"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LayerIndex = void 0;
class LayerIndex {
    constructor(value) {
        this._value = value;
    }
    set value(newValue) {
        const min = 1;
        const max = 100000;
        if (newValue >= min && newValue <= max) {
            this._value = newValue;
        }
        else {
            throw new Error(`Layer index ou of ` +
                `expected range (min: ${min}, max: ${max}) ` +
                `given ${newValue}`);
        }
    }
    get value() {
        return this._value;
    }
}
exports.LayerIndex = LayerIndex;
//# sourceMappingURL=LayerIndex.js.map