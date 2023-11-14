import {Canvas} from '../Canvas';

export function sepiaTone(): (canvas: Canvas) => Promise<void> {
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

      const sepiaR = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
      const sepiaG = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
      const sepiaB = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));

      data[i] = sepiaR;
      data[i + 1] = sepiaG;
      data[i + 2] = sepiaB;
    }
    context.putImageData(imageData, 0, 0);
  };
}
