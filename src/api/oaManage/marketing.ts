import {
  AchievementStatisticsItemType,
  AchievementStatisticsOptionType,
  AchievementStatisticsPeopleItemType,
  AreaRatioItemType,
  AreaRatioResType,
  ComplaintTypeItemType,
  CustomerComplaintDtailListItemType,
  CustomerComplaintItemType,
  CustomerComplaintOptionType,
  CustomerManageItemType,
  CustomerOptionDataType,
  CustomerRankingOptionType,
  CustomerRatioItemType,
  CustomerRatioResType,
  CustomerSummaryItemType,
  CustomerTrendItemType,
  DonateRecordItemType,
  DonateRecordOptionType,
  MaterialRatioSummaryItemType,
  OutboundSummaryItemType,
  ProductRatioItemType,
  ProductRatioResType,
  SaleNumberSummaryOptionType,
  SaleStatisticsItemType,
  SaleStatisticsOptionType,
  SeleRateItemType
} from "./types/marketing";

import { http } from "@/utils/http";

export type {
  CustomerComplaintItemType,
  CustomerComplaintDtailListItemType,
  CustomerManageItemType,
  SeleRateItemType,
  CustomerRatioResType,
  CustomerRatioItemType,
  AreaRatioResType,
  AreaRatioItemType,
  ProductRatioResType,
  ProductRatioItemType,
  CustomerTrendItemType,
  SaleStatisticsItemType,
  AchievementStatisticsItemType,
  AchievementStatisticsPeopleItemType,
  DonateRecordItemType,
  CustomerSummaryItemType,
  OutboundSummaryItemType,
  MaterialRatioSummaryItemType,
  CustomerComplaintOptionType,
  ComplaintTypeItemType,
  AchievementStatisticsOptionType,
  SaleStatisticsOptionType,
  DonateRecordOptionType,
  CustomerOptionDataType,
  CustomerRankingOptionType,
  SaleNumberSummaryOptionType
};

/** ========================= 客户投诉(OA管理:市场营销中心) ========================= */

/** 获取客户投诉列表 */
export function customerComplaint(data) {
  return http.request<TablePagingResType<CustomerComplaintItemType>>("post", "/oa/mk/customercomplaint/select", { data });
}

/** 获取客户投诉详情 */
export function customerComplaintDetail(params) {
  return http.request<CustomerComplaintItemType>("get", "/oa/mk/customercomplaint/selectbyedit", { params });
}

/** 新增 */
export function addBill(data) {
  return http.request<boolean>("post", "/oa/mk/customercomplaint/insert", { data });
}

/** 修改 */
export function updateBill(data) {
  return http.request<boolean>("post", "/oa/mk/customercomplaint/update", { data });
}
/** 提交单据 */
export function submitEditBill(data) {
  return http.request<boolean>("post", "/oa/mk/customercomplaint/marketsubmit", { data });
}

/** 删除 */
export function deleteBill(params) {
  return http.request<boolean>("get", "/oa/mk/customercomplaint/delete", { params });
}
/** 接收 */
export function acceptBill(params) {
  return http.request<boolean>("get", "/oa/mk/customercomplaint/accept", { params });
}
/** 回复 */
export function replyBill(data) {
  return http.request<boolean>("post", "/oa/mk/customercomplaint/reply", { data });
}
/** 提交 */
export function submitBill(params) {
  return http.request<boolean>("post", "/oa/mk/customercomplaint/submit", { params });
}
/** 导出 */
export function exportBill(data) {
  return http.request<string>("post", "/oa/mk/customercomplaint/export", { data });
}
/** 撤回单据 */
export function withdrawBill(params) {
  return http.request<boolean>("get", "/oa/mk/customercomplaint/withdraw", { params });
}
/** 退回单据 */
export function backBill(params) {
  return http.request<boolean>("get", "/oa/mk/customercomplaint/back", { params });
}
/** 作废 */
export function discardBill(data) {
  return http.request<boolean>("post", "/oa/mk/customercomplaint/invalidate", { data });
}

/** ========================= 客户管理(OA管理:市场营销中心) ========================= */

/** 客户关系管理: 客户管理列表 */
export function customerManageList(data) {
  return http.request<CustomerManageItemType[]>("post", "/oa/mk/customermanager/selectAllDatasByParam", { data });
}
/** 客户关系管理: 添加客户 */
export function addCustomer(data) {
  return http.request<boolean>("post", "/oa/mk/customermanager/insertcustomer", { data });
}
/** 客户关系管理: 修改客户 */
export function updateCustomer(data) {
  return http.request<boolean>("post", "/oa/mk/customermanager/updatecustomer", { data });
}
/** 客户关系管理: 删除客户 */
export function deleteCustomer(id) {
  return http.request<number>("get", `/oa/mk/customermanager/deleteCustomerById?id=${id}`);
}
/** 客户关系管理: 导出 */
export function exportCustomer(data) {
  return http.request<string>("post", "/oa/mk/customermanager/export", { data });
}
/** ================= 市场报表 =================  */
/** 新增订单统计: 列表 */
export function addOrderList(data) {
  return http.request<Array<any>>("post", "/oa/mk/salesorderstatistics/SalesOrderStatisticsData", { data });
}
/** 新增订单统计: 导出 */
export function exportOrderStatistics(data) {
  return http.request<string>("post", "/oa/mk/salesorderstatistics/export", { data });
}
/** 销售出库统计: 列表 */
export function outBoundList(data) {
  return http.request<Array<any>>("post", "/oa/mk/saleoutstockdetaildata/SaleOutStockDetailData", { data });
}
/** 销售出库统计: 导出 */
export function exportOutBound(data) {
  return http.request<string>("post", "/oa/mk/saleoutstockdetaildata/export", { data });
}
/** 销售达成率: 列表 */
export function saleRatedList(data) {
  return http.request<SeleRateItemType[]>("get", "/oa/mk/saleokrate/saleokratedata", { params: data });
}
/** 销售达成率: 导出 */
export function exportSaleRated(data) {
  return http.request<string>("post", "/oa/mk/saleokrate/export", { data });
}
/** 交付及时率: 列表 */
export function deliverRateList(data) {
  return http.request<Array<any>>("post", "/oa/mk/saleorderdelivery/SaleOrderDeliveryData", { data });
}
/** 交付及时率: 导出 */
export function exportDeliverRate(data) {
  return http.request<string>("post", "/oa/mk/saleorderdelivery/export", { data });
}

/** 客户占比: 列表 */
export function customerRatioList(data) {
  return http.request<CustomerRatioResType>("get", "/oa/mk/customerproportion/customerproportionData", { params: data });
}
/** 地区占比: 列表 */
export function areaRatioList(data) {
  return http.request<AreaRatioResType>("get", "/oa/mk/regionproportion/regionproportionDate", { params: data });
}

/** 产品类别占比: 列表 */
export function productRatioList(data) {
  return http.request<ProductRatioResType>("get", "/oa/mk/productproportion/productproportionData", { params: data });
}

/** 客户趋势: 列表 */
export function customerTrendList(params) {
  return http.request<CustomerTrendItemType[]>("get", "/oa/mk/customertrend/GetCustomer", { params });
}
/** 客户趋势: 统计列表 */
export function customerTrendChartList(params) {
  return http.request<Array<any>>("get", "/oa/mk/customertrend/GetCustomerTrend", { params });
}
/** 客户趋势: 导出 */
export function exportCustomerTrend(data) {
  return http.request<string>("post", "/oa/mk/customertrend/export", { data });
}

/** 销售统计: 列表 */
export function saleStatisticsList(data) {
  return http.request<SaleStatisticsItemType[]>("post", "/oa/mk/salestatistics/select", { data });
}
/** 销售统计: 导出 */
export function exportSaleStatistics(data) {
  return http.request<string>("post", "/oa/mk/salestatistics/export", { data });
}
/** 销售统计: 下拉框数据列表 */
export function saleStatisticsOptionList() {
  return http.request<SaleStatisticsOptionType>("get", "/oa/mk/salestatistics/getPageMessage");
}

/** 业绩统计: 列表 */
export function achievementStatisticsList(data) {
  return http.request<AchievementStatisticsItemType[]>("post", "/oa/mk/performancestatistics/select", { data });
}
/** 业绩统计业务员: 列表 */
export function achievementStatisticsPeopleList(data) {
  return http.request<AchievementStatisticsPeopleItemType[]>("post", "/oa/mk/performancestatistics/peopleperformance", { data });
}
/** 业绩统计: 导出 */
export function exportAchievementStatistics(data) {
  return http.request<string>("post", "/oa/mk/performancestatistics/export", { data });
}
/** 业绩统计: 下拉框数据列表 */
export function achievementStatisticsOptionList() {
  return http.request<AchievementStatisticsOptionType>("get", "/oa/mk/performancestatistics/getpagemessage");
}

/** 销售数量汇总: 列表 */
export function saleNumberSummaryList(data) {
  return http.request<Array<any>>("post", "/oa/mk/salecollect/getsalecollectnumberbysalemanager", { data });
}
/** 销售数量汇总: 导出 */
export function exportSaleNumberSummary(data) {
  return http.request<string>("post", "/oa/mk/salecollect/exportSaleNumber", { data });
}
/** 销售数量汇总: 下拉框数据列表 */
export function saleNumberSummaryOptionList() {
  return http.request<SaleNumberSummaryOptionType>("get", "/oa/mk/salecollect/getpagemessage");
}

/** 销售业绩汇总: 列表 */
export function saleAchievementSummaryList(data) {
  return http.request<Array<any>>("post", "/oa/mk/salecollect/getsalecollectperformancebysalemanager", { data });
}
/** 销售业绩汇总: 导出 */
export function exportSaleAchievementSummary(data) {
  return http.request<string>("post", "/oa/mk/salecollect/exportSalePerformance", { data });
}

/** 赠送记录: 列表 */
export function donateRecordList(data) {
  return http.request<DonateRecordItemType[]>("post", "/oa/mk/presentrecord/getpresentrecorddatas", { data });
}
/** 赠送记录: 导出 */
export function exportDonateRecord(data) {
  return http.request<string>("post", "/oa/mk/presentrecord/export", { data });
}
/** 赠送记录: 下拉框数据 */
export function donateRecordOptionList() {
  return http.request<DonateRecordOptionType>("get", "/oa/mk/presentrecord/getpagemessage");
}

/** 客户排名: 客户汇总数列表 */
export function customerSummaryList(data) {
  return http.request<CustomerSummaryItemType[]>("post", "/oa/mk/customerrank/getcustomersumdatas", { data });
}
/** 客户排名: 客户汇总数列表 - 导出 */
export function exportCustomerSummary(data) {
  return http.request<string>("post", "/oa/mk/customerrank/exportsumcustomer", { data });
}
/** 客户排名: 出货记录列表 */
export function outboundSummaryList(data) {
  return http.request<OutboundSummaryItemType[]>("post", "/oa/mk/customerrank/getdeliveryrecordbycustomer", { data });
}
/** 客户排名: 出货记录列表 - 导出 */
export function exportOutboundSummary(data) {
  return http.request<string>("post", "/oa/mk/customerrank/exportcustomerdetailrecord", { data });
}
/** 客户排名: 物料占比列表 */
export function materialRatioSummaryList(data) {
  return http.request<MaterialRatioSummaryItemType[]>("post", "/oa/mk/customerrank/getfnumbercountandproportion", { data });
}
/** 客户排名: 物料占比列表 - 导出 */
export function exportMaterialRatioSummary(data) {
  return http.request<string>("post", "/oa/mk/customerrank/exportfnumbercountandproportion", { data });
}
/** 客户排名: 下拉框数据类别 */
export function customerRankingOptionList() {
  return http.request<CustomerRankingOptionType>("get", "/oa/mk/customerrank/getpagemessage");
}
/** 销售报价申请: 新增 */
export function insertSaleQuotation(data) {
  return http.request("post", "/oa/mk/quotationApplication/insert", { data });
}
/** 销售报价申请: 查询 */
export function fetchSaleQuotationList(data) {
  return http.request("post", "/oa/mk/quotationApplication/getmasterdatalist", { data });
}
/** 销售报价申请: 删除 */
export function deleteSaleQuotationList(data) {
  return http.request("post", "/oa/mk/quotationApplication/deletequotationapplicationbyid", { params: data });
}
/** 销售报价申请: 修改 */
export function updateSaleQuotationList(data) {
  return http.request("post", "/oa/mk/quotationApplication/updatemasterdatabyid", { data });
}
/** 销售报价申请: 根据id查询 */
export function findByIdSaleQuotationList(data) {
  return http.request("post", "/oa/mk/quotationApplication/getquotationapplicationvodetailsbyid", { data });
}
