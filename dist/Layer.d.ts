import { ElementImage } from './ElementImage';
export declare class Layer {
    private _element;
    private _x;
    private _y;
    private _index;
    private _width;
    private _height;
    private _originalAspectRatio;
    constructor(element: ElementImage, x: number, y: number, width: number, height: number, index: number);
    compose(canvas: HTMLCanvasElement): this;
    resize(resizeProportion: number): this;
    offsetX(offsetX?: number): number;
    offsetY(offsetY?: number): number;
    width(width?: number): number;
    height(height?: number): number;
}
