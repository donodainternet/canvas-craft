import {Canvas} from '../Canvas';

export function imageMask(
    URL: URL, x: number = 0, y: number = 0,
    boundaryWidth?: number, boundaryHeight?: number):
            (canvas: Canvas) => Promise<void> {
  return async (canvas: Canvas) => {
    return new Promise<void>((resolve, reject) => {
      const maskImage = new Image();

      const loadImagePromise = new Promise<void>((loadResolve, loadReject) => {
        maskImage.addEventListener('load', () => {
          loadResolve();
        });
        maskImage.addEventListener('error', (error) => {
          loadReject(error);
        });
      });

      maskImage.src = URL.toString();

      loadImagePromise
          .then(() => {
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
          })
          .catch(() => {
            reject(Error('Load mask error'));
          });
    });
  };
}
