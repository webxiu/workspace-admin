/*
 * @Author: Hailen
 * @Date: 2023-07-13 10:10:59
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-04-14 09:44:43
 */

import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CancelToken, CustomParamsSerializer } from "axios";
import { PureHttpError, PureHttpRequestConfig, PureHttpResponse, RequestMethods } from "./types.d";

import NProgress from "../progress";
import { getUrlParameters } from "../common";
import { message } from "@/utils/message";
import { stringify } from "qs";
import { useAppStoreHook } from "@/store/modules/app";
import { useUserStoreHook } from "@/store/modules/user";
import { whiteList } from "@/router/index";

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // baseURL: import.meta.env.VITE_BASE_API,
  // 请求超时时间 60秒
  timeout: 60 * 1000,
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest"
  },
  // 数组格式参数序列化（https://github.com/axios/axios/issues/5142）
  paramsSerializer: {
    serialize: stringify as unknown as CustomParamsSerializer
  }
};

/**
 * 状态码说明:
 * 502: TOKEN过期
 * 504: 没有token
 * 508: token不合法
 * 509: 身份验证异常
 */
const STATUS_CODE = [401, 403, 404, 405, 502, 504, 508, 509];

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 移除字符串前后空格 */
  private removeBlank(data: Record<string, any>) {
    if (typeof data === "object") {
      for (const key in data) {
        if (typeof data[key] === "string") {
          data[key] = data[key].trim();
        }
      }
    }
    return data;
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        this.removeBlank(config.data); // 移除请求参数前后空格
        config.hideMessage = config.headers.hideMessage;

        // 是否隐藏Loading
        if (!config.headers.hideLoading) {
          NProgress.start();
          useAppStoreHook().pushPageLoading("loading");
        }
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        const hasAuth = whiteList.some((v) => config.url?.indexOf(v) > -1);
        return hasAuth ? config : new Promise((resolve) => resolve(config));
      },
      (error) => Promise.reject(error)
    );
  }

  /** 响应拦截 */
  private httpInterceptorsResponse(): void {
    const instance = PureHttp.axiosInstance;
    instance.interceptors.response.use(
      (response: PureHttpResponse) => {
        const $config = response.config;
        const data = response.data;
        // 关闭进度条动画
        NProgress.done();
        // 关闭loading
        useAppStoreHook().popPageLoading();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
        }

        if (data.status === 200) {
          return data;
        } else if (response.status === 200 && !data.status) {
          // 处理Excel数据导出没有包装响应格式
          return data;
        }

        if (STATUS_CODE.includes(data.status)) {
          useUserStoreHook().logOut();
          message.error(data.message);
        } else if (data.status === 403) {
          message.error("请求未授权");
        } else {
          if (!response.config.hideMessage) {
            message.error(data.message || "服务器错误, 错误代码:" + data.status);
          }
        }
        return Promise.reject(data);
      },
      (error: PureHttpError) => {
        console.log("http_error:", error);
        // 关闭loading
        useAppStoreHook().popPageLoading();
        const data = error.response?.data as any;
        const status = error.response?.status as any;

        if (!data) {
          message.error(error.message);
        } else if (STATUS_CODE.includes(data.status)) {
          message.error(data.error);
        } else if (STATUS_CODE.includes(status)) {
          message.error(data.error || error.message);
        }

        if (error?.isCancelRequest) {
          error.isCancelRequest = Axios.isCancel(error);
        }
        // 关闭进度条动画
        NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject(error);
      }
    );
  }

  /**
   * 通用请求工具函数
   * method: 第一个参数是对象则为options方式配置请求参数, 调用接口是可自定义拦截请求和响应, 可配置取消请求 {..., cancelToken: InjectAbort(login) }
   */
  public request<T>(
    method: RequestMethods | PureHttpRequestConfig,
    url?: string,
    param?: AxiosRequestConfig,
    config?: PureHttpRequestConfig
  ): Promise<BaseResponseType<T>> {
    let option = { method, url, ...param, ...config } as PureHttpRequestConfig;
    if (typeof method === "object") option = method; // 判断是否为options方式

    // 单独处理自定义请求/响应回调
    return new Promise<BaseResponseType<T>>((resolve, reject) => {
      PureHttp.axiosInstance
        .request(option)
        .then((response: any) => resolve(response as BaseResponseType<T>))
        .catch((error) => reject(error));
    });
  }

  /** 单独抽离的post工具函数 */
  public post<T, P>(url: string, params?: AxiosRequestConfig<T>, config?: PureHttpRequestConfig): Promise<BaseResponseType<P>> {
    return this.request<P>("post", url, params, config);
  }

  /** 单独抽离的get工具函数 */
  public get<T, P>(url: string, params?: AxiosRequestConfig<T>, config?: PureHttpRequestConfig): Promise<BaseResponseType<P>> {
    return this.request<P>("get", url, params, config);
  }
}

/** 为请求方法注入取消请求 */
export function InjectCancel(fn: Function) {
  const cancelToken = Axios.CancelToken;
  const source = cancelToken.source();
  fn["cancel"] = source.cancel;
  return source.token;
}

export const http = new PureHttp();
