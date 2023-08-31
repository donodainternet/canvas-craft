export declare class Canvas {
    private _htmlcanvas;
    private _width;
    private _height;
    constructor(width: number, height: number);
    private createHTMLCanvas;
    compose(): Canvas;
    htmlCanvas(): HTMLCanvasElement;
    resize(resizeProportion: number): Canvas;
    width(width?: number): number;
    height(height?: number): number;
}
