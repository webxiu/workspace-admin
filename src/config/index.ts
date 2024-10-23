import { App } from "vue";
import { CheckOnlineWebsocket } from "@/hooks/websocketOnline";
import axios from "axios";

let config: object = {};
const { VITE_PUBLIC_PATH } = import.meta.env;

export const setConfig = (cfg?: unknown) => {
  config = Object.assign(config, cfg);
};

/** 获取全局默认配置 */
export const getConfig = (key?: string): ServerConfigs => {
  if (typeof key === "string") {
    const arr = key.split(".");
    if (arr && arr.length) {
      let data = config;
      arr.forEach((v) => {
        if (data && typeof data[v] !== "undefined") {
          data = data[v];
        } else {
          data = null;
        }
      });
      return data;
    }
  }
  return config;
};

/** 获取项目动态全局配置 */
export const getServerConfig = async (app: App): Promise<undefined> => {
  app.config.globalProperties.$config = getConfig();
  return axios({ method: "get", url: `${VITE_PUBLIC_PATH}serverConfig.json` })
    .then(({ data: config }) => {
      let $config = app.config.globalProperties.$config;
      // 自动注入项目配置
      if (app && $config && typeof config === "object") {
        $config = Object.assign($config, config);
        app.config.globalProperties.$config = $config;
        // 设置全局配置
        setConfig($config);
      }
      return $config;
    })
    .catch(() => {
      throw "请在public文件夹下添加serverConfig.json配置文件";
    });
};

/** 本地响应式存储的命名空间 */
export const responsiveStorageNameSpace = () => getConfig().ResponsiveStorageNameSpace;

const org_domain = import.meta.env.VITE_ORGANIZATION_URL || "dlpctest.deogra.com";

/** 企业组织 */
export const orgHostMap = {
  localhost: org_domain,
  "127.0.0.1": org_domain,
  "192.168.2.202": org_domain,
  "192.168.2.14": org_domain,
  "192.168.2.23": org_domain,
  "192.168.1.204": org_domain,
  "dlpctest.deogra.com": org_domain,
  "app2.deogra.com": "app.deogra.com"
};

/** 检测在线用户数 */
export const webSocketConnect = (userCode: string) => {
  const hostname = orgHostMap[location.hostname] || location.hostname;
  const socketUrl = `wss://${hostname}:8000/chat/${userCode}`;
  const ws = new CheckOnlineWebsocket(socketUrl);
  ws.OpenConnectHandler = function (e) {
    console.log("连接成功！");
  };
  ws.ReceiveMessageHandler = function (e) {
    const data = JSON.parse(e.data);
    // console.log("接收消息:", data.onlineCount, data);
  };
  ws.CloseConnectHandler = function (e) {
    console.log("关闭连接");
  };
  ws.Connect();
};
