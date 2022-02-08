import net from 'net';
import { global } from '../..';

const URL = require('url').URL;

type Options = {
  timeout?: number;
  interval?: number;
  retries?: number;
};

export default {
  async check(urlString: string, { timeout = 30000, interval = 10000, retries = 3 }: Options = {}): Promise<void> {
    let count = 0;
    let timerId: NodeJS.Timeout | null = null;
    const url = new URL(urlString);

    return new Promise((resolve, reject) => {
      const ping = () => {
        if (count++ >= retries) {
          if (timerId) {
            clearInterval(timerId);

            timerId = null;
          }

          reject(new Error(`Service ${url.host} is still not yet available`));

          return;
        }

        global.trace.info(`Checking availability of service ${url.host} (${count})`);

        const client = net.connect({ port: Number.parseInt(url.port, 10), host: url.hostname, timeout });

        client
          .on('connect', () => {
            if (timerId) {
              clearInterval(timerId);

              timerId = null;
            }

            global.trace.info(`Service ${url.host} is now available`);
            resolve();
            client.destroy();
          })
          .on('timeout', () => global.trace.warn(`Service ${url.host} is not yet available (timeout)`))
          .on('error', (err) => global.trace.warn(`Service ${url.host} is not yet available (${err.message})`))
          .end();
      };

      ping();

      if (retries > 1) {
        timerId = setInterval(ping, interval);
      }
    });
  },
  async checkAll(urls: string[], { timeout = 30000, interval = 5000, retries = 3 }: Options = {}): Promise<void> {
    await Promise.all(urls.map((url) => this.check(url, { timeout, interval, retries })));
  },
};
