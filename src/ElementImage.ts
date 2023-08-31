export class ElementImage {
  private _image: HTMLImageElement;

  constructor(image: HTMLImageElement) {
    this._image = image;
  }

  compose(): ElementImage {
    return this;
  }

  imageElement(): HTMLImageElement {
    return this._image;
  }
}
