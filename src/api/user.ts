import { LoginInfoType } from "@/utils/storage";
import { http } from "@/utils/http";

export type LoginType = {
  userName: string;
  password: string;
  orgDomain: string;
};
export type PasswordType = {
  id: "string";
  oldPassword: "string";
  newPassword: "string";
};

/** 登录 */
export function login(data: LoginType) {
  return http.request("post", "/config/login/verifyuser", { data });
}

/** 注销登录 */
export function logoutLogin() {
  return http.request("get", "/config/login/logout");
}

/** 查询用户信息 */
export function queryUserInfo() {
  return http.request<LoginInfoType>("get", "/config/login/getownuserinfo");
}

/** 修改用户密码 */
export function updatePassword(data) {
  return http.request<PasswordType>("post", "/config/login/updatepassword", { data });
}
