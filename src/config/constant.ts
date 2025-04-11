import { type PaginationProps } from "@pureadmin/table";
import { OptionsType } from "@/utils/table";

/** 外出申请兼容旧数据的常量 */
export const carSourceConstant = { 1: "派车", 2: "私家车", 3: "其他" };

/** 上传后缀名 */
export const defaultMime = [".jpg", ".png", ".jpeg", ".gif", ".bmp"];
export const mediaMime = [".jfif", ".pjpeg", ".m4v", ".mp4", ".wmv", ".avi", "mp3"];
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

/** 分页配置(必须解构使用, 避免引用同一地址) */
export const PAGE_CONFIG: PaginationProps = {
  /** 总条数 */
  total: 0,
  /** 每页条数(与 pageSizes 第一项必须相同) */
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
  pageSizes: [30, 100, 500, 1000, 100000],
  /** 最大页码按钮数 */
  pagerCount: 5
};

/** 颜色选择器默认颜色 */
// prettier-ignore
export const predefineColors = ["#ffffff", "#303133", "#2200aa", "#0000FF", "#1e90ff", "#409eff", "#73A3F5", "#f590e4", "#c71585", "#dc143c", "#F53145", "#FF0000", "#ff6600", "#ff8c00", "#e6a23c", "#ffc107", "#F5F31B", "#bbff00", "#00FF00", "#90ee90", "#00dd00", "#67c23a", "#008800", "#227700", "#009688", "#909399", "#00ced1", "#ccddff", "#ffcccc", "#F59DC3", "#f56c6c", "#d2691e", "#F59773", "#F5D273", "#770077", "#8c0044", "hsv(51, 100, 98)", "rgba(255, 69, 0, 0.68)", "hsva(120, 40, 94, 0.5)", "hsla(209, 100%, 56%, 0.73)"];

export const tagColors = [
  { color: "#fff", background: "#409eff" }, // 蓝色
  { color: "#fff", background: "#e6a23c" }, // 橙色
  { color: "#fff", background: "#67c23a" }, // 绿色
  { color: "#fff", background: "#dc143c" }, // 红色
  { color: "#fff", background: "#763a96" }, // 紫色
  { color: "#fff", background: "#eb2f96" }, // 粉紫色
  { color: "#fff", background: "#ff4d4f" }, // 红色
  { color: "#fff", background: "#F59DC3" }, // 紫色
  { color: "#fff", background: "#13c2c2" }, // 青色
  { color: "#fff", background: "#531dab" } // 深紫色
];

/** 单据状态 */
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

/** 单据状态颜色 */
export const BillState_Color = {
  [BillState.submit]: { name: "待提交", color: "#409eff" },
  [BillState.auditing]: { name: "审核中", color: "#e6a23c" },
  [BillState.audited]: { name: "已审核", color: "#67c23a" },
  [BillState.reject]: { name: "重新审核", color: "#dc143c" },
  [BillState.revoke]: { name: "已终止", color: "#763a96" }
};

/** 根据菜单URL获取菜单配置的页面 */
export enum PageUrl {
  /** ==================== 弹窗页面(主菜单页面添加到弹窗中) =================== */
  /** 物料管理 */
  materialMgmt = "/plmManage/basicData/materialMgmt/index",
  /** 产品库 */
  productStore = "/plmManage/productMgmt/productStore/index",

  /** ==================== 信息中心(主菜单路由信息获取) =================== */
  /** 1.请假单路由 */
  leaveApply = "/humanResources/leaveApply/index",
  /** 2.加班单路由 */
  overtimeOrder = "/humanResources/overtimeOrder/index",
  /** 3.数据库维护 */
  database = "/system/develop/database/index",
  /** 4.测试报告 */
  testReport = "/plmManage/laboratory/testReport/index",
  /** 5.外出派车路由 */
  carAllocate = "/humanResources/carAllocate/index",
  /** 6.访客接待 */
  visitorReception = "/humanResources/visitorReception/index",
  /** 7(8).对账单详情 */
  statementAccount = "/supplyChainMange/statementAccount/index",
  /** 9.开模申请 */
  moldApply = "/plmManage/moldManage/moldApply/index",
  /** 10.离职申请 */
  resignApply = "/humanResources/resignApply/index",
  /** 11.供应链订单处理 */
  supplyChaiOrder = "/supplyChainMange/orders/index",
  /** 12.产品开发申请表 */
  devApplay = "/plmManage/productMgmt/productsDevApplay/index",
  /** 13(14).项目管理 */
  projectManage = "/plmManage/projectMgmt/projectManage/index",
  /** 15.交付物变更 */
  deliveryChange = "/plmManage/projectMgmt/deliveryChange/index",
  /** 16.我的工单 */
  myWorkOrder = "/setting/myWorkOrder",
  /** 17.报价申请 */
  quotation = "/marketing/saleManage/quotation/index",
  /** 18.DR0开发申请 */
  dr0Apply = "/plmManage/productMgmt/DR0Apply/index.vue",
  /** 19.手板制作申请 */
  handleMake = "/marketing/saleManage/handleMake/index",
  /** 20.绩效管理 */
  performance = "/humanResources/performanceManage/index",
  /** 21.提成管理 */
  commission = "/humanResources/commission/index",
  /** 22.其他金额管理 */
  otherMoney = "/humanResources/otherMoney/index",
  /** 23.薪资核算 */
  salaryCalc = "/financeDept/payrollMgmt/calculate/index",
  /** 24.人事异动 */
  staffChange = "/humanResources/staffChange/index",
  /** 25.作业指导书 */
  operateBook = "/productMkCenter/engineerDept/operateBook/index"
}

/** echarts颜色配置 */
export const ECHARTSTHEME = {
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderColor: "transparent",
    textStyle: { color: "#fff" }
  },
  redLine: {
    lineStyle: { color: "#c6423e" }, // 设置线的颜色为红色
    itemStyle: { color: "#c6423e" } // 改变折线点的颜色
  },
  blackLine: {
    lineStyle: { color: "#2f4554" }, // 设置线的颜色为黑色
    itemStyle: { color: "#2f4554" } // 改变折线点的颜色
  },
  greenLine: {
    lineStyle: { color: "#008000" }, // 设置线的颜色为绿色
    itemStyle: { color: "#008000" } // 改变折线点的颜色
  },
  blueLine: {
    lineStyle: { color: "#409eff" }, // 设置线的颜色为绿色
    itemStyle: { color: "#409eff" } // 改变折线点的颜色
  },
  grayGreenLine: {
    lineStyle: { color: "#78aeb5" }, // 设置线的颜色为灰绿色
    itemStyle: { color: "#78aeb5" } // 改变折线点的颜色
  },
  barColors: ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae", "#749f83", "#ca8622", "#bda29a"]
};

/** 布尔是否列表 */
export const boolOptions: OptionsType[] = [
  { optionName: "是", optionValue: true },
  { optionName: "否", optionValue: false }
];

/** 布尔01列表 */
export const numberOptions: OptionsType[] = [
  { optionName: "是", optionValue: 1 },
  { optionName: "否", optionValue: 0 }
];

/** 性别列表 */
export const genderOptions: OptionsType[] = [
  { optionName: "男", optionValue: "男" },
  { optionName: "女", optionValue: "女" }
];
