import { Trace } from './Trace';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IAxiosCacheAdapterOptions } from 'axios-cache-adapter';

export type Options = Omit<AxiosRequestConfig, 'baseURL'> & {
  logger?: Trace;
  cache?: IAxiosCacheAdapterOptions;
};

export function createClient(baseURL: string, options?: Options): AxiosInstance;
