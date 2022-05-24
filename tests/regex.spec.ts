/* eslint-disable radar/no-duplicate-string */

import { escapePattern } from '../src/regex';

describe('regex', () => {
  describe('escapePattern(pattern: string): string', () => {
    it.each([
      ['a-z.', 'a-z\\.'],
      ['a-z+', 'a-z\\+'],
      ['a-z?', 'a-z\\?'],
      ['a-z^', 'a-z\\^'],
      ['a-z$', 'a-z\\$'],
      ['a-z{', 'a-z\\{'],
      ['a-z}', 'a-z\\}'],
      ['a-z(', 'a-z\\('],
      ['a-z)', 'a-z\\)'],
      ['a-z|', 'a-z\\|'],
      ['a-z[', 'a-z\\['],
      ['a-z]', 'a-z\\]'],
      ['a-z\\', 'a-z\\\\'],
    ])('escapePattern("%s") === "%s"', (pattern, expected) => {
      expect(escapePattern(pattern)).toBe(expected);
    });
  });
});
