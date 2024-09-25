import { FontIcon, IconifyIconOffline, IconifyIconOnline } from "@/components/ReIcon";

import { App } from "vue";
import { Auth } from "@/components/ReAuth";
import BlendedSearch from "@/components/BlendedSearch/index.vue";

const components = [
  // 全局注册`@iconify/vue`图标库
  { name: "IconifyIconOffline", component: IconifyIconOffline },
  { name: "IconifyIconOnline", component: IconifyIconOnline },
  { name: "FontIcon", component: FontIcon },
  { name: "Auth", component: Auth }, // 全局注册按钮级别权限组件
  { name: "BlendedSearch", component: BlendedSearch } // 表单搜索组件
];

export function registerComponents(app: App) {
  components.forEach((component) => {
    app.component(component.name, component.component);
  });
}
