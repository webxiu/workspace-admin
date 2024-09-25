import { CustomerComplaintDtailListItemType, CustomerComplaintItemType } from "./types/marketing";

import { http } from "@/utils/http";

export type { CustomerComplaintItemType, CustomerComplaintDtailListItemType };

/** ========================= 客户投诉(OA管理:市场营销中心) ========================= */

/** 获取客户投诉列表 */
export function customerComplaint(data) {
  return http.request<TablePagingResType<CustomerComplaintItemType>>("post", "/oa/mk/customercomplaint/select", { data });
}

/** 获取客户投诉详情 */
export function customerComplaintDetail(params) {
  return http.request<CustomerComplaintItemType>("get", "/oa/mk/customercomplaint/selectbyedit", { params });
}

/** 获取审批节点详情 */
export function getNodeDetailList(params) {
  return http.request("post", "/app/qywx/workspace/approval/getformdata", { data: params });
}
