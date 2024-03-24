/* eslint-disable radar/cognitive-complexity */

/**
 * Represents a string value to be escaped during stringification.
 */
export class ToStringEscape {
  /**
   * The value to be escaped during stringification.
   */
  readonly value: string;

  /**
   * Constructs an instance of ToStringEscape.
   * @param {string} value - The value to be escaped during stringification.
   */
  constructor(value: string) {
    this.value = value;
  }
}

/**
 * Checks if a value is an object.
 * @param {Record<string, any>} object - The value to check.
 * @param {boolean} [strict=true] - Whether to strictly check for non-array objects.
 * @returns {boolean} True if the value is an object, false otherwise.
 */
export function isObject(object: Record<string, any>, strict = true): boolean {
  return typeof object === 'object' && object !== null && (!strict || !Array.isArray(object));
}

/**
 * Checks if an object is empty (has no properties).
 * @param {Record<string, any>} object - The object to check.
 * @returns {boolean} True if the object is empty, false otherwise.
 */
export function isEmpty(object: Record<string, any>): boolean {
  // eslint-disable-next-line no-unreachable-loop
  for (const _key in object) {
    return false;
  }

  return true;
}

/**
 * Checks if two objects are deeply equal.
 * @param {Record<string, any>} object1 - The first object.
 * @param {Record<string, any>} object2 - The second object.
 * @returns {boolean} True if the objects are deeply equal, false otherwise.
 */
export function isEqual(object1: Record<string, any>, object2: Record<string, any>): boolean {
  if (object1 === object2) {
    return true;
  }

  if (isObject(object1, false) && isObject(object2, false)) {
    if (Object.keys(object1).length !== Object.keys(object2).length) {
      return false;
    }

    for (const prop in object1) {
      if (object2.hasOwnProperty(prop)) {
        if (!isEqual(object1[prop], object2[prop])) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  }

  return false;
}

/**
 * Deletes all properties of an object.
 * @param {Record<string, any>} object - The object to clear.
 */
export function clear(object: Record<string, any>) {
  for (const key in object) {
    delete object[key];
  }
}

/**
 * Creates a deep copy of an object.
 * @template T
 * @param {T} object - The object to copy.
 * @returns {T} A deep copy of the object.
 */
export function copy<T extends Record<string, any> = Record<string, any>>(object: T): T {
  if (typeof object !== 'object' || object === null) {
    return object;
  }

  if (object instanceof Array) {
    return object.map(copy) as any;
  }

  const copyObject: Record<string, any> = {};

  for (const key in object) {
    const value: any = object[key];

    if (typeof value === 'object' && value !== null) {
      if (value instanceof Array) {
        copyObject[key] = value.map((item) => copy(item));
      } else {
        copyObject[key] = copy(value);
      }
    } else {
      copyObject[key] = value;
    }
  }

  return copyObject as T;
}

/**
 * Groups elements of an array by a specified key.
 * @template T
 * @param {T[]} list - The array to group.
 * @param {keyof T | ((item: T) => string | false)} key - The key to group by.
 * @returns {{ [key: string]: T[] }} An object where keys are unique values determined by the grouping key,
 * and values are arrays of elements from the original array.
 */
export function groupBy<T>(list: T[], key: keyof T | ((item: T) => string | false)): { [key: string]: T[] } {
  const grouped: { [key: string]: T[] } = {};

  list.forEach((item) => {
    const keyValue = typeof key === 'function' ? key(item) : `${item[key]}`;

    if (keyValue) {
      if (!grouped[keyValue]) {
        grouped[keyValue] = [];
      }

      grouped[keyValue].push(item);
    }
  });

  return grouped;
}

/**
 * Merges two objects deeply.
 * @template T
 * @template S
 * @template Z
 * @param {T} dest - The destination object to merge into.
 * @param {S} src - The source object to merge from.
 * @param {'append' | 'replace' | 'merge'} [strategy='append'] - The merging strategy.
 * @returns {Z} The merged object.
 */
export function merge<
  T extends Record<string, any>,
  S extends Record<string, any> = T,
  Z extends Record<string, any> = T & S,
>(dest: T, src: S, strategy: 'append' | 'replace' | 'merge' = 'append'): Z {
  if (isObject(dest) && isObject(src)) {
    for (const key in src) {
      if (isObject(src[key])) {
        (dest as any)[key] = key in dest && isObject(dest[key])
          ? merge(dest[key], src[key], strategy)
          : copy(src[key]);
      } else if ((dest as any)[key] instanceof Array) {
        if (strategy === 'merge') {
          let index = 0;

          for (; index < dest[key].length; index++) {
            if (index < src[key].length) {
              dest[key][index] = merge(dest[key][index], src[key][index], strategy);
            }
          }

          if (index < src[key].length) {
            dest[key].push(...src[key].slice(index));
          }
        } else {
          if (strategy === 'replace') {
            dest[key].splice(0);
          }

          dest[key].push(...copy<any>(src[key]));
        }
      } else {
        Object.assign(dest, { [key]: src[key] });
      }
    }
  } else if (src instanceof Array && dest instanceof Array) {
    dest.push(...copy(src));
  }

  return dest as any;
}

/**
 * Gets a value from an object at the specified path.
 * @template T
 * @param {Record<string, any>} object - The object to retrieve the value from.
 * @param {string} path - The path to the value.
 * @returns {T | undefined} The value at the specified path, or undefined if not found.
 */
export function get<T = unknown>(object: Record<string, any>, path: string): T | undefined {
  const paths = parsePath(path);

  return paths.length
    ? foundPaths(object, paths, null, (result, o, key, _val) => (result ? o[key] : undefined))
    : object as T;
}

/**
 * Sets a value in an object at the specified path.
 * @param {Record<string, any>} object - The object to set the value in.
 * @param {string} path - The path to set the value at.
 * @param {unknown} value - The value to set.
 * @returns {boolean} True if the value was successfully set, false otherwise.
 */
export function set(object: Record<string, any>, path: string, value: unknown): boolean {
  return applyPaths<boolean>(object, path, value, (result, o, key, val) => {
    if (result) {
      o[key] = val;
    }

    return result;
  }, true);
}

/**
 * Deletes a value from an object at the specified path.
 * @param {Record<string, any>} object - The object to delete the value from.
 * @param {string} path - The path to delete the value from.
 * @returns {boolean} True if the value was successfully deleted, false otherwise.
 */
export function del(object: Record<string, any>, path: string): boolean {
  return applyPaths<boolean>(object, path, null, (result, o, key, _val) => {
    if (result) {
      delete o[key];
    }

    return result;
  });
}

/**
 * Converts a JavaScript object or value to a JSON string with support for
 * custom stringification of functions and specified string values.
 * @param {object} object - The value to convert to a JSON string.
 * @param {string | number} [space] - The space argument may be used to control spacing in the final string.
 *   - If it is a number, successive levels in the stringification will each
 *     be indented by this many space characters (up to 10).
 *   - If it is a string, successive levels will be indented by this string
 *     (or the first ten characters of it).
 * @returns {string} A JSON string representing the given value with stringified functions and specified string values.
 */
export function toString(object: object, space?: string | number): string {
  let index = 0;
  const cache: Record<string, string> = {};
  let objectString = JSON.stringify(object, (key, value) => {
    if (value instanceof Function) {
      const cacheKey = `__${key}${index++}__`;
      const body = value.toString();

      cache[cacheKey] = body.startsWith(`${key}(`)
        ? 'function ' + body.substring(key.length)
        : body;

      return cacheKey;
    }

    if (value instanceof ToStringEscape) {
      const cacheKey = `__${key}${index++}__`;

      cache[cacheKey] = value.value;

      return cacheKey;
    }

    return value;
  }, space);

  Object.entries(cache).forEach(([cacheKey, cacheValue]) => {
    objectString = objectString.replace(`"${cacheKey}"`, cacheValue);
  });

  return objectString;
}

function parsePath(path: string) {
  return path.split(/\./).filter((item) => item);
}

function applyPaths<T>(
  object: Record<string, any>,
  path: string,
  value: unknown,
  callback: (result: boolean, o: Record<string, any>, key: string, value?: unknown) => unknown,
  initMode = false
): T {
  const paths = parsePath(path);
  const results = foundPaths<boolean | boolean[]>(object, paths, value, callback, initMode);

  return results instanceof Array
    ? results.every((result) => result)
    : results as any;
}

function foundPaths<T>(
  object: Record<string, any>,
  [key, ...nextKeys]: string[],
  value: unknown,
  callback: (result: boolean, o: Record<string, any>, key: string, value?: unknown) => unknown,
  initMode = false
): T {
  if (typeof object === 'object' && object !== null) {
    const nextKey = nextKeys[0];

    if (initMode && !(key in object)) {
      object[key] = {};
    }

    if (nextKeys.length === 1 && nextKey) {
      const entry = object[key];
      const entryIsArray = entry instanceof Array;
      const entries = entryIsArray ? entry as Record<string, any>[] : [entry];
      const results = value instanceof Array
        ? entries.filter((item) => item).map((item, index) => callback(true, item, nextKey, value[index])) as T[]
        : entries.filter((item) => item).map((item) => callback(true, item, nextKey, value));

      return entryIsArray ? results as any : results[0];
    }

    if (key in object) {
      return nextKey
        ? foundPaths(object[key], nextKeys, value, callback, initMode)
        : callback(true, object, key, value) as T;
    }

    if (object instanceof Array) {
      return object.map((item) => foundPaths(item, nextKeys, value, callback, initMode)) as any;
    }
  }

  return callback(false, object, key) as T;
}
