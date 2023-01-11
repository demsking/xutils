/* eslint-disable no-console */

import type { Trace as Interface } from '../trace';

export class Trace implements Interface {
  prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  protected parse(type: string, msg: string): string {
    const timestamp = new Date().toISOString();

    return `${timestamp} ${this.prefix} ${type} - ${msg}\n`;
  }

  info(msg: string, prefix = 'INFO'): void {
    console.info(this.parse(prefix, msg));
  }

  warn(msg: string, prefix = 'WARN'): void {
    console.info(this.parse(prefix, msg));
  }

  error(msg: string, prefix = 'ERROR'): void {
    console.error(this.parse(prefix, msg));
  }
}
