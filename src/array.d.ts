export function switchItems(array: any[], from: number, to: number): void;
export function shuffle<T>(array: T[]): T[];

/**
 * Add `item` between array items
 * @returns A new array
 */
export function include<T>(array: Readonly<T>[], item: Readonly<T>): T[];

export function equals(array1: any[], array2: any[]): boolean;

export function remove(array: unknown[], itemToRemove: unknown): number;

/**
 * Returns the index of the first element in the array, and -1 otherwise.
 */
export function findIndex<T = unknown>(items: T[], element: T): number;
