import { defineStore } from "pinia";
import { getConfig } from "@/config";
import { setType } from "./types";
import { store } from "@/store";

export const useSettingStore = defineStore({
  id: "pure-setting",
  state: (): setType => ({
    title: getConfig().Title,
    fixedHeader: getConfig().FixedHeader,
    hiddenSideBar: getConfig().HiddenSideBar,
    tableConfigMenuRoutes: []
  }),
  getters: {
    getTitle(state) {
      return state.title;
    },
    getFixedHeader(state) {
      return state.fixedHeader;
    },
    getHiddenSideBar(state) {
      return state.hiddenSideBar;
    },
    /** 获取表格配置列菜单数据 */
    gableConfigMenuRoutes(state) {
      return state.tableConfigMenuRoutes;
    }
  },
  actions: {
    CHANGE_SETTING({ key, value }) {
      if (Reflect.has(this, key)) {
        this[key] = value;
      }
    },
    changeSetting(data) {
      this.CHANGE_SETTING(data);
    },
    /** 设置表格配置列菜单数据 */
    setTableConfigMenuRoutes(data) {
      this.tableConfigMenuRoutes = data;
    }
  }
});

export function useSettingStoreHook() {
  return useSettingStore(store);
}
