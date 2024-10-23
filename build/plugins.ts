import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { cdn } from "./cdn";
import { configCompressPlugin } from "./compress";
import { genScssMultipleScopeVars } from "../src/layout/theme";
import removeConsole from "vite-plugin-remove-console";
import { resolve } from "path";
import svgLoader from "vite-svg-loader";
import { themePreprocessorPlugin } from "@pureadmin/theme";
import { visualizer } from "rollup-plugin-visualizer";
import { viteBuildInfo } from "./info";
import { viteMockServe } from "vite-plugin-mock";
import vue from "@vitejs/plugin-vue";
import legacy from "@vitejs/plugin-legacy";
import vueJsx from "@vitejs/plugin-vue-jsx";

export function getPluginsList(command: string, VITE_CDN: boolean, VITE_COMPRESSION: ViteCompression) {
  const prodMock = true;
  const lifecycle = process.env.npm_lifecycle_event;
  return [
    vue({
      script: {
        defineModel: true,
        propsDestructure: true
      }
    }),
    VueI18nPlugin({
      runtimeOnly: true,
      compositionOnly: true,
      include: [resolve("locales/**")]
    }),
    // jsx、tsx语法支持
    vueJsx(),
    VITE_CDN ? cdn : null,
    configCompressPlugin(VITE_COMPRESSION),
    // 线上环境删除console
    removeConsole({ external: ["src/assets/iconfont/iconfont.js"] }),
    viteBuildInfo(),
    // 自定义主题
    themePreprocessorPlugin({
      scss: {
        multipleScopeVars: genScssMultipleScopeVars(),
        extract: true
      }
    }),
    // svg组件化支持
    svgLoader(),
    // ElementPlus({}),
    // mock支持
    viteMockServe({
      mockPath: "mock",
      localEnabled: command === "serve",
      prodEnabled: command !== "serve" && prodMock,
      injectCode: `
          import { setupProdMockServer } from './mockProdServer';
          setupProdMockServer();
        `,
      logger: false
    }),
    // 打包分析
    lifecycle === "report" ? visualizer({ open: true, brotliSize: true, filename: "report.html" }) : null
    // 兼容处理
    // legacy({
    //   targets: ["Chrome 47"],
    //   modernPolyfills: true
    // })
  ];
}
