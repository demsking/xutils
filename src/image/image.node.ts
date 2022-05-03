import os from 'os';
import fs from 'fs/promises';
import Jimp from 'jimp';
import download from 'image-downloader';

import { Base64MimeTypeResult } from '../image.d';

const REGEX = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)/;

export function base64MimeType(encoded: string | null): Base64MimeTypeResult {
  if (typeof encoded !== 'string') {
    return null;
  }

  const matches = encoded.match(REGEX);

  if (matches?.length) {
    return {
      mime: matches[1],
      data: encoded,
      raw: matches[2],
    };
  }

  return null;
}

export async function parseBase64(imageUrl: string, resizeWidth?: number) {
  let { filename } = await download.image({ url: imageUrl, dest: os.tmpdir() });

  if (resizeWidth) {
    const image = await Jimp.read(filename);
    const newFilename = `${filename}.resized`;

    await image.resize(resizeWidth, Jimp.AUTO, Jimp.RESIZE_BEZIER).writeAsync(newFilename);
    await fs.unlink(filename);

    filename = newFilename;
  }

  const image = await fs.readFile(filename);
  const base64 = 'data:image/jpeg;base64,' + Buffer.from(image).toString('base64');

  await fs.unlink(filename);

  return base64;
}
