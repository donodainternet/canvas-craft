import {ComposeTarget} from './typings/CanvasImageEditor';
import {CanvasImageEditor, toBase64} from './CanvasImageEditor';

export function createImageEditor(): CanvasImageEditor {
  const editor = new CanvasImageEditor();
  return editor;
}

declare global {
  interface Window {
    toBase64: ComposeTarget;
  }
}

if (typeof window !== 'undefined') {
  window.toBase64 = toBase64;
}
