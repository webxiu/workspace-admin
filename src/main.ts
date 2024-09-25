import "ant-design-vue/dist/reset.css";
import "./style/reset.scss";
import "./style/tailwind.css";
import "element-plus/dist/index.css";
import "vue3-tree-org/lib/vue3-tree-org.css";
import "./assets/iconfont/iconfont.js";
import "./assets/iconfont/iconfont.css";
import "./style/index.scss";
import "@/components/BpmnFlow/package/highlight";

import AntdV from "ant-design-vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import { MotionPlugin } from "@vueuse/motion";
import Table from "@pureadmin/table";
import { createApp } from "vue";
import { getServerConfig } from "./config";
import hljsVuePlugin from "@highlightjs/vue-plugin";
import { injectResponsiveStorage } from "@/utils/responsive";
import { registerComponents } from "@/components";
import { registerDirective } from "@/directives";
import router from "./router";
import { setupStore } from "@/store";
import { useI18n } from "@/plugins/i18n";
import vue3TreeOrg from "vue3-tree-org";

// import { useEcharts } from "@/plugins/echarts";
// import PureDescriptions from "@pureadmin/descriptions";
// 一定要在main.ts中导入tailwind.css，防止vite每次hmr都会请求src/style/index.scss整体css文件导致热更新慢的问题

const app = createApp(App);
app.config.warnHandler = () => null;

registerDirective(app); // 注册全局指令
registerComponents(app); // 注册全局组件
getServerConfig(app).then(async (config) => {
  setupStore(app);
  app.use(router);
  app.use(hljsVuePlugin);
  await router.isReady();
  injectResponsiveStorage(app, config);
  app
    .use(MotionPlugin)
    .use(useI18n)
    .use(ElementPlus)
    .use(AntdV)
    .use(vue3TreeOrg)
    // .use(useEcharts);
    .use(Table);
  // .use(PureDescriptions);
  app.mount("#app");
});
