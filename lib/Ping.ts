import { connect } from 'net';
import { ITrace } from '../typings';

const { URL } = require('url');

type Options = {
  timeout?: number;
  interval?: number;
  retries?: number;
  logger?: ITrace;
};

export default {
  async check(urlString: string, { timeout = 30000, interval = 10000, retries = 3, logger }: Options = {}): Promise<void> {
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

        logger?.info(`Checking availability of service ${url.host} (${count})`);

        const client = connect({ port: Number.parseInt(url.port, 10), host: url.hostname, timeout });

        client
          .on('connect', () => {
            if (timerId) {
              clearInterval(timerId);

              timerId = null;
            }

            logger?.info(`Service ${url.host} is now available`);
            resolve();
            client.destroy();
          })
          .on('timeout', () => logger?.warn(`Service ${url.host} is not yet available (timeout)`))
          .on('error', (err) => logger?.warn(`Service ${url.host} is not yet available (${err.message})`))
          .end();
      };

      ping();

      if (retries > 1) {
        timerId = setInterval(ping, interval);
      }
    });
  },
  async checkAll(urls: string[], { timeout = 30000, interval = 5000, retries = 3, logger }: Options = {}): Promise<void> {
    await Promise.all(urls.map((url) => this.check(url, { timeout, interval, retries, logger })));
  },
};
