export type Base64MimeTypeResult = {
  mime: string;
  data: string;
  raw: string;
};

export function base64MimeType(encoded: string | null): Base64MimeTypeResult
export function parseBase64(imageUrl: string, resizeWidth?: number): Promise<string>;
