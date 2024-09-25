import type { IconifyIcon } from "@iconify/vue";
import workbench from "@/router/modules/workbench";

const { VITE_HIDE_HOME } = import.meta.env;

export const routerArrays: Array<RouteConfigs> = VITE_HIDE_HOME === "false" ? [workbench.children[0]] : [];

export type routeMetaType = {
  title?: string;
  icon?: string | IconifyIcon;
  showLink?: boolean;
  savedPosition?: boolean;
  auths?: Array<string>;
};

export type RouteConfigs = {
  path?: string;
  query?: object;
  params?: object;
  meta?: routeMetaType;
  children?: RouteConfigs[];
  name?: string;
};

export type multiTagsType = {
  tags: Array<RouteConfigs>;
};

export type tagsViewsType = {
  icon: string | IconifyIcon;
  text: string;
  divided: boolean;
  disabled: boolean;
  show: boolean;
};

export interface setType {
  sidebar: {
    opened: boolean;
    withoutAnimation: boolean;
    isClickCollapse: boolean;
  };
  device: string;
  fixedHeader: boolean;
  classes: {
    hideSidebar: boolean;
    openSidebar: boolean;
    withoutAnimation: boolean;
    mobile: boolean;
  };
  hideTabs: boolean;
  currentLoadings: string[];
}

export type menuType = {
  id?: number;
  path?: string;
  noShowingChildren?: boolean;
  children?: menuType[];
  value: unknown;
  meta?: {
    icon?: string;
    title?: string;
    rank?: number;
    showParent?: boolean;
    extraIcon?: string;
  };
  showTooltip?: boolean;
  menuCode?: string;
  parentCode?: string;
  pathList?: number[];
  redirect?: string;
};

export type themeColorsType = {
  color: string;
  themeColor: string;
};

export interface scrollbarDomType extends HTMLElement {
  wrap?: {
    offsetWidth: number;
  };
}
