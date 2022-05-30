import color from '../color/color.node.js';

import type { Trace as Interface } from '../trace';

export class Trace implements Interface {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  protected parse(type: string, msg: string): string {
    const timestamp = new Date().toISOString();

    return `${timestamp} ${this.name} ${type} - ${msg}\n`;
  }

  info(msg: string, prefix = 'INFO'): void {
    process.stdout.write(this.parse(prefix, msg));
  }

  warn(msg: string, prefix = 'WARN'): void {
    process.stderr.write(this.parse(color.yellow(prefix), msg));
  }

  error(msg: string, prefix = 'ERROR'): void {
    process.stderr.write(this.parse(color.red(prefix), msg));
  }
}
