/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 10:03:22
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-06-30 14:22:55
 */

import Cookies from "js-cookie";

const COOKIE_KEY = "Token";
const LOGIN_INFO = "Login_Info";
const SUSPEND_POSITION = "Suspend_Position";

/** ==================================  存储Cookie  ================================== */
/**
 * 获取Cookie
 */
export const getCookie = () => {
  return Cookies.get(COOKIE_KEY) || "";
};

/**
 * 设置Cookie
 * @param cookie cookie
 */
export const setCookie = (cookie: string) => {
  Cookies.set(COOKIE_KEY, cookie);
};

/**
 * 移除Cookie
 */
export const removeCookie = () => {
  Cookies.remove(COOKIE_KEY);
};

/** ==================================  存储用户信息  ================================== */
export interface LoginInfoType {
  id: string;
  userName: string;
  userCode: string;
  avater: string;
  state: number;
}
/**
 * 获取用户信息
 */
export const getLoginInfo = (): LoginInfoType => {
  const data: LoginInfoType = JSON.parse(localStorage.getItem(LOGIN_INFO) || "{}");
  if (data.userName?.length) {
    // 首字母大写
    const firstChar = data.userName.charAt(0).toLocaleUpperCase();
    const resetChar = data.userName.substring(1);
    const result: string = firstChar + resetChar;
    data.userName = result || "";
  }
  return data;
};

/**
 * 设置用户信息
 * @param userInfo 用户信息
 */
export const setLoginInfo = (userInfo: LoginInfoType) => {
  localStorage.setItem(LOGIN_INFO, JSON.stringify(userInfo));
};

/**
 * 移除用户信息
 */
export const removeLoginInfo = () => {
  localStorage.removeItem(LOGIN_INFO);
};

/** ==================================  存储悬浮按钮位置  ================================== */
export interface PositionType {
  top: string;
  left: string;
}
/**
 * 获取悬浮按钮位置
 */
export const getSuspendPosition = (): PositionType => {
  return JSON.parse(localStorage.getItem(SUSPEND_POSITION) || "{}");
};

/**
 * 设置悬浮按钮位置
 * @param position 用户信息
 */
export const setSuspendPosition = (position: PositionType) => {
  localStorage.setItem(SUSPEND_POSITION, JSON.stringify(position));
};
