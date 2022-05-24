/* eslint-disable radar/no-duplicate-string */

import { generateEmptyValue } from '../src/schema';

describe('schema', () => {
  describe('generateEmptyValue<T = unknown>(schema: Record<string, any>, useDefault = false): T', () => {
    it.each([
      // number
      [{ type: 'number' }, undefined, undefined],
      [{ type: 'number' }, false, undefined],
      [{ type: 'number' }, true, undefined],
      [{ type: 'number', default: 1 }, undefined, undefined],
      [{ type: 'number', default: 1 }, false, undefined],
      [{ type: 'number', default: 1 }, true, 1],
      [{ type: 'number', const: 1 }, undefined, undefined],
      [{ type: 'number', const: 1 }, false, undefined],
      [{ type: 'number', const: 1 }, true, 1],
      // boolean
      [{ type: 'boolean' }, undefined, undefined],
      [{ type: 'boolean' }, false, undefined],
      [{ type: 'boolean' }, true, undefined],
      [{ type: 'boolean', default: true }, undefined, undefined],
      [{ type: 'boolean', default: true }, false, undefined],
      [{ type: 'boolean', default: true }, true, true],
      [{ type: 'boolean', default: false }, true, false],
      [{ type: 'boolean', const: true }, undefined, undefined],
      [{ type: 'boolean', const: true }, false, undefined],
      [{ type: 'boolean', const: true }, true, true],
      [{ type: 'boolean', const: false }, true, false],
      // string
      [{ type: 'string' }, undefined, ''],
      [{ type: 'string' }, false, ''],
      [{ type: 'string' }, true, ''],
      [{ type: 'string', default: '' }, undefined, ''],
      [{ type: 'string', default: 'hello' }, false, ''],
      [{ type: 'string', default: '' }, true, ''],
      [{ type: 'string', default: 'hello' }, true, 'hello'],
      [{ type: 'string', const: '' }, undefined, ''],
      [{ type: 'string', const: 'hello' }, false, ''],
      [{ type: 'string', const: '' }, true, ''],
      [{ type: 'string', const: 'hello' }, true, 'hello'],
      [{ type: 'string', enum: ['hello'] }, true, undefined],
      [{ type: 'string', enum: ['hello'], default: 'hello' }, true, 'hello'],
      // array
      [{ type: 'array' }, undefined, []],
      [{ type: 'array' }, false, []],
      [{ type: 'array' }, true, []],
      [{ type: 'array', default: [1] }, undefined, []],
      [{ type: 'array', default: [1] }, false, []],
      [{ type: 'array', default: [1] }, true, [1]],
      [{ type: 'array', const: [1] }, undefined, []],
      [{ type: 'array', const: [1] }, false, []],
      [{ type: 'array', const: [1] }, true, [1]],
      // object
      [{ type: 'object' }, undefined, {}],
      [{ type: 'object' }, false, {}],
      [{ type: 'object' }, true, {}],
      [{ type: 'object', default: { a: 1 } }, undefined, {}],
      [{ type: 'object', default: { a: 1 } }, false, {}],
      [{ type: 'object', default: { a: 1 } }, true, { a: 1 }],
      [{ type: 'object', const: { a: 1 } }, undefined, {}],
      [{ type: 'object', const: { a: 1 } }, false, {}],
      [{ type: 'object', const: { a: 1 } }, true, { a: 1 }],
      [{ type: 'object', properties: { n: { type: 'number' } } }, true, {}],
      [{ type: 'object', properties: { n: { type: 'string' } }, required: ['n'] }, true, { n: '' }],
      [{ type: 'object', properties: { n: { type: 'number', default: 1 } } }, true, { n: 1 }],
      [{ type: 'object', properties: { n: { type: 'number', const: 1 } } }, true, { n: 1 }],
      // allOf
      [{ allOf: [] }, true, undefined],
      [{ allOf: [{ type: 'boolean', default: true }] }, true, true],
      [{ allOf: [{ type: 'object', default: { a: 1 } }, { type: 'object', const: { b: 2 } }] }, true, { a: 1, b: 2 }],
      // unknow
      [{ type: 'unknow' }, true, undefined],
    ])('generateEmptyValue(%s, %s) === %s', (schema, useDefault, expected) => {
      expect(generateEmptyValue(schema, useDefault)).toEqual(expected);
    });
  });
});
