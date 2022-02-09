import { ITrace } from '../../typings';
import { ConsoleColor } from '../ConsoleColor';

export class Trace implements ITrace {
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
    process.stderr.write(this.parse(ConsoleColor.yellow(prefix), msg));
  }

  error(msg: string, prefix = 'ERROR'): void {
    process.stderr.write(this.parse(ConsoleColor.red(prefix), msg));
  }
}
