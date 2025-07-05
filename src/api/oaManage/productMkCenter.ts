import {
  CheckRecordItemType,
  DistributeOperateBookItemType,
  DistributeOperateBookResType,
  EsopManualResumeItemType,
  JobEngineeringItemType,
  MaterialChildItemType,
  MaterialItemType,
  OperateBookItemType,
  OperateBookStationItemType,
  PanasonicQrcodeItemType,
  PrintOperateBookStationResType,
  ProductLineItemType,
  ProductScheduleItemType,
  TabletManageItemType,
  ToolParamItemType
} from "./types/productMkCenter";

import { http } from "@/utils/http";

export type {
  ProductScheduleItemType,
  PanasonicQrcodeItemType,
  OperateBookItemType,
  OperateBookStationItemType,
  MaterialItemType,
  JobEngineeringItemType,
  CheckRecordItemType,
  ToolParamItemType,
  MaterialChildItemType,
  PrintOperateBookStationResType,
  TabletManageItemType,
  DistributeOperateBookResType,
  DistributeOperateBookItemType,
  ProductLineItemType,
  EsopManualResumeItemType
};

/** ========================= 采购部 ========================= */

/** 获取采购员数据列表 */
export function getPurchaseList(params) {
  return http.request("get", "/oa/mfg/pur/materialclasssetting/selecalltmaterialclasstree", { params });
}

/** 获取采购员下拉列表 */
export function getPurchaseOptionList(params) {
  return http.request("get", "/oa/mfg/pur/materialclasssetting/selectbuyerlist", { params });
}

/** 修改采购员 */
export function editPurchaseList(params) {
  return http.request("post", "/oa/mfg/pur/materialclasssetting/updateOperatorToMaterial", { data: params });
}

/** 导出采购员 */
export function exportPurchaseList(params) {
  return http.request("post", "/oa/mfg/pur/materialclasssetting/export", { data: params });
}

/** 超期订单分析列表数据 */
export function fetchOverDueOrder(params) {
  return http.request("post", "/oa/mfg/pur/OverdueOrderAnalysis/selectData", { params });
}

/** 超期订单分析列表数据导出 */
export function exportOverDueOrder(params) {
  return http.request("post", "/oa/mfg/pur/OverdueOrderAnalysis/export", { params });
}

/** 采购报表 获取交货及时率 */
export function getDeliveryRateData(params) {
  return http.request("get", "/oa/mfg/pur/POPunctualityrate/poPunctualityRaFte", { params });
}

/** 采购报表 获取成本降低率 */
export function getCostMinusRateData(params) {
  return http.request("get", "/oa/mfg/pur/purchaseanalysis/getpurchasecostdowninfo", { params }, { timeout: 300000 });
}

/** 品质报表 获取来料合格率 */
export function getQAInstoreRateData(params) {
  return http.request("get", "/oa/mfg/qa/inspectionbilldata/inspectionBillData", { params });
}

/** 供应商-新增 */
export function insertSupplierList(params) {
  return http.request("post", "/sup/supplierNew/insertSupplier", { data: params });
}

/** 供应商-删除 */
export function deleteSupplierList(params) {
  return http.request("delete", "/sup/supplierNew/deleteSupplier", { params });
}

/** 供应商-修改 */
export function updateSupplierList(params) {
  return http.request("put", "/sup/supplierNew/updateSupplier", { data: params });
}

/** 供应商-分页查询 */
export function fetchSupplierList(params) {
  return http.request("post", "/sup/supplierNew/searchSupplier", { data: params });
}

/** 供应商-分组查询 */
export function fetchSupplierGroupList(params) {
  return http.request("post", "/sup/supplierGroup/searchSupplierGroup", { data: params });
}

/** 供应商-分组新增 */
export function insertSupplierGroupList(params) {
  return http.request("post", "/sup/supplierGroup/insertSupplierGroup", { data: params });
}

/** 供应商-分组修改 */
export function updateSupplierGroupList(params) {
  return http.request("put", "/sup/supplierGroup/updateSupplierGroup", { data: params });
}

/** 供应商-分组删除 */
export function deleteSupplierGroupList(params) {
  return http.request("delete", "/sup/supplierGroup/deleteSupplierGroup", { params });
}

/** 供应商-导出 */
export function exportSupplierList(params) {
  return http.request("post", "/sup/supplierNew/exportSupplier", { data: params });
}

/** ========================= 物控部 ========================= */

/** 物控部 排产齐套明细列表查询 */
export function fetchProductDetailList(params) {
  return http.request("post", "/oa/mfg/mc/productioncompletesetrate/query", { data: params });
}

/** 物控部 排产齐套明细列表导出 */
export function exportProductDetailList(params) {
  return http.request("post", "/oa/mfg/mc/productioncompletesetrate/export", { data: params });
}

/** 品质报表 获取QA抽检合格率 */
export function getQACheckRateData(params) {
  return http.request("get", "/oa/mfg/qa/inspectionbill/inspectionBill", { params });
}

/** 材料库存金额 查询图表的数据 */
export function getMaterialStockAmountData(params) {
  return http.request("get", "/oa/mfg/mc/materialstockamount/materialstockamountdata", { params });
}

/** 材料库存金额 查询生产计划达成率图表的数据 */
export function getProductPlanRateData(params) {
  return http.request("get", "/oa/mfg/mc/planrate/planratedata", { params });
}
/** 生产排产 - 查询列表  */
export function productScheduleList(data) {
  return http.request<ProductScheduleItemType[]>("post", "/oa/mfg/mc/ProductionScheduling/select", { data });
}
/** 生产排产 - 导入  */
export function importProroductSchedule(data) {
  return http.request<boolean>("post", "/oa/mfg/mc/ProductionScheduling/uploadFileInsert", { data, headers: { "Content-Type": "multipart/form-data" } });
}
/** 生产排产 - 保存  */
export function saveProroductSchedule(data) {
  return http.request<boolean>("put", "/oa/mfg/mc/ProductionScheduling/update", { data });
}
/** 生产排产 - 删除  */
export function deleteProroductSchedule(data) {
  return http.request<boolean>("delete", "/oa/mfg/mc/ProductionScheduling/delete", { data });
}
/** 生产排产 - 获取可编辑权限  */
export function getProroductScheduleEditAuth() {
  return http.request<string>("get", "/oa/mfg/mc/ProductionScheduling/batchEdit", { headers: { hideLoading: true } });
}

/** 生产欠料 - 查询  */
export function fetchOweMaterialList(data) {
  return http.request("post", "/oa/mfg/mc/productshortofmaterial/select", { data });
}

/** 生产欠料 - 导出  */
export function exportOweMaterialList(data) {
  return http.request("post", "/oa/mfg/mc/productshortofmaterial/export", { data });
}

/** ========================= 生产部 ========================= */

/** 单机成本 查询图表的数据 */
export function getSingleCostChartData(params) {
  return http.request("get", "/oa/mfg/prod/unitcost/unitcostdata", { params });
}

/** 生产效率 查询图表的数据 */
export function getProductivityChartData(params) {
  return http.request("get", "/oa/mfg/prod/productionefficiencydata/productionefficiencydata", { params });
}

/** 生产部 生产日报表 */
export function getProductDayBI(params) {
  return http.request("post", "/oa/mfg/prod/productiondailyreport/productiondailyreport", { data: params });
}

/** 生产部 导出生产日报表 */
export function exportProductDayBI(params) {
  return http.request("post", "/oa/mfg/prod/productiondailyreport/export", { data: params });
}

/** 生产计划达成率 查询图表的数据 */
export function getProductPlanRateChartData(params) {
  return http.request("get", "/oa/mfg/prod/productionplanpunctuallyrate/ProductionPlanPunctuallyRateData", { params });
}

/** 生产入库统计 查询图表的数据 */
export function getProductInstoreTotalChartData(params) {
  return http.request("get", "/oa/mfg/prod/productioninstockdetail/productioninstockdetail", { params });
}

/** 每日单机成本监控 查询图表的数据 */
export function getDayCostSingleChartData(params) {
  return http.request("get", "/oa/mfg/prod/dailyunitcostData/dailyunitcostdata", { params });
}

/** 每日单机成本监控 查询工作日历的数据 */
export function getWorkDateData(params) {
  return http.request("get", "/oa/hr/holidaySetting/holidaysettingdata", { params });
}

/** 产品直通率 查询图表的数据 */
export function getThroughRateChartData(params) {
  return http.request("get", "/oa/mfg/prod/productstraight/productstraightdata", { params });
}

/** 标准成本与实际成本对比 查询图表的数据 */
export function getStandAndActChartData(params) {
  return http.request("get", "/oa/mfg/prod/dailycostcomparison/dailycostcomparisondata", { params });
}

/** ========================= 松下二维码 ========================= */

/** 列表 */
export function getPanasonicQrcodeList(data) {
  return http.request<PanasonicQrcodeItemType[]>("post", "/oa/hr/PanasonicQrcode/selectQRProduct", { data });
}
/** 新增 */
export function addPanasonicQrcode(data) {
  return http.request<boolean>("post", "/oa/hr/PanasonicQrcode/insertQRProduct", { data });
}
/** 修改 */
export function updatePanasonicQrcode(data) {
  return http.request<boolean>("post", "/oa/hr/PanasonicQrcode/updateQRProduct", { data });
}
/** 删除 */
export function deletePanasonicQrcode(params) {
  return http.request<boolean>("post", "/oa/hr/PanasonicQrcode/deleteQRProduct", { params });
}

/** ========================= 作业指导书 ========================= */

/** 列表 */
export function EsopList(data) {
  return http.request<TablePagingResType<OperateBookItemType>>("post", "/oa/mfg/eng/ESOPManual/selectManualAll", { data, headers: { hideLoading: true } });
}
/** 新增 */
export function addEsop(data) {
  return http.request<boolean>("post", "/oa/mfg/eng/ESOPManual/insert", { data });
}
/** 修改 */
export function updateEsop(data) {
  return http.request<boolean>("post", "/oa/mfg/eng/ESOPManual/update", { data });
}
/** 删除 */
export function deleteEsop(data) {
  return http.request<boolean>("post", "/oa/mfg/eng/ESOPManual/delete", { data });
}
/** 分发-获取工位关联列表 */
export function distributeEsop(data) {
  return http.request<DistributeOperateBookResType>("post", "/oa/mfg/eng/ManualDistribute/selectConfiguration", { data, headers: { hideLoading: true } });
}
/** 分发-保存(新增/修改) */
export function updateEsopDistribute(data) {
  return http.request<boolean>("post", "/oa/mfg/eng/ManualDistribute/insertOrUpdate", { data });
}
/** 分发 */
export function submitEsopDistribute(params) {
  return http.request<boolean>("get", "/oa/mfg/eng/ManualDistribute/distribute", { params });
}
/** 变更 */
export function changeESOP(params) {
  return http.request<boolean>("get", "/oa/mfg/eng/ESOPManual/changeESOP", { params });
}

// ==== 详情 ====

/** 作业指导书工位列表 */
export function esopStationList(params) {
  return http.request<OperateBookStationItemType[]>("post", "/oa/mfg/eng/ESOPManual/selectManualDetail", { params });
}
/** 添加工位 */
export function addEsopStation(data) {
  return http.request<boolean>("post", "/oa/mfg/eng/ESOPManual/insertDetail", { data, headers: { "Content-Type": "multipart/form-data" } });
}
/** 修改工位 */
export function updateEsopStation(data) {
  return http.request<boolean>("post", "/oa/mfg/eng/ESOPManual/updateDetail", { data, headers: { "Content-Type": "multipart/form-data" } });
}
/** 工位排序 */
export function sortEsopStation(data) {
  return http.request<boolean>("post", "/oa/mfg/eng/ESOPManual/updateOrSaveWorkStation", { data });
}
/** 删除工位 */
export function deleteEsopStation(params) {
  return http.request<boolean>("delete", "/oa/mfg/eng/ESOPManual/deleteDetail", { params });
}
/** 物料表: 获取物料列表 */
export function getMaterialChildList(params) {
  return http.request<MaterialChildItemType[]>("get", "/oa/mfg/eng/ESOPManual/getChildrenMaterial", { params });
}
/** 打印指导书列表数据 */
export function printEsopStation(params) {
  return http.request<PrintOperateBookStationResType>("get", "/oa/mfg/eng/ESOPManual/printingManualAll", { params });
}

/** ========================= 平板管理 ========================= */

/** 列表 */
export function tabletManageList(data) {
  return http.request<TablePagingResType<TabletManageItemType>>("post", "/oa/mfg/eng/TabletsManagement/selectTablets", { data });
}
/** 新增 */
export function addTabletManage(data) {
  return http.request<boolean>("post", "/oa/mfg/eng/TabletsManagement/insertTablets", { data });
}
/** 修改 */
export function updateTabletManage(data) {
  return http.request<boolean>("post", "/oa/mfg/eng/TabletsManagement/updateTablets", { data });
}
/** 删除 */
export function deleteTabletManage(params) {
  return http.request<boolean>("delete", "/oa/mfg/eng/TabletsManagement/deleteTablets", { params });
}
/** 导出 */
export function exportTabletManage(data) {
  return http.request<string>("post", "/oa/mfg/eng/TabletsManagement/export", { data });
}

/** ========================= 生产线 ========================= */

/** 列表 */
export function productLineList(data) {
  return http.request<ProductLineItemType[]>("get", "/oa/mfg/eng/ManualDistribute/getProductionLineManual", { data });
}

/** 客诉台账查询 */
export function selectCustomerComplaintList(data) {
  return http.request("post", "/oa/mk/customercomplaints/select", { data });
}

/** 客诉台账导入 */
export function importCustomerComplaintList(data) {
  return http.request("post", "/oa/mk/customercomplaints/importbyexcel", { data, headers: { "Content-Type": "multipart/form-data" } });
}

/** 生产标准——导出 */
export function exportProductStandard(data) {
  return http.request("post", "/oa/mfg/eng/productionStandard/export", { data });
}

/** 生产标准——查询 */
export function fetchProductStandard(data) {
  return http.request("post", "/oa/mfg/eng/productionStandard/selectProductionStandard", { data });
}

/** 生产标准——修改 */
export function updateProductStandard(data) {
  return http.request("put", "/oa/mfg/eng/productionStandard/updateProductionStandard", { data });
}

/** 生产标准——导入 */
export function importProductStandard(data) {
  return http.request("post", "/oa/mfg/eng/productionStandard/uploadProductionStandard", { data, headers: { "Content-Type": "multipart/form-data" } });
}

/** 产线——查询 */
export function fetchProductLineList(data) {
  return http.request("post", "/oa/mfg/prod/productionLine/select", { data });
}

/** 产线——新增 */
export function insertProductLineList(data) {
  return http.request("post", "/oa/mfg/prod/productionLine/insert", { data });
}

/** 产线——修改 */
export function updateProductLineList(data) {
  return http.request("put", "/oa/mfg/prod/productionLine/update", { data });
}

/** 产线——删除 */
export function deleteProductLineList(data) {
  return http.request("delete", "/oa/mfg/prod/productionLine/delete", { params: data });
}

/** 产线——导出 */
export function exportProductLineList(data) {
  return http.request("post", "/oa/mfg/prod/productionLine/export", { data });
}
