import axios from 'axios';

import { setupCache } from 'axios-cache-adapter';
import { ConsoleColor } from './ConsoleColor/console-color.node';
import { Trace } from './Trace';

const cache = setupCache({
  maxAge: 15 * 60 * 1000,
});

export function createClient(baseURL: string, headers = {}) {
  const instance = axios.create({
    baseURL,
    headers,
    adapter: cache.adapter,
  });

  instance.interceptors.response.use((response) => {
    const method = response.request.method || 'GET';
    const prefix = `${method.toUpperCase()} ${response.config.url}`;

    if (response.status >= 400) {
      Trace.log(`${prefix} ${ConsoleColor.red(response.status)}`, 'HTTP');
      Trace.error(`Error ${response.status}: ${JSON.stringify(response.data, null, 2)}`);
    } else {
      Trace.log(`${prefix} ${ConsoleColor.green(response.status)}`, 'HTTP');
    }

    return response;
  });

  return instance;
}
