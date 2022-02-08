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

export default {
  /**
   * Get a query object from a given object
   * @param object Object representing search params
   * @returns string representation of query
   */
  stringify(object: Record<string, any>): string {
    const items: string[] = [];

    pushKeyPairs(items, '', object);

    return items.filter((e) => e !== '').join('&');
  },
};
