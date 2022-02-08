import { HttpError } from './HttpError';
import { IHttpClient, ITrace } from '../..';

import qs from './qs';
import fetch from 'cross-fetch';

export class HttpClient implements IHttpClient.Interface {
  readonly endpoint: string;
  protected readonly token?: string;
  protected readonly trace?: ITrace;

  constructor(endpoint: string, token?: string, logger?: ITrace) {
    this.endpoint = endpoint;

    this.token = token;
    this.trace = logger;
  }

  async fetch({ path = '', method = 'GET', ...options }: IHttpClient.Options = {}): Promise<IHttpClient.Response> {
    const uri = this.endpoint + path;
    const parsedOptions = this._parseOptions(options);
    const response = await this._send(method, uri, parsedOptions);

    if (response.ok) {
      return response;
    }

    return this._handleError(response);
  }

  protected _parseUrl(path: string, { params }: IHttpClient.RequestOptions): string {
    const query = params ? qs.stringify(params) : '';

    return query ? `${path}?${query}` : path;
  }

  private async _send(method: string, path: string, options: IHttpClient.RequestOptions): Promise<Response> {
    const { params, headers = {}, ...restOptions } = options;
    const body = options.body ? JSON.stringify(options.body) : undefined;
    const url = this._parseUrl(path, options);

    const result = await fetch(url, {
      ...restOptions,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      method,
      body,
    });

    if (this.trace) {
      this.trace.info(`Fetching ${method} ${url} ${result.status}`);
    }

    return result;
  }

  protected _parseOptions({ body, params = {}, headers = {}, ...options }: IHttpClient.Options): Omit<IHttpClient.RequestOptions, 'method'> {
    const parsedOptions = { body, params, headers, ...options };

    if (this.token) {
      parsedOptions.headers.Authorization = `Bearer ${this.token}`;
    }

    return parsedOptions;
  }

  protected async _handleError(response: IHttpClient.Response): Promise<IHttpClient.Response> {
    return Promise.reject(new HttpError(response.status, response));
  }
}
