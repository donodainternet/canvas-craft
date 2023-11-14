import {ComposeFilter, ComposeTarget} from './typings/CanvasImageEditor';
import {CanvasImageEditor} from './CanvasImageEditor';
import {toPNG} from './composes/toPNG';
// import {toJPEG} from './composes/toJPEG';
import {grayScale} from './uses/grayScale';
import {sepiaTone} from './uses/sepiaTone';
import {backgroundBlur} from './uses/backgroundBlur';
import {backgroundReplace} from './uses/backgroundReplace';
import {backgroundColor} from './uses/backgroundColor';
import {imageMask} from './masks/imageMask';
import {vectorMask} from './masks/vectorMask';

export function createImageEditor(): CanvasImageEditor {
  const editor = new CanvasImageEditor();
  return editor;
}

declare global {
  interface Window {
    toPNG: ComposeTarget;
    toJPEG: ComposeTarget;
    grayScale: ComposeFilter;
    sepiaTone: ComposeFilter;
    backgroundBlur: ComposeFilter;
    backgroundReplace: ComposeFilter;
    backgroundColor: ComposeFilter;
    imageMask: ComposeFilter;
    vectorMask: ComposeFilter;
  }
}

if (typeof window !== 'undefined') {
  window.toPNG = toPNG;
  // window.toJPEG = toJPEG;
  window.grayScale = grayScale;
  window.sepiaTone = sepiaTone;
  window.backgroundBlur = backgroundBlur;
  window.backgroundReplace = backgroundReplace;
  window.backgroundColor = backgroundColor;
  window.imageMask = imageMask;
  window.vectorMask = vectorMask;
}
