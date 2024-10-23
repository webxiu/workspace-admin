import { FileListItemType, StatementDetailFileItemType, StatementDetailItemType, StatementDetailType, StatementItemType, SupplierItemType } from "./types";

import { http } from "@/utils/http";

export type { StatementItemType, StatementDetailItemType, SupplierItemType, FileListItemType, StatementDetailType, StatementDetailFileItemType };

/** ========================= 供应链 ========================= */
/** 供应商 - 查询列表 */
export function fetchSupplierList(params) {
  return http.request<TablePagingResType<SupplierItemType>>("post", "/sup/supplier/selectallsupplier", { data: params });
}

/** 供应商 - 新建账号 */
export function addSupplierCount(params) {
  return http.request("post", "/sup/supplier/createsupplieruser", { data: params });
}

/** 供应商 - 入库清单 */
export function fetchInStoreList(params) {
  // delete params.date;
  return http.request("post", "/sup/inventorylist/selectinventorylist", { data: params });
}

/** 经营中心 - 产销存、订单对比表 */
export function fetchProdAndOrderList(params) {
  // delete params.date;
  return http.request("get", "/kingdee/soisstat", { params });
}
/** 经营中心 - 产销存统计 */
export function prodAndSaleList(params) {
  return http.request<any[]>("get", "/kingdee/inoutstockByMonth", { params });
}

/** 供应商 - 导出入库清单 */
export function exportInStoreList(params) {
  delete params.date;
  return http.request("post", "/sup/inventorylist/export", { data: params });
}

/** 供应商订单处理: 根据信息中心传过来的单据id,获取订单号, 查询列表 */
export function getSupOrderBillId(params) {
  return http.request<any>("get", "/sup/orderprocessing/geteditpagemessage", { params });
}

/** 供应商订单处理 - 查询列表 */
export function fetchSupOrderList(params) {
  // delete params.date;
  return http.request("post", "/sup/orderprocessing/selectprincipalorderprocessing", { data: params });
}

/** 供应商订单处理 - 订单下的物料列表 */
export function fetchSupMaterialList(data) {
  // delete params.date;
  return http.request("post", "/sup/orderprocessing/selectsubordinateorderprocessing", { data });
}

/** 供应商订单处理 - 导出订单 */
export function exportOrderList(params) {
  delete params.date;
  return http.request("post", "/sup/orderprocessing/export", { data: params });
}

/** 供应商订单处理 - 删除订单回签附件 */
export function delOrderAttr(params) {
  return http.request("post", "/sup/orderprocessing/deletefilebyid", { params });
}

/** 供应商订单处理 - 上传订单回签附件 */
export function uploadOrderAttr(data) {
  return http.request("post", "/sup/orderprocessing/insertuploadfile", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 供应商订单处理 - 上传订单回签附件前校验 */
export function getFileStatusBeforeUpload(data) {
  return http.request("get", "/sup/orderprocessing/getFileStatusByBillNo", { params: data });
}

/** 供应商订单处理 - 变更前校验 */
export function getFileNumBeforeChange(data) {
  return http.request("get", "/sup/orderprocessing/getfilenumbybillno", { params: data });
}

/** 供应商订单处理 - 变更 */
export function changePurchaseOrder(data) {
  return http.request("get", "/sup/orderprocessing/alteration", { params: data });
}

/** 供应商订单处理 - 查看回签附件 */
export function viewSignBackAttrList(data) {
  return http.request("post", "/sup/orderprocessing/selectallfile", { data });
}

/** 供应商订单处理 - 删除文件表格回签附件 */
export function deleteFileTableRow(data) {
  return http.request("post", "/sup/orderprocessing/deleteFileByIdAndFileName", { params: data });
}

/** 供应商订单处理 - 提交订单回签附件 */
export function submitOrderAttr(params) {
  return http.request("post", "/sup/orderprocessing/sumbile", { params });
}

/** 供应商财务信息- 查询列表 */
export function fetchFinInfoList(params) {
  return http.request("get", "/sup/fininformation/selectallbankbysup", { params });
}

/** 供应商财务信息- 国家列表 */
export function fetchCountryList(params) {
  return http.request("get", "/sup/fininformation/selectallcountry", { params });
}

/** 供应商财务信息- 修改记录 */
export function editFinInfo(params) {
  return http.request("post", "/sup/fininformation/updateSup", { data: params });
}

/** 供应商财务信息- 查询收款银行 */
export function fetchBankList(params) {
  return http.request("get", "/sup/fininformation/selectallbanktype", { params });
}

/** 供应商财务信息- 查询银行网点 */
export function fetchBankLocalList(params) {
  return http.request("get", "/sup/fininformation/selectallbankoutlets", { params });
}

/** 供应商财务信息- 新增 */
export function addFinanceInfo(params) {
  return http.request("post", "/sup/fininformation/insertSup", { data: params });
}

/** ========================= 对账单 ========================= */

/** 对账单- 列表 */
export function statementList(data) {
  return http.request<TablePagingResType<StatementItemType>>("post", "/sup/statement/select", { data });
}
export function deleteStatement(data) {
  return http.request<boolean>("post", "/sup/statement/deletefilebybillnoandfilename", { data });
}
/** 对账单- 详情列表 */
export function statementDetailList(data) {
  return http.request<StatementDetailItemType[]>("post", "/sup/statement/selectstatementdetailsbybillno", { data, headers: { hideLoading: true } });
}
/** 对账单- 供应商下拉列表 */
export function supplierListOptions() {
  return http.request<TablePagingResType<SupplierItemType>>("get", "/sup/statement/getsupplierlist");
}
/** 对账单- 提交对账单 */
export function submitStatement(data) {
  return http.request<boolean>("post", "/sup/statement/submitstatement", { data });
}
/** 对账单- 下载对账单 */
export function downloadStatement(params) {
  return http.request<any>("get", "/sup/statement/downloadstatement", { params }, { responseType: "blob" });
}
/** 对账单- 提交发票流程进入审批 */
export function submitInvoice(data) {
  return http.request<boolean>("post", "/sup/statement/submitstatementinvoicepdf", { data });
}
/** 对账单- 上传对账单pdf数据 */
export function uploadStatement(data) {
  return http.request<boolean>("post", "/sup/statement/uploadstatementpdf", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}
/** 对账单- 上传发票 */
export function uploadInvoice(data) {
  return http.request<boolean>("post", "/sup/statement/uploadstatementinvoicepdf", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}
/** 对账单- 查看文件列表 */
export function statementFileList(params) {
  return http.request<FileListItemType[]>("get", "/sup/statement/selectallfilebyfbillno", { params });
}
/** 对账单- 导出 */
export function exportStatement(data) {
  return http.request<string>("post", "/sup/statement/export", { data });
}
/** 对账单- 查看详情(单据详情) */
export function dtatementDetail(data) {
  return http.request<StatementDetailType>("post", "/sup/statement/getStatementView", { data });
}
