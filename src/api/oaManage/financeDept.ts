import { MaterialManageItemType, PayslipDataItemType, StandardCostItemType } from "./types/financeDept";

import { http } from "@/utils/http";

export type { StandardCostItemType, MaterialManageItemType, PayslipDataItemType };

/** ========================= 财务部接口 ========================= */

/** 获取薪资设置列表 */
export function getMoneySettingsList(data) {
  return http.request("post", "/oa/fin/salarymanagement/select", { data });
}

/** 薪资设置 — 修改 */
export function updateMoneySettingsInfo(data) {
  return http.request("post", "/oa/fin/salarymanagement/update", { data });
}
/** 获取薪资设置列表-导出 */
export function moneySettingsExport(data) {
  return http.request<string>("post", "/oa/fin/salarymanagement/export", { data });
}

/** 获取异常工时金额 */
export function fetchExceptionTimeList(data) {
  return http.request("get", "/oa/fin/costanalysis/abnormaltime", { params: data });
}

/** 修改异常工时金额 */
export function updateExceptionTimeList(data) {
  return http.request("post", "/oa/fin/costanalysis/addabnormaltime", { data });
}

/** 薪资设置 — 导入 */
export function uploadMoneySettingsInfo(data) {
  return http.request("post", "/oa/fin/salarymanagement/uploadfile", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 获取下拉列表 */
export function getStateOptionList(data) {
  return http.request("post", "/sys/sys/optionlist/select", { data });
}

/** 获取各部门费用明细 - 查询部门 */
export function getDeptFreeDetailList(data) {
  return http.request("get", "/oa/fin/departcharge/getdeptinfo", { params: data });
}

/** 查询汇率列表 */
export function getRateTableList(data) {
  return http.request("post", "/oa/fin/ratetable/select", { data });
}

/** 下载汇率 */
export function downloadRateTableList(params) {
  return http.request("get", "/oa/fin/ratetable/downloadrate", { params }, { timeout: 1000 * 60 });
}

/** 导出汇率 */
export function exportRateTableList(data) {
  return http.request("post", "/oa/fin/ratetable/export", { data });
}

/** ========================= 工资核算 ========================= */

/** 工资核算 — 列表查询 */
export function fetchStaffMoneyCheckList(data) {
  return http.request("post", "/oa/fin/wageaccounting/getStaffSalaryCalculate", { data });
}

/** 工资核算 — 修改 */
export function updateClerkMoneyCheckList(data) {
  return http.request("post", "/oa/fin/wageaccounting/updatestaffsalarycalculate", { data });
}

/** 工资核算 - 导入 */
export function importStaffMoneyCheckList(data) {
  return http.request("post", "/oa/fin/wageaccounting/uploadfile", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 工资核算 - 导出 */
export function exportStaffMoneyCheckList(data) {
  return http.request<string>("post", "/oa/fin/wageaccounting/export", { data });
}

/** 工资核算 */
export function calcMoneyCheckList(data) {
  return http.request("get", "/oa/fin/wageaccounting/wageaccounting", { params: data });
}

/** 预付账款明细表查询 */
export function fetchPrePayMoneyList(data) {
  return http.request("get", "/oa/fin/prepayment/getprepayment", { params: data });
}

/** 其他应付款明细表查询 */
export function fetchOtherPayMoneyList(data) {
  return http.request("get", "/oa/fin/otherpayables/getotherpayables", { params: data });
}

/** 其他应收款明细表查询 */
export function fetchOtherReceiveMoneyList(data) {
  return http.request("get", "/oa/fin/otherreceivable/getotherreceivable", { params: data });
}

/** 应付账款明细表查询 */
export function fetchMeetPayMoneyList(data) {
  return http.request("get", "/oa/fin/accountspayable/getaccountspayable", { params: data });
}

/** 应收账款明细表查询 */
export function fetchRecievePayMoneyList(data) {
  return http.request("get", "/oa/fin/accountsreceivable/getaccountsreceivable", { params: data });
}

/** 费用报表查询 */
export function fetchFreeBIList(data) {
  return http.request("get", "/oa/fin/expensereports/getexpensereportsinfo", { params: data });
}

interface PayslipItemType {
  id: number;
  templateNo: string;
  numberNo: number;
  fieldName: string;
  fieldTitle: string;
  width: number;
  disable: string;
  excel: string;
  frozen: string;
  total: string;
  importCheck: string;
  encryptedStorage: string;
  fieldType: string;
  inExcel: string;
  allowEdit: string;
  appShow: string;
  appNo: number;
  deduction: string;
}

/** 获取工资模板 */
export function fetchMoneyTemplateList(data) {
  return http.request<PayslipItemType[]>("post", "/oa/fin/payslipmanage/getpaysliptemplatedata", { data });
}
/** 工资条模板查询(企业微信) */
export function qywxFetchMoneyTemplateList(data) {
  return http.request<PayslipItemType[]>("post", "/app/qywx/workspace/payslip/getpaysliptemplatedata", { data });
}

/** 工资条列表查询 */
export function fetchPayslipDataList(data) {
  return http.request<PayslipDataItemType[]>("post", "/oa/fin/payslipmanage/getpayslipdata", { data });
}

/** 工资条管理 — 工资分发 */
export function dispatchPayslipDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/payoutdata", { data });
}

/** 工资条管理 — 导入 */
export function importPayslipDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/importpayslipdata", { data });
}

/** 工资条管理 — 撤销导入 */
export function cancelImportPayslipDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/cancelpayslipdata", { data });
}

/** 工资条导出 */
export function exportPayslipDataList(data) {
  return http.request<string>("post", "/oa/fin/payslipmanage/export", { data });
}

/** 获取工资签名 */
export function getMoneySignImages(data) {
  return http.request("post", "/oa/fin/payslipmanage/getpayslipsignaturebyid", { data });
}

/** 获取异常反馈列表 */
export function getFeedBackList(data) {
  return http.request("post", "/oa/fin/payslipmanage/getpayslipexceptionbyid", { data });
}

/** 获取分发记录列表 */
export function getDispatchList(data) {
  return http.request("post", "/oa/fin/payslipmanage/getpayslipoutrecordbyid", { data });
}

/** 工资单状态更新 - 撤销 */
export function revokeMoneyList(data) {
  return http.request("post", "/oa/fin/payslipmanage/chexiaopayslipbyid", { data });
}

/** 工资单状态获取 */
export function getMoneyListStatus(data) {
  return http.request("post", "/oa/fin/payslipmanage/getpayslipstatusbyid", { data });
}

/** 工资单修改 */
export function updateMoneyDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/updatepayslipdatabyid", { data });
}

/** 工资归档 */
export function docMoneyDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/updatepayslipstatusbyids", { data });
}

/** 工资获取盐值 */
export function getMoneySaltDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/getpayslipdatabyyearmonthandstatus", { data });
}

/** 保存工资模板 */
export function saveMoneyTemplateConfig(data) {
  return http.request("post", "/oa/fin/paysliptemplate/savepaysliptemplatedata", { data });
}

/** 获取利润表 */
export function getIncomeStatement(data) {
  return http.request("get", "/oa/fin/incomestatement/getincomestatement", { params: data });
}

/** 获取资产负债表 */
export function getBalancesheet(data) {
  return http.request("get", "/oa/fin/balancesheet/getbalancesheet", { params: data });
}

/** 获取工资条处理列表 */
export function getPaySlipHandleList(data) {
  return http.request("post", "/oa/fin/payslipmanage/getpaysliphandledata", { data });
}

/** 获取财务分析图表数据 */
export function getCostAnalysisData(data) {
  return http.request("get", "/oa/fin/costanalysis/getcostanalysisdata", { params: data });
}

/** 获取毛利分析表格数据 */
export function getMarginAnalysisData(data) {
  return http.request("post", "/oa/fin/GrossProfitAnalysis/selectData", { data });
}

/** 导出毛利分析表格数据 */
export function exportMarginAnalysisData(data) {
  return http.request("post", "/oa/fin/GrossProfitAnalysis/export", { data });
}

/** 获取各部门费用图表数据 */
export function getEveryDeptMoneyData(data) {
  return http.request<any[]>("get", "/oa/fin/departcharge/getcostreportdata", { params: data });
}

/** 获取各部门费用部门树数据 */
export function getFinDeptTreeData(data) {
  return http.request("get", "/oa/fin/departcharge/getdeptinfo", { params: data });
}

/** 成本比较表格数据 */
export function getCostCompareData(data) {
  return http.request("post", "/oa/fin/costcomparison/getcostcomparison", { params: data });
}

/** 成本比较期下拉数据 */
export function getCostCompareOptionData(data) {
  return http.request("get", "/oa/fin/costcomparison/getmonthbymunberyear", { params: data });
}

/** ========================= 财务报表(标准成本) ========================= */
/** 标准成本 - 列表 */
export function standardCostList(data) {
  return http.request<StandardCostItemType[]>("post", "/oa/fin/standardcost/selectstandardcost", { data });
}

export function materialManageList(data) {
  return http.request<TablePagingResType<MaterialManageItemType>>("post", "/plm/bd/material/select", { data }, { headers: { hideLoading: true } });
}
