/** ========================= 菜单管理(基础信息) ========================= */
/** 菜单管理列表 */
export interface MenuListItemType {
  itemId: number;
  parentId: number;
  menuCode: string;
  menuName: string;
  parentCode: string;
  webRouter: string;
  controller: string;
  displaySequence: number;
  icon: string;
  openModel: string;
  mark: string;
  createDate: string;
  createrId: string;
  createName: string;
  menuType: string;
  btnId: string;
  appHomeUrl: string;
  appDetailUrl: string;
  dataBase?: string;
  dataTable: string;
  auxilTable: string;
  isEnable: boolean;
  children?: MenuListItemType[];
}

/** 菜单下拉选项 */
export interface MenuOpeionsItemType {
  id: string;
  parentId: string;
  name: string;
  menuType: string;
  itemId: number;
}
/** 菜单类型 */
export interface MenuTypeItemType {
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

/** ========================= 菜单按钮配置(菜单管理) ========================= */

/** 菜单按钮列表类型 */
export interface MenuButtonItemType {
  id: number;
  menuId: number;
  btnId: string;
  btnSize: string;
  btnType: string;
  btnKey: string;
  btnIcon: string;
  btnName?: string;
  btnSort: string | number;
  url: string;
  columnGroupId: string;
  groupName: string;
  groupCode: string;
  hasRight: boolean;
  isDropDown: boolean;
  isVirtual: boolean;
}

/** ========================= 表单配置(菜单管理) ========================= */

/** 表单配置列表类型 */
export interface FormColumnItemType extends TableColumnList {
  id: string;
  seq: number;
  menuId: number;
  label: string;
  prop: string;
  hide: boolean;
  itemType: string;
  slots: boolean;
  tableName: string;
  valueFormat: string; // 数据格式化: 包括: 网格json/rules规则/枚举编号/下拉接口/样式/类名
  isNew?: boolean; // 是否新建
  dataOption?: any[];
}
/** ========================= 菜单配置(菜单管理) ========================= */
/** 菜单配置列表类型 */
export interface MenuColumnItemType extends TableColumnList {
  id: string;
  menuId: number;
  label: string;
  prop: string;
  sortable?: boolean;
  minWidth?: number | string;
  width?: number | string;
  seq: number;
  slot?: string;
  formatType?: string;
  format?: string;
  className?: string;
  hide?: boolean;
  columnname?: string;
  tablename?: string;
  /** 分组id */
  columnGroupId?: string;
  // type?: string;
  // align?: string;
  // fixed?: string;
  // headerAlign?: string;
  /** 是否新建 */
  isNew?: boolean;
}
/** 菜单分组列表类型 */
export interface TableGroupItemType {
  id: string;
  page: number;
  limit: number;
  createDate: string;
  createUserId: string;
  createUserName: string;
  modifyDate: string;
  modifyUserId: string;
  modifyUserName: string;
  menuId: string;
  groupName: string;
  groupCode: string;
  remark: string;
}

/** ========================= 部门管理(基础信息) ========================= */
/** 部门管理列表响应列表类型 */
export interface DetartMenttemType {
  id: string;
  parentId: number;
  k3DeptGroupNumber: string;
  principalId: string;
  clerkId: string;
  createDate: string;
  principalCode: string;
  newQywxDeptLists: string;
  newQywxDeptPrincipalLists: string;
  needUpdate: boolean;
  children?: DetartMenttemType[];
  /**  部门文员ID */
  itemId: number;
  /** 部门名称 */
  deptName: string;
  /** 部门编号 */
  deptCode: string;
  /** 金蝶部门ID */
  k3DeptId: string;
  /** 金蝶部门编号 */
  k3DeptCode: string;
  /** 企业微信部门ID */
  qyWeiXinDeptId: string;
  /** 部门负责人 */
  principalName: string;
  /** 部门文员 */
  clerkName: string;
  /** 组织类型 */
  orgType: string;
  /** 显示顺序 */
  displayOrder: string;
  /** 部门层级 */
  level: number | undefined;
}
/** 部门分组列表响应列表类型 */
export interface detartMentGroupItemType {
  id: number;
  deptId: number;
  deptCode: string;
  roleCode: number;
  roleName: number;
  itemId: number;
  leaderId: number;
  parentId: number;
  /** 分组编号 */
  groupCode: string;
  /** 分组名称 */
  groupName: string;
  /** 组别负责人 */
  leaderName: string;
  /** 所属部门 */
  deptName: string;
}

/** 组别负责人下拉选项列表 */
export interface GroupLeaderTreeItemType {
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
/** 组别负责人下拉选项列表 */
export interface BelongGroupItemType {
  id: string;
  parentId: string;
  name: string;
  title: string;
  director: string;
  children?: BelongGroupItemType[];
}

export interface DeptInfoTreeOptionType {
  id: string;
  parentId: string;
  name: string;
  title: string;
  director: string;
  displayOrder: number;
  spread: boolean;
  open: boolean;
  children: DeptInfoTreeOptionType[];
}
export interface DeptUserInfoItemType {
  id: number;
  userCode: string;
  userName: string;
  createDate: string;
  deptId: number;
  userState: string;
  mobile: string;
  wxOpenid: string;
  avatar: string;
  workRuleId: number;
  password: string;
  roleId: string;
  qunhuiAccount: string;
  qunhuiPassword: string;
  k3UserAccount: string;
  orgId: string;
}
interface JindieDeptGroupTreeType {
  id: string;
  parentId: string;
  name: string;
  children: JindieDeptGroupTreeType[];
}

/** 部门管理添加编辑下拉数据类型 */
export interface DetartMenuOptionType {
  orgTypeData: {
    id: string;
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
  deptInfoTree: DeptInfoTreeOptionType[];
  userinfoList: DeptUserInfoItemType[];
  jindieDeptGroupTree: JindieDeptGroupTreeType[];
}
/** ========================= 用户管理(基础信息) ========================= */
/** 用户管理列表请求类型 */
export interface UserInfoReqType {
  deptId: string | number;
  limit: number;
  page: number;
  deptIdList: (string | number)[];
  userCode?: string;
  userName?: string;
  userState: string;
}

/** 用户管理表格数据类型 */
export interface UserInfoItemType {
  id: number;
  userCode: string;
  userName: string;
  createDate: string;
  deptId: number | string;
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
  email: string;
  wageAccountingType: string;
}
/** 用户管理表格数据类型 */
export interface UserInfoRoleItemType {
  id: number;
  userId: string;
  roleId: string;
  roleCode: string;
  userCode: string;
  wx_openid: string;
  wxOpenId: string;
  userName: string;
  deptName: string;
  roleName: string;
  deptPath: string;
}

/** 添加角色 获取部门列表 */
export interface DeptInfoItemType {
  id: number;
  roleCode: string;
  roleName: string;
  k3RoleId: string;
  k3RoleCode: string;
  remark: string;
  deptId: number;
  deptName: string;
  itemId: string;
  tagid: string;
  parentId: string;
  parentName: string;
  mnemonics: string;
  staffingPeopleCount: string;
  rolePeopleCount: string;
  deptPath: string;
  children?: DeptInfoItemType[];
}
/** 在线人员明细弹窗表格数据类型 */
export interface UserinfoOnlineItemType {
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
/** ========================= 单据编号(基础信息) ========================= */

/** 单据编号表格数据类型 */
export interface BillNumberItemType {
  id: number;
  billId: string;
  prefix: string;
  yearLength: number;
  monthLength: number;
  dayLength: number;
  sequenceLength: number;
  groupField: string;
  suffix: string;
  createUserId: string;
  createName: string;
  createDate: string;
  modiUserId: string;
  modiName: string;
  modifyDate: string;
  remark: string;
  projectNo: string;
  projectName: string;
  menuId: number;
  menuName: string;
}

export interface BillNumberProjectsOptionItemType {
  id: number;
  projectName: string;
  projectId: string;
  projectNo: string;
}
/** ========================= 角色设置(权限管理) ========================= */
/** 获取角色下的用户列表类型 */
export interface RoleUserItemType {
  id: number;
  userId: number;
  roleId: number;
  roleCode: string;
  userCode: string;
  wx_openid: string;
  wxOpenId: string;
  userName: string;
  deptName: string;
  roleName: string;
  deptPath: string;
}

/** 部门用户列表 */
export interface DeptUserItemType {
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
  roleCode?: string;
  orgId: string;
  deptName: string;
  groupName: string;
}

/** ========================= 角色权限(权限管理) ========================= */
/** 部门用户列表 */
export interface MenuTreeItemType {
  id: string;
  parentId: string;
  title: string;
  field: string;
  spread: string;
  checked: string;
  disabled: boolean;
  iconClass: string;
  href: string;
  checkArr: string;
  type: string;
  groupCode: string;
  deptId: string;
  leaderId: string;
  groupRoot: string;
  children: MenuTreeItemType[];
}
/** ========================= 数据权限(权限管理) ========================= */
/** 数据权限列表响应类型 */
export interface DataAuthItemType {
  id: number;
  roleCode: string;
  roleName: string;
  k3RoleId: string;
  k3RoleCode: string;
  remark: string;
  deptId: number;
  deptName: string;
  itemId: string;
  parentId: string;
  parentName: string;
  mnemonics: string;
  staffingPeopleCount: string;
  rolePeopleCount: number;
  deptPath: string;
}

/** 数据权限列表响应类型 */
export interface DataAuthMenuItemType {
  id: number;
  roleId: number;
  dataAuthorityFlag: number;
  menuId: number;
  menuCode: string;
  menuName: string;
  authorityFlagId: number;
  authorityFlagName: string;
}
/** 数据权限修改下拉框数据类型 */
export interface DataAuthMenuOptionType {
  statusData: {
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
}

/** ========================= 操作权限(权限管理) ========================= */

/** 操作权限权限列表响应类型 */
export interface OptAuthItemType {
  itemId: number;
  parentId: number;
  menuCode: string;
  menuName: string;
  parentCode: string;
  controller: string;
  displaySequence: number;
  icon: string;
  openModel: string;
  mark: string;
  createDate: string;
  createrId: number;
  createName: string;
  menuType: string;
  btnId: string;
  appHomeUrl: number;
  appDetailUrl: number;
  children?: OptAuthItemType[];
}

/** 操作权限权限角色列表响应类型 */
export interface OptAuthRoleItemType {
  id: number;
  roleCode: string;
  roleName: string;
  k3RoleId: string;
  k3RoleCode: string;
  remark: string;
  deptId: string;
  deptName: string;
  itemId: string;
  parentId: string;
  parentName: string;
  mnemonics: string;
  staffingPeopleCount: string;
  rolePeopleCount: string;
  deptPath: string;
}
/** 操作权限权限角色列表响应类型 */
export interface OptAuthDeptTreeItemType {
  id: number;
  roleCode: string;
  roleName: string;
  k3RoleId: string;
  k3RoleCode: string;
  remark: string;
  deptId: number;
  deptName: string;
  itemId: string;
  parentId: string;
  parentName: string;
  mnemonics: string;
  staffingPeopleCount: string;
  rolePeopleCount: string;
  deptPath: string;
  children?: OptAuthDeptTreeItemType[];
}

/** ========================= 系统参数(开发运维) ========================= */

/** 操作权限权限角色列表响应类型 */
export interface SystemParamsListItemType {
  itemId: number;
  parentId: number;
  menuCode: string;
  menuName: string;
  parentCode: string;
  controller: string;
  displaySequence: number;
  icon: string;
  openModel: string;
  mark: string;
  createDate: string;
  createrId: string;
  createName: string;
  menuType: string;
  btnId: string;
  appHomeUrl: string;
  appDetailUrl: string;
  children?: SystemParamsListItemType[];
}

/** 参数编号列表响应类型 */
export interface SystemParamsNumberItemType {
  id: number;
  menuId: number;
  systemparamCode: string;
  systemparamName: string;
  remark: string;
}

/** 参数值列表响应类型 */
export interface SystemParamsValueItemType {
  id: number;
  systemparamId: number;
  systemparamValue: string;
  remark: string;
  createDate: string;
}

/** ========================= 枚举字典(开发运维) ========================= */

/** 枚举字典列表响应类型 */
export interface EnumDictionaryItemType {
  id: number;
  optionName: string;
  memo: string;
  optionCode: string;
}
/** 枚举字典列表响应类型 */
export interface EnumDictionaryOptionItemType {
  id: number;
  optionId: number;
  optionValue: string;
  optionName: string;
  reserve1: string;
  displaySeq: number;
  kingdeeValue: string;
  title: string;
}

/** ========================= 日志管理(开发运维) ========================= */

/** 日志列表数据类型 */
export interface UserLogItemType {
  id: number;
  userId: number;
  userName: string;
  userCode: string;
  method: string;
  methodCode: string;
  methodType: string;
  requestType: string;
  url: string;
  ipAddress: string;
  timeConsuming: number;
  requestParams: string;
  responseCode: number;
  browser: string;
  system: string;
  inDate: string;
  remark: string;
  orgId: string;
}

/** ========================= 数据字典(开发运维) ========================= */
/** 数据库列表类型 */
export interface DataBaseItemType {
  schemaName: string;
}

/** 数据表列表类型 */
export interface DataTableItemType {
  tableName: string;
  tableComment: string;
  columnName: string;
  columnType: string;
  columnComment: string;
}
/** 数据字典列表类型 */
export interface DataFieldItemType {
  tableName: string;
  tableComment: string;
  columnName: string;
  columnType: string;
  columnComment: string;
}
/** 数据库搜索响应类型 */
export interface DataBaseSearchItemType {
  tableInfoList: DataTableItemType[];
  fieldInfoList: DataFieldItemType[];
}

/** ========================= 缓存管理(开发运维) ========================= */

/** 缓存管理响应类型 */
export interface CacheManageItemType {
  cacheKey: string;
  access_token: string;
  lastAccess: string;
  ttl: number;
  expiredTime: string;
}
/** ========================= 数据库维护(开发运维) ========================= */

/** 数据库维护响应类型 */
export interface DbMaintenanceItemType {
  id: number;
  billNo: string;
  title: string;
  content: string;
  reason: string;
  isExecute: number;
  dbKey: string;
  isNeedFinishExecute: number;
  billState: number;
  userId: string;
  userName: string;
  createDate: string;
  modifyDate: string;
}

/** ========================= 工作流 ========================= */
/** 流程管理 - 表格数据类型 */
export interface FlowManageItemType {
  id: number;
  deployId: string;
  deployName: string;
  deployCategory: string;
  deployFileName: string;
  tenantId: string;
  deployKey: string;
  deployTime: string;
  processDescription: string;
  processId: string;
  processSuspension: boolean;
  resourceName: string;
  dgrmResourceName: string;
  processInstanceCount: number;
  isConfig: boolean;
  isEnable: boolean;
  billId: string;
  version: number;
}
/** 流程管理 - 流程图XML模板 */
export interface FlowGraphXMLType {
  processConfig: {
    id: number;
    processId: string;
    billId: string;
    formUrl: string;
    tableName: string;
    fieldName: string;
    userFieldName: string;
    flowName: string;
    isEnable: true;
    depVersion: 7;
  };
  taskLists: FlowTaskManageItemType[];
  xmlContent: string;
}

/** 流程管理 - 审批任务管理类型 */
export interface FlowTaskManageItemType {
  id?: number;
  processId: string;
  taskId: string;
  persons: string;
  personFrom: string;
  notifyObjectFrom: string;
  roleId: string;
  // finishAdviceWay: any;
  carbonPersonFrom: string;
  notifyOpportunity: string;
  carbonPersons: string;
  carbonRoleId: string;
  orgId: string;
  uelmark: string;
  uelexpr: string;
  notifyObjectPersons: string;
  notifyObjectRoleId: string;
  finishAdviceWay: string;
  deptLevel: number;
  /** 审批方式 */
  taskUsers: {
    用户?: { id: number; userCode: string; userName: string }[];
    角色?: { id: number; roleCode: string; roleName: string }[];
  };
  /** 抄送方式 */
  carbonTaskUsers: {
    用户?: { id: number; userCode: string; userName: string }[];
    角色?: { id: number; roleCode: string; roleName: string }[];
  };
  /** 通知对象 */
  notifyTaskUsers: {
    用户?: { id: number; userCode: string; userName: string }[];
    角色?: { id: number; roleCode: string; roleName: string }[];
  };
}

/** 流程管理 - 设计图-获取流程配置 */
export interface FlowDesignConfigType {
  nodes: { id: string; type: string; x: number; y: number; text: string }[];
  edges: { id: string; sourceNodeId: string; targetNodeId: string; type: string; text: string }[];
}
/** 流程管理 - 任务管理弹窗-任务列表下拉数据类型 */
export interface FlowTaskItemType {
  taskId: string;
  taskName: string;
  personFrom: string;
  personFromValue: string;
  mutilInstanceType: string;
}

/** 流程管理 - 任务管理弹窗-任务列表切换响应结果 */
export interface TaskApprovalInfoResType {
  finishAdviceWay: string;
  [key: string]: string | Array<TaskApprovalInfoItemType | TaskApprovalInfoRoleItemType>;
}

/** 流程管理 - 任务管理 - 用户响应类型 */
export interface TaskApprovalInfoItemType {
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
  deptName: string;
}
/** 流程管理 - 任务管理 - 角色响应类型 */
export interface TaskApprovalInfoRoleItemType {
  id: number;
  roleCode: string;
  roleName: string;
  k3RoleId: string;
  k3RoleCode: string;
  remark: string;
  deptId: string;
  deptName: string;
  itemId: string;
  tagid: string;
  parentId: string;
  parentName: string;
  mnemonics: string;
  staffingPeopleCount: string;
  rolePeopleCount: string;
  deptPath: string;
}

/** 流程管理 - 任务管理 - 部门角色列表响应类型 */
export interface DeptRoleItemType {
  id: number;
  roleCode: string;
  roleName: string;
  k3RoleId: string;
  k3RoleCode: string;
  remark: string;
  deptId: number;
  deptName: string;
  itemId: string;
  parentId: string;
  parentName: string;
  mnemonics: string;
  staffingPeopleCount: string;
  rolePeopleCount: number;
  deptPath: string;
}

/** 流程管理 - 模板配置 - 单据列表响应类型 */
export interface FlowBillItemType {
  yearLength: number;
  createUserId: string;
  monthLength: number;
  prefix: string;
  sequenceLength: number;
  modiUserId: number;
  remark: string;
  suffix: string;
  orgId: string;
  dayLength: number;
  groupField: string;
  projectNo: string;
  modifyDate: string;
  billId: string;
  id: number;
  createDate: string;
}
/** 流程管理 - 模板配置 - 单据信息响应类型 */
export interface FlowBillInfoType {
  fieldName: string;
  inDate: string;
  userFieldName: string;
  flowName: string;
  lastKeyIn: string;
  orgId: string;
  tableName: string;
  isEnable: boolean;
  processId: string;
  formUrl: string;
  billId: string;
  keyIn: string;
  id: number;
  lastDate: string;
}

/** 流程中心 - 表格响应类型 */
export interface FlowCenterResType {
  records: FlowCenterItemType[];
  total: number;
}
/** 流程中心 - 表格数据类型 */
export interface FlowCenterItemType {
  deployKey: string;
  deployName: string;
  processId: string;
  processInstanceId: string;
  processVersion: number;
  billNo: string;
  processStatus: string;
  processStartTime: string;
  processEndTime: string;
  processDuration: string;
  processCreateUserNo: string;
  processCreateUserName: string;
  processDeleteReason: string;
  formUrl: string;
  approverUserNames: string;
  currentStageTime: string;
}
/** 流程看板 - OA列表类型 */
export interface FlowOAItemType {
  billNo: string;
  processId: string;
  processInstanceId: string;
  status: string;
  deployKey: string;
  deployName: string;
  processCreateUserName: string;
  processStartTime: string;
  approverUserNames: string;
  currentStageTime: string;
  processDuration: string;
}
/** 流程看板 - 金蝶列表类型 */
export interface FlowKingdeeItemType {
  billNo: string;
  processId: string;
  processInstanceId: string;
  status: string;
  deployKey: string;
  deployName: string;
  processCreateUserName: string;
  processStartTime: string;
  approverUserNames: string;
  currentStageTime: string;
  processDuration: string;
}
/** 流程看板 - 企业微信列表类型 */
export interface FlowWechatItemType {
  billNo: string;
  processId: string;
  processInstanceId: string;
  status: string;
  deployKey: string;
  deployName: string;
  processCreateUserName: string;
  processStartTime: string;
  approverUserNames: string;
  currentStageTime: string;
  processDuration: string;
}

/** ========================= 任务调度 ========================= */

/** 任务调度响应类型 */
export interface TaskScheduleItemType {
  id: number;
  taskType: number;
  taskName: string;
  jobName: string;
  jobGroup: string;
  webhookUrl?: string;
  cronSchedule: string;
  toUsers: string;
  toRoles: string;
  url: string;
  currency: string;
  disabled: boolean;
  directions: string;
  messageBody: string;
  dataSources: string;
  toType: string;
  toTitle: string;
  createDate: string;
  adviceByQywx: boolean;
  adviceByEmail: boolean;
  limitedWorkingDay?: boolean;
  emailAdviceWay: boolean;
}

/** 任务角色列表响应类型 */
export interface TaskRoleItemType {
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
  rolePeopleCount: string;
  deptPath: string;
}

/** 任务用户列表响应类型 */
export interface TaskUserItemType {
  id: number;
  userCode: string;
  userName: string;
  createDate: string;
  deptId: number;
  userState: string;
  mobile: string;
  wxOpenid: string;
  avatar: string;
  workRuleId: number;
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
/** 角色列表响应类型(弹窗) */
export interface RoleInfoItemType {
  id: number;
  roleCode: string;
  roleName: string;
  k3RoleId: string;
  k3RoleCode: string;
  remark: string;
  deptId: number;
  deptName: string;
  itemId: string;
  parentId: string;
  parentName: string;
  mnemonics: string;
  staffingPeopleCount: string;
  rolePeopleCount: string;
  deptPath: string;
}

/** ========================= 管理中心 ========================= */

/** 任务管理列表类型 */
export interface TaskManageItemType {
  id: number;
  billNo: string;
  taskName: string;
  projectCode: string;
  taskTypeCode: string;
  priority: string;
  startTime: string;
  endTime: string;
  taskContent: string;
  userCode: string;
  taskStatus: string;
  approvalStatus: string;
  responsibleMan: string;
  joinMan: string;
  tags: string;
  inDate: string;
  realStartTime: string;
  realEndTime: string;
  billState: string;
  parentId: number;
  score: number;
  responsibleManCode: string;
  number: number;
  file: string;
  taskStatusName: string;
  taskFilesVO: string;
  maxParentId: number;
  submit: string;
  duration: string;
  children: TaskManageItemType[];
}

/** 任务管理下拉数据类型 */
export interface TaskMangeOptionType {
  userinfoList: UserInfoItemType[];
  kkFileView: string;
  taskTypeCodeList: {
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
  backtask: {
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
  filePath: string;
  taskStatusList: {
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
  priorityList: {
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
}
/** 任务管理: 日志列表类型 */
export interface TaskLogItemType {
  userCode: string;
  taskRegisterId: number;
  createDate: string;
  content: string;
  userName: string;
  id: number;
}
/** 任务管理: 修改弹窗获取文件列表类型 */
export interface TaskFileItemType {
  id: number;
  fileName: string;
  inDate: string;
  taskId: string;
  filePath: string;
}

/** ========================= 我的工单 ========================= */

/** 我的工单: 列表类型 */
export interface MyWorkOrderItemType {
  id: number;
  billNo: string;
  taskName: string;
  projectCode: string;
  taskTypeCode: string;
  priority: string;
  startTime: string;
  endTime: string;
  taskContent: string;
  userCode: string;
  taskStatus: string;
  responsibleMan: string;
  joinMan: string;
  tags: string;
  realStartTime: string;
  realEndTime: string;
  billState: number;
  parentId: number;
  score: string;
  responsibleManCode: string;
  number: number;
  file: string;
  taskStatusName: string;
  taskFilesVO: string;
  maxParentId: number;
  submit: string;
  systemName: string;
  expectDate: string;
  createDate: string;
  modifyDate: string;
  createUserName: string;
  modifyUser: string;
  createUserId: string;
  modifyUserId: string;
  deptName: string;
  deptId: number;
}

/** ========================= APP版本记录 ========================= */

/** APP版本记录列表类型 */
export interface EsopVersionItemType {
  id: string;
  downloadUrl: string;
  updateLog: string;
  version: string;
  forceUpdate: false;
  minTime: number;
  maxTime: number;
  timeType: string;
  createUserName: string;
  createDate: string;
}
