/* eslint-disable radar/no-duplicate-string */

import { chain, all } from '../src/promise';

describe('promise', () => {
  describe('async function chain<T, X>(items: X[], fn: (item: X, index: number) => Promise<T>): Promise<T[]>', () => {
    const fnIncrement = async (x: number) => x + 1;

    it.only.each([
      [[2, 3], fnIncrement, [3, 4], jest.fn().mockImplementation(fnIncrement)],
    ])('chain(%j, %s) === %j', async (items, fn, expected, mockfn) => {
      const result = await chain(items, mockfn);

      expect(result).toEqual(expected);
      expect(mockfn).toBeCalledTimes(items.length);
      expect(mockfn).toBeCalledWith(items[0], 0);
      expect(mockfn).toHaveBeenLastCalledWith(items[1], 1);
    });
  });

  describe('async function all<T, X>(items: X[], fn: (item: X, index: number) => Promise<T>): Promise<T[]>', () => {
    const fnIncrement = async (x: number) => x + 1;

    it.only.each([
      [[2, 3], fnIncrement, [3, 4], jest.fn().mockImplementation(fnIncrement)],
    ])('all(%j, %s) === %j', async (items, fn, expected, mockfn) => {
      const result = await all(items, mockfn);

      expect(result).toEqual(expected);
      expect(mockfn).toBeCalledTimes(items.length);
      expect(mockfn).toBeCalledWith(items[1], 1);
      expect(mockfn).toBeCalledWith(items[0], 0);
    });
  });
});
