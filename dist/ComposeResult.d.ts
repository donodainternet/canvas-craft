import { TargetMimetype } from './typings/CanvasImageEditor';
export declare class ComposeResult {
    private _data;
    private _mimetype;
    private _resulttype;
    constructor(data: string, mimetype: TargetMimetype, resulttype: string);
    private validateResult;
    get data(): string;
    get mimetype(): string;
    get resulttype(): string;
    toString(): string;
}
