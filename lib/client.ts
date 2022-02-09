import axios from 'axios';

import { ITrace } from '../typings';
import { setupCache } from 'axios-cache-adapter';
import { ConsoleColor } from './ConsoleColor/console-color.node';

type Options = {
  headers?: Record<string, string>;
  logger?: ITrace;
};

const cache = setupCache({
  maxAge: 15 * 60 * 1000,
});

export function createClient(baseURL: string, { headers = {}, logger }: Options) {
  const instance = axios.create({
    baseURL,
    headers,
    adapter: cache.adapter,
  });

  instance.interceptors.response.use((response) => {
    const method = response.request.method || 'GET';
    const prefix = `${method.toUpperCase()} ${response.config.url}`;

    if (response.status >= 400) {
      logger?.info(`${prefix} ${ConsoleColor.red(response.status)}`, 'HTTP');
      logger?.error(`Error ${response.status}: ${JSON.stringify(response.data, null, 2)}`);
    } else {
      logger?.info(`${prefix} ${ConsoleColor.green(response.status)}`, 'HTTP');
    }

    return response;
  });

  return instance;
}
