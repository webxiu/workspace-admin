import { ascending, filterTree } from "@/router/utils";
import { debounce, getKeyList } from "@pureadmin/utils";

import { cacheType } from "./types";
import { constantMenus } from "@/router";
import { defineStore } from "pinia";
import { store } from "@/store";
import { useMultiTagsStoreHook } from "./multiTags";
import workbench from "@/router/modules/workbench";

export const usePermissionStore = defineStore({
  id: "pure-permission",
  state: () => ({
    // 静态路由生成的菜单
    constantMenus,
    // 整体路由生成的菜单（静态、动态）
    wholeMenus: [],
    // 缓存页面keepAlive
    cachePageList: []
  }),
  actions: {
    /** 组装整体路由生成的菜单 */
    handleWholeMenus(routes: any[]) {
      const wholeMenus = filterTree(ascending(this.constantMenus.concat(routes)));
      const tempList = [];
      /** 仅获取一级菜单 */
      wholeMenus.forEach((item) => {
        const { children, ...reset } = item;
        // 菜单屏蔽首页显示(默认已经在Tag标签中显示)
        if (item.name !== workbench.name) {
          tempList.push({ ...reset, children: [] });
        }
      });
      this.wholeMenus = tempList;
    },
    cacheOperate({ mode, name }: cacheType) {
      const delIndex = this.cachePageList.findIndex((v) => v === name);
      switch (mode) {
        case "refresh":
          this.cachePageList = this.cachePageList.filter((v) => v !== name);
          break;
        case "add":
          if (!this.cachePageList.includes(name)) this.cachePageList.push(name);
          break;
        case "delete":
          delIndex !== -1 && this.cachePageList.splice(delIndex, 1);
          break;
      }
    },
    /** 清空缓存页面 */
    clearAllCachePage() {
      this.wholeMenus = [];
      this.cachePageList = [];
    }
  }
});

export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
