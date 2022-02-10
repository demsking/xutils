/* eslint-disable radar/cognitive-complexity */

import { Objects } from './Objects';

const Filters = {
  object: (item: unknown) => typeof item === 'object' && item !== null,
};

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
        .reduce((data: T, item: T) => Objects.merge(data, item) as T, {} as T);
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

          if (schema.required?.includes(prop) || 'default' in propSchema || 'const' in propSchema) {
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
