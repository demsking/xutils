/* eslint-disable radar/no-duplicate-string */

import { identical, findIndex, include, remove, shuffle, split, swapItems } from '../src/array';

describe('array', () => {
  describe('split<T>(array: T[], limit: number): T[][]', () => {
    it.only.each([
      [[], 2, []],
      [[0, 1, 2], 0, [[0, 1, 2]]],
      [[0, 1, 2], 5, [[0, 1, 2]]],
      [[0, 1, 2], 2, [[0, 1], [2]]],
      [[0, 1, 2], 1, [[0], [1], [2]]],
    ])('split(%j, %i) === %j', (input, limit, expected) => {
      expect(split(input, limit)).toEqual(expected);
    });
  });

  describe('swapItems(array: any[], from: number, to: number): void', () => {
    it.only.each([
      [[0, 1, 2], 0, 2, [2, 1, 0]],
      [[0, 1, 2], 1, 1, [0, 1, 2]],
    ])('swapItems(%j, %i, %i) === %j', (input, from, to, expected) => {
      swapItems(input, from, to);
      expect(input).toEqual(expected);
    });
  });

  describe('shuffle<T>(array: T[]): T[]', () => {
    it.only.each([
      [[0, 1, 2, 3, 4, 5, 6, 7]],
    ])('should shuffle items randomly', (input) => {
      const expected = [...input];

      expect(shuffle(input)).not.toEqual(expected);
    });
  });

  describe('include<T>(array: Readonly<T>[], item: Readonly<T>): T[]', () => {
    it.only.each([
      [[0, 1, 2], 3, [0, 3, 1, 3, 2]],
    ])('include(%j, %i) === %j', (input, item, expected) => {
      expect(include(input, item)).toEqual(expected);
    });
  });

  describe('identical(array1: any[], array2: any[]): boolean', () => {
    const item = { a: 2 };
    const a = [2, 5];

    it.only.each([
      [null, null, false],
      [true, true, false],
      [1, 1, false],
      [a, a, true],
      [undefined, [], false],
      [[], {}, false],
      [[], [], true],
      [[0, 1, 2], [], false],
      [[0, 1, 2], [0, 1, 3], false],
      [[0, 1, 2], [0, 1, 2], true],
      [[0, 1, 2], [0, 2, 1], false],
      [[0, 1, item], [0, 1, item], true],
      [[0, 1, item], [0, 1, { ...item }], false],
    ])('identical(%j, %j) === %j', (array1, array2, expected) => {
      expect(identical(array1, array2)).toEqual(expected);
    });
  });

  describe('remove(array: unknown[], itemToRemove: unknown): number', () => {
    const itemToRemove = { a: 2 };

    it.only.each([
      [[0, 1, 2], 3, -1],
      [[0, 1, 2], 0, 0],
      [[0, 1, itemToRemove], itemToRemove, 2],
    ])('remove(%j, %j) === %j', (input, item, expected) => {
      expect(remove(input, item)).toEqual(expected);
    });
  });

  describe('findIndex<T = unknown>(items: T[], item: T): number', () => {
    it.only.each([
      [[0, 1, 2], 3, -1],
      [[0, 1, 2], 0, 0],
    ])('findIndex(%j, %j) === %j', (input, item, expected) => {
      expect(findIndex(input, item)).toEqual(expected);
    });
  });
});
