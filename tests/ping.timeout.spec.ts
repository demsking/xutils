/* eslint-disable radar/no-duplicate-string */
/* eslint-disable jest/no-conditional-expect */

import { ping } from '../src/ping';
import { EventEmitter } from 'node:events';

const emitter = new EventEmitter();

(emitter as any).end = jest.fn();

const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

jest.mock('node:net', () => ({
  createConnection: () => emitter,
}));

describe('ping', () => {
  describe('async function ping(urlString: string, { timeout = 30000, interval = 10000, retries = 3, logger }: Options = {}): Promise<void>', () => {
    beforeEach(() => jest.resetAllMocks());

    it.each([
      ['http://www.example.with.timeout.com', { logger: undefined, timeout: 500, interval: 100 }],
      ['http://www.example.with.timeout.com', { logger, timeout: 500, interval: 100 }],
    ])('ping(%j, %j) === true with timeout', async (url, options) => {
      setTimeout(() => emitter.emit('timeout'), options.timeout);
      setTimeout(() => emitter.emit('connect'), options.timeout + 10);

      const result = ping(url, options);

      await expect(result).resolves.toBeTruthy();

      if (options?.logger) {
        expect(logger.error).not.toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalledTimes(1);
        expect(logger.info).toHaveBeenCalledTimes(2);
      }
    });

    it.each([
      ['http://www.example.with.timeout.com', { logger: undefined, timeout: 500, interval: 100, retries: 1 }],
      ['http://www.example.with.timeout.com', { logger, timeout: 500, interval: 100, retries: 1 }],
    ])('ping(%j, %j) === true with timeout and error', async (url, options) => {
      setTimeout(() => emitter.emit('timeout'), options.timeout);
      setTimeout(() => emitter.emit('timeout'), options.timeout + 10);

      const result = ping(url, options);

      await expect(result).rejects.toThrow(/Service .+ is still not yet available/);

      if (options?.logger) {
        expect(logger.error).not.toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalledTimes(3);
        expect(logger.info).toHaveBeenCalledTimes(1);
      }
    });
  });
});
