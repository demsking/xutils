/* eslint-disable radar/no-duplicate-string */

import { random } from '../src/number';

describe('number', () => {
  describe('random(min: number, max: number): number', () => {
    it.only.each([
      [5, 9],
    ])('random(%i, %i) includes in [%0, %1]', (min, max) => {
      const result = random(min, max);

      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });
  });
});
