/* eslint-disable jest/no-conditional-expect */

import { ping } from '../src/ping';

import nock from 'nock';

const EventEmitter = require('events');

const emitter = new EventEmitter();

emitter.end = jest.fn();

const logger = {
  prefix: 'xxx',
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('ping', () => {
  describe('async function ping(urlString: string, { timeout = 30000, interval = 10000, retries = 3, logger }: Options = {}): Promise<void>', () => {
    beforeEach(() => jest.resetAllMocks());

    it.each([
      ['http://www.example1.com', undefined],
      ['http://www.example2.com', { logger }],
    ])('ping(%j, %j) === true', async (url, options) => {
      nock(url).get('/').reply(200);

      const result = ping(url, options);

      await expect(result).resolves.toBeTruthy();

      if (options?.logger) {
        expect(logger.warn).not.toHaveBeenCalled();
        expect(logger.error).not.toHaveBeenCalled();
        expect(logger.info).toHaveBeenCalledTimes(2);
      } else {
        expect(logger.error).not.toHaveBeenCalled();
        expect(logger.info).not.toHaveBeenCalled();
        expect(logger.warn).not.toHaveBeenCalled();
      }
    });

    it.each([
      ['http://www.example.with.error1.com', { logger: undefined, timeout: 500, interval: 100 }],
      ['http://www.example.with.error22.com', { logger, timeout: 500, interval: 100 }],
    ])('ping(%j, %j) with error', async (url, options) => {
      const result = ping(url, options);

      await expect(result).rejects.toThrow(/Service .+ is still not yet available \(/);

      if (options?.logger) {
        expect(logger.error).not.toHaveBeenCalled();
        expect(logger.warn).toHaveBeenCalledTimes(3);
        expect(logger.info).toHaveBeenCalledTimes(3);
      } else {
        expect(logger.error).not.toHaveBeenCalled();
        expect(logger.info).not.toHaveBeenCalled();
        expect(logger.warn).not.toHaveBeenCalled();
      }
    });
  });
});
