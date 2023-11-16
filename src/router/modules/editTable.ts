const Layout = () => import("@/layout/index.vue");

export default {
  path: "/editTable",
  name: "EditTable",
  component: Layout,
  redirect: "/editTable/list",
  meta: { title: "常用模块", icon: "CheckboxCircleLine", rank: 1566 },
  children: [
    {
      path: "/editTable/list",
      name: "EditTableList",
      component: () => import("@/views/editTable/index.vue"),
      meta: { title: "编辑表格", icon: "Edit" }
    },
    {
      path: "/calendar",
      name: "Calendar",
      component: () => import("@/views/calendar/index.vue"),
      meta: { title: "日历", icon: "Card" }
    },
    {
      path: "/bpmn",
      name: "Bpmn",
      component: () => import("@/views/bpmn/index.vue"),
      meta: { title: "BPMN", icon: "SetUp" }
    }
  ]
} as RouteConfigsTable;
