"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComposeResult = void 0;
class ComposeResult {
    constructor(data, mimetype, resulttype) {
        this._data = data;
        this._mimetype = mimetype;
        this._resulttype = resulttype;
        this.validateResult();
    }
    validateResult() {
        const regex = `^data:${this._mimetype};base64,[A-Za-z0-9+/=]+$`;
        const base64Regex = new RegExp(regex);
        if (!base64Regex.test(this._data)) {
            throw new Error(`Invalid base64 string`);
        }
    }
    get data() {
        return this._data;
    }
    get mimetype() {
        return this._mimetype;
    }
    get resulttype() {
        return this._resulttype;
    }
    toString() {
        return this.data;
    }
}
exports.ComposeResult = ComposeResult;
//# sourceMappingURL=ComposeResult.js.map