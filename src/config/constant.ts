import { type PaginationProps } from "@pureadmin/table";
import { useAppStoreHook } from "@/store/modules/app";
import { setRouterInfo } from "@/utils/storage";

/** 外出申请兼容旧数据的常量 */
export const carSourceConstant = { 1: "派车", 2: "私家车", 3: "其他" };

/** 上传后缀名 */
export const defaultMime = [".jpg", ".png", ".jpeg"];
export const mediaMime = [".gif", ".jfif", ".pjpeg", ".m4v", ".mp4", ".wmv", ".avi", "mp3"];
export const fileMime = [".xls", ".xlsx", ".doc", ".docx", ".pdf", ".dot", ".ppt", ".pptx", ".zip"];
export const acceptMime = [...defaultMime, ...fileMime, ...mediaMime];

/** 需要单独一屏显示的路由地址(不会嵌套在导航菜单内) */
export const topRouteList = [
  /** 审批监控中心 */
  "/businessCenter/dataScreen/approvalMonitor/index",
  /** 经营管理中心 */
  "/businessCenter/dataScreen/businessMonitor/index",
  /** 生产监控中心 */
  "/businessCenter/dataScreen/productMonitor/index",
  /** 销售监控中心 */
  "/businessCenter/dataScreen/saleMonitor/index",
  /** 研发监控中心 */
  "/businessCenter/dataScreen/researchDeveleopMonitor/index",
  /** 供应链监控中心 */
  "/businessCenter/dataScreen/supplyChainMonitor/index"
];

/** 分页配置 */
export const PAGE_CONFIG: PaginationProps = {
  /** 总条数 */
  total: 0,
  /** 每页条数(与`分页选择`第一项相同) */
  pageSize: 30,
  /** 分页尺寸 */
  small: false,
  /** 背景 */
  background: true,
  /** 分页位置 */
  align: "right",
  /** 当前页 */
  currentPage: 1,
  /** 分页选择 */
  pageSizes: [30, 50, 100],
  /** 最大页码按钮数 */
  pagerCount: 5
};

// 单据审批状态
export enum BillState {
  /** 待提交 */
  submit = 0,
  /** 审核中 */
  auditing = 1,
  /** 已审核 */
  audited = 2,
  /** 重新审核 */
  reject = 3,
  /** 已终止 */
  revoke = 4
}

// 单据审批状态颜色
export const BillState_Color = {
  [BillState.submit]: { name: "待提交", color: "#409eff" },
  [BillState.auditing]: { name: "审核中", color: "#e6a23c" },
  [BillState.audited]: { name: "已审核", color: "#67c23a" },
  [BillState.reject]: { name: "重新审核", color: "#dc143c" },
  [BillState.revoke]: { name: "已终止", color: "#763a96" }
};

/** 颜色选择器默认颜色 */
// prettier-ignore
export const predefineColors = ["#ffffff", "#303133", "#2200aa", "#0000FF", "#1e90ff", "#409eff", "#73A3F5", "#f590e4", "#c71585", "#dc143c", "#F53145", "#FF0000", "#ff6600", "#ff8c00", "#e6a23c", "#ffc107", "#F5F31B", "#bbff00", "#00FF00", "#90ee90", "#00dd00", "#67c23a", "#008800", "#227700", "#009688", "#909399", "#00ced1", "#ccddff", "#ffcccc", "#F59DC3", "#f56c6c", "#d2691e", "#F59773", "#F5D273", "#770077", "#8c0044", "hsv(51, 100, 98)", "rgba(255, 69, 0, 0.68)", "hsva(120, 40, 94, 0.5)", "hsla(209, 100%, 56%, 0.73)"];

/** 弹窗中引入页面路由组件, 获取该页面的路由ID */
export const menuPageRouter = () => {
  enum PageUrl {
    /** 物料管理 */
    materialMgmt = "/plmManage/basicData/materialMgmt/index",
    /** 产品库 */
    productStore = "/plmManage/productMgmt/productStore/index"
  }
  return { PageUrl, setRouterInfo };
};
