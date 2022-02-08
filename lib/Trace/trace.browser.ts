function parse(type: string, msg: string): string {
  const timestamp = new Date().toISOString();

  return `${timestamp} ${type} - ${msg}\n`;
}

export const Trace = {
  info(msg: string, prefix = 'INFO'): void {
    console.info(parse(prefix, msg));
  },
  log(msg: string, prefix = 'INFO'): void {
    console.info(parse(prefix, msg));
  },
  warn(msg: string, prefix = 'WARN'): void {
    console.error(parse(prefix, msg));
  },
  error(msg: string, prefix = 'ERROR'): void {
    console.error(parse(prefix, msg));
  },
};
