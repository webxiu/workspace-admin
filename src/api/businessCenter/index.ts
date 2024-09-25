import { BudgetManageItemType } from "./types";
import { http } from "@/utils/http";

export type { BudgetManageItemType };

/**
 * 经营中心接口定义
 */

/** ========================= 预算管理 ========================= */

/** 预算管理列表 */
export function budgetManageList(params) {
  return http.request<BudgetManageItemType[]>("post", "/oa/hr/deptBudget/select", { data: params });
}

/** 导入预算 */
export function importBudgetManage(data) {
  return http.request<boolean>("post", "/oa/hr/deptBudget/import", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 导出预算 */
export function exportBudgetManage(data) {
  return http.request<string>("post", "/oa/hr/deptBudget/export", { data });
}

/** 保存预算 */
export function saveBudgetManage(data) {
  return http.request<boolean>("post", "/oa/hr/deptBudget/save", { data });
}
