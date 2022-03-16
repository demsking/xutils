/**
 * Sequential promise execution
 */
export function chain<T, X>(items: X[], fn: (item: X, index: number) => Promise<T>): Promise<T[]>;

/**
 * Parallel promise execution
 */
export function all<T, X>(items: X[], fn: (item: X, index: number) => Promise<T>): Promise<T[]>;
