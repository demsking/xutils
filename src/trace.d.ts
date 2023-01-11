export declare class Trace {
  readonly prefix: string;

  constructor(prefix: string);
  info(msg: string, prefix?: string): void;
  warn(msg: string, prefix?: string): void;
  error(msg: string, prefix?: string): void;
}
