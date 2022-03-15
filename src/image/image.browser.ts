type CompressFileOptions = {
  width?: number;
  height?: number;
};

export type CompressOptions = CompressFileOptions & {
  type: string;
};

export type CompressionResult = {
  data: string;
  width: number;
  height: number;
};

const EventOptions = {
  once: true,
};

/**
 * Compress an input image's dataurl with resizing & image quality compression
 */
function compressFromDataurl(dataurl: string, options: CompressOptions): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener('load', () => {
      const canvas = document.createElement('canvas');

      canvas.width = options.width
        ? Math.min(image.width, options.width)
        : image.width;

      if (options.height) {
        canvas.height = options.height;
      } else {
        const scaleFactor = canvas.width / image.width;

        canvas.height = image.height * scaleFactor;
      }

      const context = canvas.getContext('2d');

      if (context) {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);

        resolve({
          data: context.canvas.toDataURL(),
          width: canvas.width,
          height: canvas.height,
        });
      } else {
        reject(new Error('Unable to get canvas context'));
      }
    }, EventOptions);

    image.src = dataurl;
  });
}

export async function parseBase64(imageUrl: string, resizeWidth?: number) {
  const result = await compressFromDataurl(imageUrl, {
    type: 'datauri',
    width: resizeWidth,
  });

  return result.data;
}
