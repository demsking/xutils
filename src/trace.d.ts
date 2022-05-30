export declare class Trace {
  constructor(name: string);
  info(msg: string, prefix?: string): void;
  warn(msg: string, prefix?: string): void;
  error(msg: string, prefix?: string): void;
}
