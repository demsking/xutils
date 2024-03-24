/**
 * Converts an object into a URL-encoded query string.
 * @param {Record<string, any>} object - The object to be converted into a query string.
 * @returns {string} The URL-encoded query string.
 */
export function stringify(object: Record<string, any>): string {
  const items: string[] = [];

  pushKeyPairs(items, '', object);

  return items.filter((e) => e !== '').join('&');
}

/**
 * Parses query parameters into the appropriate types.
 * @param {Record<string, any>} queryParams - The query parameters to parse.
 * @returns {T} The parsed query parameters.
 * @template T
 */
export function parseQueryParams<T>(queryParams: Record<string, any>) {
  const parsedParams: Record<string, any> = {};

  for (const key in queryParams) {
    if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
      parsedParams[key] = convertToAppropriateType(queryParams[key]);
    }
  }

  return parsedParams as T;
}

function pushKeyPairs(items: string[], keyPrefix: string, object: Record<string, any>): void {
  for (const key in object) {
    const valueObj: any = object[key];
    const isObjectValue = typeof valueObj === 'object';

    if (isObjectValue) {
      const deepKey: string = keyPrefix ? `${keyPrefix}.${key}` : key;

      pushKeyPairs(items, deepKey, valueObj);
    } else {
      items.push(getKeyValue(keyPrefix || key, valueObj));
    }
  }
}

// Recursively convert string values to appropriate types
function convertToAppropriateType(value: any) {
  if (typeof value === 'object' && value !== null) {
    // If value is an object, recursively convert its properties
    const result: Record<string, any> = {};

    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        result[key] = convertToAppropriateType(value[key]);
      }
    }

    return result;
  }

  if (typeof value === 'string') {
    // Convert string values to appropriate types
    if (value === 'true') {
      return true;
    }

    if (value === 'false') {
      return false;
    }

    const numValue = Number(value);

    return Number.isNaN(numValue) ? value : numValue;
  }

  // Return other types as is
  return value;
}

function getKeyValue(key: string, value: any): string {
  if (!isNullValue(value)) {
    return `${key}=${encodeURIComponent(value)}`;
  }

  return '';
}

/**
 * Check if a variable is not defined.
 * @param val variable to check
 * @returns true if the value is not defined an false otherwise
 */
function isNullValue(val: object): boolean {
  return val === null || typeof val === 'undefined';
}
