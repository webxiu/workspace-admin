const Layout = () => import("@/layout/index.vue");

export default {
  path: "/kingdee",
  name: "kingdeeDB",
  redirect: "/kingdee/list",
  component: Layout,
  meta: {
    icon: "Histogram",
    title: "数据库配置",
    rank: 1
  },
  children: [
    {
      path: "/kingdee/list",
      name: "kingdeeDBList",
      component: () => import("@/views/kingdeeDB/index.vue"),
      meta: {
        title: "数据库列表"
      }
    }
  ]
} as RouteConfigsTable;
