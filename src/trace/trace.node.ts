import color from '../color/color.node';

import { AbstractTrace } from './AbstractTrace';

export class Trace extends AbstractTrace {
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
