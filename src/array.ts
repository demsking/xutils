/**
 * Splits an array into multiple arrays of specified size.
 * @template T
 * @param {T[]} array - The array to split.
 * @param {number} limit - The size limit for each sub-array.
 * @returns {T[][]} An array containing arrays of elements from the original array.
 */
export function split<T>(array: T[], limit: number): T[][] {
  const input = [...array];

  if (limit <= 0) {
    return [input];
  }

  const result: T[][] = [];

  while (input.length) {
    result.push(input.splice(0, limit));
  }

  return result;
}

/**
 * Swaps items in an array at specified indices.
 * @param {any[]} array - The array containing the items to swap.
 * @param {number} from - The index of the first item to swap.
 * @param {number} to - The index of the second item to swap.
 * @returns {void}
 */
export function swapItems(array: any[], from: number, to: number): void {
  [array[from], array[to]] = [array[to], array[from]];
}

/**
 * Shuffles the elements of an array in place.
 * @template T
 * @param {T[]} array - The array to shuffle.
 * @returns {T[]} The shuffled array.
 */
export function shuffle<T>(array: T[]): T[] {
  for (let index = array.length - 1; index > 0; index--) {
    const j = Math.floor(Math.random() * (index + 1)) as number;

    [array[index], array[j]] = [array[j], array[index]];
  }

  return array;
}

/**
 * Returns a new array by inserting a specified item between each element of the original array.
 * @template T
 * @param {Readonly<T>[]} array - The array to include the item in.
 * @param {Readonly<T>} item - The item to include between each element.
 * @returns {T[]} A new array with the specified item included between each element.
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

/**
 * Checks if two arrays are identical, i.e., have the same elements in the same order.
 * @param {Array} array1 - The first array to compare.
 * @param {Array} array2 - The second array to compare.
 * @returns {boolean} Returns true if the arrays are identical, false otherwise.
 */
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

/**
 * Removes the first occurrence of a specified item from an array.
 * @template T
 * @param {T[]} array - The array to remove the item from.
 * @param {T} itemToRemove - The item to remove.
 * @returns {number} The index of the removed item, or -1 if the item is not found.
 */
export function remove<T = unknown>(array: T[], itemToRemove: T): number {
  const index = array.findIndex((item) => item === itemToRemove);

  if (index > -1) {
    array.splice(index, 1);
  }

  return index;
}

/**
 * Finds the index of the first occurrence of a specified element in an array.
 * @template T
 * @param {T[]} items - The array to search for the element.
 * @param {T} element - The element to find.
 * @returns {number} The index of the first occurrence of the element, or -1 if not found.
 */
export function findIndex<T = unknown>(items: T[], element: T): number {
  return items.findIndex((currentItem) => currentItem === element);
}

/**
 * Finds the intersection of multiple arrays.
 * @param {any[][]} arrays - Arrays to find the intersection from.
 * @returns {any[]} The intersection of the arrays.
 */
export function intersection(arrays: any[][]) {
  if (arrays.length === 0) {
    return [];
  }

  if (arrays.length === 1) {
    return arrays[0];
  }

  const restArrays = arrays.slice(1);

  return arrays[0].filter((element) => restArrays.every((array) => array.includes(element)));
}

/**
 * Removes duplicate elements from an array while preserving the original order.
 * @template T
 * @param {T[]} arr - The array to remove duplicates from.
 * @returns {T[]} A new array with duplicate elements removed.
 */
export function removeDuplicates<T>(arr: T[]): T[] {
  const uniqueArr: T[] = [];

  for (const item of arr) {
    if (uniqueArr.indexOf(item) === -1) {
      uniqueArr.push(item);
    }
  }

  return uniqueArr;
}
