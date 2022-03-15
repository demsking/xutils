/* eslint-disable radar/no-duplicate-string */

import { ping } from '../src/ping';

import nock from 'nock';

const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.end = jest.fn();

const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('ping', () => {
  describe('async function ping(urlString: string, { timeout = 30000, interval = 10000, retries = 3, logger }: Options = {}): Promise<void>', () => {
    beforeEach(() => jest.resetAllMocks());

    it.only.each([
      ['http://www.example1.com', undefined],
      ['http://www.example2.com', { logger }],
    ])('ping(%j, %j) === true', async (url, options) => {
      nock(url).get('/').reply(200);

      const result = ping(url, options);

      await expect(result).resolves.toBeTruthy();

      if (options?.logger) {
        expect(logger.warn).not.toBeCalled();
        expect(logger.error).not.toBeCalled();
        expect(logger.info).toBeCalledTimes(2);
      } else {
        expect(logger.error).not.toBeCalled();
        expect(logger.info).not.toBeCalled();
        expect(logger.warn).not.toBeCalled();
      }
    });

    it.only.each([
      ['http://www.example.with.error1.com', { logger: undefined, timeout: 500, interval: 100 }],
      ['http://www.example.with.error22.com', { logger, timeout: 500, interval: 100 }],
    ])('ping(%j, %j) with error', async (url, options) => {
      const result = ping(url, options);

      await expect(result).rejects.toThrowError(/Service .+ is still not yet available \(/);

      if (options?.logger) {
        expect(logger.error).not.toBeCalled();
        expect(logger.warn).toBeCalledTimes(3);
        expect(logger.info).toBeCalledTimes(3);
      } else {
        expect(logger.error).not.toBeCalled();
        expect(logger.info).not.toBeCalled();
        expect(logger.warn).not.toBeCalled();
      }
    });
  });
});
