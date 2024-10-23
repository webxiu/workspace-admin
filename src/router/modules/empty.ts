const Layout = () => import("@/layout/index.vue");

/**
 * 空页面路由(请勿删除):
 * 解决最后一个路由跳转报错的问题, 添加到接口返回路由列表最后
 */
export default {
  path: "/error/empty",
  component: Layout,
  name: "ErrorEmpty",
  meta: { title: "", showLink: false },
  redirect: "/error/empty/index",
  children: [
    {
      path: "/error/empty/index",
      name: "Empty",
      meta: { title: "", showLink: false, keepAlive: true },
      component: () => import("@/views/error/empty.vue")
    }
    // {
    //   path: "/:catchAll(.*)",
    //   component: () => import("@/views/error/empty.vue"),
    //   meta: { title: "", showLink: false, keepAlive: true }
    // }
  ]
} as RouteConfigsTable;
