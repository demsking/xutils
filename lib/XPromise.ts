export const XPromise = {
  /**
   * Sequential promise execution
   */
  async chain<T>(items: T[], fn: (item: T, index: number) => Promise<any>) {
    const results: any[] = [];

    await items.reduce((task, item, index) => {
      return task
        .then(() => fn(item, index))
        .then((result) => results.push(result))
        .then(() => Promise.resolve());
    }, Promise.resolve());

    return results;
  },

  /**
   * Parallel promise execution
   */
  async all<T>(items: T[], fn: (item: T, index: number) => Promise<any>) {
    return Promise.all(items.map((item, index) => fn(item, index)));
  }
};
