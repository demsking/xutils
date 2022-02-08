import { Objects } from '../../system/lib/Objects';
import { JsonSchema } from '../../system';

const Filters = {
  object: (item: unknown) => typeof item === 'object' && item !== null
};

export default {
  generateEmptyValue<T = unknown>(schema: JsonSchema, useDefault = false): T {
    if (useDefault) {
      if (typeof schema.default !== 'undefined') {
        return schema.default;
      }

      if (typeof schema.const !== 'undefined') {
        return schema.const;
      }
    }

    if (schema.allOf) {
      const dataItems = schema.allOf.map((pieceSchema) => this.generateEmptyValue(pieceSchema, useDefault));
      const hasObject = dataItems.some(Filters.object);

      if (hasObject) {
        return dataItems
          .filter(Filters.object)
          .reduce((data: T, item) => Objects.merge(data, item as T) as T, {} as T);
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

            if (schema.required?.includes(prop) || 'default' in propSchema) {
              object[prop] = this.generateEmptyValue(propSchema, useDefault);
            }
          }

          return object as any;
        }
      }

      default:
        return undefined as any;
    }
  },
};
