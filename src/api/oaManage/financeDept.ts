import { InjectCancel, http } from "@/utils/http";
import { MaterialManageItemType, PayslipDataItemType, StandardCostItemType, WageAccountDetailItemType } from "./types/financeDept";

export type { StandardCostItemType, MaterialManageItemType, PayslipDataItemType, WageAccountDetailItemType };

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

/** 工资核算 — 主列表查询 */
export function fetchMainStaffMoneyCheckList(data) {
  return http.request("post", "/oa/fin/wageaccounting/getPage", { data });
}

/** 工资核算 — 部门汇总查询 */
export function fetchDeptTotalMoneyCheckList(data) {
  return http.request("get", "/oa/fin/wageaccounting/getPayrollSummary", { params: data });
}

/** 工资核算 — 明细查询 */
export function fetchDetailStaffMoneyCheckList(data) {
  return http.request<TablePagingResType<WageAccountDetailItemType>>("post", "/oa/fin/wageaccounting/getPageDetail", { data });
}

/** 工资核算 — 明细单条查询 */
export function queryDetailStaffMoneyCheckList(data) {
  return http.request("get", "/oa/fin/wageaccounting/getDetail", { params: data });
}

/** 工资核算 — 抄送 */
export function makeCopyStaffMoneyCheckList(data) {
  return http.request("post", "/oa/fin/wageaccounting/carbonCopy", { data });
}

/** 工资核算 — 同步工资条管理 */
export function syncToPayslip(data) {
  return http.request("get", "/oa/fin/wageaccounting/syncToPayslip", { params: data });
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
  return http.request<PayslipItemType[]>("post", "/oa/fin/payslipmanage/getpaysliptemplatedataall", { data });
}
/** 工资条模板查询(企业微信) */
export function qywxFetchMoneyTemplateList(data) {
  return http.request<PayslipItemType[]>("post", "/app/qywx/workspace/payslip/getpaysliptemplatedata", { data });
}

/** 工资条列表查询 */
export function fetchPayslipDataList(data) {
  return http.request<PayslipDataItemType[]>("post", "/oa/fin/payslipmanage/getpayslipdataall", { data });
}

/** 工资条单条查询 */
export function queryPayslipData(data) {
  return http.request<PayslipDataItemType>("post", "/oa/fin/payslipmanage/getpayslipdata", { data });
}

/** 工资条帮助文档地址查询 */
export function queryPayslipUrlData(data) {
  return http.request<string>("post", "/oa/fin/payslipmanage/getpayslipdata", { data });
}

/** 工资条管理 — 工资分发 */
export function dispatchPayslipDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/payoutdataall", { data });
}

/** 工资条管理 — 工资撤销分发 */
export function revokeDispatchPayslipDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/delpayslipoutrecord", { data });
}

/** 工资条管理 — 导入 */
export function importPayslipDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/importpayslipdata", { data });
}
/** 工资条管理 — 导入(后台解析) */
export function importPayslip(data, onUploadProgress) {
  return http.request<string[]>(
    "post",
    "/oa/fin/payslipmanage/importpayslipfile",
    { data },
    {
      headers: { "Content-Type": "multipart/form-data", hideLoading: true },
      onUploadProgress,
      cancelToken: InjectCancel(importPayslip)
    }
  );
}

/** 工资条管理 — 撤销导入 */
export function cancelImportPayslipDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/cancelpayslipdataall", { data });
}

/** 工资条导出 */
export function exportPayslipDataList(data) {
  return http.request<string>("post", "/oa/fin/payslipmanage/exportall", { data });
}

/** 获取工资签名 */
export function getMoneySignImages(data) {
  return http.request("post", "/oa/fin/payslipmanage/getpayslipsignaturebyidall", { data });
}

/** 获取异常反馈列表 */
export function getFeedBackList(data) {
  return http.request("post", "/oa/fin/payslipmanage/getpayslipexceptionbyidall", { data });
}

/** 获取分发记录列表 */
export function getDispatchList(data) {
  return http.request("post", "/oa/fin/payslipmanage/getpayslipoutrecordbyidall", { data });
}

/** 工资单状态更新 - 撤销 */
export function revokeMoneyList(data) {
  return http.request("post", "/oa/fin/payslipmanage/chexiaopayslipbyidall", { data });
}

/** 工资单状态获取 */
export function getMoneyListStatus(data) {
  return http.request("post", "/oa/fin/payslipmanage/getpayslipstatusbyidall", { data });
}

/** 工资单修改 */
export function updateMoneyDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/updatepayslipdatabyidall", { data });
}

/** 工资归档 */
export function docMoneyDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/updatepayslipstatusbyidsall", { data });
}

/** 工资获取盐值 */
export function getMoneySaltDataInfo(data) {
  return http.request("post", "/oa/fin/payslipmanage/getpayslipdatabyyearmonthandstatus", { data });
}

/** 保存工资模板 */
export function saveMoneyTemplateConfig(data) {
  return http.request("post", "/oa/fin/paysliptemplate/savepaysliptemplatedataall", { data });
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
  return http.request("post", "/oa/fin/payslipmanage/getpaysliphandledataall", { data });
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

/** 解析毛利分析表格数据 */
export function marginResolutionData(data) {
  return http.request("post", "/oa/fin/GrossProfitAnalysis/costByLost", { params: data });
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
  return http.request<{ list: StandardCostItemType[]; mapList: any[] }>("post", "/oa/fin/standardcost/selectstandardcost", { data });
}

export function materialManageList(data) {
  return http.request<TablePagingResType<MaterialManageItemType>>("post", "/plm/bd/material/select", { data }, { headers: { hideLoading: true } });
}

/** 基础信息 - 币种列表 */
export function fetchMoneyClassList(data) {
  return http.request("post", "/oa/fin/currencyManagement/selectCurrency", { data });
}
/** 基础信息 - 新增币种列表 */
export function insertMoneyClassList(data) {
  return http.request("post", "/oa/fin/currencyManagement/insertCurrency", { data });
}
/** 基础信息 - 修改币种列表 */
export function updateMoneyClassList(data) {
  return http.request("put", "/oa/fin/currencyManagement/updateCurrency", { data });
}
/** 基础信息 - 删除币种列表 */
export function deleteMoneyClassList(data) {
  return http.request("delete", "/oa/fin/currencyManagement/deleteCurrency", { params: data });
}
/** 基础信息 - 导出币种列表 */
export function exportMoneyClassList(data) {
  return http.request("post", "/oa/fin/currencyManagement/export", { data });
}
