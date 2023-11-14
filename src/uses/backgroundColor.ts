import {Canvas} from '../Canvas';
import * as tf from '@tensorflow/tfjs';
import {load} from '@tensorflow-models/body-pix';

export function backgroundColor(color: string): (canvas: Canvas) =>
  Promise<void> {
  return async (canvas: Canvas) => {
    const htmlCanvas = canvas.htmlCanvas();
    const context = htmlCanvas.getContext('2d');

    if (!context) {
      console.error('Não foi possível obter o contexto 2D do canvas');
      return;
    }

    const hexPairs =
        color.match(/([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})/i);
    if (!hexPairs?.length) {
      throw new Error('Invalid hex color parameter');
    }

    const rgb = hexPairs?.slice(1).map((value) => {
      return parseInt(value, 16);
    });

    const width = htmlCanvas.width;
    const height = htmlCanvas.height;

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
        imageData.data[i * 4] = rgb[0];
        imageData.data[i * 4 + 1] = rgb[1];
        imageData.data[i * 4 + 2] = rgb[2];
        imageData.data[i * 4 + 3] = 255;
      }
    }

    context.putImageData(imageData, 0, 0);
  };
}
