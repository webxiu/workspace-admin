import { ProjectClassifyItemType, TemplateDataItemType, TestProjectItemType, TestTemplateItemType } from "./types";

import { http } from "@/utils/http";

export type { ProjectClassifyItemType, TestProjectItemType, TestTemplateItemType, TemplateDataItemType };

/** ========================= 实验室管理 ========================= */
/** 测试项目 - 查询分类 */
export function fetchClassifyList() {
  return http.request<ProjectClassifyItemType[]>("post", "/plm/lab/testproject/selectTestProjectTypeList");
}

/** 测试项目 - 查询列表 */
export function fetchTestProjectList(params) {
  return http.request<TablePagingResType<TestProjectItemType>>("post", "/plm/lab/testproject/selectTestProjectList", {
    data: params,
    headers: { hideLoading: true }
  });
}

/** 测试项目 - 新增列表 */
export function addTestProjectList(params) {
  return http.request("post", "/plm/lab/testproject/saveOrUpdate", { data: params });
}

/** 测试项目 - 新增分组 */
export function addTestProjecGrouptList(params) {
  return http.request("post", "/plm/lab/testprojecttype/saveOrUpdate", { data: params });
}

/** 测试项目 - 删除列表 */
export function deleteTestProjectList(params) {
  return http.request("post", "/plm/lab/testproject/deleteTestProject", { params });
}

/** 测试项目 - 导出列表 */
export function exportTestProjectList(params) {
  return http.request("post", "/plm/lab/testproject/exportTestProject", { data: params });
}

/** 测试项目 - 删除分类 */
export function deleteTestProjectClassifyList(params) {
  return http.request("post", "/plm/lab/testprojecttype/delete", { data: params });
}

/** 测试申请 - 列表分页查询 */
export function fetchTestApplyList(params) {
  return http.request("post", "/plm/lab/testapply/selectTestApplyList", { data: params });
}

/** 测试申请 - 删除 */
export function deleteTestApply(params) {
  return http.request("post", "/plm/lab/testapply/delete", { data: params });
}

/** 测试申请 - 导出 */
export function exportTestApply(params) {
  return http.request("post", "/plm/lab/testapply/exportTestApply", { data: params });
}

/** 测试申请 - 提交 */
export function submitTestApply(params) {
  return http.request("get", "/plm/lab/testapply/submit", { params });
}

/** 测试申请 - 保存列表 */
export function saveTestApply(params) {
  return http.request("post", "/plm/lab/testapply/saveOrUpdateTestApply", { data: params });
}

/** 测试模板 - 列表 */
export function fetchTestTemplateList(params) {
  return http.request<TestTemplateItemType[]>("post", "/plm/lab/testTemplate/select", { data: params });
}
/** 测试模板 - 查询详情 */
export function detailTestTemplate(params) {
  return http.request<TestTemplateItemType>("get", "/plm/lab/testTemplate/selectDetailById", { params });
}
/** 测试模板 - 导入excel表格 */
export function importTestTemplate(data) {
  return http.request<TestTemplateItemType>("post", "/plm/lab/testTemplate/analysisUpload", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}
/** 测试模板 - 保存新增/修改 */
export function saveTemplateList(data) {
  return http.request("post", "/plm/lab/testTemplate/saveOrUpdate", { data });
}
/** 测试模板 - 删除 */
export function delTestTemplateList(params) {
  return http.request("delete", "/plm/lab/testTemplate/delete", { params });
}
/** 测试模板 - 复制 */
export function copyTestTemplateList(params) {
  return http.request<boolean>("get", "/plm/lab/testTemplate/copy", { params });
}
/** 测试模板 - 导出 */
export function exportTestTemplateList(data) {
  return http.request<string>("post", "/plm/lab/testTemplate/exportTestModel", { data });
}
