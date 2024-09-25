import {
  BackBillNOOptionItemType,
  DealPhaseOptionItemType,
  GetIdByBillNOListResponseType,
  QueryPendingTaskResponseType,
  QueryStartTaskResponseType
} from "./types";

import { http } from "@/utils/http";

export type { GetIdByBillNOListResponseType, QueryPendingTaskResponseType, QueryStartTaskResponseType, BackBillNOOptionItemType, DealPhaseOptionItemType };

/** ========================= 信息中心 - 我的单据 ========================= */
/** 我发起 */
export function queryStartTask(data) {
  return http.request<QueryStartTaskResponseType[]>("post", "/work/wb/infocenter/querystarttask", { data });
}

/** 待审批 */
export function queryPendingTask(data) {
  return http.request<QueryPendingTaskResponseType>("post", "/work/wb/infocenter/querypendingtask", { data });
}

/** 已审批 */
export function queryFinishTask(data) {
  return http.request("post", "/work/wb/infocenter/queryfinishtask", { data });
}

/** ========================= 信息中心 (我创建的任务 | 我负责的任务) ========================= */
/** 待处理 | 已处理 | 已暂停 | 已终止 */
export function queryMyTasks(data) {
  return http.request("post", "/work/wb/infocenter/querymytasks", { data });
}

/** 获取单据流程图配置 */
export function getFlowBillConfig(params) {
  return http.request("post", "/work/wb/infocenter/gettasksdatabybillno", { params });
}

/** 获取跳转详情的单据ID */
export function getIdByBillNO(params, config) {
  return http.request<string>("get", "/work/wb/infocenter/getidbybillno", { params }, config);
}
/** 撤销流程 */
export function cancelBillNO(data) {
  return http.request<boolean>("post", "/work/wb/infocenter/cancelprocess", { data });
}

/** ========================= 信息中心 - (单据详情 | 单据处理) ========================= */
/** 单据处理 - 单据ID列表 */
export function getIdByBillNOList(params) {
  return http.request<GetIdByBillNOListResponseType[]>("post", "/oa/hr/askforleave/SelectByEdits", { params });
}
/** 单据处理 - 同意审批 */
export function approvalBillNO(data, headers) {
  return http.request<boolean>("post", "/work/wb/infocenter/approval", { data, headers });
}
/** 单据处理 - 退回重审 */
export function backBillNO(data, headers) {
  return http.request<boolean>("post", "/work/wb/infocenter/back", { data, headers });
}
/** 单据处理 - 退回重申下拉框数据 */
export function backBillNOOptionList(data) {
  return http.request<BackBillNOOptionItemType[]>("post", "/work/wb/infocenter/getbacknodes", { data });
}
/** 单据处理 - 已处理环节列表数据 */
export function dealPhaseOptionList(data) {
  return http.request<DealPhaseOptionItemType[]>("post", "/work/wb/infocenter/getfinishhisactinstancebyprocessinstanceid", { data });
}
