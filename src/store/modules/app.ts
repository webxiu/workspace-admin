import { App_INFO, useLocalStorage } from "@/utils/storage";
import { deviceDetection, storageLocal } from "@pureadmin/utils";
import { getConfig, responsiveStorageNameSpace } from "@/config";

import { appType } from "./types";
import { defineStore } from "pinia";
import { store } from "@/store";

const { setItem, getItem } = useLocalStorage<StorageConfigs>(App_INFO);

export const useAppStore = defineStore({
  id: "pure-app",
  state: (): appType => ({
    appConfig: getItem(),
    sidebar: {
      opened: storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}layout`)?.sidebarStatus ?? getConfig().SidebarStatus,
      withoutAnimation: false,
      isClickCollapse: false
    },
    // 这里的layout用于监听容器拖拉后恢复对应的导航模式
    layout: (storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}layout`)?.layout as LayoutStyle) ?? getConfig().Layout,
    device: deviceDetection() ? "mobile" : "desktop",
    /** 后端返回的动态路由 */
    asyncRoutes: [],
    /** 动态路由loading状态 */
    routeLoading: false,
    /** 处于loading状态的数组 */
    currentLoadings: []
  }),
  getters: {
    /** 动态公司名称,logo，官网地址等 */
    getAppConfig(state): StorageConfigs {
      return state.appConfig;
    },
    getSidebarStatus(state) {
      return state.sidebar.opened;
    },
    getDevice(state) {
      return state.device;
    },
    getAsyncRoutes(state) {
      return state.asyncRoutes;
    },
    getRouteLoading(state) {
      return state.routeLoading;
    },
    getCurrentLoadings(state) {
      return state.currentLoadings;
    }
  },
  actions: {
    // 设置应用配置(动态公司名称,logo，官网地址等)
    setAppConfig(appConfig: Partial<StorageConfigs>) {
      this.appConfig = setItem(appConfig);
    },
    TOGGLE_SIDEBAR(opened?: boolean, resize?: string) {
      const layout = storageLocal().getItem<StorageConfigs>(`${responsiveStorageNameSpace()}layout`);
      if (opened && resize) {
        this.sidebar.withoutAnimation = true;
        this.sidebar.opened = true;
        layout.sidebarStatus = true;
      } else if (!opened && resize) {
        this.sidebar.withoutAnimation = true;
        this.sidebar.opened = false;
        layout.sidebarStatus = false;
      } else if (!opened && !resize) {
        this.sidebar.withoutAnimation = false;
        this.sidebar.opened = !this.sidebar.opened;
        this.sidebar.isClickCollapse = !this.sidebar.opened;
        layout.sidebarStatus = this.sidebar.opened;
      }
      storageLocal().setItem(`${responsiveStorageNameSpace()}layout`, layout);
    },
    async toggleSideBar(opened?: boolean, resize?: string) {
      await this.TOGGLE_SIDEBAR(opened, resize);
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    setLayout(layout) {
      this.layout = layout;
    },
    setAsyncRoutes(asyncRoutes) {
      this.asyncRoutes = asyncRoutes;
    },
    setRouteLoading(loading) {
      this.routeLoading = loading;
    },
    pushPageLoading(pageLoading: string) {
      this.currentLoadings.push(pageLoading);
    },
    popPageLoading() {
      this.currentLoadings.pop();
    }
  }
});

export function useAppStoreHook() {
  return useAppStore(store);
}
