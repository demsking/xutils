import { toKebabCase } from '../lib/XString';

describe('XString', () => {
  describe('toKebabCase(str: string): string', () => {
    // eslint-disable-next-line jest/no-focused-tests
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
    ])('toKebabCase("%s") === "%s"', (input, expected) => expect(toKebabCase(input)).toBe(expected));
  });
});
