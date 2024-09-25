import { ConfigEnv, UserConfigExport, loadEnv } from "vite";
import { exclude, include } from "./build/optimize";

import dayjs from "dayjs";
import { getPluginsList } from "./build/plugins";
import pkg from "./package.json";
import { resolve } from "path";
import { warpperEnv } from "./build";

/** 当前执行node命令时文件夹的地址（工作目录） */
const root: string = process.cwd();
const timestamp = new Date().getTime();

/** 路径查找 */
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

/** 设置别名 */
const alias: Record<string, string> = {
  "@": pathResolve("src"),
  "@build": pathResolve("build"),
  "~": pathResolve("")
};

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss")
};

export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const { VITE_CDN, VITE_PORT, VITE_COMPRESSION, VITE_PUBLIC_PATH, VITE_BASE_API, VITE_BASE_URL } = warpperEnv(loadEnv(mode, root));
  return {
    base: VITE_PUBLIC_PATH,
    root,
    resolve: {
      alias
    },
    // 服务端渲染
    server: {
      hmr: true,
      // 是否开启 https
      https: false,
      // 端口号
      port: VITE_PORT,
      host: "0.0.0.0"
      // 本地跨域代理 https://cn.vitejs.dev/config/server-options.html#server-proxy
      // proxy: {
      //   [VITE_BASE_API]: {
      //     target: VITE_BASE_URL,
      //     changeOrigin: true,
      //     rewrite: (path) => path.replace(VITE_BASE_API, "")
      //   }
      // }
    },
    plugins: getPluginsList(command, VITE_CDN, VITE_COMPRESSION),
    // https://cn.vitejs.dev/config/dep-optimization-options.html#dep-optimization-options
    optimizeDeps: {
      include,
      exclude
    },
    build: {
      // outDir: "E:/project/www/api",
      sourcemap: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 4000,
      rollupOptions: {
        input: {
          index: pathResolve("index.html")
        },
        // 静态资源分类打包
        output: {
          chunkFileNames: `static/js/[name]-[hash].${timestamp}.js`,
          entryFileNames: `static/js/[name]-[hash].${timestamp}.js`,
          assetFileNames: `static/[ext]/[name]-[hash].${timestamp}.[ext]`
        }
      }
    },
    define: {
      __ROOT__: JSON.stringify(resolve(__dirname)),
      __INTLIFY_PROD_DEVTOOLS__: false,
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
