import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "WorkBench",
  component: Layout,
  redirect: "/workbench/home",
  meta: { title: $t("menus.hshome"), icon: "icon-shouye", rank: 1 },
  children: [
    {
      name: "Home", // 首页(默认显示在Tag中)
      path: "/workbench/home",
      meta: { title: $t("menus.hshome"), icon: "icon-gongzuotai", keepAlive: true },
      component: () => import("@/views/workbench/home/index.vue")
    },
    {
      path: "/menuPanel",
      name: "RouterPanel", //主菜单
      meta: { title: $t("menus.mainMenu"), keepAlive: true },
      component: () => import("@/views/routerPanel/index.vue")
    }
  ]
} as RouteConfigsTable;
