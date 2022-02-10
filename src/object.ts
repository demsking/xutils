/* eslint-disable radar/cognitive-complexity */

export class ToStringEscape {
  readonly value: string;

  constructor(value: string) {
    this.value = value;
  }
}

export function isObject(object: Record<string, any>): boolean {
  return typeof object === 'object' && object !== null && !Array.isArray(object);
}

export function isEmpty(a: Record<string, any>): boolean {
  return Object.keys(a).length === 0;
}

/**
 * Delete all object's properties
 */
export function clear(object: Record<string, any>) {
  for (const key in object) {
    delete object[key];
  }
}

/**
 * Original code from http://adripofjavascript.com/blog/drips/object-equality-in-javascript.html
 */
export function isEquivalent(a: Record<string, any>, b: Record<string, any>): boolean {
  const aProps = Object.getOwnPropertyNames(a);
  const bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) {
    return false;
  }

  for (let i = 0; i < aProps.length; i++) {
    const propName = aProps[i];

    if (propName === '__ob__') {
      continue;
    }

    if (a[propName] === null && b[propName] !== null) {
      return false;
    }

    if (a[propName] instanceof Array) {
      if (!Array.isArray(b[propName])) {
        return false;
      }

      const aArray = a[propName];
      const bArray = b[propName];

      if (aArray.length !== bArray.length) {
        return false;
      }

      for (let j = 0; j < aArray.length; j++) {
        if (typeof aArray[j] === 'object' && !isEquivalent(aArray[j], bArray[j])) {
          return false;
        }

        if (a[propName] !== b[propName]) {
          return false;
        }
      }

      continue;
    }

    if (typeof a[propName] === 'object') {
      if (!this.isEquivalent(a[propName], b[propName])) {
        return false;
      }

      continue;
    }

    if (a[propName] !== b[propName]) {
      return false;
    }
  }

  return true;
}

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
 * Deep assign implementation (merge)
 */
export function merge(dest: Record<string, any>, src: Record<string, any>) {
  if (isObject(dest) && isObject(src)) {
    for (const key in src) {
      if (isObject(src[key])) {
        dest[key] = key in dest && isObject(dest[key])
          ? merge(dest[key], src[key])
          : copy(src[key]);
      } else if (dest[key] instanceof Array) {
        dest[key].push(...copy(src[key]));
      } else {
        Object.assign(dest, { [key]: src[key] });
      }
    }
  } else if (src instanceof Array && dest instanceof Array) {
    dest.push(...copy(src));
  }

  return dest;
}

export function get<T = unknown>(object: Record<string, any>, path: string): T | undefined {
  const paths = parsePath(path);

  return paths.length
    ? foundPaths(object, paths, null, (result, o, key, val) => (result ? o[key] : undefined))
    : object as T;
}

export function set(object: Record<string, any>, path: string, value: unknown): boolean {
  return applyPaths<boolean>(object, path, value, (result, o, key, val) => {
    if (result) {
      o[key] = val;
    }

    return result;
  }, true);
}

export function del(object: Record<string, any>, path: string): boolean {
  return applyPaths<boolean>(object, path, null, (result, o, key, val) => {
    if (result) {
      delete o[key];
    }

    return result;
  });
}

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
