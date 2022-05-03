import os from 'os';
import fs from 'fs/promises';
import Jimp from 'jimp';
import download from 'image-downloader';

import { Base64MimeTypeResult, PullNodeOptions } from '../image.d';

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

export async function parseBase64(filename: string) {
  const image = await fs.readFile(filename);

  return 'data:image/jpeg;base64,' + Buffer.from(image).toString('base64');
}

export function pull({ dest = os.tmpdir(), extractFilename = true, ...options }: PullNodeOptions) {
  return download.image({ dest, extractFilename, ...options });
}

export async function resize(filename: string, width: number, height = Jimp.AUTO): Promise<download.DownloadResult> {
  const image = await Jimp.read(filename);
  const newFilename = `${filename}.resized`;

  await image.resize(width, height, Jimp.RESIZE_BEZIER).writeAsync(newFilename);

  return {
    filename: newFilename,
  };
}
