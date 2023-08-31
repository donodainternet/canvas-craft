"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TargetQuality = void 0;
class TargetQuality {
    constructor(value) {
        this._value = value;
    }
    set value(newValue) {
        const min = 0.1;
        const max = 1;
        if (newValue >= min && newValue <= max) {
            this._value = newValue;
        }
        else {
            throw new Error(`Quality ou of expected range ` +
                `(min: ${min}, max: ${max}) ` +
                `given ${newValue}`);
        }
    }
    get value() {
        return this._value;
    }
}
exports.TargetQuality = TargetQuality;
//# sourceMappingURL=TargetQuality.js.map