export type ParseCaseOptions = {
  escapedChars?: string[];
  separator: string;
};

export function trimlines(str: string, separator?: string): string;
export function parseCase(str: string, options: ParseCaseOptions): string;
export function toKebabCase(str: string, escapedChars?: string[]): string;
export function unCamelCase(str: string, escapedChars?: string[]): string;
