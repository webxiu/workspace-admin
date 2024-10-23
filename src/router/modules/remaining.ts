import { $t } from "@/plugins/i18n";

const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: $t("menus.hslogin"), showLink: false, rank: 101 }
  },
  {
    path: "/app/qywx/workspace/suppliercomplaint/index",
    name: "WorkspaceSuppliercomplaint",
    meta: { title: "工作台投诉建议", rank: 104, showLink: false },
    redirect: "/supplierComplaint"
  },
  {
    path: "/supplierComplaint",
    name: "supplierComplaintQYWX",
    meta: { title: "工作台投诉建议", rank: 103, showLink: false },
    component: () => import("@/views/qywxH5Page/complaint.vue")
  },
  {
    path: "/mobileApp/projectChart",
    name: "MobileAppProjectChart",
    component: () => import("@/views/appChart/index.vue"),
    meta: { title: "项目管理看板", showLink: false }
  },
  {
    path: "/redirect",
    component: Layout,
    name: "Redirect",
    meta: { title: $t("status.hsLoad"), showLink: false, rank: 102 },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "RedirectPage",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
] as Array<RouteConfigsTable>;
