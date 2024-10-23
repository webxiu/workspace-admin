import { RequestMethods } from "@/utils/http/types";
import { RouteRecordRaw } from "vue-router";
import { http } from "@/utils/http";

type ResultDataType = {
  success: boolean;
  data: Array<any>;
};

export interface UserMenuItem {
  id: number;
  menuCode: string;
  menuName: string;
  menuType: string;
  parentCode: string;
  controller: string;
  displaySequence: number;
  icon: string;
  openModel: string;
  mark: string;
  appHomeUrl: string;
  appDetailUrl: string;
  createDate: string;
  createrId: number;
  component: RouteRecordRaw["component"];
  /** 前端路由 */
  webRouter: string;
  /** 是否启用 */
  isEnable: boolean;
  /** 是否收藏 */
  isNoLike: boolean;
}

/** 获取异步路由 */
export function getAsyncRoutes(params) {
  return http.request<ResultDataType>("get", "/getAsyncRoutes");
}

/** 获取菜单列表 */
export function getMenuList(params) {
  return http.request<UserMenuItem[]>("get", "/home/usermenu", { params });
}

/** 配置表单: 下拉数据获取 */
export function getApiData<T = any>(method: RequestMethods, url: string, data = {}) {
  const mKey = method === "get" ? "params" : "data";
  return http.request<T>(method, url, { [mKey]: data, headers: { hideLoading: true } });
}
