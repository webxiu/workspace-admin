const Layout = () => import("@/layout/index.vue");

export default [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue"),
    meta: { title: "登录", showLink: false, rank: 101 }
  },
  {
    path: "/dataScreen",
    name: "DataScreen",
    component: () => import("@/views/dataScreen/index.vue"),
    meta: { title: "数据大屏", showLink: true, rank: 102 }
  },
  {
    path: "/redirect",
    component: Layout,
    meta: { title: "加载中...", showLink: false, rank: 107 },
    children: [
      {
        path: "/redirect/:path(.*)",
        name: "Redirect",
        component: () => import("@/layout/redirect.vue")
      }
    ]
  }
] as Array<RouteConfigsTable>;
