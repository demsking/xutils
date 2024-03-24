/**
 * Escapes special characters in a string, making it suitable for use as a literal in a regular expression pattern.
 * @param {string} pattern - The input pattern string.
 * @returns {string} The escaped pattern string.
 */
export function escapePattern(pattern: string): string {
  return pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
