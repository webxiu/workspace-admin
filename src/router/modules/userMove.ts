const Layout = () => import("@/layout/index.vue");

export default {
  path: "/userMove",
  name: "UserMove",
  redirect: "/userMove/list",
  component: Layout,
  meta: {
    icon: "Promotion",
    title: "用户迁移组织",
    rank: 1
  },
  children: [
    {
      path: "/userMove/list",
      name: "UserMoveList",
      component: () => import("@/views/userMove/index.vue"),
      meta: {
        title: "用户迁移组织"
      }
    }
  ]
} as RouteConfigsTable;
