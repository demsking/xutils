import color from 'cli-color';

export class Trace {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  protected parse(type: string, msg: string): string {
    const timestamp = new Date().toISOString();

    return `${timestamp} ${this.name} ${type} - ${msg}\n`;
  }

  info(msg: string): void {
    process.stdout.write(this.parse('INFO', msg));
  }

  warn(msg: string): void {
    process.stderr.write(this.parse(color.yellow('WARN'), msg));
  }

  error(msg: string): void {
    process.stderr.write(this.parse(color.red('ERROR'), msg));
  }
}
