import {Canvas} from '../Canvas';

export function grayScale(): (canvas: Canvas) => Promise<void> {
  return async (canvas: Canvas) => {
    const htmlCanvas = canvas.htmlCanvas();
    const context = htmlCanvas.getContext('2d');
    const imageData =
      context.getImageData(0, 0, canvas.width(), canvas.height());
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
      data[i] = grayscale;
      data[i + 1] = grayscale;
      data[i + 2] = grayscale;
    }

    context.putImageData(imageData, 0, 0);
  };
}
