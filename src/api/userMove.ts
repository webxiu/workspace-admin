import { http } from "@/utils/http";

/** 迁移列表响应列表数据类型 */
export interface UserMoveItemType {
  /** ID */
  id: number;
  /** 员工工号 */
  userCode: string;
  /** 员工姓名 */
  userName: string;
  /** 创建时间 */
  createdate: string;
  /** 部门编号 */
  deptId: number;
  /** 员工状态 */
  userState: string;
  /** 移动电话 */
  mobile: string;
  /** 企业微信ID */
  wxOpenid: string;
  /** 员工头像 */
  avatar: string;
  /** 员工工号 */
  workRuleId: string;
  /** 密码 */
  password: string;
  /** 员工工号 */
  postName: string;
  /** 群辉账号 */
  qunhuiAccount: string;
  /** 群辉密码 */
  qunhuiPassword: string;
  /** K3账号 */
  k3UserAccount: string;
  /** 员工工号 */
  roleName: string;
  /** 组织ID */
  orgId: string;
  /** 部门 */
  deptName: string;
  /** 组织名称 */
  groupName: string;
}

/** 迁移列表响应类型 */
export interface UserMoveResponseType {
  total: number;
  size: number;
  current: number;
  records: UserMoveItemType[];
}
/** 迁移列表请求类型 */
export interface UserMoveRequestQueryType {
  orgId: string;
  page: number;
  limit: number;
  userCode: string;
  userName: string;
}

/**========================= 用户迁移列表 =========================*/
// 用户迁移列表
export const userMoveList = (data: UserMoveRequestQueryType) => {
  return http.request<UserMoveResponseType>("post", "/config/usermove/list", { data });
};

/**========================= 用户迁移列表 =========================*/
/** 迁移提交请求类型 */
export interface UserMoveRequestType {
  userIds: string[];
  oldOrgId: string;
  newOrgId: string;
}
// 提交用户迁移
export const sendUserMove = (data: UserMoveRequestType) => {
  return http.request<{ data: boolean }>("post", "/config/usermove/copy", { data });
};
