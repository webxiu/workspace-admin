import { MoldApplyItemType, MoldFileItemType, ProductClassifyManageItemType } from "./types";

import { http } from "@/utils/http";

export type { ProductClassifyManageItemType, MoldApplyItemType, MoldFileItemType };

/** ========================= PLM ========================= */
/** 基础数据 -  查询物料列表 */
export function fetchMaterialList(params) {
  delete params.date;
  return http.request("post", "/plm/bd/material/select", { data: params });
}

/** 基础数据 -  导出物料列表 */
export function exportMaterialList(params) {
  delete params.date;
  return http.request("post", "/plm/bd/material/export", { data: params });
}

/** 基础数据 -  查询下拉选项列表 */
export function fetchSelectList(params) {
  return http.request("post", "/sys/sys/optionlist/select", { data: params });
}

/** 基础数据 -  新增编辑物料上传图片 */
export function uploadMaterialImg(params) {
  return http.request("post", "/plm/bd/material/uploadimage", { data: params }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 基础数据 -  新增物料 */
export function addMaterialInfo(params) {
  return http.request("post", "/plm/bd/material/insert", { data: params });
}

/** 基础数据 -  物料分组 */
export function getMaterialGroupTreeData(params) {
  return http.request("post", "/plm/bd/materialgroup/GetMaterialGroupTreeData", { data: params });
}

/** 基础数据 -  更新物料 */
export function updateMaterialInfo(params) {
  return http.request("post", "/plm/bd/material/update", { data: params });
}

/** 基础数据 -  提交物料 */
export function submitMaterialInfo(params) {
  return http.request("post", "/plm/bd/material/submit", { params });
}

/** 基础数据 -  回退物料 */
export function backMaterialInfo(params) {
  return http.request("post", "/plm/bd/material/back", { params });
}

/** 基础数据 -  下推物料 */
export function pushDownMaterialInfo(params) {
  return http.request("post", "/plm/bd/material/pushdown", { params });
}

/** 基础数据 -  删除物料 */
export function delMaterialInfo(params) {
  return http.request("post", "/plm/bd/material/delete", { data: params });
}

/** 基础数据 -  冻结（禁用）物料 */
export function disabledMaterialInfo(params) {
  return http.request("post", "/plm/bd/material/disabled", { data: params });
}

/** 基础数据 -  启用物料 */
export function enableMaterialInfo(params) {
  return http.request("post", "/plm/bd/material/enable", { data: params });
}

/** 基础数据 -  物料履历 - 修改人列表查询 */
export function fetchEditUserList(params) {
  return http.request<any[]>("get", "/plm/bd/material/selectMaterialHistoryInfoList", { params });
}

/** 基础数据 -  物料履历 - 履历信息查询 */
export function fetchHistoryInfo(params) {
  return http.request("get", "/plm/bd/material/selectMaterialHistoryInfo", { params });
}

/** 基础数据 -  选择物料 */
export function selectMaterialInfo(params) {
  return http.request("post", "/plm/bd/material/selectmaterial", { data: params });
}

/** 基础数据 -  查询物料列表V2 */
export function selectMaterialV2List(params) {
  return http.request("post", "/plm/bd/material/selectv2", { data: params });
}

/** 基础数据 -  下推物料列表V2 */
export function pushDownMaterialV2List(params) {
  return http.request("post", "/plm/bd/material/pushdownv2", { params });
}

/** 基础数据 -  更新物料列表V2 */
export function updateMaterialV2List(params) {
  return http.request("post", "/plm/bd/material/updatematerialv2", { data: params });
}

/** 基础数据 -  库存查询 */
export function fetchStockList(params) {
  delete params.stockNoLineName;
  return http.request("post", "/plm/k3/k3api/selectinventory", { data: params });
}

/** 基础数据 -  库存查询 - 仓库列表 */
export function fetchSearchSelectStockList(params) {
  return http.request("get", "/plm/k3/k3api/SelectStock", { params });
}

/** 基础数据 -  库存导出 */
export function exportStockList(params) {
  delete params.stockNoLineName;
  return http.request("post", "/plm/k3/k3api/exportinventory", { data: params });
}

/** 基础数据 -  bom管理 - 左侧数据 */
export function fetchBomLeftTreeData(params) {
  return http.request("post", "/plm/bd/bomgroup/selectbomgrouptree", { data: params });
}

/** 基础数据 -  bom管理 - 增加左侧数据 */
export function addBomLeftTreeData(params) {
  return http.request("post", "/plm/bd/bomgroup/insertBomGroup", { data: params });
}

/** 基础数据 -  bom管理 - 修改左侧数据 */
export function editBomLeftTreeData(params) {
  return http.request("post", "/plm/bd/bomgroup/updateBomGroup", { data: params });
}

/** 基础数据 -  bom管理 - 删除左侧数据 */
export function delBomLeftTreeData(params) {
  return http.request("post", "/plm/bd/bomgroup/deleteBomGroup", { params });
}

/** 基础数据 -  bom管理 - 表格数据 */
export function fetchBomTableData(params) {
  return http.request("post", "/plm/bd/bominfo/select", { data: params });
}

/** 基础数据 -  bom管理 - 查询详情 */
export function fetchBomDetailData(params) {
  return http.request("get", "/plm/bd/bominfo/selectbyedit", { params });
}

/** 基础数据 -  bom管理 - 导出数据 */
export function exportBomTableData(params) {
  return http.request("post", "/plm/bd/bominfo/export", { data: params });
}

/** 基础数据 -  bom管理 - 导出工程BOM */
export function exportProjectBomTableData(params) {
  return http.request("post", "/plm/bd/bominfo/exportBomById", { params });
}

/** 基础数据 -  bom管理 - 打印 */
export function printBomTableData(params) {
  return http.request("post", "/plm/bd/bominfo/selectbyprint", { params });
}

/** 基础数据 -  bom管理 - 新增 */
export function insertBomTableData(params) {
  return http.request("post", "/plm/bd/bominfo/insert", { data: params });
}

/** 基础数据 -  bom管理 - 禁用 */
export function disabledBomData(params) {
  return http.request("post", "/plm/bd/bominfo/disabled", { params });
}

/** 基础数据 -  bom管理 - 反禁用 */
export function unDisabledBomData(params) {
  return http.request("post", "/plm/bd/bominfo/undisabled", { params });
}

/** 基础数据 -  bom管理 - 下推 */
export function pushDownBomData(params) {
  return http.request("post", "/plm/bd/bominfo/pushdown", { params });
}

/** 基础数据 -  bom管理 - 回退 */
export function backBomData(params) {
  return http.request("post", "/plm/bd/bominfo/back", { params });
}

/** 基础数据 -  bom管理 - 提交 */
export function submitBomData(params) {
  return http.request("post", "/plm/bd/bominfo/submit", { params });
}

/** 基础数据 -  bom管理 - 修改 */
export function updateBomTableData(params) {
  return http.request("post", "/plm/bd/bominfo/update", { data: params });
}

/** 基础数据 -  bom管理 - 删除 */
export function delBomTableData(params) {
  return http.request("post", "/plm/bd/bominfo/delete", { params });
}

/** 基础数据 -  bom管理 - bom履历 */
export function bomHistoryTableData(params) {
  return http.request("post", "/plm/bd/bominfo/selectbomhistoryinfoentry", { params });
}

/** 基础数据 -  bom管理 - bom子项列表 */
export function bomHistoryListByBomId(params) {
  return http.request("get", "/plm/bd/bominfo/selectbomhistorybominfoentry", { params });
}

/** 基础数据 -  bom制造BOM正查 - 查询列表 */
export function fetchBomFrontTableData(params) {
  return http.request("post", "/plm/k3/k3api/selectbom", { params });
}

/** 基础数据 -  bom制造BOM反查 - 查询列表 */
export function fetchBomBackTableData(params) {
  return http.request("post", "/plm/k3/k3api/peggingbompage", { params });
}

/** 基础数据 -  bom制造BOM反查 - 导出列表 */
export function exportBomBackTableData(params) {
  return http.request("post", "/plm/k3/k3api/exportpeggingbom", { data: params });
}

/** 基础数据 -  bom制造BOM正查 - 导出列表 */
export function exportBomFrontTableData(params) {
  return http.request("post", "/plm/k3/k3api/exportselectbom", { data: params });
}

/** 基础数据 -  物料分组属性保存 */
export function saveMaterialGroupAttr(params) {
  return http.request("post", "/plm/bd/MaterialGroupProperty/batchSaveOrUpdate", { data: params });
}

/** 基础数据 -  物料分组属性列表查询 */
export function fetchMaterialGroupAttr(params) {
  return http.request("post", "/plm/bd/MaterialGroupProperty/selectGroupProperty", { data: params });
}

/** 基础数据 -  物料分组属性列表删除 */
export function deleteMaterialGroupAttr(params) {
  return http.request("delete", "/plm/bd/MaterialGroupProperty/batchDelete", { data: params });
}

/** 项目管理 -  产品分类管理 - 查询列表 */
export function productClassifyManageList(params) {
  return http.request<ProductClassifyManageItemType[]>("post", "/plm/pm/productcategory/select", { data: params });
}

/** 项目管理 -  产品库 - 查询列表 */
export function fetchProductStoreList(params) {
  return http.request("post", "/plm/pm/productinfo/getproductinfolist", { data: params });
}

/** 项目管理 -  产品库 - 删除列表 */
export function deleteProductStoreList(params) {
  return http.request("post", "/plm/pm/productinfo/deleteProduct", { data: params });
}

/** 项目管理 -  产品库 - 修改列表 */
export function updateProductStoreList(params) {
  return http.request("post", "/plm/pm/productinfo/updateproduct", { data: params }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 项目管理 -  产品库 - 新增列表 */
export function insertProductStoreList(params) {
  return http.request("post", "/plm/pm/productinfo/insertproduct", { data: params }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 项目管理 -  产品分类管理 - 导出列表 */
export function exportClassifyTableData(params) {
  return http.request("post", "/plm/pm/productcategory/export", { data: params });
}

/** 项目管理 -  产品分类管理 - 删除 */
export function deleteClassifyTableInfo(params) {
  return http.request("post", "/plm/pm/productcategory/delete", { params });
}

/** 项目管理 -  产品分类管理 - 插入 */
export function insertClassifyTableInfo(params) {
  return http.request("post", "/plm/pm/productcategory/insert", { data: params });
}

/** 项目管理 -  产品分类管理 - 修改 */
export function updateClassifyTableInfo(params) {
  return http.request("post", "/plm/pm/productcategory/update", { data: params });
}

/** 项目管理 -  产品开发模板 - 查询 */
export function fetchProductTemplateList(params) {
  return http.request("post", "/plm/pm/producttemplate/selectproducttemplatebyparam", { data: params });
}

/** 项目管理 -  产品开发模板 - 删除 */
export function deleteProductTemplate(params) {
  return http.request("post", "/plm/pm/producttemplate/deleteTemplateById", { data: params });
}

/** 项目管理 -  产品开发模板 - 新增 */
export function addProductTemplate(params) {
  return http.request("post", "/plm/pm/producttemplate/inserttemplate", { data: params });
}

/** 项目管理 -  产品开发模板 - 修改 */
export function editProductTemplate(params) {
  return http.request("post", "/plm/pm/producttemplate/updatetemplate", { data: params });
}

/** 项目管理 -  产品开发模板 - 查询详情 */
export function getProductTemplateDetailInfo(params) {
  return http.request("post", "/plm/pm/producttemplate/getedittemplatemessagebytemplateid", { data: params });
}

/** 项目管理 -  产品开发模板 - 查询可选类型列表 */
export function fetchSelectableTypeList(params) {
  return http.request("post", "/plm/pm/producttemplate/getUnselectedTypesForTreeTable", { params });
}

/** 项目管理 -  产品开发模板 - 查询已选类型列表 */
export function fetchSelectedTypeList(params) {
  return http.request("post", "/plm/pm/producttemplate/getSelectedTypesForTreeTable", { params });
}

/** 项目管理 -  产品开发模板 - 右移可选类型 */
export function toRightSelectableTypeList(params) {
  return http.request("post", "/plm/pm/producttemplate/inserttemplatetype", { data: params });
}

/** 项目管理 -  产品开发模板 - 左移已选类型 */
export function toLeftSelectedTypeList(params) {
  return http.request("post", "/plm/pm/producttemplate/deleteTypeForTreeTable", { data: params });
}

/** 项目管理 -  产品开发模板 - 根据已选类型获取配置项 */
export function getConfigListBySelectedType(params) {
  return http.request("post", "/plm/pm/producttemplate/gettypesettingbytemplateidandtypeid", { data: params });
}

/** 项目管理 -  产品开发模板 - 修改配置项 */
export function updateConfigBySelectedType(params) {
  return http.request("post", "/plm/pm/producttemplate/updatetypesettingbytemplateidandtypeid", { data: params });
}

/** 项目管理 -  节日设置 - 列表查询 */
export function fetchHolidayList(params) {
  return http.request("post", "/plm/pm/holiday/selectholiday", { data: params });
}

/** 项目管理 -  节日设置 - 新增 */
export function addHolidayList(params) {
  return http.request("post", "/plm/pm/holiday/insert", { data: params });
}

/** 项目管理 -  节日设置 - 修改 */
export function updateHolidayList(params) {
  return http.request("post", "/plm/pm/holiday/update", { data: params });
}

/** 项目管理 -  节日设置 - 删除 */
export function deleteHolidayList(params) {
  return http.request("post", "/plm/pm/holiday/delete", { params });
}

/** 项目管理 -  节日设置 - 右侧假日列表查询 */
export function getRightFreeDayList(params) {
  return http.request("post", "/plm/pm/holiday/selectholidayentry", { data: params });
}

/** 项目管理 -  节日设置 - 右侧假日删除 */
export function delRightFreeDayList(params) {
  return http.request("post", "/plm/pm/holiday/deleteentry", { params });
}

/** 项目管理 -  节日设置 - 右侧假新增 */
export function addRightFreeDayList(params) {
  delete params.dateArr;
  return http.request("post", "/plm/pm/holiday/insertentry", { data: params });
}

/** 项目管理 -  节日设置 - 右侧假修改 */
export function editRightFreeDayList(params) {
  delete params.dateArr;
  return http.request("post", "/plm/pm/holiday/updateentry", { data: params });
}

/** 项目管理 -  产品开发申请 - 列表查询 */
export function fetchProductsDevApplayList(params) {
  return http.request("post", "/plm/pm/productdev/getallproductdevbyparam", { data: params });
}

/** 项目管理 -  产品开发申请 - 模板查询 */
export function fetchProductsDevApplayTemplateList(params) {
  return http.request("post", "/plm/pm/productdev/getalltemplatebasemessage", { data: params });
}

/** 项目管理 -  产品开发申请 - 删除 */
export function deleteProductsDevApplayInfo(params) {
  return http.request("post", "/plm/pm/productdev/deleteproductdev", { data: params });
}
/** 项目管理 -  产品开发申请 - 提交 */
export function submitProductsDevApplayInfo(id) {
  return http.request("post", `/plm/pm/productdev/submitapprovalbyid/${id}`, {});
}

/** 项目管理 -  产品开发申请 - 新增 */
export function addProductsDevApplayInfo(data) {
  return http.request("post", `/plm/pm/productdev/insertdevsheet`, { data });
}

/** 项目管理 -  产品开发申请 - 查看 */
export function viewProductsDevApplayInfo(data) {
  return http.request("post", `/plm/pm/productdev/getdevsheetdatamessagebyid`, { data });
}

/** 项目管理 -  产品开发申请 - 上传 */
export function uploadProductsDevApplayImage(data) {
  return http.request(
    "post",
    `/plm/pm/productdev/uploadmultifile`,
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
}

/** 项目管理 -  产品开发申请 - 获取单据状态 */
export function getBillStateNameList(params) {
  return http.request("post", "/sys/sys/optionlist/select", { data: params });
}

/** 项目管理 -  交付物模板管理 - 列表分页查 */
export function getDeliveryTemplateList(params) {
  return http.request("post", "/plm/pm/deliverableinfo/select", { data: params });
}

/** 项目管理 -  交付物模板管理 - 右侧URL列表查询 */
export function getDeliveryRightURLList(params) {
  return http.request("post", "/plm/pm/deliverabletemplateentry/select", { data: params });
}

/** 项目管理 -  交付物模板管理 - 左侧数据列表导出 */
export function exportDeliveryTemplateList(params) {
  return http.request("post", "/plm/pm/deliverableinfo/export", { data: params });
}

/** 项目管理 -  交付物模板管理 - 左侧数据删除 */
export function deleteDeliveryInfo(params) {
  return http.request("post", "/plm/pm/deliverableinfo/delete", { params });
}

/** 项目管理 -  交付物模板管理 - 左侧数据新增 */
export function addDeliveryInfo(params) {
  return http.request("post", "/plm/pm/deliverableinfo/insert", { data: params });
}

/** 项目管理 -  交付物模板管理 - 左侧数据修改 */
export function editDeliveryInfo(params) {
  return http.request("post", "/plm/pm/deliverableinfo/update", { data: params });
}

/** 项目管理 -  产品开发类型库 - 左侧树形列表查询 */
export function fetchLeftTypeTreeList(params) {
  return http.request("post", "/plm/pm/producttype/getAllTypeForTable", { data: params });
}

/** 项目管理 -  产品开发类型库 - 右侧值列表查询 */
export function fetchRightValueList(params) {
  return http.request("post", "/plm/pm/producttype/gettypesettingbyparam", { data: params });
}

/** 项目管理 -  产品开发类型库 - 右侧值列表数据项删除 */
export function deletefetchRightValueInfo(params) {
  return http.request("post", "/plm/pm/producttype/deletetypevaluebyid", { data: params });
}

/** 项目管理 -  产品开发类型库 - 右侧值列表数据项新增 */
export function addFetchRightValueInfo(params) {
  return http.request("post", "/plm/pm/producttype/inserttypesetting", { data: params });
}

/** 项目管理 -  产品开发类型库 - 右侧值列表数据项统一保存 */
export function saveFetchRightValueInfo(params) {
  return http.request("post", "/plm/pm/producttype/updatev2", { data: params });
}

/** 项目管理 -  产品开发类型库 - 左侧所有类型获取 */
export function fetchGroupNameOptionList(params) {
  return http.request("post", "/plm/pm/producttype/getalltypegroupname", { data: params });
}

/** 项目管理 -  产品开发类型库 - 类型修改 */
export function updateProductDevTypeInfo(params) {
  return http.request("post", "/plm/pm/producttype/updatetype", { data: params });
}

/** 项目管理 -  产品开发类型库 - 类型新增 */
export function addProductDevTypeInfo(params) {
  return http.request("post", "/plm/pm/producttype/inserttype", { data: params });
}

/** 项目管理 -  项目模板 - 列表查询 */
export function fetchProjectTemplateList(params) {
  return http.request("post", "/plm/pm/projectmodel/selectProjectModelList", { data: params });
}

/** 项目管理 -  项目模板 - 分组查询 */
export function fetchProjectGroupList(params) {
  return http.request("get", "/plm/pm/projectmodel/selectGroup", { params });
}

/** 项目管理 -  项目模板 - 新增 */
export function insertProjectTemplateList(params) {
  return http.request("post", "/plm/pm/projectmodel/insert", { data: params });
}

/** 项目管理 -  项目模板 - 查询下拉阶段 */
export function fetchProjectSelectOpts(params) {
  return http.request("get", "/plm/pm/projectmodel/selectOptionList", { params });
}

/** 项目管理 -  项目模板 - 删除 */
export function deleteProjectTemplate(params) {
  return http.request("get", "/plm/pm/projectmodel/deleteProjectModel", { params });
}

/** 项目管理 - 项目模板 - 分组保存 */
export function saveProjectGroupTemplate(params) {
  return http.request("post", "/plm/pm/projectmodel/saveOrUpdateGroup", { data: params });
}

/** 项目管理 - 项目模板 - 分组删除 */
export function delProjectGroupTemplate(params) {
  return http.request("post", "/plm/pm/projectmodel/deleteTaskGroups", { data: params });
}

/** 项目管理 - 项目模板 - 任务删除 */
export function delProjectTaskInfo(params) {
  return http.request("post", "/plm/pm/projectmodel/deleteTask", { params });
}

/** 项目管理 - 项目模板 - 导出 */
export function exportProjectGroupTemplate(params) {
  return http.request("post", "/plm/pm/projectmodel/export", { data: params });
}

/** 项目管理 - 项目模板 - 分组任务查询 */
export function fetchProjectGroupTaskList(params) {
  return http.request("get", "/plm/pm/projectmodel/selectTaskList", { params });
}

/** 项目管理 - 项目模板 - 分组任务保存 */
export function saveProjectGroupTaskList(params) {
  return http.request("post", "/plm/pm/projectmodel/saveOrUpdateTask", { data: params });
}

/** 项目管理 - 项目模板 - 分组任务保存顺序 */
export function saveProjectGroupTaskListIndex(params) {
  return http.request("post", "/plm/pm/projectmodel/SaveSort", { data: params });
}

/** 项目管理 - 项目模板 - 模版分组保存顺序 */
export function saveProjectGroupListIndex(params) {
  return http.request("post", "/plm/pm/projectmodel/updategroupsort", { data: params });
}

/** 项目管理 - 项目模板 - 前置任务下拉列表查询 */
export function fetchProjectBeforeTaskOptionList(params) {
  return http.request("get", "/plm/pm/projectmodel/SelectTaskByModelId", { params });
}

/** 项目管理 - 项目管理修改 - 前置任务下拉列表查询 */
export function fetchEditProjectBeforeTaskOptionList(params) {
  return http.request("get", "/plm/pm/projectinfo/getTaskListByProjectId", { params });
}

/** 项目管理 - 项目任务交付物获取 */
export function fetchProjectTaskDelivers(params) {
  return http.request("get", "/plm/pm/projectinfo/getdeliverablefilelistbytaskid", { params });
}

/** 项目管理 - 根据billNo获取项目任务交付物数据 */
export function fetchProjectTaskDeliversByBillNo(params) {
  return http.request("get", "/plm/pm/projectinfo/getDeliverableDetailsByBillNo", { params });
}

/** 交付物变更 - 获取任务下的交付物文件 */
export function fetchTaskDeliverFiles(params) {
  return http.request("get", "/plm/pm/project/projectchange/getdeliverablefilelist", { params });
}

/** 项目管理 - 交付物变更列表查询 */
export function fetchProjectTaskDeliversChangeList(params) {
  return http.request("post", "/plm/pm/project/projectchange/select", { data: params });
}

/** 项目管理 - 新增交付物变更 */
export function addProjectTaskDeliversChange(data) {
  return http.request("post", "/plm/pm/project/projectchange/insert", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 项目管理 - 交付物变更详情 */
export function getProjectTaskDeliversChangeDetail(data) {
  return http.request("get", "/plm/pm/project/projectchange/getdetailsbymasterid", { params: data });
}

/** 项目管理 - 交付物变更文件列表查询 */
export function getProjectTaskDeliversChangeFileList(data) {
  return http.request("get", "/plm/pm/projectinfo/getgeneraltemplatedatabyid", { params: data });
}

/** 项目管理 - 提交交付物变更 */
export function submitProjectTaskDeliversChange(data) {
  return http.request("post", "/plm/pm/project/projectchange/submitchange", { data });
}

/** 项目管理 - 查询交付物变更 */
export function queryProjectTaskDeliversChange(data) {
  return http.request("get", "/plm/pm/project/projectchange/getdetailsbymasterid", { params: data });
}

/** 项目管理 -  产品开发申请表 - 查询模板对应的动态配置 */
export function fetchProjectTemplateConfigList(params) {
  return http.request("post", "/plm/pm/productdev/gettemplatealltypedatamessage", { data: params });
}

/** 实验室管理 - 测试报告管理 - 查询列表 */
export function fetchTestReportList(params) {
  return http.request("post", "/plm/lab/testreport/select", { data: params });
}

/** 实验室管理 - 测试报告管理 - 查询单个 */
export function fetchTestReportInfo(params) {
  return http.request("post", "/plm/lab/testreport/getTestReportById", { params });
}

/** 实验室管理 - 测试报告管理 - 删除列表 */
export function delTestReportList(params) {
  return http.request("get", "/plm/lab/testreport/deleteTestReport", { params });
}

/** 实验室管理 - 测试报告管理 - 提交 */
export function submitTestReport(params) {
  return http.request("get", "/plm/lab/testreport/submitTestReport", { params });
}

/** 实验室管理 - 测试报告管理 - 保存 */
export function saveTestReportList(params) {
  return http.request(
    "post",
    "/plm/lab/testreport/saveOrUpdateTestReport",
    { data: params },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
}

/** 实验室管理 - 测试报告管理 - 删除附件 */
export function delTestReportAttrList(params) {
  return http.request("delete", "/plm/lab/testreport/deleteFile", { params });
}

/** 项目管理 - 任务库 - 列表查询 */
export function fetchTaskStoreList(params) {
  return http.request("post", "/plm/pm/taskmodel/select", { data: params });
}

/** 项目管理 - 任务库 - 查询所有模板 */
export function fetchAllTemplateList(params) {
  return http.request("post", "/plm/pm/taskmodel/getDeliverable", { data: params });
}

/** 项目管理 - 任务库 - 新增 */
export function addTaskStoreList(params) {
  return http.request("post", "/plm/pm/taskmodel/saveTaskModel", { data: params });
}

/** 项目管理 - 任务库 - 右侧表格保存 */
export function saveRightTableList(params) {
  return http.request("post", "/plm/pm/taskmodel/saveOrUpdateDeliverable", { data: params });
}

/** 项目管理 - 任务库 - 修改 */
export function updateTaskStoreList(params) {
  return http.request("post", "/plm/pm/taskmodel/updateTaskModel", { data: params });
}

/** 项目管理 - 任务库 - 删除 */
export function delTaskStoreList(params) {
  return http.request("post", "/plm/pm/taskmodel/delteTaskModel", { params });
}

/** 项目管理 - 任务库 - 列表导出 */
export function exportTaskStoreList(params) {
  return http.request("post", "/plm/pm/taskmodel/export", { data: params });
}

/** 项目管理 - 项目管理 - 列表查询 */
export function fetchProjectMgmtList(params) {
  return http.request("post", "/plm/pm/projectinfo/selectProjectInfo", { data: params });
}

/** 项目管理 - 项目管理 - 新项目修改 */
export function updateProjectNewInfo(params) {
  return http.request("post", "/plm/pm/projectinfo/updateProjectV2", { data: params });
}

/** 项目管理 - 项目管理 - 导出 */
export function exportProjectManageList(params) {
  return http.request("post", "/plm/pm/projectinfo/export", { data: params });
}

/** 项目管理 - 项目管理 - 查询项目模板下拉 */
export function fetchProjectTemplateOpts(params) {
  return http.request("post", "/plm/pm/projectmodel/selectProjectModelList", { data: params });
}

/** 项目管理 - 项目管理 - 查询项目模板对应的负责人和相关人 */
export function fetchProjectTemplatePersons(params) {
  return http.request("get", "/plm/pm/projectinfo/selectmodelrolebyid", { params });
}

/** 项目管理 - 项目管理 - 列表删除 */
export function delProjectList(params) {
  return http.request("post", "/plm/pm/projectinfo/delete", { data: params });
}

/** 项目管理 - 项目管理 - 终止审批 */
export function finishedProjectInfo(params) {
  return http.request("post", "/plm/pm/projectinfo/sumbitfinishedproject", { data: params });
}

/** 项目管理 - 项目管理 - 暂停 */
export function stopProjectInfo(params) {
  return http.request("post", "/plm/pm/projectinfo/suspendproject", { data: params });
}

/** 项目管理 - 项目管理 - 恢复 */
export function restoreProjectInfo(params) {
  return http.request("post", "/plm/pm/projectinfo/activeproject", { data: params });
}

/** 项目管理 - 项目管理 - 列表提交 */
export function submitProjectList(params) {
  return http.request("post", "/plm/pm/projectinfo/submitProject", { params });
}

/** 项目管理 - 项目管理 - 列表回退 */
export function backProjectList(params) {
  return http.request("post", "/plm/pm/projectinfo/backProject", { params });
}

/** 项目管理 - 项目看板app数据获取 */
export function fetchProjectMgmtAppChartData(params) {
  return http.request("post", "/plm/pm/projectinfo/calccountprojectinfolist", { data: params });
}

/** 项目管理 - 项目管理 - 列表启动 */
export function startProjectList(params) {
  return http.request("post", "/plm/pm/projectinfo/startProject", { params });
}

/** 项目管理 - 项目管理 - 根据模板id查询项目任务 */
export function fetchProjectTaskListByModelId(params) {
  return http.request("get", "/plm/pm/projectmodel/selectModel", { params });
}

/** 项目管理 - 项目管理 - 负责人姓名部分数据下拉 */
export function fetchPersonNameProjectPartData(params) {
  return http.request("post", "/plm/pm/projectinfo/selectPrincipalSelectData", { data: params });
}

/** 项目管理 - 项目管理 - 负责人角色部分数据下拉 */
export function fetchPersonRoleProjectPartData(params) {
  return http.request("post", "/plm/pm/projectinfo/selectRoleDate", { data: params });
}

/** 项目管理 - 项目管理 - 列表保存 */
export function saveProjectMgmtList(params) {
  return http.request("post", "/plm/pm/projectinfo/saveOrUpdateProject", { data: params });
}

/** 项目管理 - 项目管理 - 根据项目id查询所有信息 */
export function fetchAllProjectMsgByProjectId(params) {
  return http.request("post", "/plm/pm/projectinfo/selectAllMessageById", { data: params });
}

/** 项目管理 - 项目管理 - 新增项目任务 */
export function insertProjectTask(params) {
  return http.request("post", "/plm/pm/projectinfo/saveProjectTask", { data: params });
}

/** 项目管理 - 项目管理 - 修改项目任务 */
export function updateProjectTask(params) {
  return http.request("post", "/plm/pm/projectinfo/updateProjectTask", { data: params });
}

/** 项目管理 - 项目管理 - 查询项目任务 */
export function fetchProjectTask(params) {
  return http.request("post", "/plm/pm/projectinfo/selectTasks", { data: params });
}

/** 项目管理 - 项目管理 - 删除项目任务 */
export function deleteProjectTask(params) {
  return http.request("post", "/plm/pm/projectinfo/deleteProjectTask", { data: params });
}

/** 项目管理 - 项目管理 - 排序项目任务 */
export function sortProjectTask(params) {
  return http.request("post", "/plm/pm/projectinfo/sortTask", { data: params });
}

/** 项目管理 - 项目管理 - 删除项目任务分组 */
export function deleteProjectTaskGroup(params) {
  return http.request("post", "/plm/pm/projectinfo/deleteTaskGroups", { data: params });
}

/** 项目管理 - 项目管理 - 保存项目任务分组 */
export function saveProjectTaskGroup(params) {
  return http.request("post", "/plm/pm/projectinfo/saveOrUpdateGroup", { data: params });
}

/** 项目管理 - 项目管理 - 新增项目任务交付物 */
export function saveProjectTaskDeliverableInfo(params) {
  return http.request("post", "/plm/pm/projectinfo/savetaskdeliverable", { data: params }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 项目管理 - 项目管理 - 修改项目任务交付物 */
export function updateProjectTaskDeliverableInfo(params) {
  return http.request("post", "/plm/pm/projectinfo/updatetaskdeliverable", { data: params }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 项目管理 - 项目管理 - 提交项目任务交付物 */
export function submitProjectTaskDeliverableInfo(params) {
  return http.request("post", "/plm/pm/projectinfo/submittaskdeliverable", { data: params });
}

/** 项目管理 - 项目管理 - 回退项目任务交付物 */
export function backProjectTaskDeliverableInfo(params) {
  return http.request("post", "/plm/pm/projectinfo/rollbackdeliverabletemplate", { params });
}

/** 项目管理 - 项目管理 - 撤销项目任务交付物 */
export function revokeProjectTaskDeliverableInfo(params) {
  return http.request("post", "/plm/pm/projectinfo/revocationdeliverabletemplate", { data: params });
}

/** 项目管理 - 交付物变更 - 删除交付物变更 */
export function deleteDeliveralbeChangeInfo(params) {
  return http.request("post", "/plm/pm/project/projectchange/deleteById", { data: params });
}

export interface OptionItemType {
  id: number;
  optionId: number;
  optionValue: string;
  optionName: string;
  reserve1: string;
  reserve2: string;
  displaySeq: number;
  kingdeeValue: string;
  title: string;
  optionCode: string;
}

export interface OptionResType {
  id: number;
  memo: string;
  optionName: string;
  optionCode: string;
  optionList: OptionItemType[];
}

/** 基础数据 - BOM管理 - 下拉选项统一获取接口 */
export function getBOMTableRowSelectOptions(params) {
  return http.request<OptionResType[]>("get", "/sys/sys/optioninfo/getOptionInfoList", { params, headers: { hideLoading: true } });
}

/** 基础数据 - 物料管理 - 物料图片删除接口 */
export function deleteMaterialPicture(params) {
  return http.request("get", "/plm/bd/material/deletepicture", { params });
}

/** 基础数据 - 项目管理批量查询项目负责人  */
export function fetchAllProjectUserList(params) {
  return http.request("post", "/sys/sys/userrole/selectUserByRoleIds", { data: params });
}

/** ========================= 模具管理 ========================= */

/** 开模申请 - 列表 */
export function moldApplyList(data) {
  return http.request<TablePagingResType<MoldApplyItemType>>("post", "/plm/plm/ModelOpening/selectModelOpening", { data });
}
/** 开模申请 - 新增 */
export function addMoldApply(data) {
  return http.request<boolean>("post", "/plm/plm/ModelOpening/insertModelOpening", { data, headers: { "Content-Type": "multipart/form-data" } });
}
/** 开模申请 - 编辑 */
export function editMoldApply(data) {
  return http.request<boolean>("put", "/plm/plm/ModelOpening/updateModelOpening", { data, headers: { "Content-Type": "multipart/form-data" } });
}
/** 开模申请 - 删除 */
export function deleteMoldApply(data) {
  return http.request<boolean>("delete", "/plm/plm/ModelOpening/deleteModelOpening", { data });
}
/** 开模申请 - 打印 */
export function printMoldApply(data) {
  return http.request<MoldApplyItemType>("post", "/plm/plm/ModelOpening/xxxx", { data });
}
