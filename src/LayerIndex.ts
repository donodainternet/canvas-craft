export class LayerIndex {
  private _value: number;

  constructor(value: number) {
    this._value = value;
  }

  set value(newValue: number) {
    const min: number = 1;
    const max: number = 100000;
    if (newValue >= min && newValue <= max) {
      this._value = newValue;
    } else {
      throw new Error(`Layer index ou of ` +
                      `expected range (min: ${min}, max: ${max}) ` +
                      `given ${newValue}`);
    }
  }

  get value(): number {
    return this._value;
  }
}
