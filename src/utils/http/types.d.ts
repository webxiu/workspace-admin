import Axios, { Method, AxiosError, AxiosResponse, AxiosRequestConfig } from "axios";

export type resultType = {
  accessToken?: string;
};

export type RequestMethods = Extract<Method, "get" | "post" | "put" | "delete" | "patch" | "option" | "head">;

export interface PureHttpError extends AxiosError {
  isCancelRequest?: boolean;
}

export interface PureHttpResponse extends AxiosResponse {
  config: PureHttpRequestConfig;
}

export interface PureHttpRequestConfig extends AxiosRequestConfig {
  /** 是否需要提示错误信息(在headers中配置) */
  hideMessage?: boolean;
  beforeRequestCallback?: (request: PureHttpRequestConfig) => void;
  beforeResponseCallback?: (response: PureHttpResponse) => void;
}

export default class PureHttp {
  request<T>(method: RequestMethods, url: string, param?: AxiosRequestConfig, config?: PureHttpRequestConfig): Promise<T>;
  request<T>(option: PureHttpRequestConfig): Promise<T>;
  post<T, P>(url: string, params?: T, config?: PureHttpRequestConfig): Promise<P>;
  get<T, P>(url: string, params?: T, config?: PureHttpRequestConfig): Promise<P>;
}
