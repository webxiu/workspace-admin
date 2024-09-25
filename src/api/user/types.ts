/*
 * @Author: Hailen
 * @Date: 2023-07-14 17:16:59
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-01-31 16:48:25
 */

/**
 * 用于定义用过相关接口响应类型
 */

/** 登录页面下载信息 */
export interface LoginAppInfoType {
  redirect: string;
  clientPathMac: string;
  agentid: string;
  appid: string;
  orgName: string;
  orgShortName: string;
  clientPathWin: string;
  clientPathWin32: string;
  version: string;
  logoUrl: string;
}

/** 用户基本资料 */
export interface BasicuserResponseType {
  id: number;
  staffId: string;
  staffName: string;
  deptId: number;
  groupId: null;
  position: null;
  roleId: number;
  sex: string;
  education: string;
  marital: string;
  children: null;
  nation: string;
  birthDate: string;
  nativePlace: string;
  height: string;
  weight: null;
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
  contractExpiresDate: null;
  contractRenewalDate: null;
  oldPosition: string;
  newPosition: string;
  transferDate: null;
  remark: string;
  accommodation: string;
  contractSigning: string;
  ogranizationId: null;
  state: string;
  leaveofficeDate: null;
  renewalCount: null;
  province: null;
  city: null;
  district: null;
  resignationReason: string;
  temporaryFlag: number;
  laborServiceCompany: string;
  employeKind: string;
  currentStayAddress: string;
  tryDate: number;
  tryDateMoney: null;
  moneyStartDate: string;
  createUserId: 1317547;
  createDate: string;
  clockingInUserCode: string;
  workRuleId: number;
  inductionCheckInId: null;
  noAttendance: boolean;
  userInfoId: null;
  wxOpenId: null;
  deptCode: string;
  deptName: string;
  groupCode: null;
  groupName: null;
  forenoonStart: string;
  forenoonEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  worktime: null;
  roleName: null;
  applyPosition: null;
  annualleave: string;
  validDate: null;
  authority: null;
  deptGroupInfoList: null;
  staffInfoWorkVOS: [];
  staffInfoFamilyVOS: [];
  staffInfoEducationVOS: [];
  staffInfoPhotoVOS: null;
  permissionFlag: null;
  permissionDeptId: null;
  userCode: null;
  inDate: null;
  idpicture: null;
}

export interface UserInfoType {
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

/** 查询用户信息 */
export interface QueryuserResponseType {
  id: string;
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
/** 待处理任务数 */
export interface PendingTaskType {
  responsibilityWait: number;
  createSuspend: number;
  responsibilitySuspend: number;
  createWait: number;
}

/** 快捷入口 */
export interface FastEntryItemType {
  web_router: string;
  controller: string;
  icon: string;
  menuId: number;
  menuName: string;
}
/** 快捷入口-左侧穿梭框 */
export interface FastEntryLeftItemType {
  controller: string;
  openModel: string;
  icon: string;
  menuId: number;
  menuName: string;
  mark: string;
}

/** 百岁计时 */
export interface CountDownsResponseType {
  item: string;
  auxiliary: string;
  value: string;
}
