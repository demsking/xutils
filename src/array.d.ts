/**
 * Array split into groups of specific length
 */
export function split<T>(array: T[], limit: number): T[][];

/**
 * Swap the `fromIndex` and `toIndex` index elements of the given `array`
 */
export function swapItems(array: any[], fromIndex: number, toIndex: number): void;


/**
 * Shuffle elements of the given `array`
 */
export function shuffle<T>(array: T[]): T[];

/**
 * Add `item` between array items
 * @returns A new array
 */
export function include<T>(array: Readonly<T>[], item: Readonly<T>): T[];

/**
 * Check whether `array1` and `array2` are equal, returning a Boolean result.
 * The function uses the [Strict Equality Comparison Algorithm](https://www.ecma-international.org/ecma-262/5.1/#sec-11.9.6)
 * to compare two operands.
 * - If one of operands is not an array, return `false`.
 * - If the operands have the same reference, return `true`.
 * - If the two operands do not have the same length, return `false`.
 * - If each item of the first operand is strictly equals to its equivalent in
 *   the second operand, return `true`
 */
export function identical(array1: any[], array2: any[]): boolean;

/**
 * Remove `element` from the given `array` and returns the index of the
 * removed `element`
 */
export function remove<T>(array: T[], element: T): number;

/**
 * Returns the index of the first element in the array, and -1 otherwise.
 */
export function findIndex<T>(items: T[], element: T): number;
