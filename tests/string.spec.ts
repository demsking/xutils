/* eslint-disable radar/no-duplicate-string */

import { describe, expect, it } from 'vitest';
import { parseCase, toKebabCase, trimlines, unCamelCase } from '../src/string';

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

  describe('parseCase(str: string, options: ParseCaseOptions): string', () => {
    it.each([
      ['heLlo', { separator: '$' }, 'he$llo'],
      ['heLlo', { separator: '$', escapedChars: ['$'] }, 'he$llo'],
      ['heLlo', { separator: '-', escapedChars: ['$'] }, 'he-llo'],
    ])('parseCase("%s", %j) === "%s" with separator "%s"', (input, options, expected) => {
      expect(parseCase(input, options)).toBe(expected);
    });
  });

  describe('toKebabCase(str: string, escapedChars?: string[]): string', () => {
    it.each([
      ['hello', undefined, 'hello'],
      ['HELLO', undefined, 'hello'],
      ['Hello', undefined, 'hello'],
      ['H1ello', undefined, 'h1ello'],
      ['camelCase', undefined, 'camel-case'],
      ['PascalCase', undefined, 'pascal-case'],
      ['Hello World', undefined, 'hello-world'],
      ['Hello_World', undefined, 'hello-world'],
      ['Hello-world', undefined, 'hello-world'],
      ['Hello_world', undefined, 'hello-world'],
      ['Hello@world', undefined, 'hello-world'],
      ['showOnUpDown', undefined, 'show-on-up-down'],
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
      ['hello', 'hello'],
      ['Hello', 'hello'],
      ['H1ello', 'h1ello'],
      ['camelCase', 'camel case'],
      ['PascalCase', 'pascal case'],
    ])('unCamelCase("%s") === "%s"', (input, expected) => {
      expect(unCamelCase(input)).toBe(expected);
    });
  });
});
