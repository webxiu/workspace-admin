import { RouteComponent, RouteRecordRaw, Router, RouterHistory, createWebHashHistory, createWebHistory } from "vue-router";
import { cloneDeep, intersection, isAllEmpty, isIncludeAllChildren, isString, storageSession } from "@pureadmin/utils";
import { isProxy, toRaw } from "vue";

import { buildHierarchyTree } from "@/utils/tree";
import emptyRoute from "@/router/modules/empty";
import { getConfig } from "@/config";
import { getMenuList } from "@/api/routes";
import { getUserInfo } from "@/utils/storage";
import { handleTree } from "@/utils/tree";
import { menuType } from "@/layout/types";
import { message } from "@/utils/message";
import { router } from "./index";
import { toCamelCase } from "@/utils/common";
import { topRouteList } from "@/config/constant";
import { transformI18n } from "@/plugins/i18n";
import { useAppStoreHook } from "@/store/modules/app";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useSettingStoreHook } from "@/store/modules/settings";
import { useTimeoutFn } from "@vueuse/core";
import { webSocketConnect } from "@/config";
import workbench from "@/router/modules/workbench";

// 动态路由
const IFrame = () => import("@/layout/frameView.vue");
// https://cn.vitejs.dev/guide/features.html#glob-import
const modulesRoutes = import.meta.glob("/src/views/**/*.{vue,tsx}");

function handRank(routeInfo: any) {
  const { name, path, parentId, meta } = routeInfo;
  return isAllEmpty(parentId) ? (isAllEmpty(meta?.rank) || (meta?.rank === 0 && name !== "Home" && path !== "/") ? true : false) : false;
}

/** 按照路由中meta下的rank等级升序来排序路由 */
function ascending(arr: any[]) {
  arr.forEach((v, index) => {
    // 当rank不存在时，根据顺序自动创建，首页路由永远在第一位
    if (handRank(v)) v.meta.rank = index + 2;
  });
  return arr.sort((a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
    return a?.meta.rank - b?.meta.rank;
  });
}

/** 过滤meta中showLink为false的菜单 */
function filterTree(data: RouteComponent[]) {
  const newTree = cloneDeep(data).filter((v: { meta: { showLink: boolean; title?: string } }) => v.meta?.showLink !== false && v.meta?.title !== "空白页面");
  newTree.forEach((v: { children }) => v.children && (v.children = filterTree(v.children)));
  return newTree;
}

/** 过滤children长度为0的的目录，当目录下没有菜单时，会过滤此目录，目录没有赋予roles权限，当目录下只要有一个菜单有显示权限，那么此目录就会显示 */
function filterChildrenTree(data: RouteComponent[]) {
  const newTree = cloneDeep(data).filter((v: any) => v?.children?.length !== 0);
  newTree.forEach((v: { children }) => v.children && (v.children = filterTree(v.children)));
  return newTree;
}

/** 判断两个数组彼此是否存在相同值 */
function isOneOfArray(a: Array<string>, b: Array<string>) {
  return Array.isArray(a) && Array.isArray(b) ? (intersection(a, b).length > 0 ? true : false) : true;
}

/** 通过指定 `key` 获取父级路径集合，默认 `key` 为 `path` */
function getParentPaths(value: string, routes: RouteRecordRaw[], key = "path") {
  // 深度遍历查找
  function dfs(routes: RouteRecordRaw[], value: string, parents: string[]) {
    for (let i = 0; i < routes.length; i++) {
      const item = routes[i];
      // 返回父级path
      if (item[key] === value) return parents;
      // children不存在或为空则不递归
      if (!item.children || !item.children.length) continue;
      // 往下查找时将当前path入栈
      parents.push(item.path);

      if (dfs(item.children, value, parents).length) return parents;
      // 深度遍历查找未找到时当前path 出栈
      parents.pop();
    }
    // 未找到时返回空数组
    return [];
  }

  return dfs(routes, value, []);
}

/** 查找对应 `path` 的路由信息 */
function findRouteByPath(path: string, routes: RouteRecordRaw[]) {
  let res = routes.find((item: { path: string }) => item.path == path);
  if (res) {
    return isProxy(res) ? toRaw(res) : res;
  } else {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].children instanceof Array && routes[i].children.length > 0) {
        res = findRouteByPath(path, routes[i].children);
        if (res) {
          return isProxy(res) ? toRaw(res) : res;
        }
      }
    }
    return null;
  }
}

function addPathMatch() {
  if (!router.hasRoute("pathMatch")) {
    router.addRoute({
      path: "/:pathMatch(.*)",
      name: "pathMatch",
      redirect: "/error/404"
    });
  }
}

/** 1.处理动态路由（后端返回的路由） */
function handleAsyncRoutes(routeList: RouteRecordRaw[]) {
  const fullRoutes = [...routeList, emptyRoute];
  fullRoutes.map((v: RouteRecordRaw) => {
    // 防止重复添加路由
    if (router.options.routes[0].children.findIndex((value) => value.path === v.path) !== -1) {
      return;
    } else {
      // 切记将路由push到routes后还需要使用addRoute，这样路由才能正常跳转
      router.options.routes[0].children.push(v);
      // 最终路由进行升序
      ascending(router.options.routes[0].children);
      if (!router.hasRoute(v?.name)) router.addRoute(v);
      const flattenRouters: any = router.getRoutes().find((n) => n.path === "/");
      router.addRoute(flattenRouters);
    }
  });
  addPathMatch();
}

/** 获取接口菜单 */
const getAsyncRouter = () => {
  const userInfo = getUserInfo();
  useAppStoreHook().setRouteLoading(true);
  return new Promise<RouteRecordRaw[]>((resolve) => {
    getMenuList({ userId: userInfo.id })
      .then(({ data }) => {
        // 过滤掉5开头的移动端路由
        const tableColMenu = data.filter((v) => v.menuType === "菜单" && !v.menuCode.startsWith("5"));
        useSettingStoreHook().setTableConfigMenuRoutes(tableColMenu);
        webSocketConnect(userInfo.userCode);
        const routeList = data
          .filter((v) => !v.menuCode.startsWith("5"))
          .map((item) => {
            // 菜单路由添加组件
            if (item.menuType === "菜单") {
              item.component = getRouteComponent(item.webRouter);
            }
            const { menuName, webRouter, icon, ...reset } = item;
            const name = toCamelCase(webRouter); // 生成驼峰组件名
            const meta = { title: transformI18n(menuName), icon, keepAlive: true };
            // 修改为菜单标准结构
            return { ...reset, path: webRouter, name, meta, title: transformI18n(menuName), redirect: "" };
          });

        /** 需要单独一屏显示的路由地址(不会嵌套在导航菜单内, 例如:数据大屏)） */
        const newList = cloneDeep(routeList).filter((v) => {
          if (topRouteList.includes(v.path)) {
            router.addRoute(v);
            return false;
          }
          return true;
        });
        const treeList = handleTree(routeList, "menuCode", "parentCode", "children"); // 导航菜单树列表(所有动态路由)
        useAppStoreHook().setAsyncRoutes(treeList);
        usePermissionStoreHook().handleWholeMenus(treeList);
        resolve(newList);
      })
      .catch(() => {
        message.error("菜单列表获取失败", { duration: 9000 });
        resolve([]);
      })
      .finally(() => useAppStoreHook().setRouteLoading(false));
  });
};

/** 初始化路由（`new Promise` 写法防止在异步请求中造成无限循环）*/
function initRouter() {
  const key = "async-routes"; // 开启动态路由缓存本地sessionStorage
  const cachingEnabled = getConfig()?.CachingAsyncRoutes;
  const cacheRouteList: RouteRecordRaw[] = storageSession().getItem(key);
  const asyncRouteList = cachingEnabled ? cacheRouteList : null;
  return new Promise<{ router: Router; routes: RouteRecordRaw[] }>((resolve) => {
    if (asyncRouteList && asyncRouteList.length > 0) {
      handleAsyncRoutes(asyncRouteList);
      resolve({ router, routes: asyncRouteList });
    } else {
      getAsyncRouter().then((data) => {
        handleAsyncRoutes(cloneDeep(data));
        if (cachingEnabled) storageSession().setItem(key, data);
        resolve({ router, routes: data });
      });
    }
  });
}

/**
 * 将多级嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  let hierarchyList = buildHierarchyTree(routesList);
  for (let i = 0; i < hierarchyList.length; i++) {
    if (hierarchyList[i].children) {
      hierarchyList = hierarchyList.slice(0, i + 1).concat(hierarchyList[i].children, hierarchyList.slice(i + 1));
    }
  }
  return hierarchyList;
}

/**
 * 一维数组处理成多级嵌套数组（三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存）
 * https://github.com/pure-admin/vue-pure-admin/issues/67
 * @param routesList 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList;
  const newRoutesList: RouteRecordRaw[] = [];
  routesList.forEach((v: RouteRecordRaw) => {
    if (v.path === "/") {
      const { name, component, path, redirect, meta } = v;
      newRoutesList.push({ component, name, path, redirect, meta, children: [] });
    } else {
      newRoutesList[0]?.children.push({ ...v });
    }
  });
  return newRoutesList;
}

/** 处理缓存路由（添加、删除、刷新） */
function handleAliveRoute({ name }: ToRouteType, mode?: string) {
  switch (mode) {
    case "add":
      usePermissionStoreHook().cacheOperate({ mode: "add", name });
      break;
    case "delete":
      usePermissionStoreHook().cacheOperate({ mode: "delete", name });
      break;
    case "refresh":
      usePermissionStoreHook().cacheOperate({ mode: "refresh", name });
      break;
    default:
      usePermissionStoreHook().cacheOperate({ mode: "delete", name });
      useTimeoutFn(() => {
        usePermissionStoreHook().cacheOperate({ mode: "add", name });
      }, 100);
  }
}

// 根据菜单地址获取路由组件(.vue文件)
function getRouteComponent(path: string) {
  const modulesRoutesKeys = Object.keys(modulesRoutes);
  const index = modulesRoutesKeys.findIndex((ev) => ev.includes(path));
  return modulesRoutes[modulesRoutesKeys[index]];
}

/** 过滤后端传来的动态路由 重新生成规范路由 */
function addAsyncRoutes(arrRoutes: Array<RouteRecordRaw>) {
  if (!arrRoutes || !arrRoutes.length) return;
  const modulesRoutesKeys = Object.keys(modulesRoutes);
  arrRoutes.forEach((v: RouteRecordRaw) => {
    // 将backstage属性加入meta，标识此路由为后端返回路由
    v.meta.backstage = true;
    // 父级的redirect属性取值：如果子级存在且父级的redirect属性不存在，默认取第一个子级的path；如果子级存在且父级的redirect属性存在，取存在的redirect属性，会覆盖默认值
    if (v?.children && v.children.length && !v.redirect) v.redirect = v.children[0].path;
    // 父级的name属性取值：如果子级存在且父级的name属性不存在，默认取第一个子级的name；如果子级存在且父级的name属性存在，取存在的name属性，会覆盖默认值（注意：测试中发现父级的name不能和子级name重复，如果重复会造成重定向无效（跳转404），所以这里给父级的name起名的时候后面会自动加上`Parent`，避免重复）
    if (v?.children && v.children.length && !v.name) v.name = (v.children[0].name as string) + "Parent";
    if (v.meta?.frameSrc) {
      v.component = IFrame;
    } else {
      // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会跟path保持一致）
      const index = v?.component
        ? modulesRoutesKeys.findIndex((ev) => ev.includes(v.component as any))
        : modulesRoutesKeys.findIndex((ev) => ev.includes(v.path));
      v.component = modulesRoutes[modulesRoutesKeys[index]];
    }
    if (v?.children && v.children.length) {
      addAsyncRoutes(v.children);
    }
  });
  return arrRoutes;
}

/** 获取路由历史模式 https://next.router.vuejs.org/zh/guide/essentials/history-mode.html */
function getHistoryMode(routerHistory): RouterHistory {
  // len为1 代表只有历史模式 为2 代表历史模式中存在base参数 https://next.router.vuejs.org/zh/api/#%E5%8F%82%E6%95%B0-1
  const historyMode = routerHistory.split(",");
  const leftMode = historyMode[0];
  const rightMode = historyMode[1];
  // no param
  if (historyMode.length === 1) {
    if (leftMode === "hash") {
      return createWebHashHistory("");
    } else if (leftMode === "h5") {
      return createWebHistory("");
    }
  } //has param
  else if (historyMode.length === 2) {
    if (leftMode === "hash") {
      return createWebHashHistory(rightMode);
    } else if (leftMode === "h5") {
      return createWebHistory(rightMode);
    }
  }
}

/** 获取当前页面按钮级别的权限 */
function getAuths(): Array<string> {
  return router.currentRoute.value.meta.auths as Array<string>;
}

/** 是否有按钮级别的权限 */
function hasAuth(value: string | Array<string>): boolean {
  if (!value) return false;
  /** 从当前路由的`meta`字段里获取按钮级别的所有自定义`code`值 */
  const metaAuths = getAuths();
  if (!metaAuths) return false;
  const isAuths = isString(value) ? metaAuths.includes(value) : isIncludeAllChildren(value, metaAuths);
  return isAuths ? true : false;
}

/** 获取所有菜单中的第一个菜单（顶级菜单）*/
function getTopMenu(tag = false): menuType {
  const topMenu = usePermissionStoreHook().wholeMenus[0]?.children[0] || workbench.children[0];
  tag && useMultiTagsStoreHook().handleTags("push", topMenu);
  return topMenu;
}

export {
  hasAuth,
  getAuths,
  ascending,
  filterTree,
  initRouter,
  getTopMenu,
  addPathMatch,
  isOneOfArray,
  getHistoryMode,
  addAsyncRoutes,
  getParentPaths,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes
};
