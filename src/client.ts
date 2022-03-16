import axios from 'axios';
import color from 'cli-color';

import { setupCache } from 'axios-cache-adapter';
import { Options } from './client.d';

export function createClient(baseURL: string, { headers = {}, logger, cache, ...options }: Options = {}) {
  const adapter = cache ? setupCache(cache).adapter : undefined;
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
