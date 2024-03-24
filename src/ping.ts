import { createConnection } from 'node:net';
import type { Trace } from './trace/trace.node.js';

/**
 * Options for ping function.
 * @typedef {Object} PingOptions
 * @property {number} [timeout=30000] - The timeout value in milliseconds.
 * @property {number} [interval=10000] - The interval between retries in milliseconds.
 * @property {number} [retries=3] - The number of retries.
 * @property {Trace} [logger] - The logger object for logging.
 */
export type PingOptions = {
  timeout?: number;
  interval?: number;
  retries?: number;
  logger?: Trace;
};

/**
 * Checks the availability of a service by pinging it.
 * @param {string} urlString - The URL of the service.
 * @param {PingOptions} [options={}] - The options for pinging.
 * @returns {Promise<boolean>} A promise that resolves to true if the service is available, otherwise false.
 */
export function ping(
  urlString: string,
  { timeout = 30000, interval = 10000, retries = 3, logger }: PingOptions = {}
): Promise<boolean> {
  let count = 1;
  let retrying = true;
  const url = new URL(urlString);
  const port = Number.parseInt(url.port, 10) || 80;

  return new Promise((resolve, reject) => {
    const retry = (err?: Error) => {
      if (retrying) {
        if (++count <= retries) {
          setTimeout(check, interval);
        } else if (err) {
          reject(new Error(`Service ${url.host} is still not yet available (${err.message})`));
        } else {
          reject(new Error(`Service ${url.host} is still not yet available`));
        }
      }
    };

    const check = () => {
      logger?.info(`Checking availability of service ${url.host} (${count})`);

      const socket = createConnection({ host: url.hostname, port, timeout });

      socket.on('connect', () => {
        retrying = false;

        resolve(true);
        logger?.info(`Service ${url.host} is now available`);
      });

      socket.on('timeout', () => {
        socket.end();
        logger?.warn(`Service ${url.host} is not yet available (timeout)`);
        retry();
      });

      socket.on('error', (err) => {
        socket.end();
        logger?.warn(`Service ${url.host} is not yet available (${err.message})`);
        retry(err);
      });

      socket.on('close', () => socket.destroy());

      socket.end();
    };

    check();
  });
}
