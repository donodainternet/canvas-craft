export class CanvasEdge {
  private _value: number;

  constructor(value: number) {
    this._value = value;
  }

  set value(newValue: number) {
    const min: number = 1;
    const max: number = 300000;
    if (newValue >= min && newValue <= max) {
      this._value = newValue;
    } else {
      throw new Error(`Edge ou of expected range (min: ${min}, max: ${max}) ` +
                      `given ${newValue}`);
    }
  }

  get value(): number {
    return this._value;
  }
}
