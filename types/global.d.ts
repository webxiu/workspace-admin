import type { VNode, FunctionalComponent, PropType as VuePropType, ComponentPublicInstance } from "vue";
import type { ECharts } from "echarts";
import type { IconifyIcon } from "@iconify/vue";
import type { TableColumns } from "@pureadmin/table";
import type { ElOption, UploadProps } from "element-plus";
import { CheckOnlineWebsocket } from "@/hooks/websocketOnline";

/**
 * 全局类型声明，无需引入直接在 `.vue` 、`.ts` 、`.tsx` 文件使用即可获得类型提示
 */
declare global {
  /**
   * 项目根目录
   */
  const __ROOT__: string;
  /**
   * 平台的名称、版本、依赖、最后构建时间的类型提示
   */
  const __APP_INFO__: {
    pkg: {
      name: string;
      version: string;
      dependencies: Recordable<string>;
      devDependencies: Recordable<string>;
    };
    lastBuildTime: string;
  };

  /**
   * Window 的类型提示
   */
  interface Window {
    // Global vue app instance
    __APP__: App<Element>;
    // 检测在线用户数websocket
    _onlineSocket: CheckOnlineWebsocket;
    // 企业微信
    wxlogin: Function;
    webkitCancelAnimationFrame: (handle: number) => void;
    mozCancelAnimationFrame: (handle: number) => void;
    oCancelAnimationFrame: (handle: number) => void;
    msCancelAnimationFrame: (handle: number) => void;
    webkitRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    oRequestAnimationFrame: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame: (callback: FrameRequestCallback) => number;

    bpmnInstances: {
      modeler: any;
      modeling: any;
      moddle: any;
      eventBus: any;
      bpmnFactory: any;
      elementFactory: any;
      elementRegistry: any;
      replace: any;
      selection: any;
      bpmnElement: any;
    };
  }

  /**
   * 接口请求数据响应类型
   */
  interface BaseResponseType<T> {
    data: T;
    status: number;
    message: string;
    timestamp: number;
  }

  /**
   * 打包压缩格式的类型声明
   */
  type ViteCompression = "none" | "gzip" | "brotli" | "both" | "gzip-clear" | "brotli-clear" | "both-clear";

  /**
   * 全局自定义环境变量的类型声明
   * @see {@link https://yiming_chang.gitee.io/pure-admin-doc/pages/config/#%E5%85%B7%E4%BD%93%E9%85%8D%E7%BD%AE}
   */
  interface ViteEnv {
    VITE_PORT: number;
    VITE_PUBLIC_PATH: string;
    VITE_ROUTER_HISTORY: string;
    VITE_CDN: boolean;
    VITE_HIDE_HOME: string;
    VITE_COMPRESSION: ViteCompression;
    VITE_BASE_API: string;
    VITE_BASE_URL: string;
  }

  /**
   *  继承 `@pureadmin/table` 的 `TableColumns` ，方便全局直接调用
   */
  interface TableColumnList extends TableColumns {
    /** 表格行编辑表单网格占比 */
    span?: number;
    /** 禁止编辑 */
    disabled?: boolean;
    /** 输入提示 */
    placeholder?: string;
    /** 下拉选项列表 */
    options?: Array<ElOption>;
    /** 导出时间格式 (yyyy-MM-dd HH:mm:ss) */
    format?: string;
    /** 格式化处理方式(json字符串) */
    formatType?: string;

    id?: string;
    menuId?: number;
    sortable?: boolean;
    minWidth?: number | string;
    width?: number | string;
    seq?: number;
    className?: string;
    columnname?: string;
    tablename?: string;
    groupCode?: string;
    groupName?: string;
    columnGroupId?: string;
    // type?: string;
    // align?: string;
    // fixed?: string;
    // headerAlign?: string;
    /** 是否新建 */
    isNew?: boolean;
  }

  type LayoutStyle = "horizontal" | "vertical" | "mix";
  /**
   * 对应 `public/serverConfig.json` 文件的类型声明
   * @see {@link https://yiming_chang.gitee.io/pure-admin-doc/pages/config/#serverconfig-json}
   */
  interface ServerConfigs {
    Version?: string;
    Title?: string;
    Logo?: string;
    FixedHeader?: boolean;
    HiddenSideBar?: boolean;
    MultiTagsCache?: boolean;
    KeepAlive?: boolean;
    Locale?: string;
    Layout?: LayoutStyle;
    Theme?: string;
    DarkMode?: boolean;
    Grey?: boolean;
    HideTabs?: boolean;
    SidebarStatus?: boolean;
    EpThemeColor?: string;
    ShowLogo?: boolean;
    ShowModel?: string;
    MenuArrowIconNoTransition?: boolean;
    CachingAsyncRoutes?: boolean;
    TooltipEffect?: Effect;
    ResponsiveStorageNameSpace?: string;
  }

  /**
   * 与 `ServerConfigs` 类型不同，这里是缓存到浏览器本地存储的类型声明
   * @see {@link https://yiming_chang.gitee.io/pure-admin-doc/pages/config/#serverconfig-json}
   */
  interface StorageConfigs {
    version?: string;
    title?: string;
    orgName?: string;
    logo?: string;
    fixedHeader?: boolean;
    hiddenSideBar?: boolean;
    multiTagsCache?: boolean;
    keepAlive?: boolean;
    locale?: string;
    layout?: string;
    theme?: string;
    darkMode?: boolean;
    grey?: boolean;
    hideTabs?: boolean;
    sidebarStatus?: boolean;
    epThemeColor?: string;
    showLogo?: boolean;
    showModel?: string;
    username?: string;
  }

  /**
   * `responsive-storage` 本地响应式 `storage` 的类型声明
   */
  interface ResponsiveStorage {
    locale: {
      locale?: string;
    };
    layout: {
      layout?: LayoutStyle;
      theme?: string;
      darkMode?: boolean;
      sidebarStatus?: boolean;
      epThemeColor?: string;
    };
    configure: {
      grey?: boolean;
      hideTabs?: boolean;
      showLogo?: boolean;
      showModel?: string;
      multiTagsCache?: boolean;
    };
    tags?: Array<any>;
  }

  /**
   * 平台里所有组件实例都能访问到的全局属性对象的类型声明
   */
  interface GlobalPropertiesApi {
    $echarts: ECharts;
    $storage: ResponsiveStorage;
    $config: ServerConfigs;
  }

  /** 分页表格响应类型 */
  export interface TablePagingResType<T> {
    records: T[];
    total: number;
    size: number;
    current: number;
    orders: number[];
    optimizeCountSql: boolean;
    searchCount: boolean;
    countId: number;
    maxLimit: number;
    pages: number;
  }

  export interface ButtonItemType {
    loading?: boolean;
    disabled?: boolean;
    dark?: boolean;
    icon?: any;
    width?: string;
    color?: string;
    circle?: boolean;
    round?: boolean;
    type?: any;
    size?: any;
    /** 配置此属性则显示为上传按钮, 默认为普通按钮 */
    uploadProp?: Partial<UploadProps>;
    /** 必传项 */
    text: string;
    /** 点击选择事件 */
    clickHandler?: (item: ButtonItemType) => void;
    /** 是否显示在下拉按钮中 */
    isDropDown?: boolean;
  }
}
