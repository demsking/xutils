/* eslint-disable no-console */

import { AbstractTrace } from './AbstractTrace';

export class Trace extends AbstractTrace {
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
