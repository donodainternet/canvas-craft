import {Canvas} from '../Canvas';

export function vectorMask(
    svgContent: string, x: number = 0, y: number = 0,
    boundaryWidth?: number, boundaryHeight?: number):
            (canvas: Canvas) => Promise<void> {
  return async (canvas: Canvas) => {
    return new Promise<void>((resolve, reject) => {
      const svgData =
      `<svg xmlns="http://www.w3.org/2000/svg" text-anchor="middle" x="0" y="0" width="${canvas.width()}" height="${canvas.height()}" viewbox="0 0 ${canvas.width()} ${canvas.height()}">
        ${svgContent}
      </svg>`;
      const maskImage = new Image();
      maskImage.addEventListener('load', () => {
        const htmlCanvas = canvas.htmlCanvas();
        const context = htmlCanvas.getContext('2d');

        const width = canvas.width();
        const height = canvas.height();

        let maskWidth = width;
        let maskHeight = height;

        if (boundaryWidth !== undefined && boundaryHeight !== undefined) {
          const boundaryAspectRatio = boundaryWidth / boundaryHeight;
          const imageAspectRatio = maskImage.width / maskImage.height;

          if (boundaryAspectRatio > imageAspectRatio) {
            maskHeight = Math.min(boundaryHeight, maskHeight);
            maskWidth = maskHeight * imageAspectRatio;
          } else {
            maskWidth = Math.min(boundaryWidth, maskWidth);
            maskHeight = maskWidth / imageAspectRatio;
          }
        }

        context.globalCompositeOperation = 'destination-atop';
        context.drawImage(
            maskImage,
            x * -1 * (maskImage.width / width),
            y * -1 * (maskImage.height / height),
            htmlCanvas.width * (maskImage.width / width),
            htmlCanvas.height * (maskImage.width / width),
            0,
            0,
            htmlCanvas.width,
            htmlCanvas.height);
        console.log('draw mask');

        resolve();
      });

      maskImage.addEventListener('error', (error) => {
        console.error(`Error loading mask image: ${error}`);
        reject(error);
      });

      maskImage.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    });
  };
}
