import { App_INFO, getUserInfo, removeCookie, removeStorage, removeUserInfo, setUserInfo } from "@/utils/storage";
import { getLogin, queryUserInfo } from "@/api/user/user";
import { resetRouter, router } from "@/router";

import { LoginReqType } from "@/api/user/user";
import { UserInfoType } from "@/api/user/types";
import { defineStore } from "pinia";
import { routerArrays } from "@/layout/types";
import { storageSession } from "@pureadmin/utils";
import { store } from "@/store";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { userType } from "./types";

export const useUserStore = defineStore({
  id: "pure-user",
  state: (): userType => ({
    // 用户信息
    userInfo: getUserInfo(),
    // 页面级别权限
    roles: []
  }),
  actions: {
    /** 更新用户信息 */
    updateUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 登录 */
    async login(data: LoginReqType) {
      return new Promise<UserInfoType>((resolve, reject) => {
        getLogin(data)
          .then(async (res) => {
            const data = await this.getLoginInfo();
            resolve(data);
          })
          .catch((error) => reject(error));
      });
    },
    /** 登录 */
    async getLoginInfo() {
      return new Promise<UserInfoType>((resolve, reject) => {
        queryUserInfo()
          .then(async ({ data }) => {
            this.updateUserInfo(data);
            setUserInfo(data);
            resolve(data);
          })
          .catch((error) => reject(error));
      });
    },

    /** 前端登出（不调用接口） */
    async logOut() {
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login?redirect=" + location.href.split("#")[1]);
      removeCookie();
      removeStorage(App_INFO);
      removeUserInfo();
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
