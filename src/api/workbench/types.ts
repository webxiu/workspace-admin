/*
 * @Author: Hailen
 * @Date: 2023-07-14 17:16:59
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-01-20 10:10:53
 */

import { BelongGroupItemType, MenuTreeItemType } from "@/api/systemManage/types";

/** ================================== 信息中心 ================================== */
/** 信息中心-我发起 响应类型 */
export interface QueryStartTaskResponseType {
  executionId: string;
  activityId: string;
  taskId: string;
  activityName: string;
  assignee: string;
  startTime: string;
  endTime: string;
  handleComment: string;
  deleteReason: string;
  duration: string;
  billNo: string;
  flowName: string;
  processDefId: string;
  processInstId: string;
  formUrl: string;
  projectId: string;
  processStatus: string;
  statusColor: string;
  billId: string;
}
/** 信息中心-待审批 响应类型 */
export interface QueryPendingTaskResponseType {
  sendKey: string;
  sendName: string;
  flowName: string;
  billNo: string;
  sendTime: string;
  processDefId: string;
  processInstId: string;
  formUrl: string;
  projectId: string;
  billId: string;
}
/** 信息中心-normal 响应类型 */
export interface MyTaskResponseType {
  id: number;
  projectId: string;
  projectNo: string;
  taskNo: string;
  projectName: string;
  taskName: string;
  completeTarget: string;
  taskState: string;
  director: string;
  directorId: string;
  createDate: string;
  createMan: number;
  planCompleteDate: string;
  taskCompleteDate: string;
  taskCompleteMan: string;
  taskRemark: string;
  priority: string;
  stateName: string;
  completeManName: string;
  createManName: string;
  taskFrom: string;
}

/** 信息中心-单据详情 响应类型 */
export interface GetIdByBillNOListResponseType {
  id: string;
  billNo: string;
  itemSequence: number;
  userId: string;
  userName: string;
  holidayType: string;
  startDate: string;
  startTime: string;
  entryDate: string;
  endDate: string;
  endTime: string;
  days: number;
  hours: number;
  createUserId: string;
  createDate: string;
  billState: number;
  operationType: string;
  remark: string;
  approverStep: string;
  billStateName: string;
  createUserName: string;
  deptName: string;
  approver: string;
  overtimeBillNo: string;
  overStartDate: string;
  priId: string;
  overId: string;
}
/** 信息中心-单据处理: 退回节点下拉框数据 */
export interface BackBillNOOptionItemType {
  activeId: string;
  activeName: string;
  assignee: string;
}
/** 信息中心-单据处理: 已处理环节表格数据 */
export interface DealPhaseOptionItemType {
  executionId: string;
  activityId: string;
  taskId: string;
  activityName: string;
  assignee: string;
  startTime: string;
  endTime: string;
  handleComment: string;
  deleteReason: string;
  duration: string;
  billNo: string;
  flowName: string;
  processDefId: string;
  processInstId: string;
  formUrl: string;
  projectId: string;
  processStatus: string;
  statusColor: string;
  billId: string;
}

/** ================================== 岗位管理 ================================== */

/** 岗位管理 - 岗位列表类型 */
export interface TeamPostItemType {
  id: number;
  roleCode: string;
  roleName: string;
  k3RoleId: number;
  k3RoleCode: string;
  remark: string;
  deptId: number;
  deptName: string;
  itemId: string;
  tagid: number;
  parentId: string;
  parentName: string;
  mnemonics: string;
  staffingPeopleCount: number;
  rolePeopleCount: number;
  deptPath: string;
}
/** 岗位管理 - 岗位职责列表类型 */
export interface TeamDutyItemType {
  id: number;
  roleInfoId: number;
  responsibilities: string;
  sequence: number;
}
/** ================================== 团队成员 ================================== */

/** 团队成员 - 部门行列表类型 */
export interface TeamMemberItemType {
  id: number;
  staffId: string;
  staffName: string;
  deptId: number;
  groupId: string;
  position: string;
  roleId: number;
  sex: string;
  education: string;
  marital: string;
  children: string;
  nation: string;
  birthDate: string;
  nativePlace: string;
  height: string;
  weight: string;
  englishLevel: string;
  computerLevel: string;
  drivingLicence: string;
  age: number;
  idCard: string;
  insurance: string;
  socialSecurity: string;
  registeredResidence: string;
  phone: string;
  emergencyName: string;
  emergencyPhone: string;
  emergencyRelation: string;
  emergencyResidence: string;
  startDate: string;
  contractExpiresDate: string;
  contractRenewalDate: string;
  oldPosition: string;
  newPosition: string;
  transferDate: string;
  remark: string;
  accommodation: string;
  contractSigning: string;
  ogranizationId: string;
  state: string;
  leaveofficeDate: string;
  renewalCount: string;
  province: string;
  city: string;
  district: string;
  resignationReason: string;
  temporaryFlag: string;
  laborServiceCompany: string;
  employeKind: string;
  currentStayAddress: string;
  tryDate: string;
  tryDateMoney: string;
  moneyStartDate: string;
  createUserId: string;
  createDate: string;
  clockingInUserCode: string;
  workRuleId: string;
  inductionCheckInId: string;
  noAttendance: string;
  userInfoId: number;
  wxOpenId: string;
  deptCode: string;
  deptName: string;
  groupCode: string;
  groupName: string;
  forenoonStart: string;
  forenoonEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  worktime: string;
  roleName: string;
  applyPosition: string;
  annualleave: string;
  validDate: string;
  authority: string;
  deptGroupInfoList: string;
  staffInfoWorkVOS: string;
  staffInfoFamilyVOS: string;
  staffInfoEducationVOS: string;
  staffInfoPhotoVOS: string;
  permissionFlag: string;
  permissionDeptId: string;
  userCode: string;
  inDate: string;
  idpicture: string;
}

/** 团队成员 - 部门行列表类型 */
export interface GroupLeaderItemType {
  id: number;
  userCode: string;
  userName: string;
  createDate: string;
  deptId: string;
  userState: string;
  mobile: string;
  wxOpenid: string;
  avatar: string;
  workRuleId: string;
  password: string;
  postName: string;
  qunhuiAccount: string;
  qunhuiPassword: string;
  k3UserAccount: string;
  roleName: string;
  orgId: string;
  deptName: string;
  groupName: string;
}
/** 团队成员 - 分组负责人响应类型 */
export interface GroupLeaderItemType {
  id: number;
  userCode: string;
  userName: string;
  createDate: string;
  deptId: string;
  userState: string;
  mobile: string;
  wxOpenid: string;
  avatar: string;
  workRuleId: string;
  password: string;
  postName: string;
  qunhuiAccount: string;
  qunhuiPassword: string;
  k3UserAccount: string;
  roleName: string;
  orgId: string;
  deptName: string;
  groupName: string;
}

/** 团队成员 - 部门分组响应类型 */
export interface DepGroupItemType {
  id: string;
  parentId: string;
  name: string;
  title: string;
  director: string;
  spread?: true;
  open?: true;
  children: DepGroupItemType;
}

/** 团队成员 - 岗位角色及部门组织信息响应类型 */
export interface RoleAndGroupType {
  roleInfoList: {
    id: number;
    roleCode: string;
    roleName: string;
    k3RoleId: number;
    k3RoleCode: string;
    remark: string;
    deptId: number;
    deptName: string;
    itemId: string;
    parentId: string;
    parentName: string;
    mnemonics: string;
    staffingPeopleCount: number;
    rolePeopleCount: number;
    deptPath: string;
  }[];
  deptGroupInfoList: {
    id: number;
    deptId: number;
    groupCode: string;
    groupName: string;
    parentId: number;
    leaderId: number;
    orgId: string;
  }[];
}

/** 所有部门树列表类型 */
export interface DeptGroupTreeItemType {
  id: number;
  parentId: number;
  title: string;
  field: string;
  spread: boolean;
  checked: boolean;
  disabled: boolean;
  iconClass: string;
  href: string;
  checkArr: number[];
  type: string;
  groupCode: string;
  deptId: number;
  leaderId: number;
  groupRoot: boolean;
  children: DeptGroupTreeItemType[];
}
/** 本部门树列表类型 */
export interface DeptInfoTreeItemType {
  id: string;
  parentId: string;
  name: string;
  title: string;
  director: string;
  displayOrder: number;
  children: DeptInfoTreeItemType[];
}

/** 团队成员 - 获取列表修改下拉框数据类型 */
export interface TeamMemberOptionType {
  stateList: {
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
  }[];
  deptGroupTree: DeptGroupTreeItemType[];
  deptInfoTree: DeptInfoTreeItemType[];
}

/** ================================== 审批代理人 ================================== */

/** 审批代理人 - 部门列表返回响应类型 */
export interface DeptInfoResType {
  id: number;
  parentId: number;
  deptCode: string;
  qyWeiXinDeptId: number;
  k3DeptId: string;
  k3DeptCode: string;
  k3DeptGroupNumber: string;
  deptName: string;
  principalId: string;
  clerkId: string;
  createDate: string;
  itemId: number;
  principalCode: string;
  principalName: string;
  clerkName: string;
  orgType: string;
  displayOrder: string;
  newQywxDeptLists: string;
  newQywxDeptPrincipalLists: string;
  needUpdate: boolean;
}

/** 审批代理人 - 部门列表代理人返回响应类型 */
export interface DeptInfoAgentResType {
  id: number;
  deptId: string;
  userId: string;
  billId: number;
  modifyTime: string;
  userName: string;
  wx_openid: string;
  userCode: string;
  flowName: string;
}

/** 审批代理人 - 部门列表树形数据用户响应类型 */
export interface DepInfoTreeUserInfoResType {
  id: number;
  userCode: string;
  userName: string;
  createDate: string;
  deptId: number;
  userState: string;
  mobile: string;
  wxOpenid: string;
  avatar: string;
  workRuleId: string;
  password: string;
  postName: string;
  qunhuiAccount: string;
  qunhuiPassword: string;
  k3UserAccount: string;
  roleName: string;
  orgId: string;
  deptName: string;
  groupName: string;
}

/** 组织架构图 - 响应类型 */
export interface OrgCharItemType {
  id: string;
  parentId: string;
  name: string;
  title: string;
  director: string;
  displayOrder: number | null;
  children?: OrgCharItemType | OrgCharItemType[];
}
