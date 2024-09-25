import { storeToRefs } from "pinia";
import { getConfig } from "@/config";
import { useRouter } from "vue-router";
import { emitter } from "@/utils/mitt";
import { routeMetaType } from "../types";
// import userAvatar from "@/assets/user.png";
import { getTopMenu } from "@/router/utils";
import { useGlobal } from "@pureadmin/utils";
import { transformI18n } from "@/plugins/i18n";
import { router, remainingPaths } from "@/router";
import { computed, type CSSProperties } from "vue";
import { useAppStoreHook } from "@/store/modules/app";
import { useUserStore, useUserStoreHook } from "@/store/modules/user";
import { useEpThemeStoreHook } from "@/store/modules/epTheme";
import { usePermissionStoreHook } from "@/store/modules/permission";
import LogoutCircleRLine from "@iconify-icons/ri/logout-circle-r-line";
import type { IconifyIcon } from "@iconify/vue";
import { ElMessageBox } from "element-plus";
import Memo from "@iconify-icons/ep/memo";
import User from "@iconify-icons/ep/user";
import Edit from "@iconify-icons/ep/edit";
import Notebook from "@iconify-icons/ep/notebook";
import LearnOutLine from "@iconify-icons/ep/video-camera";
import ToolsGrape from "@iconify-icons/ep/grape";
import { getLearnCenterTokenData } from "@/api/user/user";

type DropKey = "basic" | "user" | "password" | "logout" | "workOrder" | "learnCenter" | "tools";
type navDropItemType = { label: string; value: DropKey; icon: IconifyIcon };

export function useNav() {
  const pureApp = useAppStoreHook();
  const router = useRouter();
  const routers = router.options.routes;
  const { wholeMenus } = storeToRefs(usePermissionStoreHook());
  /** 平台`layout`中所有`el-tooltip`的`effect`配置，默认`light` */
  const tooltipEffect = getConfig()?.TooltipEffect ?? "light";
  const appInfo = pureApp.getAppConfig;

  const navDropList: navDropItemType[] = [
    { label: "navs.basicInfo", value: "basic", icon: Memo },
    { label: "navs.userInfo", value: "user", icon: User },
    { label: "navs.changePassword", value: "password", icon: Edit },
    { label: "navs.myWorkOrder", value: "workOrder", icon: Notebook },
    { label: "navs.learnCenter", value: "learnCenter", icon: LearnOutLine },
    { label: "navs.hsTools", value: "tools", icon: ToolsGrape },
    { label: "navs.hsLoginOut", value: "logout", icon: LogoutCircleRLine }
  ];

  const userAvatar = useUserStore().userInfo?.avatar;

  const getDivStyle = computed((): CSSProperties => {
    return {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "hidden"
    };
  });

  /** 用户信息 */
  const userInfo = computed(() => {
    return useUserStoreHook()?.userInfo;
  });

  /** 设置国际化选中后的样式 */
  const getDropdownItemStyle = computed(() => {
    return (locale, t) => {
      return {
        background: locale === t ? useEpThemeStoreHook().epThemeColor : "",
        color: locale === t ? "#f4f4f5" : "#000"
      };
    };
  });

  const getDropdownItemClass = computed(() => {
    return (locale, t) => {
      return locale === t ? "" : "dark:hover:!text-primary";
    };
  });

  const avatarsStyle = computed(() => {
    return userInfo.value?.userName ? { marginRight: "10px", boxShadow: "0 0 1px 1px #ccc" } : "";
  });

  const isCollapse = computed(() => {
    return !pureApp.getSidebarStatus;
  });

  const device = computed(() => {
    return pureApp.getDevice;
  });

  const { $storage, $config } = useGlobal<GlobalPropertiesApi>();
  const layout = computed(() => {
    return $storage?.layout?.layout;
  });

  const appConfig = computed(() => {
    const title = appInfo.title || $config.Title;
    const logo = appInfo.logo || $config.Logo;
    return { ...$config, title, logo };
  });

  /** 切换语言动态title */
  function changeTitle(meta: routeMetaType) {
    const Title = getConfig().Title;
    const nameTitle = appInfo.title || meta.title;
    if (Title) document.title = `${transformI18n(nameTitle)} | ${Title}`;
    else document.title = transformI18n(nameTitle);
  }

  /** 点击下拉菜单Item */
  function onNavDropClick(item: navDropItemType) {
    const fnObj = {
      basic: onBasic,
      logout: logout,
      user: onUserInfo,
      workOrder: onWorkOrder,
      learnCenter: onLearnCenter,
      tools: onTools,
      password: onChangePassword
    };
    fnObj[item.value]();
  }
  /** 基本资料 */
  function onBasic() {
    router.push("/setting/basicInfo");
  }
  /** 用户信息 */
  function onUserInfo() {
    router.push("/setting/userInfo");
  }
  /**  我的工单 */
  function onWorkOrder() {
    router.push("/setting/myWorkOrder");
  }
  /**  学习中心 */
  function onLearnCenter() {
    getLearnCenterTokenData({}).then((res: any) => {
      if (res.data) {
        const { token, directUrl } = res.data;
        if (token && directUrl) window.open(`${directUrl}login?token=${token}`);
      }
    });
  }
  /**  工具面板 */
  function onTools() {
    router.push("/setting/tools");
  }
  /** 修改密码 */
  function onChangePassword() {
    router.push("/setting/changePassword");
  }
  /** 退出系统 */
  function logout() {
    ElMessageBox.confirm(`您确定要退出系统吗?`, "德龙温馨提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    }).then(() => {
      useUserStoreHook().logOut();
    });
  }

  function backTopMenu() {
    router.push(getTopMenu()?.path);
  }

  function onPanel() {
    emitter.emit("openPanel");
  }

  function toggleSideBar() {
    pureApp.toggleSideBar();
  }

  function handleResize(menuRef) {
    menuRef?.handleResize();
  }

  function resolvePath(route) {
    if (!route.children) return console.error("当前路由配置不正确，请检查配置");
    const httpReg = /^http(s?):\/\//;
    const routeChildPath = route.children[0]?.path;
    if (httpReg.test(routeChildPath)) {
      return route.path + "/" + routeChildPath;
    } else {
      return routeChildPath;
    }
  }

  function menuSelect(indexPath: string) {
    if (wholeMenus.value.length === 0 || isRemaining(indexPath)) return;
    emitter.emit("changLayoutRoute", indexPath);
  }

  /** 判断路径是否参与菜单 */
  function isRemaining(path: string) {
    return remainingPaths.includes(path);
  }

  return {
    appConfig,
    device,
    layout,
    routers,
    $storage,
    navDropList,
    backTopMenu,
    onNavDropClick,
    onPanel,
    getDivStyle,
    changeTitle,
    toggleSideBar,
    menuSelect,
    handleResize,
    resolvePath,
    isCollapse,
    pureApp,
    userInfo,
    userAvatar,
    avatarsStyle,
    tooltipEffect,
    getDropdownItemStyle,
    getDropdownItemClass
  };
}
