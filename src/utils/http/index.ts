/*
 * @Author: lixiuhai
 * @Date: 2023-06-30 16:30:09
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-09-21 10:37:58
 */

import Axios, { AxiosInstance, AxiosRequestConfig, CustomParamsSerializer } from "axios";
import { PureHttpError, PureHttpRequestConfig, PureHttpResponse, RequestMethods } from "./types.d";
import { formatToken, getToken } from "@/utils/auth";

import { ElMessage } from "element-plus";
import NProgress from "../progress";
import { stringify } from "qs";
import { useUserStoreHook } from "@/store/modules/user";

// 相关配置请参考：www.axios-js.com/zh-cn/docs/#axios-request-config-1
const defaultConfig: AxiosRequestConfig = {
  // baseURL: import.meta.env.VITE_BASE_API,
  // 请求超时时间 50秒
  timeout: 50 * 1000,
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

class PureHttp {
  constructor() {
    this.httpInterceptorsRequest();
    this.httpInterceptorsResponse();
  }

  /** token过期后，暂存待执行的请求 */
  private static requests = [];

  /** 防止重复刷新token */
  private static isRefreshing = false;

  /** 初始化配置对象 */
  private static initConfig: PureHttpRequestConfig = {};

  /** 保存当前Axios实例对象 */
  private static axiosInstance: AxiosInstance = Axios.create(defaultConfig);

  /** 重连原始请求 */
  private static retryOriginalRequest(config: PureHttpRequestConfig) {
    return new Promise((resolve) => {
      PureHttp.requests.push((token: string) => {
        config.headers["Authorization"] = formatToken(token);
        resolve(config);
      });
    });
  }

  /** 请求拦截 */
  private httpInterceptorsRequest(): void {
    PureHttp.axiosInstance.interceptors.request.use(
      async (config: PureHttpRequestConfig): Promise<any> => {
        // 开启进度条动画
        NProgress.start();
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof config.beforeRequestCallback === "function") {
          config.beforeRequestCallback(config);
          return config;
        }
        if (PureHttp.initConfig.beforeRequestCallback) {
          PureHttp.initConfig.beforeRequestCallback(config);
          return config;
        }
        /** 请求白名单，放置一些不需要token的接口（通过设置请求白名单，防止token过期后再请求造成的死循环问题） */
        const whiteList = ["/refreshToken", "/login"];
        return whiteList.some((v) => config.url.indexOf(v) > -1)
          ? config
          : new Promise((resolve) => {
              const data = getToken();
              if (data) {
                config.headers["Authorization"] = formatToken(data.accessToken);
                resolve(config);
              } else {
                resolve(config);
              }
            });
      },
      (error) => {
        return Promise.reject(error);
      }
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
        // 优先判断post/get等方法是否传入回调，否则执行初始化设置等回调
        if (typeof $config.beforeResponseCallback === "function") {
          $config.beforeResponseCallback(response);
        }
        if (PureHttp.initConfig.beforeResponseCallback) {
          PureHttp.initConfig.beforeResponseCallback(response);
        }

        // ================ 状态码判断 start ================
        if (data.code === 200) {
          return response.data;
        } else if ([401, 504, 509].includes(data.code)) {
          useUserStoreHook().logOut();
        } else if (data.code === 403) {
          ElMessage({ message: "请求未授权", type: "error" });
        } else {
          ElMessage({ message: data.message, duration: 3000 });
          return Promise.reject(data.message);
        }
        // ================ 状态码判断 end ================
      },
      (error: PureHttpError) => {
        const $error = error;
        const data = error.response.data as any;
        if ([500].includes(data.status)) {
          ElMessage({ message: data.error || "获取失败", type: "error" });
        }
        if ($error?.isCancelRequest) {
          $error.isCancelRequest = Axios.isCancel($error);
        }
        // 关闭进度条动画
        NProgress.done();
        // 所有的响应异常 区分来源为取消请求/非取消请求
        return Promise.reject($error);
      }
    );
  }

  /** 通用请求工具函数 */
  public request<T = {}>(method: RequestMethods, url: string, param?: AxiosRequestConfig, axiosConfig?: PureHttpRequestConfig): Promise<BaseResponseType<T>> {
    const config = {
      method,
      url,
      ...param,
      ...axiosConfig
    } as PureHttpRequestConfig;

    // 单独处理自定义请求/响应回调
    return new Promise((resolve, reject) => {
      PureHttp.axiosInstance
        .request(config)
        .then((response: undefined) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
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

export const http = new PureHttp();
