import {
  BelongGroupItemType,
  BillNumberItemType,
  BillNumberProjectsOptionItemType,
  CacheManageItemType,
  DataAuthItemType,
  DataAuthMenuItemType,
  DataAuthMenuOptionType,
  DataBaseItemType,
  DataBaseSearchItemType,
  DataFieldItemType,
  DataTableItemType,
  DbMaintenanceItemType,
  DeptInfoItemType,
  DeptInfoTreeOptionType,
  DeptRoleItemType,
  DeptUserInfoItemType,
  DeptUserItemType,
  DetartMenttemType,
  DetartMenuOptionType,
  EnumDictionaryItemType,
  EnumDictionaryOptionItemType,
  EsopVersionItemType,
  FlowBillItemType,
  FlowCenterItemType,
  FlowCenterResType,
  FlowDesignConfigType,
  FlowGraphXMLType,
  FlowKingdeeItemType,
  FlowManageItemType,
  FlowOAItemType,
  FlowTaskItemType,
  FlowTaskManageItemType,
  FlowWechatItemType,
  FormColumnItemType,
  GroupLeaderTreeItemType,
  MenuButtonItemType,
  MenuColumnItemType,
  MenuListItemType,
  MenuOpeionsItemType,
  MenuTreeItemType,
  MenuTypeItemType,
  MyWorkOrderItemType,
  OptAuthDeptTreeItemType,
  OptAuthItemType,
  OptAuthRoleItemType,
  RoleInfoItemType,
  RoleUserItemType,
  SystemParamsListItemType,
  SystemParamsNumberItemType,
  SystemParamsValueItemType,
  TableGroupItemType,
  TaskApprovalInfoItemType,
  TaskApprovalInfoResType,
  TaskApprovalInfoRoleItemType,
  TaskFileItemType,
  TaskLogItemType,
  TaskManageItemType,
  TaskMangeOptionType,
  TaskRoleItemType,
  TaskScheduleItemType,
  TaskUserItemType,
  UserInfoItemType,
  UserInfoReqType,
  UserInfoRoleItemType,
  UserLogItemType,
  UserinfoOnlineItemType,
  detartMentGroupItemType
} from "./types";

import { http } from "@/utils/http";

export type {
  BelongGroupItemType,
  DetartMenttemType,
  GroupLeaderTreeItemType,
  MenuListItemType,
  MenuOpeionsItemType,
  UserInfoItemType,
  UserInfoReqType,
  UserInfoRoleItemType,
  detartMentGroupItemType,
  DeptInfoItemType,
  BillNumberItemType,
  RoleUserItemType,
  DeptUserItemType,
  MenuTreeItemType,
  DataAuthItemType,
  DataAuthMenuItemType,
  OptAuthItemType,
  OptAuthRoleItemType,
  OptAuthDeptTreeItemType,
  SystemParamsListItemType,
  SystemParamsNumberItemType,
  SystemParamsValueItemType,
  EnumDictionaryItemType,
  EnumDictionaryOptionItemType,
  UserLogItemType,
  DataBaseItemType,
  DataTableItemType,
  DataFieldItemType,
  DataBaseSearchItemType,
  CacheManageItemType,
  DbMaintenanceItemType,
  TaskScheduleItemType,
  TaskRoleItemType,
  TaskUserItemType,
  RoleInfoItemType,
  FlowManageItemType,
  FlowTaskItemType,
  TaskApprovalInfoRoleItemType,
  TaskApprovalInfoResType,
  TaskApprovalInfoItemType,
  DeptRoleItemType,
  FlowBillItemType,
  FlowDesignConfigType,
  FlowCenterResType,
  FlowCenterItemType,
  FlowOAItemType,
  FlowKingdeeItemType,
  FlowWechatItemType,
  DeptInfoTreeOptionType,
  DeptUserInfoItemType,
  BillNumberProjectsOptionItemType,
  DataAuthMenuOptionType,
  UserinfoOnlineItemType,
  TaskLogItemType,
  TaskManageItemType,
  TaskMangeOptionType,
  TaskFileItemType,
  MenuColumnItemType,
  FlowGraphXMLType,
  FlowTaskManageItemType,
  TableGroupItemType,
  FormColumnItemType,
  MenuButtonItemType,
  MyWorkOrderItemType,
  EsopVersionItemType
};

/** ========================= 菜单管理(基础信息) ========================= */
/** 菜单管理列表 */
export function menuList(data) {
  return http.request<MenuListItemType[]>("post", "/sys/sys/menulist/select", { data });
}
/** 下拉菜单 */
export function menuOpeionsList() {
  return http.request<MenuOpeionsItemType[]>("post", "/sys/sys/menulist/selectmenuselecttree");
}

/** 添加菜单 */
export function menuAdd(data) {
  return http.request<boolean>("post", "/sys/sys/menulist/insert", { data });
}

/** 修改菜单 */
export function menuUpdate(data) {
  return http.request<boolean>("post", "/sys/sys/menulist/update", { data });
}

/** 删除菜单 */
export function menuDelete(params) {
  return http.request<boolean>("post", "/sys/sys/menulist/delete", { params });
}

/** ========================= 菜单按钮配置(菜单管理) ========================= */

/** 菜单按钮列表(包含查询) */
export function menuButtonList(data) {
  return http.request<MenuButtonItemType[]>("post", "/sys/sys/menubuttoninfo/select", { data });
}

/** 菜单按钮列表(不含查询) */
export function menuButtonVirtualList(data) {
  return http.request<MenuButtonItemType[]>("post", "/sys/sys/menubuttoninfo/selectnonvirtualbutton", { data });
}

/** 新增: 菜单按钮 */
export function addMenuButton(data) {
  return http.request<boolean>("post", "/sys/sys/menubuttoninfo/insert", { data });
}
/** 修改: 菜单按钮 */
export function updateMenuButton(data) {
  return http.request<boolean>("post", "/sys/sys/menubuttoninfo/update", { data });
}
/** 删除: 菜单按钮 */
export function deleteMenuButton(data) {
  return http.request<boolean>("post", "/sys/sys/menubuttoninfo/deleteBatch", { data });
}
/** 批量修改: 菜单按钮 */
export function batchMenuButton(data) {
  return http.request<boolean>("post", "/sys/sys/menubuttoninfo/batchinsertorupdatemenucloumns", { data });
}

/** 按钮配置: 获取操作按钮接口地址 */
export function getButtonUrlList(data) {
  return http.request<TablePagingResType<string>>("post", "/sys/sys/menubuttoninfo/mappingurl", { data });
}

/** ========================= 表单配置(菜单管理) ========================= */

/** 表单配置: 获取列表 */
export function formColumnList(menuId, params = {}) {
  return http.request<FormColumnItemType[]>("get", "/sys/sys/SysMenuFormItem/select/" + menuId, { ...params });
}
/** 表单配置: 更新 */
export function updateformColumn(data: FormColumnItemType[]) {
  return http.request<boolean>("put", "/sys/sys/SysMenuFormItem/updateBatch", { data });
}
/** 表单配置: 删除 */
export function deleteformColumn(data) {
  return http.request<boolean>("delete", "/sys/sys/SysMenuFormItem/deleteBatch", { data });
}

/** ========================= 表格配置(菜单管理) ========================= */

/** 表格配置: 获取表格动态配置列 */
export function menuColumnList(data) {
  return http.request<MenuColumnItemType[]>("post", "/sys/sys/menucolumn/select", { data });
}
/** 表格配置: 新增一行 */
export function addMenuColumn(data) {
  return http.request<boolean>("post", "/sys/sys/menucolumn/insert", { data });
}
/** 表格配置: 保存整个表数据 */
export function addBatchMenuColumn(data) {
  return http.request<boolean>("post", "/sys/sys/menucolumn/batchinsertorupdatemenucloumns", { data });
}
/** 表格配置: 修改 */
export function updateMenuColumn(data) {
  return http.request<boolean>("post", "/sys/sys/menucolumn/update", { data });
}
/** 表格配置: 删除 */
export function deleteMenuColumn(data) {
  return http.request<boolean>("post", "/sys/sys/menucolumn/delete", { data });
}

/** 表格配置: 分组列表 */
export function tableGroupList(data) {
  return http.request<TableGroupItemType[]>("post", "/sys/sys/menucolumngroup/select", { data });
}
/** 表格配置: 新增分组项 */
export function addTableGroup(data) {
  return http.request<boolean>("post", "/sys/sys/menucolumngroup/insert", { data });
}
/** 表格配置: 修改分组项 */
export function updateTableGroup(data) {
  return http.request<boolean>("post", "/sys/sys/menucolumngroup/update", { data });
}
/** 表格配置: 删除分组项 */
export function deleteTableGroup(params) {
  return http.request<boolean>("get", "/sys/sys/menucolumngroup/delete", { params });
}

/** ========================= 用户表格配置(菜单管理) ========================= */
/** 获取-用户自定义配置表格 */
export function userMenuColumnList(data) {
  return http.request<MenuColumnItemType[]>("post", "/sys/sys/usermenucolumn/select", { data });
}
/** 修改-用户自定义配置表格 */
export function updateUserMenuColumn(data) {
  return http.request<boolean>("post", "/sys/sys/usermenucolumn/batchinsertorupdatemenucloumns", { data });
}

/** 移除-用户自定义配置表格 */
export function recoverUserMenuColumn(data) {
  return http.request<boolean>("delete", "/sys/sys/usermenucolumn/restoreDefaultConf", { data });
}

/** ========================= 部门管理(基础信息) ========================= */
/** 部门管理列表 */
export function detartMentList() {
  return http.request<DetartMenttemType[]>("post", "/sys/sys/deptinfo/select");
}
/** 获取不超过三级的部门树 */
export function departTreeNotOverThreeLevel() {
  return http.request("get", "/sys/sys/deptinfo/getDeptTreeForLevel");
}
/** 添加编辑部门下拉列表 */
export function getDetartMenuOptionList() {
  return http.request<DetartMenuOptionType>("get", "/sys/sys/deptinfo/getpagemessage");
}
/** 添加部门管理 */
export function detartMentAdd(data) {
  return http.request<boolean>("post", "/sys/sys/deptinfo/insert", { data });
}
/** 修改部门管理 */
export function detartMentUpdate(data) {
  return http.request<boolean>("post", "/sys/sys/deptinfo/update", { data });
}
/** 删除部门管理 */
export function detartMentDelete(params) {
  return http.request<boolean>("post", "/sys/sys/deptinfo/delete", { params });
}

/** 部门分组 */
export function detartMentGroup(params) {
  return http.request<detartMentGroupItemType[]>("post", "/sys/sys/deptgroupinfo/selectgrouptree", { params, headers: { hideLoading: true } });
}
/** 新增分组 获取最大部门编号 */
export function addGroupSelectMax() {
  return http.request<string>("post", "/sys/sys/deptgroupinfo/selectmax");
}

/** 获取组别负责人-下拉列表 */
export function detartGroupLeaderTree(params) {
  return http.request<GroupLeaderTreeItemType[]>("get", "/sys/sys/userinfo/selectuserinfo", { params });
}
/** 获取所属分组-下拉列表 */
export function detartGroupTree(params) {
  return http.request<BelongGroupItemType[]>("get", "/sys/sys/deptgroupinfo/grouptreeselectdata", { params });
}
/** 添加分组 */
export function detartGroupAdd(data) {
  return http.request<boolean>("post", "/sys/sys/deptgroupinfo/insert", { data });
}
/** 修改分组 */
export function detartGroupUpdate(data) {
  return http.request<boolean>("post", "/sys/sys/deptgroupinfo/update", { data });
}
/** 删除分组 */
export function detartGroupDelete(params) {
  return http.request<boolean>("post", "/sys/sys/deptgroupinfo/delete", { params });
}

/** ========================= 用户管理(基础信息) ========================= */

/** 用户列表 */
export function userInfoList(data: UserInfoReqType) {
  return http.request<TablePagingResType<UserInfoItemType>>("post", "/sys/sys/userinfo/select", { data });
}
/** 新增角色 */
export function userInfoAdd(data) {
  return http.request<boolean>("post", "/sys/sys/userinfo/insert", { data });
}
/** 修改角色 */
export function userInfoUpdate(data) {
  return http.request<boolean>("post", "/sys/sys/userinfo/update", { data });
}
/** 删除角色 */
export function deleteUserRoleInfo(data) {
  return http.request("post", "/sys/sys/userrole/delete", { data });
}
/** 导出 */
export function exportUserInfo(data) {
  return http.request<string>("post", "/sys/sys/userinfo/export", { data });
}
/** 在线人员明细 */
export function onlineUserInfoDetail() {
  return http.request<UserinfoOnlineItemType[]>("post", "/sys/sys/userinfo/getonline");
}
/** 重置密码 */
export function resetPassword(data) {
  return http.request<boolean>("post", "/sys/sys/userinfo/resetpassword", { data });
}
/** 创建数据库帐号 */
export function createDatabase(data) {
  return http.request<boolean>("post", "/sys/sys/userinfo/createuseraccountbyusercode", { data });
}
/** 创建金蝶账号 */
export function createKingdee(id) {
  return http.request<boolean>("get", `/sys/sys/userinfo/setK3UserAccount/${id}`, {});
}
/** 删除数据库帐号 */
export function deleteDatabase(data) {
  return http.request<boolean>("post", "/sys/sys/userinfo/deleteuseraccountbyusercode", { data });
}

/** 角色列表(右侧表格) */
export function userInfoRole(params) {
  const { id, ...data } = params;
  return http.request<UserInfoRoleItemType[]>("post", "/sys/sys/userinfo/selectuserrolebyid", { params: { id }, data, headers: { hideLoading: true } });
}

/** 删除用户角色 */
export function userRoleDelete(data) {
  return http.request<boolean>("post", "/sys/sys/userinfo/deleteusersrole", { data });
}

/** 新增角色 - 获取部门名称 */
export function getDeptTreeList() {
  return http.request<DeptInfoItemType[]>("post", "/sys/sys/roleauthority/selecttree");
}

/** 添加角色 - 提交添加 */
export function addDeptRole(data) {
  return http.request<boolean>("post", "/sys/sys/userrole/insert", { data });
}

/** 设置主角色 */
export function setMainRole(data) {
  return http.request("post", "/sys/sys/userrole/updateuserrole", { data });
}

/** 查询用户部门列表  */
export function queryUserDeptList(data) {
  return http.request("post", "/sys/sys/userdeptinfo/selectAllDatas", { data, headers: { hideLoading: true } });
}

/** 新增用户部门  */
export function insertUserDeptList(data) {
  return http.request("post", "/sys/sys/userdeptinfo/insertorupdateuserdept", { data });
}

/** 删除用户部门  */
export function deleteUserDeptList(data) {
  return http.request("post", "/sys/sys/userdeptinfo/deleteuserdept", { data });
}

/** ========================= 单据编号(基础信息) ========================= */
/** 获取单据列表 */
export function billNumberList(data) {
  return http.request<TablePagingResType<BillNumberItemType>>("post", "/sys/sys/billcoderule/select", { data });
}

/** 获取最大递增业务ID */
export function getBillIDIndex() {
  return http.request<string>("post", "/sys/sys/billcoderule/selectmaxbillId");
}

/** 提交新增检测 */
export function billNumberAddCheck(data) {
  return http.request<number>("post", "/sys/sys/billcoderule/selectrepeatprefixsuffix", { data });
}

/** 添加编辑归属模块下拉框 */
export function billNumberProjectsOptionList() {
  return http.request<BillNumberProjectsOptionItemType[]>("get", "/sys/sys/billcoderule/getprojectsoptionlist");
}

/** 新增单据 */
export function billNumberAdd(data) {
  return http.request<boolean>("post", "/sys/sys/billcoderule/insert", { data });
}

/** 修改单据 */
export function billNumberUpdate(data) {
  return http.request<boolean>("post", "/sys/sys/billcoderule/update", { data });
}

/** 获取单据编号编辑菜单列表选项 */
export function billMenuList(data) {
  return http.request<MenuListItemType[]>("post", "/sys/sys/menulist/getmenulistfilterdirandbtn", { data });
}

/** 删除单据 */
export function billNumberDelete(params) {
  return http.request<TablePagingResType<BillNumberItemType>>("post", "/sys/sys/billcoderule/delete", { params });
}

/** 导出单据 */
export function billNumberExport(data) {
  return http.request<string>("post", "/sys/sys/billcoderule/export", { data });
}

/** ========================= 角色设置(权限管理) ========================= */

/** 新增角色获取最大编号 */
export function roleSelectMax() {
  return http.request<string>("post", "/sys/sys/roleinfo/selectmax");
}
/** 新增角色 */
export function roleAdd(data) {
  return http.request<boolean>("post", "/sys/sys/roleinfo/insert", { data });
}

/** 修改角色 */
export function roleUpdate(data) {
  return http.request<boolean>("post", "/sys/sys/roleinfo/update", { data });
}

/** 删除角色 */
export function roleDelete(params) {
  return http.request<boolean>("post", "/sys/sys/roleinfo/delete", { params });
}

/** 设置金蝶角色 */
export function setKingdeeRole(id) {
  return http.request<boolean>("get", `/sys/sys/roleinfo/setK3Role/${id}`, {});
}
/** 设置企业微信标签 */
export function setQYWXTag(data) {
  return http.request("post", `/sys/sys/roleinfo/setQYWXTag`, { data });
}

/** 获取角色下的用户 */
export function roleUserList(data) {
  return http.request<RoleUserItemType[]>("post", "/sys/sys/userrole/select", { data, headers: { hideLoading: true } });
}
/** 删除用户 */
export function deleteRuleUser(data) {
  return http.request<boolean>("post", "/sys/sys/userrole/delete", { data });
}
/** 弹窗表格 */
export function getDeptUserList(params) {
  return http.request<DeptUserItemType[]>("get", "/sys/sys/userinfo/queryuserinfo", { params, headers: { hideLoading: true } });
}

/** ========================= 角色权限(权限管理) ========================= */

/** 获取权限树选中 */
export function menuTree(params) {
  return http.request<MenuTreeItemType[]>("post", "/sys/sys/roleauthority/select", { params, headers: { hideLoading: true } });
}
/** 复制权限 */
export function copyAuthority(data) {
  return http.request<boolean>("post", "/sys/sys/roleauthority/copy", { data });
}

/** 保存权限 */
export function saveAuthority(data) {
  return http.request<boolean>("post", "/sys/sys/roleauthority/save", { data });
}

/** 按钮权限获取 */
export function getBtnListByMenuId(data) {
  return http.request("post", "/sys/sys/roleauthority/SelectRoleButtonAuthority", { params: data, headers: { hideLoading: true } });
}

/** ========================= 数据权限(权限管理) ========================= */

/** 数据权限列表 */
export function dataAuthList(data) {
  return http.request<DataAuthItemType[]>("post", "/sys/sys/roleinfo/select", { data });
}

/** 数据权限右侧菜单列表 */
export function dataAuthMenuList(data) {
  return http.request<DataAuthMenuItemType[]>("post", "/sys/sys/roledataauthority/select", { data, headers: { hideLoading: true } });
}
/** 修改权限 */
export function dataAuthMenuUpdate(data) {
  return http.request<boolean>("post", "/sys/sys/roledataauthority/update", { data });
}

/** ========================= 接口集管理(权限管理) ========================= */

/** 查询接口集列表数据 */
export function getApiList(data) {
  return http.request("post", "/sys/sys/sysMappingSet/select", { data });
}

/** 初始化接口集 */
export function initApiList(data) {
  return http.request("get", "/sys/sys/sysMappingSet/initialize", { params: data });
}

/** 批量修改接口集 */
export function updateApiList(data) {
  return http.request("post", "/sys/sys/sysMappingSet/update", { data });
}

/** ========================= 操作权限(权限管理) ========================= */

/** 数据权限列表 */
export function optAuthList() {
  return http.request<OptAuthItemType[]>("post", "/sys/sys/operationpermissions/select");
}
/** 数据权限角色列表 */
export function optAuthRoleList(params) {
  const { menuId, menuType, ...data } = params;

  return http.request<OptAuthRoleItemType[]>("post", "/sys/sys/operationpermissions/queryroles", {
    params: { menuId, menuType },
    data,
    headers: { hideLoading: true }
  });
}
/** 数据权限部门列表 */
export function optAuthDeptTree(data) {
  return http.request<OptAuthDeptTreeItemType[]>("post", "/sys/sys/operationpermissions/selecttree", { data });
}
/** 数据权限角色添加 */
export function optAuthRoleAdd(data) {
  return http.request<boolean>("post", "/sys/sys/operationpermissions/save", { data });
}
/** 数据权限角色删除 */
export function optAuthRoleDelete(params) {
  const { menuId, menuType, ...data } = params;
  return http.request<boolean>("post", "/sys/sys/operationpermissions/delete", { params: { menuId, menuType }, data });
}

/** ========================= 系统参数(开发运维) ========================= */

/** 获取系统参数列表(左) */
export function systemParamsList() {
  return http.request<SystemParamsListItemType[]>("post", "/sys/sys/menulist/selectsystem");
}

/** 获取列表参数编号(中) */
export function systemParamsNumberList(data) {
  return http.request<SystemParamsNumberItemType[]>("post", "/sys/sys/systemparamlist/select", { data, headers: { hideLoading: true } });
}
/** 添加参数编号(中) */
export function systemParamsNumberAdd(data) {
  return http.request<boolean>("post", "/sys/sys/systemparamlist/insert", { data });
}
/** 修改参数编号(中) */
export function systemParamsNumberUpdate(data) {
  return http.request<boolean>("post", "/sys/sys/systemparamlist/update", { data });
}
/** 删除参数编号(中) */
export function systemParamsNumbeDelete(params) {
  return http.request<boolean>("post", "/sys/sys/systemparamlist/delete", { params });
}

/** 获取列表参数值(右) */
export function systemParamsValueList(data) {
  return http.request<SystemParamsValueItemType[]>("post", "/sys/sys/systemparameter/select", { data, headers: { hideLoading: true } });
}
/** 添加参数值(右) */
export function systemParamsValueAdd(data) {
  return http.request<boolean>("post", "/sys/sys/systemparameter/insert", { data });
}
/** 修改参数值(右) */
export function systemParamsValueUpdate(data) {
  return http.request<boolean>("post", "/sys/sys/systemparameter/update", { data });
}
/** 删除参数值(右) */
export function systemParamsValueDelete(params) {
  return http.request<boolean>("post", "/sys/sys/systemparameter/delete", { params });
}

/** ========================= 枚举字典(开发运维) ========================= */

/** 获取枚举字典列表(左) */
export function enumDictionaryList(data) {
  return http.request<EnumDictionaryItemType[]>("post", "/sys/sys/optioninfo/select", { data });
}

/** 添加枚举字典(左) */
export function enumDictionaryAdd(data) {
  return http.request<boolean>("post", "/sys/sys/optioninfo/insert", { data });
}
/** 修改枚举字典(左) */
export function enumDictionaryUpdate(data) {
  return http.request<boolean>("post", "/sys/sys/optioninfo/update", { data });
}
/** 删除枚举字典(左) */
export function enumDictionaryDelete(params) {
  return http.request<boolean>("get", "/sys/sys/optioninfo/delete", { params });
}

/** 获取枚举字典选项列表(右) */
export function enumDictionaryOptionList(data) {
  return http.request<EnumDictionaryOptionItemType[]>("post", "/sys/sys/optionlist/select", { data });
}
/** 添加枚举字典选项(右) */
export function enumDictionaryOptionAdd(data) {
  return http.request<boolean>("post", "/sys/sys/optionlist/insert", { data });
}
/** 获取枚举字典最大序号(右) */
export function enumDictionaryOptionSelectMax(data) {
  return http.request<string>("post", "/sys/sys/optionlist/selectmax", { data });
}
/** 修改枚举字典选项(右) */
export function enumDictionaryOptionUpdate(data) {
  return http.request<boolean>("post", "/sys/sys/optionlist/update", { data });
}
/** 删除枚举字典选项(右) */
export function enumDictionaryOptionDelete(data) {
  return http.request<boolean>("post", "/sys/sys/optionlist/delete", { data });
}

/** ========================= 日志管理(开发运维) ========================= */

/** 日志列表 */
export function userLogList(data) {
  return http.request<TablePagingResType<UserLogItemType>>("post", "/sys/sys/userlogs/select", { data });
}

/** 导出日志 */
export function userLogExport(data) {
  return http.request<string>("post", "/sys/sys/userlogs/export", { data });
}

/** ========================= 数据字典(开发运维) ========================= */

/** 数据库列表 */
export function dataBaseList(data) {
  return http.request<DataBaseItemType[]>("post", "/sys/sys/datadictionary/querydatabaseinfo", { data });
}

/** 数据表列表 */
export function dataTableList(params) {
  return http.request<DataTableItemType[]>("get", "/sys/sys/datadictionary/querytableinfo", { params, headers: { hideLoading: true } });
}

/** 数据字段列表 */
export function dataFieldList(params) {
  return http.request<DataFieldItemType[]>("get", "/sys/sys/datadictionary/queryfieldinfo", { params, headers: { hideLoading: true } });
}

/** 数据库搜素列表 */
export function dataBaseSearch(data) {
  return http.request<DataBaseSearchItemType>("post", "/sys/sys/datadictionary/search", { data });
}

/** ========================= 缓存管理(开发运维) ========================= */

/** 缓存管理列表 */
export function cacheManageList(data) {
  return http.request<CacheManageItemType[]>("post", "/sys/sys/cachemanager/cachelist", { data });
}

/** ========================= 数据库维护(开发运维) ========================= */

/** 数据库维护列表 */
export function dbMaintenanceList(data) {
  return http.request<TablePagingResType<DbMaintenanceItemType>>("post", "/sys/sys/sqlexecuteapproval/selectList", { data });
}

/** 添加SQL审批申请 */
export function sqlAuditAdd(data, headers) {
  return http.request<boolean>("post", "/sys/sys/sqlexecuteapproval/insertsqlexecuteapproval", { data, headers });
}

/** 修改SQL审批申请 */
export function sqlAuditUpdate(data, headers) {
  return http.request<boolean>("post", "/sys/sys/sqlexecuteapproval/updatesqlexecuteapproval", { data, headers });
}

/** 删除SQL审批申请 */
export function sqlAuditDelete(data, headers) {
  return http.request<boolean>("post", "/sys/sys/sqlexecuteapproval/deletesqlexecuteapprovalbyid", { data, headers });
}

/** 提交SQL审批申请 */
export function sqlAuditSubmit(data, headers) {
  return http.request<boolean>("post", "/sys/sys/sqlexecuteapproval/submitapprovalbyid", { data, headers });
}

/** 执行SQL审批申请 */
export function sqlAuditExecute(data, headers) {
  return http.request<boolean>("post", "/sys/sys/sqlexecuteapproval/executesqlbyid", { data, headers });
}

/** ========================= 工作流 ========================= */

/** 流程管理 - 获取表格数据 */
export function flowManageList(data) {
  return http.request<FlowManageItemType[]>("post", "/sys/bp/processmanage/query", { data });
}
/** 流程管理 - 获取流程状态(true: 激活状态 false:暂停状态) */
export function getFlowState(params) {
  return http.request<boolean>("get", "/sys/bp/processmanage/issuspended", { params });
}

/** 流程管理 - 部署流程 */
export function deployFlow(data) {
  return http.request<number>("post", "/sys/bp/processmanage/deployprocess", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}
/** 流程管理 - 部署流程(传xml字符串) */
export function deployFlowStr(data) {
  return http.request<number>("post", "/sys/bp/processmanage/deployprocessbystr", { data });
}
/** 流程管理 - 更新任务管理(流程部署就更新) */
export function updateFlowTask(data) {
  return http.request<boolean>("post", "/sys/bp/processmanage/updateadviceconfig", { data });
}

/** 流程管理 - 获取流程图xml */
export function editFlow(params) {
  return http.request<FlowGraphXMLType>("get", "/sys/bp/processmanage/getprocessxml", { params });
}
/** 流程管理 - 获取审批部门最大层级 */
export function getDeptLevel() {
  return http.request<number>("post", "/sys/bp/processmanage/getdeptlevel");
}

/** 流程管理 - 撤销流程(检测接口) */
export function revokeFlowCheck(params) {
  return http.request<boolean>("get", "/sys/bp/processmanage/ishashistoryprocess", { params });
}
/** 流程管理 - 删除流程 */
export function revokeFlow(params) {
  return http.request<boolean>("get", "/sys/bp/processmanage/deletedeploy", { params });
}
/** 流程管理 - 根据ID删除流程(只创建模板, 未创建流程时) */
export function revokeFlowConfig(params) {
  return http.request<boolean>("get", "/sys/bp/processmanage/deleteprocessconfig", { params });
}

/** 流程管理 - 暂停与激活流程(检测接口) */
export function pauseActiveFlowCheck(params) {
  return http.request<boolean>("get", "/sys/bp/processmanage/issuspended", { params });
}
/** 流程管理 - 暂停流程 */
export function pauseFlow(params) {
  return http.request<boolean>("get", "/sys/bp/processmanage/suspended", { params });
}

/** 流程管理 - 激活流程 */
export function activeFlow(params) {
  return http.request<boolean>("get", "/sys/bp/processmanage/activate", { params });
}

/** 流程管理 - 设计图 */
export function getFlowDesignConfig(params) {
  return http.request<FlowDesignConfigType>("post", "/sys/bp/processmanage/getlogicflowdata", { params });
}

/** 流程管理 - 任务管理-状态请求预请求 */
export function getFlowTaskState() {
  return http.request<boolean>("post", "/sys/bp/processmanage/flowmanage");
}
/** 流程管理 - 任务管理-任务列表下拉列表 */
export function flowTaskList(params) {
  return http.request<FlowTaskItemType[]>("get", "/sys/bp/processmanage/getprocesstaskinfo", { params });
}
/** 流程管理 - 任务管理-任务列表下拉列表change事件 */
export function getTaskApprovalInfo(params) {
  return http.request<TaskApprovalInfoResType>("get", "/sys/bp/processmanage/getapprovalbytask", { params });
}

/** 流程管理 - 任务管理-获取部门角色列表 */
export function getDeptRoleList(data) {
  return http.request<DeptRoleItemType[]>("post", "/sys/sys/roleinfo/queryallroleinfo", { data });
}

/** 流程管理 - 任务管理-提交修改 */
export function updateTaskFlow(data) {
  return http.request<boolean>("post", "/sys/bp/processmanage/saveapprovaltotask", { data });
}
/** 流程管理 - 模板配置-获取单据列表 */
export function getFlowBillList() {
  return http.request<FlowBillItemType[]>("post", "/sys/sys/billcoderule/getall");
}
/** 流程管理 - 模板配置-获取单据列表(未部署单据列表) */
export function getFlowBillPendingList(data) {
  return http.request<FlowBillItemType[]>("post", "/sys/sys/billcoderule/getnodeploybillrule", { data });
}
/** 流程管理 - 模板配置-获取单据信息 */
export function getFlowBillInfo(params) {
  return http.request<TaskRoleItemType>("get", "/sys/bp/processmanage/getconfigbyprocessid", { params });
}
/** 流程管理 - 模板配置-获取单据信息(根据ID) */
export function getFlowBillInfoById(params) {
  return http.request<TaskRoleItemType>("get", "/sys/bp/processmanage/getprocessconfigbyid", { params });
}

/** 流程管理 - 模板配置-新增 */
export function addFlowBillInfo(data) {
  return http.request<number>("post", "/sys/bp/processmanage/insertprocessconfig", { data });
}
/** 流程管理 - 模板配置-更新 */
export function updateFlowBillInfo(data) {
  return http.request<number>("post", "/sys/bp/processmanage/saveprocessconfig", { data });
}
/** 流程管理 - 模板配置-更新(使用id) */
export function updateFlowBillInfoById(data) {
  return http.request<number>("post", "/sys/bp/processmanage/updateprcessconfigbyid", { data });
}

/** 流程中心 - 获取表格数据 */
export function flowCenterList(data) {
  return http.request<FlowCenterResType>("post", "/sys/bp/processcenter/query", { data });
}
/** 流程中心 - 回退 */
export function backFlowCenter(params) {
  return http.request<boolean>("post", "/sys/bp/processcenter/rollbacktask", { params });
}
/** 流程中心 - 撤销 */
export function revokeFlowCenter(data) {
  return http.request<boolean>("post", "/sys/bp/processcenter/cancelprocess", { data });
}
/** 流程中心 - 暂停 */
export function pauseFlowCenter(params) {
  return http.request<boolean>("post", "/sys/bp/processcenter/suspendprocess", { params });
}
/** 流程中心 - 终止 */
export function stopFlowCenter(params) {
  return http.request<boolean>("post", "/sys/bp/processcenter/terminationprocess", { data: params });
}
/** 流程中心 - 恢复 */
export function restoreFlowCenter(params) {
  return http.request<boolean>("post", "/sys/bp/processcenter/activateprocess", { params });
}
/** 流程中心 - 查看流程图 */
export function flowChartCenter(params) {
  return http.request<FlowDesignConfigType>("post", "/work/wb/infocenter/gettasksdatabybillno", { params });
}
/** 流程中心 - 查看单据 - 获取流程ID */
export function getIdByBillNumber(params, config) {
  return http.request<string>("get", "/sys/bp/processcenter/getidbybillnumber", { params }, config);
}
/** 流程看板 - OA列表 */
export function flowOAList(data) {
  return http.request<FlowOAItemType[]>("post", "/sys/bp/processkanban/selectOA", { data });
}
/** 流程看板 - OA列表-更改审批人 */
export function changeApproval(data) {
  return http.request<number>("post", "/sys/bp/processkanban/swapoldapprovaltonewapproval", { data });
}
/** 流程看板 - 金蝶列表 */
export function flowKingdeeList(data) {
  return http.request<FlowKingdeeItemType[]>("post", "/sys/bp/processkanban/selectJindie", { data });
}
/** 流程看板 - 企业微信列表 */
export function flowWechatList(data) {
  return http.request<FlowWechatItemType[]>("post", "/sys/bp/processkanban/selectQywx", { data });
}
/** 流程看板 - 企业微信-抓取当前月份数据 */
export function getQywxDataByMonth(data) {
  return http.request<boolean>("post", "/sys/bp/processkanban/getQywxDataByMonth", { data });
}

/** ========================= 任务调度 ========================= */

/** 任务调度列表 */
export function taskScheduleList(data) {
  return http.request<TablePagingResType<TaskScheduleItemType>>("post", "/sys/sys/taskschedulingconfig/select", { data });
}

/** 添加任务调度 */
export function addTaskSchedule(data) {
  return http.request<Boolean>("post", "/sys/sys/taskschedulingconfig/insert", { data });
}

/** 修改任务调度 */
export function updateTaskSchedule(data) {
  return http.request<Boolean>("post", "/sys/sys/taskschedulingconfig/update", { data });
}

/** 删除任务调度 */
export function deleteTaskSchedule(params) {
  return http.request<Boolean>("post", "/sys/sys/taskschedulingconfig/delete", { params });
}

/** 刷新任务调度 */
export function freshTaskSchedule() {
  return http.request("get", "/sys/sys/taskschedulingconfig/refresh", { params: {} });
}

/** 任务角色列表 */
export function taskRoleList(data) {
  return http.request<TaskRoleItemType[]>("post", "/sys/sys/taskschedulingconfig/selectToRoles", { data, headers: { hideLoading: true } });
}

/** 任务用户列表 */
export function taskUserList(data) {
  return http.request<TaskUserItemType[]>("post", "/sys/sys/taskschedulingconfig/selectToUsers", { data, headers: { hideLoading: true } });
}

/** 获取部门菜单(弹窗) */
export function getDeptTreeData() {
  return http.request<string>("get", "/sys/com/getdepttreedata", { headers: { hideLoading: true } });
}

/** 获取角色列表(弹窗) */
export function getRoleInfoList(params) {
  return http.request<RoleInfoItemType[]>("get", "/sys/sys/roleinfo/queryroleinfo", { params });
}

/** 添加和移除角色 公共接口(弹窗) */
export function addSelectRole(data) {
  return http.request<boolean>("post", "/sys/sys/taskschedulingconfig/UpdateToRoles", { data });
}

/** 添加和移除用户 公共接口(弹窗) */
export function addSelectUser(data) {
  return http.request<boolean>("post", "/sys/sys/taskschedulingconfig/UpdateToUsers", { data });
}

/** ========================= 任务管理 ========================= */
/** 任务管理: 列表 */
export function taskManageList(data) {
  return http.request<TablePagingResType<TaskManageItemType>>("post", "/oa/sys/systaskregister/select", { data });
}

/** 任务管理: 获取任务日志 */
export function getTaskLog(params) {
  return http.request<TaskLogItemType[]>("get", "/oa/sys/systaskregister/gettasklog", { params, headers: { hideLoading: true } });
}
/** 任务管理: 修改弹窗获取文件列表 */
export function taskFileList(params) {
  return http.request<TaskFileItemType[]>("get", "/oa/sys/systaskregister/selectTaskFilesByBillNo", { params, headers: { hideLoading: true } });
}
/** 任务管理: 删除弹窗列表文件 */
export function deleteTaskFile(params) {
  return http.request<boolean>("get", "/oa/sys/systaskregister/deleteTaskFilesById", { params });
}
/** 任务管理: 提交前获取任务编码 */
export function getTaskCode(params) {
  return http.request<string>("get", "/oa/sys/systaskregister/gettasknumber", { params });
}
/** 任务管理: 修改任务的状态 */
export function updateTaskStatus(params) {
  return http.request<boolean>("post", "/oa/sys/systaskregister/updatetaskstatus", { data: params });
}
/** 任务管理: 新增主/子任务 */
export function addMainTask(data) {
  return http.request<boolean>("post", "/oa/sys/systaskregister/insert", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}
/** 任务管理: 编辑任务 */
export function editTask(data) {
  return http.request<boolean>("post", "/oa/sys/systaskregister/update", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}
/** 任务管理: 导出任务md */
export function exportTask(params) {
  return http.request<string>("get", "/oa/sys/systaskregister/export", { params });
}
/** 任务管理: 预览任务md */
export function viewTask(params) {
  return http.request<{ markdown_content: string }>("get", "/oa/sys/systaskregister/preview-v2", { params });
}
/** 任务管理: 删除任务 */
export function deleteTask(params) {
  return http.request<boolean>("post", "/oa/sys/systaskregister/delete", { data: params });
}
/** 任务管理: 提交任务 */
export function submitTask(id) {
  return http.request("post", `/oa/sys/systaskregister/submitApproval/${id}`, {});
}

/** ========================= 我的工单 ========================= */

/** 我的工单: 列表 */
export function fetchMyWorkOrderList(data) {
  return http.request<TablePagingResType<MyWorkOrderItemType>>("post", "/oa/sys/systaskregister/selectByUser", { data });
}

/** 我的工单: 根据id获取详情 */
export function getMyWorkOrderDetail(id) {
  return http.request<MyWorkOrderItemType>("get", `/oa/sys/systaskregister/selectById/${id}`);
}

/** 审批通用提交 */
export function commonSubmit(params, headers?) {
  return http.request("post", "/app/common/approval/submit", { data: params, headers });
}

/** 审批通用回退 */
export function commonBack(params, headers?) {
  return http.request("post", "/app/common/approval/back", { data: params, headers });
}

/** ========================= APP版本日志 ========================= */
/** APP版本日志 列表 */
export function esopVersionList() {
  return http.request<EsopVersionItemType[]>("get", "/sys/application/apk/getApplicationInfo");
}
/** 新增 - APP版本日志 */
export function addEsopVersion(data) {
  return http.request<boolean>("post", "/sys/application/apk/insertApplicationInfo", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** ========================= 任务统计 ========================= */
/** 任务统计 任务分配看板 */
export function getTaskBoardData(params) {
  return http.request("get", "/oa/sys/systaskregisterstatistics/getTaskBoard", { params });
}
/** 任务统计 - 任务绩效 */
export function getTaskPerformanceData(params) {
  return http.request("get", "/oa/sys/systaskregisterstatistics/getTaskPerformance", { params });
}
