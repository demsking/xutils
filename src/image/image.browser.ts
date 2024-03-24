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
  throw Error('Not Yet Supported');
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
