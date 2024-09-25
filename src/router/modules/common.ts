import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default {
  path: "/setting",
  name: "BasicSetting",
  component: Layout,
  redirect: "/set/basicInfo",
  meta: { title: "", icon: "", showLink: false, rank: 333 },
  children: [
    {
      path: "/setting/basicInfo",
      name: "BasicInfo",
      component: () => import("@/views/common/basicInfo/index.vue"),
      meta: { title: "基本资料", showLink: true }
    },
    {
      path: "/setting/userInfo",
      name: "UserInformation",
      component: () => import("@/views/common/userInfo/index.vue"),
      meta: { title: "用户信息", showLink: true }
    },

    {
      path: "/setting/myWorkOrder",
      name: "MyWorkOrder",
      component: () => import("@/views/common/myWorkOrder/index.vue"),
      meta: { title: "我的工单", showLink: true }
    },
    {
      path: "/setting/changePassword",
      name: "ChangePassword",
      component: () => import("@/views/common/changePassword/index.vue"),
      meta: { title: "修改密码", showLink: true }
    },
    {
      path: "/setting/tools",
      name: "Tools",
      component: () => import("@/views/common/tools/index.vue"),
      meta: { title: "工具面板", showLink: true }
    }
  ]
} as RouteConfigsTable;
