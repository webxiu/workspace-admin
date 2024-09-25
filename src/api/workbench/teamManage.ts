import {
  DepGroupItemType,
  DepInfoTreeUserInfoResType,
  DeptGroupTreeItemType,
  DeptInfoAgentResType,
  DeptInfoResType,
  GroupLeaderItemType,
  OrgCharItemType,
  RoleAndGroupType,
  TeamDutyItemType,
  TeamMemberItemType,
  TeamMemberOptionType,
  TeamPostItemType
} from "./types";

import { http } from "@/utils/http";

export type {
  GroupLeaderItemType,
  DepGroupItemType,
  TeamMemberItemType,
  DeptInfoResType,
  DeptInfoAgentResType,
  DepInfoTreeUserInfoResType,
  OrgCharItemType,
  RoleAndGroupType,
  TeamPostItemType,
  TeamMemberOptionType,
  DeptGroupTreeItemType,
  TeamDutyItemType
};

/** =========================  岗位管理(团队管理) ========================= */
/** 岗位列表===== */
export function teamPostList(data) {
  return http.request<TeamPostItemType[]>("post", "/work/tm/teamposition/selectposition", { data });
}
/** 岗位列表-新增岗位 */
export function addTeamPost(data) {
  return http.request<boolean>("post", "/work/tm/teamposition/insertposition", { data });
}
/** 岗位列表-修改岗位 */
export function updateTeamPost(data) {
  return http.request<boolean>("post", "/work/tm/teamposition/updateposition", { data });
}
/** 岗位列表-修改岗位 */
export function deleteTeamPost(params) {
  return http.request<boolean>("post", "/work/tm/teamposition/deleteposition", { params });
}

/** 职责列表===== */
export function teamDutyList(data) {
  return http.request<TeamDutyItemType[]>("post", "/work/tm/teamposition/selectresponsibilities", { data });
}
/** 岗位列表-新增岗位职责 */
export function addTeamDuty(data) {
  return http.request<boolean>("post", "/work/tm/teamposition/insertresponsibilities", { data });
}
/** 岗位列表-修改岗位职责 */
export function updateTeamDuty(data) {
  return http.request<boolean>("post", "/work/tm/teamposition/updateresponsibilities", { data });
}
/** 岗位列表-删除岗位职责 */
export function deleteTeamDuty(params) {
  return http.request<boolean>("post", "/work/tm/teamposition/deleteresponsibilities", { params });
}

/** 模板列表===== */
export function teamTemplateList(data) {
  return http.request<any>("post", "/work/tm/teamposition/selectfileoutput", { data });
}

/** 岗位列表-新增模板 */
export function addTeamTemplate(data) {
  return http.request<boolean>("post", "/work/tm/teamposition//insertfileoutput", { data });
}
/** 岗位列表-修改模板 */
export function updateTeamTemplate(data) {
  return http.request<boolean>("post", "/work/tm/teamposition/updatefileoutput", { data });
}
/** 岗位列表-删除模板 */
export function deleteTeamTemplate(params) {
  return http.request<boolean>("post", "/work/tm/teamposition/deletefileoutput", { params });
}

/** =========================  团队成员(团队管理) ========================= */
/** 成员列表 */
export function teamMemberList(data) {
  return http.request<TablePagingResType<TeamMemberItemType>>("post", "/work/tm/teammembers/select", { data });
}
/** 成员列表(通过部门ID获取) */
export function teamMemberListByDepId(data) {
  return http.request<TablePagingResType<TeamMemberItemType>>("post", "/work/tm/teammembers/selectbydeptId", { data });
}
/** 获取分组负责人 */
export function teamGroupLeader(params) {
  return http.request<GroupLeaderItemType[]>("get", "/sys/sys/userinfo/selectuserinfo", { params });
}
/** 获取部门所属分组 */
export function teamDepGroupList() {
  return http.request<DepGroupItemType[]>("get", "/work/tm/teammembers/getdeptgrouplist");
}
/** 获取分组编号 */
export function teamDepGroupCode() {
  return http.request<string>("post", "/sys/sys/deptgroupinfo/selectmax");
}
/** 获取列表修改下拉框数据 */
export function teamMemberOptionList() {
  return http.request<TeamMemberOptionType>("get", "/work/tm/teammembers/getteammembers");
}

/** 提交新增分组 */
export function addDepGroup(data) {
  return http.request<boolean>("post", "/work/tm/teammembers/insertdeptgroup", { data });
}
/** 提交修改分组 */
export function editDepGroup(data) {
  return http.request<boolean>("post", "/work/tm/teammembers/updatedeptgroup", { data });
}
/** 提交删除分组 */
export function deleteDepGroup(params) {
  return http.request<boolean>("post", "/work/tm/teammembers/deletedeptgroup", { params });
}
/** 获取岗位角色及组别信息 */
export function roleAndGroupList(params) {
  return http.request<RoleAndGroupType>("post", "/work/tm/teammembers/getrolelist", { params });
}
/** 提交岗位修改 */
export function updateDepGroup(data) {
  return http.request<boolean>("post", "/work/tm/teammembers/update", { data });
}
/** =========================  审批代理人(团队管理) ========================= */

/** 部门列表 */
export function getdeptInfoList(data) {
  return http.request<DeptInfoResType[]>("post", "/sys/sys/deptinfo/select", { data });
}

/** 获取部门列表代理人 */
export function getdeptInfoAgent(params) {
  return http.request<DeptInfoAgentResType[]>("post", "/work/tm/approvalagent/selectapprovalagentdate", { params });
}

/** 修改审批代理人 */
export function updateAuditAgent(data) {
  return http.request<boolean>("post", "/work/tm/approvalagent/updateapprovalagent", { data });
}

/** =========================  组织架构图 ========================= */
/** 获取组织架构列表 */
export function orgchartData(data) {
  return http.request<OrgCharItemType[]>("post", "/work/sys/orgchart/select", { data });
}
