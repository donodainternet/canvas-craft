import {Canvas} from '../Canvas';
import * as tf from '@tensorflow/tfjs';
import {load} from '@tensorflow-models/body-pix';

export function backgroundReplace(url: string): (canvas: Canvas) =>
  Promise<void> {
  return async (canvas: Canvas) => {
    const htmlCanvas = canvas.htmlCanvas();
    const context = htmlCanvas.getContext('2d');

    if (!context) {
      console.error('Não foi possível obter o contexto 2D do canvas');
      return;
    }

    const width = htmlCanvas.width;
    const height = htmlCanvas.height;

    const newBackground = await loadImage(url);

    await tf.setBackend('webgl');

    const net = await load({
      architecture: 'ResNet50',
      outputStride: 32,
      quantBytes: 4,
    });

    const segmentation = await net.segmentPerson(htmlCanvas, {
      internalResolution: 'high',
      segmentationThreshold: 0.75,
      scoreThreshold: 0.75,
    });

    const imageData = context.getImageData(0, 0, width, height);

    for (let i = 0; i < segmentation.data.length; i++) {
      if (segmentation.data[i] !== 1) {
        // Preencher com o novo fundo nas áreas não segmentadas
        const newBackgroundPixel =
          getPixelFromImage(newBackground, i % width, Math.floor(i / width));

        imageData.data[i * 4] = newBackgroundPixel[0];
        imageData.data[i * 4 + 1] = newBackgroundPixel[1];
        imageData.data[i * 4 + 2] = newBackgroundPixel[2];
        imageData.data[i * 4 + 3] = newBackgroundPixel[3];
      }
    }

    context.putImageData(imageData, 0, 0);
  };

  async function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function getPixelFromImage(image: HTMLImageElement, x: number, y: number):
    Uint8ClampedArray {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Não foi possível obter o contexto 2D do canvas');
    }

    canvas.width = 1;
    canvas.height = 1;

    context.drawImage(image, x, y, 1, 1, 0, 0, 1, 1);

    return context.getImageData(0, 0, 1, 1).data;
  }
}
