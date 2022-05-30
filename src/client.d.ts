import { Trace } from './Trace';
import { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IAxiosCacheAdapterOptions } from 'axios-cache-adapter';
import { Color } from './color';

export type Options = Omit<AxiosRequestConfig, 'baseURL'> & {
  logger?: Trace;
  cache?: IAxiosCacheAdapterOptions;
  color?: Color;
};

export function createClient(baseURL: string, options?: Options): AxiosInstance;
