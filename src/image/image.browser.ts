import { Base64MimeTypeResult, Input, PullBrowserOptions } from '../image.d';

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

const REGEX = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)/;

export function parseMimeType(base64: string): Base64MimeTypeResult | null {
  const matches = base64.match(REGEX);

  if (matches?.length) {
    return {
      mime: matches[1],
      data: base64,
      raw: matches[2],
    };
  }

  return null;
}

export async function parseBase64(image: HTMLImageElement) {
  const result = parseCanvas(image, image.width, image.height);

  return result.toDataURL();
}

export function pull({ url }: PullBrowserOptions) {
  return new Promise((resolve, reject) => {
    const image = new Image();

    image.addEventListener('load', () => resolve(image), EventOptions);
    image.addEventListener('error', reject, EventOptions);

    image.src = url;
  });
}

export async function convert(input: Input, format: string): Promise<Input> {
  // Check if the browser supports the required format
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(format)) {
    throw Error('Format not supported');
  }

  // Create a canvas element to draw the image
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Create an image element and load the input image from the Blob
  const image = new Image();

  image.src = URL.createObjectURL(input.data as Blob);

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
  });

  // Set canvas size to match the image
  canvas.width = image.width;
  canvas.height = image.height;

  // Draw the image onto the canvas
  ctx.drawImage(image, 0, 0);

  // Convert the canvas to the desired format and create a new Input object
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const output: Input = {
          data: blob,
          contentType: format,
        };

        resolve(output);
      } else {
        reject(new Error('Conversion failed'));
      }
    }, format);
  });
}

export async function resize(image: HTMLImageElement, width: number, height?: number) {
  return parseCanvas(image, width, height);
}

function parseCanvas(image: HTMLImageElement, width: number, height?: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');

  canvas.width = width;

  if (height) {
    canvas.height = height;
  } else {
    const scaleFactor = canvas.width / image.width;

    canvas.height = image.height * scaleFactor;
  }

  const context = canvas.getContext('2d');

  if (context) {
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return context.canvas;
  }

  throw new Error('Unable to get canvas context');
}

export function parseInput(input: string | Input): Input {
  if (typeof input === 'string') {
    const result = parseMimeType(input);

    if (!result) {
      throw new Error('Unsupported content type');
    }

    return {
      data: Buffer.from(result.data, 'base64'),
      contentType: result.mime,
    };
  }

  return input;
}
