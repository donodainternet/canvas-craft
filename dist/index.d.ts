import { ComposeTarget } from './typings/CanvasImageEditor';
import { CanvasImageEditor } from './CanvasImageEditor';
export declare function createImageEditor(): CanvasImageEditor;
declare global {
    interface Window {
        toBase64: ComposeTarget;
    }
}
