import "./style/reset.scss";
import "./style/index.scss";
import "./style/tailwind.css";
import "element-plus/dist/index.css";
import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";
import "../mock";
import "./components/BpmnV3/package/theme/index.scss";

import * as directives from "@/directives";

import { Directive, createApp } from "vue";
import { FontIcon, IconifyIconOffline, IconifyIconOnline } from "./components/ReIcon";

import App from "./App.vue";
import { Auth } from "@/components/ReAuth";
import ElementPlus from "element-plus";
import { MotionPlugin } from "@vueuse/motion";
import Table from "@pureadmin/table";
import { getServerConfig } from "./config";
import { injectResponsiveStorage } from "@/utils/responsive";
import router from "./router";
import { setupStore } from "@/store";

// import MyPD from "@/components/BpmnV3/package";

// import vuePlugin from "@/components/BpmnV3/package/highlight";

// import { useEcharts } from "@/plugins/echarts";

// import PureDescriptions from "@pureadmin/descriptions";

// 引入重置样式

// 导入公共样式

// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题

// 导入字体图标

const app = createApp(App);
app.config.warnHandler = () => null;

// 自定义指令

Object.keys(directives).forEach((key) => {
  app.directive(key, (directives as { [key: string]: Directive })[key]);
});

// 全局注册`@iconify/vue`图标库

app.component("IconifyIconOffline", IconifyIconOffline);
app.component("IconifyIconOnline", IconifyIconOnline);
app.component("FontIcon", FontIcon);

// 全局注册按钮级别权限组件

app.component("Auth", Auth);

getServerConfig(app).then(async (config) => {
  app.use(router);
  await router.isReady();
  injectResponsiveStorage(app, config);
  setupStore(app);
  app
    .use(MotionPlugin)
    .use(ElementPlus)
    // .use(useEcharts);
    .use(Table);
  // .use(PureDescriptions);
  app.mount("#app");
});
