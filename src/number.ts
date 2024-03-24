/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 * @param {number} min - The minimum value (inclusive).
 * @param {number} max - The maximum value (inclusive).
 * @returns {number} A random integer within the specified range.
 */
export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
