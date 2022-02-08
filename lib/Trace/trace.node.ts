import color from 'cli-color';

function parse(type: string, msg: string): string {
  const timestamp = new Date().toISOString();

  return `${timestamp} ${type} - ${msg}\n`;
}

export const Trace = {
  info(msg: string, prefix = 'INFO'): void {
    process.stdout.write(parse(prefix, msg));
  },
  log(msg: string, prefix = 'INFO'): void {
    process.stdout.write(parse(color.cyan(prefix), msg));
  },
  warn(msg: string, prefix = 'WARN'): void {
    process.stderr.write(parse(color.yellow(prefix), msg));
  },
  error(msg: string, prefix = 'ERROR'): void {
    process.stderr.write(parse(color.red(prefix), msg));
  },
};
