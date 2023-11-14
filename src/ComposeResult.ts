import {TargetMimetype} from './typings/CanvasImageEditor';

export class ComposeResult {
  private _data: string;
  private _mimetype: TargetMimetype;
  private _resulttype: string;

  constructor(data: string, mimetype: TargetMimetype, resulttype: string) {
    this._data = data;
    this._mimetype = mimetype;
    this._resulttype = resulttype;
    this.validateResult();
  }

  private validateResult() {
    const regex = `^data:image/octet-stream;base64,[A-Za-z0-9+/=]+$`;
    const base64Regex = new RegExp(regex);
    if (!base64Regex.test(this._data)) {
      throw new Error(`Invalid base64 string`);
    }
  }

  get data(): string {
    return this._data;
  }

  get mimetype(): string {
    return this._mimetype;
  }

  get resulttype(): string {
    return this._resulttype;
  }

  toString() {
    return this.data;
  }
}
