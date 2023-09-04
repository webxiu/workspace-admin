const Layout = () => import("@/layout/index.vue");

export default {
  path: "/editTable",
  name: "EditTable",
  component: Layout,
  redirect: "/editTable/list",
  meta: { title: "编辑表格", icon: "Edit", rank: 1566 },
  children: [
    {
      path: "/editTable/list",
      name: "EditTableList",
      component: () => import("@/views/editTable/index.vue"),
      meta: { title: "编辑表格", icon: "Edit" }
    }
  ]
} as RouteConfigsTable;
