import download from 'image-downloader';

export type Input = {
  data: Buffer;
  contentType: string | null;
};

export type Base64MimeTypeResult = {
  mime: string;
  data: string;
  raw: string;
};

export type PullBrowserOptions = { url: string };
export type PullNodeOptions = Omit<download.Options, 'dest'> & Partial<Pick<download.Options, 'dest'>>;

export function parseMimeType(base64: string): Base64MimeTypeResult | null;
export function parseBase64(filename: string): Promise<string>;
export function parseBase64(image: HTMLImageElement): Promise<string>;
export function pull(options: PullBrowserOptions): Promise<HTMLImageElement>;
export function pull(options: PullNodeOptions): Promise<download.DownloadResult>;
export function resize(image: HTMLImageElement, width: number, height?: number): Promise<HTMLCanvasElement>;
export function resize(filename: string, width: number, height?: number): Promise<download.DownloadResult>;
