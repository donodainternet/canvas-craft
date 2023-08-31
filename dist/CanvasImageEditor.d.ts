import { ComposeTargetFunction, Logger, TargetMimetype } from './typings/CanvasImageEditor';
import { ComposeResult } from './ComposeResult';
export declare class CanvasImageEditor {
    private _canvas;
    private _layers;
    private _logger;
    private _showErrors;
    private _errorStack;
    private _promiseQueue;
    constructor();
    private enqueuePromise;
    private processPromiseQueue;
    compose(targetFunction?: ComposeTargetFunction): Promise<ComposeResult>;
    private fitCanvasToContent;
    private createCanvas;
    resetLayers(): this;
    setLogger(logger: Logger): this;
    toggleErrors(showErrors: boolean): this;
    placeImage(URL: URL, x?: number, y?: number): this;
    resizeToWidth(newCanvasWidth: number): this;
    resizeToHeight(newCanvasHeight: number): this;
    slice(x?: number, y?: number, width?: number, height?: number): this;
    crop(aspectRatio?: number): this;
}
export declare function toBase64(mimetype?: TargetMimetype, quality?: number): ComposeTargetFunction;
