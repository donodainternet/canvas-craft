/* eslint-disable max-len */
import {Canvas} from '../Canvas';
import * as tf from '@tensorflow/tfjs';
import {load} from '@tensorflow-models/body-pix';

export function backgroundBlur(): (canvas: Canvas) => Promise<void> {
  return async (canvas: Canvas) => {
    const htmlCanvas = canvas.htmlCanvas();
    const context = htmlCanvas.getContext('2d');

    if (!context) {
      console.error('Não foi possível obter o contexto 2D do canvas');
      return;
    }

    const width = htmlCanvas.width;
    const height = htmlCanvas.height;

    const loadImage = async (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    };

    const imagem = await loadImage(htmlCanvas.toDataURL());

    const canvasBlur = document.createElement('canvas');
    const contextoBlur = canvasBlur.getContext('2d');

    if (!contextoBlur) {
      console.error('Não foi possível obter o contexto 2D do canvas de blur');
      return;
    }

    canvasBlur.width = width;
    canvasBlur.height = height;

    contextoBlur.filter = 'blur(20px)';
    contextoBlur.drawImage(imagem, 0, 0, width, height);

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
        imageData.data[i * 4] = contextoBlur.getImageData(i % width, Math.floor(i / width), 1, 1).data[0];
        imageData.data[i * 4 + 1] = contextoBlur.getImageData(i % width, Math.floor(i / width), 1, 1).data[1];
        imageData.data[i * 4 + 2] = contextoBlur.getImageData(i % width, Math.floor(i / width), 1, 1).data[2];
        imageData.data[i * 4 + 3] = contextoBlur.getImageData(i % width, Math.floor(i / width), 1, 1).data[3];
      }
    }

    context.putImageData(imageData, 0, 0);
  };
}
