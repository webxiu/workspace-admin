/*
 * @Author: Hailen
 * @Date: 2023-06-23 10:03:22
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-01-16 15:32:32
 */

import { Base64 } from "js-base64";
import Cookies from "js-cookie";
import { UserInfoType } from "@/api/user/types";
import { toParse } from "@/utils/common";

export const App_INFO = "app_info"; // 应用配置存储
export const COOKIE_KEY = "Token"; // 存储登录Token
export const USER_INFO = "user_info"; // 存储用户信息
export const LOGIN_INFO = "login_info"; // 存储登录信息
export const KKVIEW_URL = "kkView_url"; // 存储kkview预览地址

/** ==================================  存储Cookie  ================================== */
/** 获取Cookie */
export const getCookie = () => {
  return Cookies.get(COOKIE_KEY) || "";
};

/** 设置Cookie */
export const setCookie = (cookie: string) => {
  Cookies.set(COOKIE_KEY, cookie);
};

/** 移除Cookie */
export const removeCookie = () => {
  Cookies.remove(COOKIE_KEY);
};

/** ==================================  存储用户信息  ================================== */

const useInfoStorage = useLocalStorage<UserInfoType>(USER_INFO);
/** 获取用户信息(用户名首字母大写) */
export const getUserInfo = useInfoStorage.getItem;

/** 设置用户信息 */
export const setUserInfo = useInfoStorage.setItem;

/** 移除用户信息 */
export const removeUserInfo = useInfoStorage.removeItem;

/** ==================================  存储kkview预览地址 ================================== */

/** 设置kkview预览地址 */
export const setKkViewInfo = (kkviewUrl: string) => {
  localStorage.setItem(KKVIEW_URL, kkviewUrl);
};

/** 获取kkview预览地址 */
export const getKkViewInfo = () => {
  return localStorage.getItem(KKVIEW_URL);
};

/**
 * 生成kkview预览地址
 * @param filePath 文件路径,/api后面的地址(xxx/name.jpg)
 * @param query 查询参数 (&aa=bb&cc=dd)
 */
export const getkkViewUrl = (filePath: string, query = "") => {
  const kkViewUrl = getKkViewInfo();
  const vPath = `${kkViewUrl}api/${filePath}`;
  const encodeUrl = encodeURIComponent(Base64.encode(vPath));
  const url = kkViewUrl + "preview/onlinePreview?url=" + encodeUrl + query;
  return url;
};

/** ==================================  存储菜单路由信息  ================================== */
const Page_url = "page_url";
/** 获取菜单路由(给获取弹窗表格及详情菜单id) */
export const getRouterInfo = (): string => {
  return localStorage.getItem(Page_url);
};

/** 设置菜单路由(根据菜单路径获取菜单ID) */
export const setRouterInfo = (path: string, callback: () => void) => {
  localStorage.setItem(Page_url, path);
  callback?.();
};

/** 移除路由信息 */
export const removeRouterInfo = () => {
  localStorage.removeItem(Page_url);
};

/** ==================================  通用本地存储  ================================== */

/** 移除本地存储数据 */
export function removeStorage(key) {
  if (!key) return localStorage.clear();
  localStorage.removeItem(key);
}

/**
 * 操作本地存储
 * @param key 存储key
 * @param isObj 是否存储对象(如果是数组, 更新只支持对象数组)
 */
export function useLocalStorage<T>(key: string, isObj = true) {
  /**
   * 1.获取本地存储数据
   * @param isStr 是否返回字符串数据
   */
  function getItem(isStr = false): T {
    const emptyStr = isObj ? "{}" : "[]";
    const data = localStorage.getItem(key);
    return isStr ? data : toParse(data || emptyStr);
  }

  /** 2.设置本地存储数据 */
  function setItem(data: T) {
    localStorage.setItem(key, JSON.stringify(data));
    return data;
  }

  /**
   * 3.更新本地存储数据
   * @param item 更新值
   * @param field 更新唯一字段
   */
  function updateItem(item: T, field?: string) {
    let oldData = getItem();
    if (!isObj && Array.isArray(oldData)) {
      if (!field) throw new Error("updateItem方法缺少更新唯一字段");
      const idx = oldData.findIndex((f) => f[field] === item[field]);
      if (idx > -1) {
        oldData.splice(idx, 1, item);
      } else {
        oldData.push(item);
      }
    } else {
      oldData = { ...oldData, ...item };
    }
    localStorage.setItem(key, JSON.stringify(oldData));
  }

  /** 4.移除本地存储数据 */
  function removeItem() {
    removeStorage(key);
  }
  return { getItem, setItem, updateItem, removeItem };
}
