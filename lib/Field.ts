import { IContext } from '@community/scripts';
import { XImage } from './XImage';
import { Converter } from 'showdown';

const converter = new Converter();

export const Field = {
  parseHtml: (markdown: string) => converter.makeHtml(Field.parseBody(markdown)),
  parseString: (str: string) => str.trim().replace(/\r+/g, '\n').replace(/(\s)+/g, '$1'),
  parseBody: (str: string) => str.trim().replace(/\r+/g, '\n').replace(/\n+/g, '\n'),
  parseImage: async (img: string | null) => img ? await XImage.parseBase64(img) : undefined,
  parseUrl(url: string | null, context: IContext) {
    return url && url[0] === '/'
      ? context.instance.community.endpoint + url
      : url;
  },
};
