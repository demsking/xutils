/* eslint-disable radar/no-duplicate-string */

import { equals, findIndex, include, remove, shuffle, split, switchItems } from '../src/array';

describe('array', () => {
  describe('split<T>(array: T[], limit: number): T[][]', () => {
    it.only.each([
      [[], 2, []],
      [[0, 1, 2], 0, [[0, 1, 2]]],
      [[0, 1, 2], 5, [[0, 1, 2]]],
      [[0, 1, 2], 2, [[0, 1], [2]]],
      [[0, 1, 2], 1, [[0], [1], [2]]],
    ])('split(%s, %i) === %s', (input, limit, expected) => {
      expect(split(input, limit)).toEqual(expected);
    });
  });

  describe('switchItems(array: any[], from: number, to: number): void', () => {
    it.only.each([
      [[0, 1, 2], 0, 2, [2, 1, 0]],
      [[0, 1, 2], 1, 1, [0, 1, 2]],
    ])('switchItems(%s, %i, %i) === %s', (input, from, to, expected) => {
      switchItems(input, from, to);
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
    ])('include(%s, %i) === %s', (input, item, expected) => {
      expect(include(input, item)).toEqual(expected);
    });
  });

  describe('equals(array1: any[], array2: any[]): boolean', () => {
    const item = { a: 2 };

    it.only.each([
      [[], [], true],
      [[0, 1, 2], [], false],
      [[0, 1, 2], [0, 1, 3], false],
      [[0, 1, 2], [0, 1, 2], true],
      [[0, 1, 2], [0, 2, 1], false],
      [[0, 1, item], [0, 1, item], true],
      [[0, 1, item], [0, 1, { ...item }], false],
    ])('remove(%s, %s) === %s', (array1, array2, expected) => {
      expect(equals(array1, array2)).toEqual(expected);
    });
  });

  describe('remove(array: unknown[], itemToRemove: unknown): number', () => {
    const itemToRemove = { a: 2 };

    it.only.each([
      [[0, 1, 2], 3, -1],
      [[0, 1, 2], 0, 0],
      [[0, 1, itemToRemove], itemToRemove, 2],
    ])('remove(%s, %s) === %s', (input, item, expected) => {
      expect(remove(input, item)).toEqual(expected);
    });
  });

  describe('findIndex<T = unknown>(items: T[], item: T): number', () => {
    it.only.each([
      [[0, 1, 2], 3, -1],
      [[0, 1, 2], 0, 0],
    ])('remove(%s, %s) === %s', (input, item, expected) => {
      expect(findIndex(input, item)).toEqual(expected);
    });
  });
});
