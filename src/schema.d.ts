/**
 * Generate an empty value for the given schema.
 * @param schema The input schema
 * @param useDefault Default `false`
 */
export function generateEmptyValue<T = unknown>(schema: Record<string, any>, useDefault?: boolean): T;
