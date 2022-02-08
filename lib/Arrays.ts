export const Arrays = Object.freeze({
  switch(array: any[], from: number, to: number) {
    [array[from], array[to]] = [array[to], array[from]];
  },
  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)) as number;

      [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
  },
  /**
   * Add `item` between array items
   * @returns A new array
   */
  include<T>(array: Readonly<T>[], item: Readonly<T>): T[] {
    return array.reduce((children, entry, index) => {
      children.push(entry);

      if (index < array.length - 1) {
        children.push(item);
      }

      return children;
    }, [] as T[]);
  },
  flat(array: any[], depth = 1) {
    const flattend = [];

    (function flat(a, d) {
      for (const el of a) {
        if (Array.isArray(el) && d > 0) {
          flat(el, d - 1);
        } else {
          flattend.push(el);
        }
      }
    }(array, depth));

    return flattend;
  },
  scalarEquals(array1: any[], array2: any[]) {
    if (array1.length !== array2.length) {
      return false;
    }

    return !array1.some((item) => !array2.includes(item));
  },
});
