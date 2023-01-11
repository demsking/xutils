import color from '../color/color.node';

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
    process.stdout.write(this.parse(prefix, msg));
  }

  warn(msg: string, prefix = 'WARN'): void {
    process.stderr.write(this.parse(color.yellow(prefix), msg));
  }

  error(msg: string, prefix = 'ERROR'): void {
    process.stderr.write(this.parse(color.red(prefix), msg));
  }
}
