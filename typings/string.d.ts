declare module '@b613/utils/lib/string' {
  export function trimlines(str: string, separator?: string): string;
  export function toKebabCase(str: string): string;
  export function unCamelCase(str: string, separator?: string): string;
}
