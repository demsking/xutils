/* eslint-disable radar/no-duplicate-string */

import { toKebabCase } from '../lib/String';

describe('XString', () => {
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
});
