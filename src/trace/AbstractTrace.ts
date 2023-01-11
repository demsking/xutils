import type { Trace as Interface } from '../trace';

export abstract class AbstractTrace implements Interface {
  prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  protected parse(type: string, msg: string): string {
    const timestamp = new Date().toISOString();

    return `${timestamp} ${this.prefix} ${type} - ${msg}\n`;
  }

  abstract info(msg: string, prefix?: string): void;
  abstract warn(msg: string, prefix?: string): void;
  abstract error(msg: string, prefix?: string): void;
}
