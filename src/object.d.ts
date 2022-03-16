export declare class ToStringEscape {
  readonly value: string;

  constructor(value: string);
}

/**
 *
 * @param object
 * @param strict Default `true`
 */
export function isObject(object: Record<string, any>, strict?: boolean): boolean;

export function isEmpty(object: Record<string, any>): boolean;

export function isEqual(object1: Record<string, any>, object2: Record<string, any>): boolean;

/**
 * Delete all object's properties
 */
export function clear(object: Record<string, any>): void;

export function copy<T extends Record<string, any> = Record<string, any>>(object: T): T;

/**
 * Deep assign implementation (merge)
 */
export function merge(dest: Record<string, any>, src: Record<string, any>): Record<string, any>;

export function get<T = unknown>(object: Record<string, any>, path: string): T | undefined;

export function set(object: Record<string, any>, path: string, value: unknown): boolean;

export function del(object: Record<string, any>, path: string): boolean;

/**
 * Converts a JavaScript object or value to a JSON string with support of function value
 *
 * @param object The value to convert to a JSON string
 * @param space The space argument may be used to control spacing in the final string.
 *              - If it is a number, successive levels in the stringification will each
 *                be indented by this many space characters (up to 10).
 *              - If it is a string, successive levels will be indented by this string
 *                (or the first ten characters of it).
 * @returns A JSON string representing the given value with stringified functions, or undefined.
 */
export function toString(object: object, space?: string | number): string;
