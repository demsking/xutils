import { tmpdir } from 'node:os';
import { readFile } from 'node:fs/promises';
import * as download from 'image-downloader';
import sharp from 'sharp';

import { Base64MimeTypeResult, Input, PullNodeOptions } from '../image.d';

const REGEX = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)/;

export function parseMimeType(base64: string): Base64MimeTypeResult | null {
  // Extract the content type from the Base64 URL
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

export async function parseBase64(filename: string) {
  const image = await readFile(filename);

  return 'data:image/jpeg;base64,' + Buffer.from(image).toString('base64');
}

export function pull({ dest = tmpdir(), extractFilename = true, ...options }: PullNodeOptions) {
  return download.image({ dest, extractFilename, ...options });
}

export async function convert(input: Input, format: keyof sharp.FormatEnum): Promise<Input> {
  const pipeline = sharp(input.data as Buffer);

  return {
    data: await pipeline.toFormat(format).toBuffer(),
    contentType: `image/${format as string}`,
  };
}

export async function resize(input: Input, options: sharp.ResizeOptions) {
  const pipeline = sharp(input.data as Buffer);

  const { width, height } = await pipeline.metadata();

  if (!options.width || width! > options.width || !options.height || height! > options.height) {
    // Resize the image only if its dimensions exceed the specified options
    return {
      ...input,
      data: await pipeline.resize(options as sharp.ResizeOptions).toBuffer(),
    };
  }

  return input;
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
