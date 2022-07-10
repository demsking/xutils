/* eslint-disable radar/no-duplicate-string */

import { toKebabCase, trimlines, unCamelCase } from '../src/string';

describe('string', () => {
  describe('trimlines(str: string, separator = \'\'): string', () => {
    it.each([
      ['hello', undefined, 'hello'],
      ['hello\nworld', undefined, 'helloworld'],
      ['hello\nworld', '', 'helloworld'],
      ['hello\nworld\n', ' ', 'hello world'],
    ])('trimlines("%s", %s) === "%s"', (input, separator, expected) => {
      expect(trimlines(input, separator)).toBe(expected);
    });
  });

  describe('toKebabCase(str: string, escapedChars?: string[]): string', () => {
    it.only.each([
      ['hello', undefined, 'hello'],
      ['Hello', undefined, 'hello'],
      ['H1ello', undefined, 'h1ello'],
      ['camelCase', undefined, 'camel-case'],
      ['PascalCase', undefined, 'pascal-case'],
      ['Hello World', undefined, 'hello-world'],
      ['Hello_World', undefined, 'hello-world'],
      ['Hello-world', undefined, 'hello-world'],
      ['Hello_world', undefined, 'hello-world'],
      ['Hello@world', undefined, 'hello-world'],
      ['Hello@world', [], 'hello-world'],
      ['Hello@world', ['@'], 'hello@world'],
      ['Hello@world:', [':'], 'hello-world:'],
      ['=Hello@world', ['='], '=hello-world'],
    ])('toKebabCase(%j, %j) === %j', (input, escapedChars, expected) => {
      expect(toKebabCase(input, escapedChars)).toBe(expected);
    });
  });

  describe('unCamelCase(str: string, separator = \' \')', () => {
    it.each([
      ['hello', 'hello', undefined],
      ['Hello', 'hello', undefined],
      ['H1ello', 'h1ello', undefined],
      ['camelCase', 'camel case', undefined],
      ['camelCase', 'camel case', ' '],
      ['camelCase', 'camelcase', ''],
      ['PascalCase', 'pascal-case', '-'],
      ['Hello World', 'hello-world', '-'],
      ['Hello_World', 'hello-world', '-'],
      ['Hello-world', 'hello*world', '*'],
      ['Hello_world', 'hello-world', '-'],
      ['Hello@world', 'hello-world', '-'],
    ])('unCamelCase("%s") === "%s" with separator "%s"', (input, expected, separator) => {
      expect(unCamelCase(input, separator)).toBe(expected);
    });
  });
});
