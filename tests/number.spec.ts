import { describe, expect, it } from 'vitest';
import { random } from '../src/number';

describe('number', () => {
  describe('random(min: number, max: number): number', () => {
    it.each([
      [5, 9],
    ])('result should be includes in [%i, %i]', (min, max) => {
      const result = random(min, max);

      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
    });
  });
});
