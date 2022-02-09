/* eslint-disable radar/no-duplicate-string */

import { toKebabCase, trimlines, unCamelCase } from '../src/string';

describe('string', () => {
  describe('trimlines(str: string, separator = \'\'): string', () => {
    it.only.each([
      ['hello', undefined, 'hello'],
      ['hello\nworld', undefined, 'helloworld'],
      ['hello\nworld', '', 'helloworld'],
      ['hello\nworld\n', ' ', 'hello world'],
    ])('trimlines("%s", %s) === "%s"', (input, separator, expected) => {
      expect(trimlines(input, separator)).toBe(expected);
    });
  });

  describe('toKebabCase(str: string): string', () => {
    it.only.each([
      ['hello', 'hello'],
      ['Hello', 'hello'],
      ['H1ello', 'h1ello'],
      ['camelCase', 'camel-case'],
      ['PascalCase', 'pascal-case'],
      ['Hello World', 'hello-world'],
      ['Hello_World', 'hello-world'],
      ['Hello-world', 'hello-world'],
      ['Hello_world', 'hello-world'],
      ['Hello@world', 'hello-world'],
    ])('toKebabCase("%s") === "%s"', (input, expected) => {
      expect(toKebabCase(input)).toBe(expected);
    });
  });

  describe('unCamelCase(str: string, separator = \' \')', () => {
    it.only.each([
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
