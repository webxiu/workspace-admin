import {
  BasicuserResponseType,
  CountDownsResponseType,
  FastEntryItemType,
  FastEntryLeftItemType,
  LoginAppInfoType,
  PendingTaskType,
  QueryuserResponseType,
  UserInfoType
} from "./types";
import { InjectCancel, http } from "@/utils/http";

import { PureHttpRequestConfig } from "@/utils/http/types";
import { StaffInfoItemType } from "../oaManage/humanResources";

export type {
  BasicuserResponseType,
  CountDownsResponseType,
  FastEntryItemType,
  QueryuserResponseType,
  UserInfoType,
  FastEntryLeftItemType,
  PendingTaskType,
  LoginAppInfoType,
  StaffInfoItemType
};

/** 登录请求类型 */
export type LoginReqType = {
  userNo: string;
  password: string;
  orgDomain: string;
};

/** 登录(常规方式) */
// export function getLogin(data: LoginReqType) {
//   return http.request<string>("post", "/verifyuser", { data });
// }

/**
 * 登录(取消请求)
 * 调用方式: getLogin["cancel"]("取消登录了")
 */
export function getLogin(data: LoginReqType, config?: PureHttpRequestConfig) {
  return http.request<string>({ method: "post", url: "/verifyuser", data, ...config, cancelToken: InjectCancel(getLogin) });
}

/** 注销登录 */
export function logoutLogin() {
  return http.request("get", "/logout");
}

/** 扫码登录提交code */
export function wxAppLogin(params) {
  return http.request<boolean>("get", "/app/qywx/api/login", { params });
}

/** 修改密码 */
export function changePassword(params) {
  return http.request("get", "/sys/system/modifypassword", { params });
}

/** 获取手机验证码 */
export function getCode(id: string) {
  return http.request("post", `/login/getcodebyphone/${id}`);
}

/** 忘记密码重置 */
export function submitResetPassword(data) {
  return http.request("post", "/login/forgetPasswordByPhone", { data });
}

/** 获取用户基本资料 */
export function basicUserInfo() {
  return http.request<{ staffInfoVO: StaffInfoItemType }>("get", "/oa/hr/staffinfo/getbaseuserinfo");
}

/** 查询用户信息 */
export function queryUserInfo() {
  return http.request<UserInfoType>("get", "/getowneruserinfo");
}

/** 查询登录页面版本等信息 */
export function queryLoginParamsInfo(params) {
  return http.request<LoginAppInfoType>("get", "/getloginpagemessage", { params });
}

/** 查询用户信息2 */
export function queryuser() {
  return http.request<QueryuserResponseType>("get", "/sys/sys/userinfo/queryuser");
}

/** 百岁倒计时 */
export function countDowns() {
  return http.request<CountDownsResponseType[]>("get", "/home/Countdowns");
}

/** 待处理: 待处理任务数量 */
export function getPendingTask() {
  return http.request<PendingTaskType>("post", "/work/wb/infocenter/selectconuttask");
}

/** 快捷入口 */
export function fastEntry() {
  return http.request<FastEntryItemType[]>("post", "/sys/sys/mymenus/querymymenu");
}
/** 快捷入口: 添加 */
export function addFastEntry(params) {
  return http.request<boolean>("get", "/sys/sys/mymenus/addmymenu", { params });
}
/** 快捷入口: 左侧穿梭框列表 */
export function fastEntryLeftList() {
  return http.request<FastEntryLeftItemType[]>("post", "/sys/sys/mymenus/queryallmenu");
}
/** 快捷入口: 右侧穿梭框列表 */
export function fastEntryRightList() {
  return http.request<FastEntryLeftItemType[]>("post", "/sys/sys/mymenus/querymymenu");
}

/** 主菜单: 菜单添加收藏 */
export function addMenuFavorite(params) {
  return http.request<boolean>("get", "/sys/sys/mymenus/addonemenu", { params });
}
/** 主菜单: 菜单取消收藏 */
export function deleteMenuFavorite(params) {
  return http.request<boolean>("get", "/sys/sys/mymenus/cancelonemenu", { params });
}

/** 获取全局kkview预览地址 */
export function fetchkkViewIpUrl(params) {
  return http.request<string>("get", "/sys/system/getPrevewDomain", { params });
}

/** 查询个人所有密钥信息 */
export function getUserSecretKeys(params) {
  return http.request("post", "/sys/sys/secretkey/select", { data: params });
}

/** 新增密钥信息 */
export function insertUserSecretKey(params) {
  return http.request("post", "/sys/sys/secretkey/insertsecret", { data: params });
}

/** 删除密钥信息 */
export function deleteUserSecretKey(params) {
  return http.request("post", "/sys/sys/secretkey/deletesecret", { data: params });
}

/** 重新生成密钥信息 */
export function reGenerateUserSecretKey(params) {
  return http.request("post", "/sys/sys/secretkey/refreshsecret", { data: params });
}

/** 新增前校验身份信息 */
export function authBeforeAdd(params) {
  return http.request("post", "/authentication", { data: params });
}

/** 获取学习中心token数据 */
export function getLearnCenterTokenData(params) {
  return http.request("get", "/getStudyCenter", { params });
}
