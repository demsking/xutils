/* eslint-disable func-names */

import { clear, copy, del, get, isEmpty, isEquivalent, isObject, merge, set, toString, ToStringEscape } from '../src/object';

describe('object', () => {
  describe('isObject(object: Record<string, any>): boolean', () => {
    it.only.each([
      ['', false],
      [null, false],
      [true, false],
      [false, false],
      [12, false],
      [[], false],
      [{}, true],
    ])('isObject(%j) === %s', (object: unknown, expectedResult: boolean) => {
      expect(isObject(object)).toBe(expectedResult);
    });
  });

  describe('isEmpty(a: Record<string, any>): boolean', () => {
    it.only.each([
      [[1], false],
      [{ a: 1 }, false],
      [[], true],
      [{}, true],
    ])('isEmpty(%j) === %s', (object, expectedResult) => {
      expect(isEmpty(object)).toBe(expectedResult);
    });
  });

  describe('isEquivalent(a: Record<string, any>, b: Record<string, any>): boolean', () => {
    it.only.each([
      [[1], [], false],
      [[], [1], false],
      [{ a: 1 }, {}, false],
      [{}, { a: 1 }, false],
      [[], [], true],
      [[1], [1], true],
      [{ a: 1 }, { a: 1 }, true],
      [{}, {}, true],
    ])('isEquivalent(%j, %j) === %s', (a, b, expectedResult) => {
      expect(isEquivalent(a, b)).toBe(expectedResult);
    });
  });

  describe('copy<T extends Record<string, any> = Record<string, any>>(object: T): T', () => {
    it.only.each([
      [[], []],
      [[1], [1]],
      [[1, { a: 2 }], [1, { a: 2 }]],
      [{}, {}],
      [{ a: 1 }, { a: 1 }],
      [{ a: 1, b: [2] }, { a: 1, b: [2] }],
      [{ a: 1, b: { x: 1 } }, { a: 1, b: { x: 1 } }],
    ])('isEquivalent(%j, %j) === %s', (object, expectedResult) => {
      expect(copy(object)).toEqual(expectedResult);
    });
  });

  describe('merge(dest: Record<string, any>, src: Record<string, any>)', () => {
    it.only.each([
      [[], [], []],
      [[1], [0], [1, 0]],
      [[1], [0, { a: 1 }], [1, 0, { a: 1 }]],
      [{ a: 1 }, { b: 2 }, { a: 1, b: 2 }],
      [{ a: 1 }, { a: 2 }, { a: 2 }],
      [{ a: 1 }, { a: 2, b: { x: 1 } }, { a: 2, b: { x: 1 } }],
      [{ a: 1, b: { x: 3, y: 2 } }, { a: 2, b: { x: 1 } }, { a: 2, b: { x: 1, y: 2 } }],
      [{ a: 1, b: [] }, { a: 2, b: [1] }, { a: 2, b: [1] }],
      [{ a: 1, b: [1] }, { a: 2, b: [2, 3] }, { a: 2, b: [1, 2, 3] }],
      [{ a: 1, b: [{ x: 1 }] }, { a: 2, b: [{ y: 2 }] }, { a: 2, b: [{ x: 1 }, { y: 2 }] }],
    ])('merge(%j, %j) === %j', (src, dest, expectedResult) => {
      expect(merge(src, dest)).toEqual(expectedResult);
    });
  });

  describe('clear(object: Record<string, any>): void', () => {
    it.only.each([
      [{}, {}],
      [{ a: 1 }, {}],
      [{ a: 1, b: 2 }, {}],
    ])('clear(%j) === %j', (object, expectedResult) => {
      clear(object);
      expect(object).toEqual(expectedResult);
    });
  });

  describe('toString(object: object, space?: string | number): string', () => {
    it.only.each([
      [{}, undefined, '{}'],
      [{}, '', '{}'],
      [{}, ' ', '{}'],
      [{ a: 1 }, undefined, '{"a":1}'],
      [{ a: 1 }, '', '{"a":1}'],
      [{ a: 1 }, ' ', '{\n "a": 1\n}'],
      [{ a: 1, f: function() { return 1; } }, '', '{"a":1,"f":function () { return 1; }}'],
      [{ a: 1, f: () => { return 1; } }, '', '{"a":1,"f":() => { return 1; }}'],
      [{ a: 1, f() { return 1; } }, '', '{"a":1,"f":function () { return 1; }}'],
      [{ a: 1, fn () { return 1; } }, '', '{"a":1,"fn":function () { return 1; }}'],
      [{ a: 1, f: function fn() { return 1; } }, '', '{"a":1,"f":function fn() { return 1; }}'],
      [{ a: 1, f: new ToStringEscape('hello') }, '', '{"a":1,"f":hello}'],
    ])('toString(%j, %j) === %j', (object, space, expectedResult) => {
      expect(toString(object, space)).toEqual(expectedResult);
    });
  });

  describe('get<T extends unknown = unknown>(object: Record<string, any>, path: string): T | undefined', () => {
    it.only.each([
      [{}, '.', {}],
      [{ a: 1 }, '.', { a: 1 }],
      [{ a: 1 }, '', { a: 1 }],
      [{ a: 1 }, '.a', 1],
      [{ a: 1 }, 'a', 1],
      [{ a: 1 }, 'b', undefined],
      [{ a: 1, b: { c: 2 } }, 'b', { c: 2 }],
      [{ a: 1, b: { c: 2 } }, 'b.c', 2],
      [{ a: 1, b: { c: 2 } }, 'a.b', undefined],
      [{ a: 1, b: { c: [1, 2] } }, 'b.c', [1, 2]],
      [{ a: 1, b: { c: [{ x: 11, y: 21 }, { y: 3 }] } }, 'b.c.x', [11, undefined]],
      [{ a: 1, b: { c: [{ x: 11, y: 21 }, { y: 3 }] } }, 'b.c.y', [21, 3]],
      [{ a: 1, b: { c: [{ x: 11, y: { z: 26.1 } }, { y: { z: 26.2 } }] } }, 'b.c.y', [{ z: 26.1 }, { z: 26.2 }]],
    ])('get(%j, %j) === %j', (object, path, expectedResult) => expect(get(object, path)).toEqual(expectedResult));
  });

  describe('set(object: Record<string, any>, path: string, value: unknown): boolean', () => {
    describe.only.each([
      [{ a: 2 }, '.a', 1, true, { a: 1 }],
      [{ a: 2 }, '.b', 1, true, { a: 2, b: 1 }],
      [{ a: 2 }, '.b.c', 1, true, { a: 2, b: { c: 1 } }],
      [{ a: 2 }, 'b.c', 1, true, { a: 2, b: { c: 1 } }],
      [{ a: 2 }, 'd', [1], true, { a: 2, d: [1] }],
      [{ a: 2, d: [{ b: 1, x: 0 }] }, 'd.x', 2, true, { a: 2, d: [{ b: 1, x: 2 }] }],
      [{ a: 2, d: [{ b: 1 }] }, 'd.x', 2, true, { a: 2, d: [{ b: 1, x: 2 }] }],
    ])('set(%j, %j, %j) === %j', (object, path, value, expectedResult, objectResult) => {
      it(`should returns ${expectedResult}`, () => expect(set(object, path, value)).toEqual(expectedResult));
      it(`given object should be ${JSON.stringify(objectResult)}`, () => expect(object).toEqual(objectResult));
    });
  });

  describe('del(object: Record<string, any>, path: string): boolean', () => {
    describe.only.each([
      [{ a: 2 }, '.a', true, {}],
      [{ a: 2 }, '.b', false, { a: 2 }],
      [{ a: 2, d: [{ b: 1, x: 0 }] }, 'd.x', true, { a: 2, d: [{ b: 1 }] }],
      [{ a: 2, d: { b: 1 } }, 'd.b', true, { a: 2, d: { } }],
    ])('del(%j, %j) === %j', (object, path, expectedResult, objectResult) => {
      it(`should returns ${expectedResult}`, () => expect(del(object, path)).toEqual(expectedResult));
      it(`given object should be ${JSON.stringify(objectResult)}`, () => expect(object).toEqual(objectResult));
    });
  });
});
