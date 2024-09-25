import { $t, transformI18n } from "@/plugins/i18n";
import { RouteComponent, RouteRecordRaw, Router, createRouter } from "vue-router";
import { ascending, findRouteByPath, formatFlatteningRoutes, formatTwoStageRoutes, getHistoryMode, getTopMenu, handleAliveRoute, initRouter } from "./utils";
import { fetchkkViewIpUrl, wxAppLogin } from "@/api/user/user";
import { getCookie, getUserInfo, setKkViewInfo } from "@/utils/storage";
import { isAllEmpty, isUrl, openLink } from "@pureadmin/utils";

import NProgress from "@/utils/progress";
import { buildHierarchyTree } from "@/utils/tree";
import { getConfig } from "@/config";
import { getUrlParameters } from "@/utils/common";
import remainingRouter from "./modules/remaining";
import { useAppStoreHook } from "@/store/modules/app";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { useUserStoreHook } from "@/store/modules/user";

/** 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 * 如何匹配所有文件请看：https://github.com/mrmlnc/fast-glob#basic-syntax
 * 如何排除文件请看：https://cn.vitejs.dev/guide/features.html#negative-patterns
 */
const modules: Record<string, any> = import.meta.glob(["./modules/**/*.ts", "!./modules/**/remaining.ts", "!./modules/**/empty.ts"], { eager: true });

/** 原始静态路由（未做任何处理） */
const routes = [];

Object.keys(modules).forEach((key) => {
  routes.push(modules[key].default);
});

/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity)))));

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteComponent> = ascending(routes.flat(Infinity)).concat(...remainingRouter);

/** 不参与菜单的路由 */
export const remainingPaths = Object.keys(remainingRouter).map((v) => {
  return remainingRouter[v].path;
});

/** 创建路由实例 */
export const router: Router = createRouter({
  history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
  routes: constantRoutes.concat(...(remainingRouter as any)),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise((resolve) => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number = document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

/** 重置路由 */
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name, meta } = route;
    if (name && router.hasRoute(name) && meta?.backstage) {
      router.removeRoute(name);
      router.options.routes = formatTwoStageRoutes(formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity)))));
    }
  });
  usePermissionStoreHook().clearAllCachePage();
}

/** 刷新页面获取到当前路由 */
export function getUrlRoute(routeList, urlPath) {
  let curPath;
  const fn = (routeList, urlPath) => {
    for (let i = 0; i < routeList.length; i++) {
      const item = routeList[i];
      if (item.path === urlPath) {
        curPath = item;
        break;
      } else if (item.children?.length > 0) {
        fn(item.children, urlPath);
      }
    }
  };
  fn(routeList, urlPath);
  return curPath || routeList[0];
}

/** 路由白名单 */
export const whiteList = ["/login", "/app/qywx/workspace/suppliercomplaint/index", "/supplierComplaint", "/mobileApp/projectChart"];

let isFirstLoad = false;

router.beforeEach(async (to: ToRouteType, _from, next) => {
  if (to.meta?.keepAlive) {
    handleAliveRoute(to, "add");
    if (to.query?.redirect === "true" || to.name === "BOMMgmtView") {
      // to.name判断 修复 查看BOM 跳转 查看BOM不生效
      useMultiTagsStoreHook().handleTags("push", to);
    }
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "Redirect") {
      handleAliveRoute(to);
    }
    // 主菜单更新
    if (to.path.includes("/menuPanel")) {
      useMultiTagsStoreHook().handleTags("update", to);
    }
  }
  const hasToken: string = getCookie();
  const userInfo = getUserInfo();

  NProgress.start();
  const externalLink = isUrl(to?.name as string);
  if (!externalLink) {
    to.matched.some((item) => {
      const metaTitle = transformI18n(item.meta.title);
      if (!metaTitle) return "";
      const Title = getConfig().Title;
      const configTitle = useAppStoreHook().getAppConfig.title;
      if (Title) document.title = `${metaTitle} | ${configTitle || Title}`;
      else document.title = metaTitle as string;
    });
  }
  /** 如果已经登录并存在登录信息后不能跳转到路由白名单，而是继续保持在当前页面 */
  function toCorrectRoute() {
    whiteList.includes(to.fullPath) ? next(_from.fullPath) : next();
  }

  if (hasToken && userInfo.userCode) {
    if (to.path === "/login") {
      return next(false);
    } else if (_from?.name) {
      // name为超链接
      if (externalLink) {
        openLink(to?.name as string);
        NProgress.done();
      } else {
        toCorrectRoute();
      }
    } else {
      // 刷新
      if (usePermissionStoreHook().wholeMenus.length === 0 && to.path !== "/login") {
        initRouter().then((router: Router) => {
          if (!useMultiTagsStoreHook().getMultiTagsCache) {
            const { path } = to;
            const route = findRouteByPath(path, router.options.routes[0].children);
            getTopMenu(true);
            // query、params模式路由传参数的标签页不在此处处理
            if (route && route.meta?.title) {
              if (isAllEmpty(route.parentId) && route.meta?.backstage) {
                // 此处为动态顶级路由（目录）
                const { path, name, meta } = getUrlRoute(route.children, to.path);
                useMultiTagsStoreHook().handleTags("push", { path, name, meta, query: to.query });
              } else {
                const { path, name, meta } = route;
                useMultiTagsStoreHook().handleTags("push", { path, name, meta, query: to.query });
              }
            }
          }

          // 确保动态路由完全加入路由列表并且不影响静态路由（注意：动态路由刷新时router.beforeEach可能会触发两次，第一次触发动态路由还未完全添加，第二次动态路由才完全添加到路由列表，如果需要在router.beforeEach做一些判断可以在to.name存在的条件下去判断，这样就只会触发一次）
          if (isAllEmpty(to.name)) router.push(to.fullPath);
        });
      }
      toCorrectRoute();
    }
  } else {
    /** ===========  扫码登录 start =========== */
    const { code, state, appid } = getUrlParameters(location.href);
    if (code && appid && !isFirstLoad) {
      wxAppLogin({ code, state })
        .then(async (res) => {
          isFirstLoad = true;
          await useUserStoreHook().getLoginInfo();
          await initRouter();
          fetchkkViewIpUrl({}).then((resp: any) => {
            if (resp.data) {
              setKkViewInfo(resp.data);
            }
          });
          const isMenuPanel = to.fullPath.indexOf("menuPanel") > -1;
          location.href = "/#" + (isMenuPanel ? "/workbench/home" : to.fullPath);
          next();
        })
        .catch(() => {
          isFirstLoad = true;
          next({ path: "/login", query: { redirect: to.fullPath } });
        });
      return;
    }
    /** ===========  扫码登录 end =========== */

    if (to.path !== "/login") {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        next({ path: "/login", query: { redirect: to.fullPath } });
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
