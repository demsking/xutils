export interface ITrace {
  info(msg: string, prefix?: string): void;
  warn(msg: string, prefix?: string): void;
  error(msg: string, prefix?: string): void;
}
