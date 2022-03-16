import { Trace } from './Trace';

export type Options = {
  timeout?: number;
  interval?: number;
  retries?: number;
  logger?: Trace;
};

/**
 * Check if a host from the given URL can be reached
 * @param url
 * @param options Default `{ timeout: 30000, interval: 10000, retries: 3 }`
 */
export function ping(url: string, options?: Options): Promise<boolean>;
