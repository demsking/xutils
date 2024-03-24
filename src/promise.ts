/**
 * Executes asynchronous functions sequentially over each item in the array and returns an array of results.
 * @param {X[]} items - The array of items.
 * @param {(item: X, index: number) => Promise<T>} fn - The asynchronous function to execute over each item.
 * @returns {Promise<T[]>} A promise that resolves to an array of results.
 * @template T, X
 */
export async function chain<T, X>(items: X[], fn: (item: X, index: number) => Promise<T>): Promise<T[]> {
  const results: any[] = [];

  await items.reduce((task, item, index) => {
    return task
      .then(() => fn(item, index))
      .then((result) => results.push(result))
      .then(() => Promise.resolve());
  }, Promise.resolve());

  return results;
}

/**
 * Executes asynchronous functions in parallel over each item in the array and returns an array of results.
 * @param {X[]} items - The array of items.
 * @param {(item: X, index: number) => Promise<T>} fn - The asynchronous function to execute over each item.
 * @returns {Promise<T[]>} A promise that resolves to an array of results.
 * @template T, X
 */
export async function all<T, X>(items: X[], fn: (item: X, index: number) => Promise<T>): Promise<T[]> {
  return Promise.all(items.map((item, index) => fn(item, index)));
}
