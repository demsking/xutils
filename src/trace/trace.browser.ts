/* eslint-disable no-console */

export class Trace {
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
    console.warn(this.parse(prefix, msg));
  }

  error(msg: string, prefix = 'ERROR'): void {
    console.error(this.parse(prefix, msg));
  }

  debug(msg: string, prefix = 'DEBUG'): void {
    console.log(this.parse(prefix, msg));
  }
}
