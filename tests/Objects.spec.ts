import { Objects } from '../src/Objects';

describe('Objects', () => {
  describe('Objects.isObject(object: Record<string, any>): boolean', () => {
    it.only.each([
      ['', false],
      [null, false],
      [true, false],
      [false, false],
      [12, false],
      [[], false],
      [{}, true],
    ])('Objects.isObject(%j) === %s', (object: unknown, expectedResult: boolean) => {
      expect(Objects.isObject(object)).toBe(expectedResult);
    });
  });

  describe('Objects.isEmpty(a: Record<string, any>): boolean', () => {
    it.only.each([
      [[1], false],
      [{ a: 1 }, false],
      [[], true],
      [{}, true],
    ])('Objects.isEmpty(%j) === %s', (object, expectedResult) => {
      expect(Objects.isEmpty(object)).toBe(expectedResult);
    });
  });

  describe('Objects.isEquivalent(a: Record<string, any>, b: Record<string, any>): boolean', () => {
    it.only.each([
      [[1], [], false],
      [[], [1], false],
      [{ a: 1 }, {}, false],
      [{}, { a: 1 }, false],
      [[], [], true],
      [[1], [1], true],
      [{ a: 1 }, { a: 1 }, true],
      [{}, {}, true],
    ])('Objects.isEquivalent(%j, %j) === %s', (a, b, expectedResult) => {
      expect(Objects.isEquivalent(a, b)).toBe(expectedResult);
    });
  });

  describe('Objects.copy<T extends Record<string, any> = Record<string, any>>(object: T): T', () => {
    it.only.each([
      [[], []],
      [[1], [1]],
      [[1, { a: 2 }], [1, { a: 2 }]],
      [{}, {}],
      [{ a: 1 }, { a: 1 }],
      [{ a: 1, b: [2] }, { a: 1, b: [2] }],
    ])('Objects.isEquivalent(%j, %j) === %s', (object, expectedResult) => {
      expect(Objects.copy(object)).toEqual(expectedResult);
    });
  });

  describe('Objects.merge(dest: Record<string, any>, src: Record<string, any>)', () => {
    it.only.each([
      [[], [], []],
      [[1], [0], [1, 0]],
      [[1], [0, { a: 1 }], [1, 0, { a: 1 }]],
      [{ a: 1 }, { b: 2 }, { a: 1, b: 2 }],
      [{ a: 1 }, { a: 2 }, { a: 2 }],
    ])('Objects.merge(%j, %j) === %j', (src, dest, expectedResult) => {
      expect(Objects.merge(src, dest)).toEqual(expectedResult);
    });
  });

  describe('Objects.get<T extends unknown = unknown>(object: Record<string, any>, path: string): T | undefined', () => {
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
    ])('Objects.get(%j, %j) === %j', (object, path, expectedResult) => expect(Objects.get(object, path)).toEqual(expectedResult));
  });

  describe('Objects.set(object: Record<string, any>, path: string, value: unknown): boolean', () => {
    describe.only.each([
      [{ a: 2 }, '.a', 1, true, { a: 1 }],
      [{ a: 2 }, '.b', 1, true, { a: 2, b: 1 }],
      [{ a: 2 }, '.b.c', 1, true, { a: 2, b: { c: 1 } }],
      [{ a: 2 }, 'b.c', 1, true, { a: 2, b: { c: 1 } }],
      [{ a: 2 }, 'd', [1], true, { a: 2, d: [1] }],
      [{ a: 2, d: [{ b: 1, x: 0 }] }, 'd.x', 2, true, { a: 2, d: [{ b: 1, x: 2 }] }],
      [{ a: 2, d: [{ b: 1 }] }, 'd.x', 2, true, { a: 2, d: [{ b: 1, x: 2 }] }],
    ])('Objects.set(%j, %j, %j) === %j', (object, path, value, expectedResult, objectResult) => {
      it(`should returns ${expectedResult}`, () => expect(Objects.set(object, path, value)).toEqual(expectedResult));
      it(`given object should be ${JSON.stringify(objectResult)}`, () => expect(object).toEqual(objectResult));
    });
  });

  describe('Objects.del(object: Record<string, any>, path: string): boolean', () => {
    describe.only.each([
      [{ a: 2 }, '.a', true, {}],
      [{ a: 2 }, '.b', false, { a: 2 }],
      [{ a: 2, d: [{ b: 1, x: 0 }] }, 'd.x', true, { a: 2, d: [{ b: 1 }] }],
      [{ a: 2, d: { b: 1 } }, 'd.b', true, { a: 2, d: { } }],
    ])('Objects.del(%j, %j) === %j', (object, path, expectedResult, objectResult) => {
      it(`should returns ${expectedResult}`, () => expect(Objects.del(object, path)).toEqual(expectedResult));
      it(`given object should be ${JSON.stringify(objectResult)}`, () => expect(object).toEqual(objectResult));
    });
  });
});
