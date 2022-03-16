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
