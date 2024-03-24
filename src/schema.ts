/* eslint-disable radar/cognitive-complexity */

import { isObject, merge } from './object.js';

/**
 * Filters for objects.
 */
export const Filters = {
  /**
   * Checks if the item is an object.
   * @param {unknown} item - The item to check.
   * @returns {boolean} True if the item is an object, false otherwise.
   */
  object: (item: unknown): boolean => typeof item === 'object' && item !== null,
};

/**
 * Generates an empty value based on a schema.
 * @param {Record<string, any>} schema - The schema to generate the empty value from.
 * @param {boolean} [useDefault=false] - Whether to use the default value defined in the schema.
 * @returns {T} The generated empty value.
 */
export function generateEmptyValue<T = unknown>(schema: Record<string, any>, useDefault = false): T {
  if (useDefault) {
    if (typeof schema.default !== 'undefined') {
      return schema.default;
    }

    if (typeof schema.const !== 'undefined') {
      return schema.const;
    }
  }

  if (schema.allOf) {
    const dataItems = schema.allOf.map((pieceSchema: any) => generateEmptyValue(pieceSchema, useDefault));
    const hasObject = dataItems.some(Filters.object);

    if (hasObject) {
      return dataItems
        .filter(Filters.object)
        .reduce((data: object, item: object) => merge(data, item) as T, {} as T);
    }

    return dataItems[0] as T;
  }

  switch (schema.type) {
    case 'string':
      return schema.enum ? undefined : '' as any;

    case 'number':
    case 'boolean':
      return undefined as any;

    case 'array':
      return [] as any;

    case 'object': {
      if (schema.properties) {
        const object: Record<string, any> = {};

        for (const prop in schema.properties) {
          const propSchema = schema.properties[prop];

          if (isObject(propSchema) && (schema.required?.includes(prop) || 'default' in propSchema || 'const' in propSchema)) {
            object[prop] = generateEmptyValue(propSchema, useDefault);
          }
        }

        return object as any;
      }

      return {} as T;
    }

    default:
      return undefined as any;
  }
}
