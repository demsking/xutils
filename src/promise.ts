/**
 * Sequential promise execution
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
 * Parallel promise execution
 */
export async function all<T, X>(items: X[], fn: (item: X, index: number) => Promise<T>): Promise<T[]> {
  return Promise.all(items.map((item, index) => fn(item, index)));
}
