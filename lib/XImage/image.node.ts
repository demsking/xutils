import os from 'os';
import fs from 'fs/promises';
import Jimp from 'jimp';

const download = require('image-downloader');

export const XImage = {
  async parseBase64(imageUrl: string, resizeWidth?: number) {
    try {
      let { filename } = await download.image({ url: imageUrl, dest: os.tmpdir() });

      if (resizeWidth) {
        const image = await Jimp.read(filename);
        const newFilename = `${filename}.resized`;

        filename = newFilename;

        await image.resize(resizeWidth, Jimp.AUTO, Jimp.RESIZE_BEZIER).writeAsync(newFilename);
      }

      const image = await fs.readFile(filename);

      return 'data:image/jpeg;base64,' + Buffer.from(image).toString('base64');
    } catch {}

    return '';
  },
};
