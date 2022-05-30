import axios from 'axios';
import axiosCacheAdapter from 'axios-cache-adapter';

import { Options } from './client.d';
import { Color } from './color.d';

const fallbackColor: Color = {
  cyan: (str: string | number) => `${str}`,
  red: (str: string | number) => `${str}`,
  yellow: (str: string | number) => `${str}`,
  green: (str: string | number) => `${str}`,
};

export function createClient(
  baseURL: string,
  { headers = {}, logger, cache, color = fallbackColor, ...options }: Options = {}
) {
  const adapter = cache ? axiosCacheAdapter.setupCache(cache).adapter : undefined;
  const instance = axios.create({ ...options, baseURL, headers, adapter });

  instance.interceptors.response.use((response) => {
    const method = response.request.method || 'GET';
    const prefix = `${method.toUpperCase()} ${response.config.url}`;

    if (response.status >= 400) {
      logger?.info(`${prefix} ${color.red(response.status)}`, 'HTTP');
      logger?.error(`Error ${response.status}: ${JSON.stringify(response.data, null, 2)}`);
    } else {
      logger?.info(`${prefix} ${color.green(response.status)}`, 'HTTP');
    }

    return response;
  });

  return instance;
}
