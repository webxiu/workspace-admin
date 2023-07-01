const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/",
  name: "Home",
  redirect: "/organization",
  component: Layout,
  meta: {
    icon: "homeFilled",
    title: "组织机构列表",
    rank: 0
  },
  children: [
    {
      path: "/organization",
      name: "OrganizationIndex",
      component: () => import("@/views/organization/index.vue"),
      meta: {
        title: "组织列表",
        showLink: VITE_HIDE_HOME === "true" ? false : true
      }
    }
  ]
} as RouteConfigsTable;
