/* eslint-disable no-console */

import type { Trace as Interface } from '../trace';

export class Trace implements Interface {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  protected parse(type: string, msg: string): string {
    const timestamp = new Date().toISOString();

    return `${timestamp} ${this.name} ${type} - ${msg}`;
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
