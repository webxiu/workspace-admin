/*
 * @Author: lixiuhai
 * @Date: 2023-06-30 14:05:46
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2023-07-04 17:03:54
 */
import { LoginInfoType, getLoginInfo, setCookie, removeCookie, removeLoginInfo, setLoginInfo } from "@/utils/storage";
import { logoutLogin, queryUserInfo } from "@/api/user";
import { resetRouter, router } from "@/router";

import { ElMessage } from "element-plus";
import { defineStore } from "pinia";
import { removeToken } from "@/utils/auth";
import { routerArrays } from "@/layout/types";
import { store } from "@/store";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { userType } from "./types";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户名
    userName: getLoginInfo()?.userName ?? ""
  }),
  actions: {
    /** 存储用户名 */
    SET_USERNAME(userName: string) {
      this.userName = userName;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 设置用户信息 */
    async setUserInfo(token) {
      return new Promise<LoginInfoType>((resolve, reject) => {
        setCookie(token);
        queryUserInfo()
          .then((res) => {
            if (res.data) {
              setLoginInfo(res.data);
              resolve(res.data);
            }
          })
          .catch((err) => reject(err));
      });
    },
    /** 前端登出 */
    async logOut() {
      try {
        await logoutLogin();
        ElMessage.error({ message: "登录已失效, 请重新登录", duration: 3000 });
      } catch (error) {
        ElMessage.error({ message: error, duration: 3000 });
        console.log("logout: ", error);
      }
      this.userName = "";
      this.roles = [];
      removeToken();
      removeCookie();
      removeLoginInfo();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
