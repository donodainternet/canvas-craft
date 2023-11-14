import {
  ComposeTargetFunction,
} from '../typings/CanvasImageEditor';
import {ComposeResult} from '../ComposeResult';
import {TargetQuality} from '../constrains/TargetQuality';

export function toJPEG(
    quality: number = 0.9): ComposeTargetFunction {
  return (canvas) => {
    const targetQuality = new TargetQuality(quality);
    const base64Data =
        canvas.toDataURL('image/jpeg', targetQuality)
            .replace('image/jpeg', 'image/octet-stream');
    const composeResult = new ComposeResult(base64Data, 'image/jpeg', 'base64');
    return composeResult;
  };
}
