export function split<T>(array: T[], limit: number): T[][] {
  const input = [...array];

  if (limit <= 0) {
    return [input];
  }

  const result = [];

  while (input.length) {
    result.push(input.splice(0, limit));
  }

  return result;
}

export function swapItems(array: any[], from: number, to: number): void {
  [array[from], array[to]] = [array[to], array[from]];
}

export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)) as number;

    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

/**
 * Add `item` between array items
 * @returns A new array
 */
export function include<T>(array: Readonly<T>[], item: Readonly<T>): T[] {
  return array.reduce((children, entry, index) => {
    children.push(entry);

    if (index < array.length - 1) {
      children.push(item);
    }

    return children;
  }, [] as T[]);
}

export function identical(array1: any, array2: any): boolean {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return false;
  }

  if (array1 === array2) {
    return true;
  }

  if (array1.length !== array2.length) {
    return false;
  }

  return !array1.some((item, index) => item !== array2[index]);
}

export function remove(array: unknown[], itemToRemove: unknown): number {
  const index = array.findIndex((item) => item === itemToRemove);

  if (index > -1) {
    array.splice(index, 1);
  }

  return index;
}

/**
 * Returns the index of the first element in the array, and -1 otherwise.
 */
export function findIndex<T = unknown>(items: T[], element: T): number {
  return items.findIndex((currentItem) => currentItem === element);
}
