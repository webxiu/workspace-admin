const Layout = () => import("@/layout/index.vue");

export default {
  path: "/mxgraph",
  name: "Mxgraph",
  redirect: "/mxgraph/index",
  component: Layout,
  meta: {
    icon: "Promotion",
    title: "流程图",
    rank: 1
  },
  children: [
    {
      path: "/mxgraph/index",
      name: "MxgraphIndex",
      component: () => import("@/views/mxgraph/index.vue"),
      meta: {
        title: "流程图"
      }
    }
  ]
} as RouteConfigsTable;
