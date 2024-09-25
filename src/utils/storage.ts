/*
 * @Author: Hailen
 * @Date: 2023-06-23 10:03:22
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-09-20 11:29:43
 */

import { Base64 } from "js-base64";
import Cookies from "js-cookie";
import { UserInfoType } from "@/api/user/types";
import { toParse } from "@/utils/common";
import { useAppStoreHook } from "@/store/modules/app";

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
const Router_INFO = "router_info";
/** 获取设置的路由信息 */
export const getRouterInfo = (): RouteConfigsTable => {
  const data = toParse(localStorage.getItem(Router_INFO));
  return data;
};

/** 设置路由信息(在弹窗中加载另一个页面菜单作为详情时, 根据path路径查找到菜单ID, 获取表格配置列) */
export const setRouterInfo = (path: string, callback: () => void) => {
  const asyncRoutes = useAppStoreHook().getAsyncRoutes;
  const findRoute = (routes: RouteConfigsTable[], path: string): RouteConfigsTable => {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      if (item.path === path) {
        return item;
      } else if (item.children) {
        const result = findRoute(item.children, path);
        if (result) return result;
      }
    }
  };
  const result = findRoute(asyncRoutes, path);
  localStorage.setItem(Router_INFO, JSON.stringify(result));
  callback?.();
};

/** 移除路由信息 */
export const removeRouterInfo = () => {
  localStorage.removeItem(Router_INFO);
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
