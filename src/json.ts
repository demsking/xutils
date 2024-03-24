import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

/**
 * Reads and parses JSON data from a file asynchronously.
 * @template T
 * @param {string} filename - The path to the JSON file to read.
 * @param {string} [cwd] - The current working directory to resolve the filename against.
 * @returns {Promise<T>} A promise that resolves with the parsed JSON data.
 */
export async function readJson<T>(filename: string, cwd?: string): Promise<T> {
  if (cwd) {
    filename = resolve(cwd, filename);
  }

  const packageString = await readFile(filename, 'utf-8');

  return JSON.parse(packageString);
}
