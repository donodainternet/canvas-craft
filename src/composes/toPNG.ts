import {
  ComposeTargetFunction,
} from '../typings/CanvasImageEditor';
import {ComposeResult} from '../ComposeResult';

export function toPNG(): ComposeTargetFunction {
  return (canvas) => {
    const base64Data =
        canvas.toDataURL('image/png')
            .replace('image/png', 'image/octet-stream');
    console.log('to dataurl');
    const composeResult = new ComposeResult(base64Data, 'image/png', 'base64');
    return composeResult;
  };
}
