/* eslint-disable max-len */
import { createHttpException } from './http.js';
import { stringify } from './qs.js';
import type { Trace } from './trace/trace.node.js';

export type Method =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'PATCH'
  | 'OPTIONS'
  | 'TRACE';

export type RequestAuth = {
  token?: string;
  username?: string;
  roles?: string;
};

export type RequestOptions<T extends Record<string, any> = object> = RequestInit & {
  params?: T;
  data?: any;
};

export type Options<
  AdditionalOptions extends Record<string, any> = never
> = RequestInit & {
  logger?: Trace;
  beforeEach?: <T extends Record<string, any>>(
    method: Method,
    path: string,
    request: RequestOptions<T> & Partial<AdditionalOptions>,
  ) => void;
};

export interface RequestInit {
  /** A string indicating how the request will interact with the browser's cache to set request's cache. */
  cache?: RequestCache;
  /** A string indicating whether credentials will be sent with the request always, never, or only when sent to a same-origin URL. Sets request's credentials. */
  credentials?: RequestCredentials;
  /** A Headers object, an object literal, or an array of two-item arrays to set request's headers. */
  headers?: HeadersInit;
  /** A cryptographic hash of the resource to be fetched by request. Sets request's integrity. */
  integrity?: string;
  /** A boolean to set request's keepalive. */
  keepalive?: boolean;
  /** A string to indicate whether the request will use CORS, or will be restricted to same-origin URLs. Sets request's mode. */
  mode?: RequestMode;
  /** A string indicating whether request follows redirects, results in an error upon encountering a redirect, or returns the redirect (in an opaque fashion). Sets request's redirect. */
  redirect?: RequestRedirect;
  /** A string whose value is a same-origin URL, "about:client", or the empty string, to set request's referrer. */
  referrer?: string;
  /** A referrer policy to set request's referrerPolicy. */
  referrerPolicy?: ReferrerPolicy;
  /** An AbortSignal to set request's signal. */
  signal?: AbortSignal | null;
  /** Can only be null. Used to disassociate request from any Window. */
  window?: null;
}

/**
 * Creates an HTTP client to make requests.
 * @template AdditionalOptions
 * @param {string} baseUrl - The base URL for requests.
 * @param {Options<AdditionalOptions>} [options={}] - Additional options for the client.
 * @returns {{
*   options: Options<AdditionalOptions>,
*   execute<T>(method: Method, path: string, request?: RequestOptions & Partial<AdditionalOptions>): Promise<T>
* }} The HTTP client.
*/
export function createClient<
  AdditionalOptions extends Record<string, any> = never
>(baseUrl: string, options: Options<AdditionalOptions> = {}) {
  const mainHeaders = options.headers ?? {};

  return {
    options,
    async execute<T>(
      method: Method,
      path: string,
      request: RequestOptions & Partial<AdditionalOptions> = {}
    ): Promise<T> {
      if (options.beforeEach) {
        options.beforeEach(method, path, request);
      }

      const { params, data, ...rest } = request;

      let url = baseUrl + path;
      const requestHeaders = rest.headers ?? {};
      const requestOptions = { ...options, ...request, headers: { ...mainHeaders, ...requestHeaders } };

      if (params) {
        const q = stringify(params);

        if (q) {
          url += `?${q}`;
        }
      }

      const response = await fetch(url, { ...requestOptions, method, body: data });
      const contentType = response.headers.get('content-type');
      let contentBody = null;

      if (options.logger) {
        if (response.status < 400) {
          options.logger.info(`${method} ${url} ${response.status}`, 'HTTP');
        } else {
          options.logger.error(`${method} ${url} ${response.status}`, 'HTTP');
        }
      }

      if (contentType?.includes('application/json')) {
        contentBody = await response.json();
      } else if (contentType?.includes('application/octet-stream') || contentType?.includes('image/') || contentType?.includes('audio/') || contentType?.includes('video/')) {
        contentBody = Buffer.from(await response.arrayBuffer());
      } else if (contentType?.includes('text')) {
        contentBody = await response.text();
      }

      if (response.ok) {
        return contentBody;
      }

      throw createHttpException(response.status, response.statusText, contentBody);
    },
  };
}
