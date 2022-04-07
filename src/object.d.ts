export declare class ToStringEscape {
  readonly value: string;

  constructor(value: string);
}

/**
 *
 * @param object
 * @param strict Default `true`
 */
export function isObject(object: object, strict?: boolean): boolean;

export function isEmpty(object: object): boolean;

export function isEqual(object1: object, object2: object): boolean;

/**
 * Delete all object's properties
 */
export function clear(object: object): void;

export function copy<T extends object>(object: T): T;

/**
 * Deep assign implementation (merge)
 *
 * @param dest The target object — what to apply the sources' properties to
 * @param src The source object(s) — objects containing the properties you want to apply
 * @param [strategy='append'] The merge strategy of array properties. By default `'append'`
 */
export function merge<T extends object, U extends object>(
  dest: T,
  src: U,
  strategy?: 'append' | 'replace'
): T & U;

export function get<T>(object: object, path: string): T | undefined;

export function set(object: object, path: string, value: unknown): boolean;

export function del(object: object, path: string): boolean;

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
