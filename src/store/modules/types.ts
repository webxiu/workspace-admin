import { RouteRecordName } from "vue-router";
import { UserInfoType } from "@/api/user/types";
import { UserMenuItem } from "@/api/routes";

export type cacheType = {
  mode: string;
  name?: RouteRecordName;
};

export type positionType = {
  startIndex?: number;
  length?: number;
};

export type appType = {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    // 判断是否手动点击Collapse
    isClickCollapse: boolean;
  };
  layout: LayoutStyle;
  appConfig: StorageConfigs;
  device: string;
  asyncRoutes: RouteConfigsTable[];
  routeLoading: boolean;
  currentLoadings: string[];
};

export type multiType = {
  path: string;
  name: string;
  meta: any;
  query?: Record<string, any>;
  params?: object;
};

export type setType = {
  title: string;
  fixedHeader: boolean;
  hiddenSideBar: boolean;
  tableConfigMenuRoutes: UserMenuItem[];
};

export type userType = {
  userInfo?: UserInfoType;
  roles?: Array<string>;
  verifyCode?: string;
  currentPage?: number;
};
