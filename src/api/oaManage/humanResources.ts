import {
  ApprovalDataType,
  AttendanceMachineItemType,
  AttendanceSummaryItemType,
  AttendanceSummaryOption,
  CarInfoItemType,
  DeptStatisticsItemType,
  GoodsManageItemType,
  GoodsManageOptionType,
  HolidaySettingDataType,
  HolidaySettingItemType,
  InductionAuditDetailResType,
  InductionAuditItemType,
  InductionAuditOptionDataType,
  JobLevelStatisticsItemType,
  LeaveApplyDetailItemType,
  LeaveApplyEditOptionItemType,
  LeaveApplyItemType,
  MealCostManageListItemType,
  NoStaffItemType,
  OrderManageItemType,
  OtherApprovalType,
  OvertimeDetailItemType,
  OvertimeOrderEditOptionItemType,
  OvertimeOrderItemType,
  PerformanceManageItemType,
  PersonFlowStatisticsDetailItemType,
  ResignApplyApproveNodeItemType,
  ResignApplyItemType,
  StaffAnalysisType,
  StaffChangeItemType,
  StaffDeptGroupItemType,
  StaffDeptRoleInfoItemType,
  StaffInfoEducationVOListType,
  StaffInfoEducationVOSType,
  StaffInfoFamilyVOListType,
  StaffInfoFamilyVOSType,
  StaffInfoItemType,
  StaffInfoOptionType,
  StaffInfoPhotoVOListType,
  StaffInfoPhotoVOSItemType,
  StaffInfoWorkVOListType,
  StaffInfoWorkVOSType,
  StatisticsPeopleDetailItemType,
  TimeSettingItemType,
  UserBasicInfoItemType
} from "./types/humanResources";
import { DeptInfoTreeOptionType, UserInfoItemType, UserInfoReqType } from "@/api/systemManage/types";

import { AxiosProgressEvent } from "axios";
import { http } from "@/utils/http";

export type {
  TimeSettingItemType,
  AttendanceSummaryItemType,
  GoodsManageItemType,
  OrderManageItemType,
  StaffInfoItemType,
  StaffDeptGroupItemType,
  InductionAuditItemType,
  InductionAuditDetailResType,
  StaffInfoEducationVOListType,
  StaffInfoFamilyVOListType,
  StaffInfoWorkVOListType,
  StaffInfoPhotoVOListType,
  StaffAnalysisType,
  LeaveApplyItemType,
  LeaveApplyDetailItemType,
  HolidaySettingDataType,
  HolidaySettingItemType,
  OvertimeOrderItemType,
  OvertimeDetailItemType,
  StaffInfoOptionType,
  GoodsManageOptionType,
  AttendanceSummaryOption,
  InductionAuditOptionDataType,
  StaffInfoPhotoVOSItemType,
  OvertimeOrderEditOptionItemType,
  LeaveApplyEditOptionItemType,
  StaffDeptRoleInfoItemType,
  CarInfoItemType,
  PerformanceManageItemType,
  MealCostManageListItemType,
  StaffInfoWorkVOSType,
  StaffInfoFamilyVOSType,
  StaffInfoEducationVOSType,
  ApprovalDataType,
  OtherApprovalType,
  DeptStatisticsItemType,
  JobLevelStatisticsItemType,
  StatisticsPeopleDetailItemType,
  PersonFlowStatisticsDetailItemType,
  AttendanceMachineItemType,
  NoStaffItemType,
  StaffChangeItemType,
  ResignApplyItemType,
  UserBasicInfoItemType,
  ResignApplyApproveNodeItemType
};

/** OA管理:人事行政部 */

/** ========================= 考勤管理 ========================= */

/** ========================= 工作时间设定 ========================= */
/** 工作时间设定: 列表 */
export function timeSettingList(data) {
  return http.request<TimeSettingItemType[]>("post", "/oa/hr/worktimeinfo/select", { data });
}
/** 工作时间设定: 新增 */
export function addTimeSetting(data) {
  return http.request<boolean>("post", "/oa/hr/worktimeinfo/insert", { data });
}
/** 工作时间设定: 修改 */
export function updateTimeSetting(data) {
  return http.request<boolean>("post", "/oa/hr/worktimeinfo/update", { data });
}
/** 工作时间设定: 删除 */
export function deleteTimeSetting(params) {
  return http.request<boolean>("post", "/oa/hr/worktimeinfo/delete", { params });
}

/** ========================= 考勤汇总 ========================= */
/** 考勤汇总: 列表 */
export function attendanceSummaryList(data) {
  return http.request<TablePagingResType<AttendanceSummaryItemType>>("post", "/oa/hr/attendanceSummary/getattendancedetailsbyparam", { data });
}
/** 考勤汇总: 上传考勤明细表 */
export function uploadAttendanceExcel(data) {
  return http.request<boolean>("post", "/oa/hr/attendanceSummary/uploadExcel", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}
/** 考勤汇总: 查询是否存在考勤明细数据 */
export function queryHasRecords(data) {
  return http.request<boolean>("post", "/oa/hr/attendanceSummary/existsrecord", { data });
}
/** 考勤汇总: 清除考勤明细 */
export function deleteAttendanceDetail(data) {
  return http.request<string>("post", "/oa/hr/attendanceSummary/deleteallrecord", { data });
}
/** 考勤汇总: 导出考勤明细表 */
export function exportAttendanceDetail(data) {
  return http.request<string>("post", "/oa/hr/attendanceSummary/exportattendancedetail", { data });
}
/** 考勤汇总: 修改考勤 */
export function editAttendanceSummary(data) {
  return http.request<boolean>("post", "/oa/hr/attendanceSummary/updateattendancedetailbyattendancedetaildto", { data });
}
/** 考勤汇总: 分发考勤 */
export function dispatchAttendanceSummary(data) {
  return http.request<boolean>("post", "/oa/hr/attendanceSummary/distributeAttendanceByIds", { data });
}
/** 考勤汇总: 删除考勤 */
export function deleteAttendanceSummary(data) {
  return http.request<boolean>("post", "/oa/hr/attendanceSummary/deleteAttendanceDetailByIds", { data });
}
/** ========================= 考勤机管理 ========================= */

/** 考勤机: 注册 */
export function registerMachine(data) {
  return http.request("post", "/oa/hr/AttendanceMachineInfo/register", { data });
}

/** 考勤机: 查询 */
export function fetchMachine(data) {
  return http.request<AttendanceMachineItemType[]>("post", "/oa/hr/AttendanceMachineInfo/select", { data });
}

/** 考勤机: 修改 */
export function updateMachine(data) {
  return http.request("post", "/oa/hr/AttendanceMachineInfo/update", { data });
}

/** 考勤机: 删除 */
export function deleteMachine(data) {
  return http.request("delete", "/oa/hr/AttendanceMachineInfo/delete", { params: data });
}
/** 考勤机: 下载面部信息 */
export function downloadFaceInfo(data) {
  return http.request<boolean>("post", "/oa/hr/AttendanceMachineInfo/downloadFaceInfo", { data });
}
/** 考勤机: 下载考勤数据 */
export function downloadAttendanceData(data) {
  return http.request<string>("post", "/oa/hr/xxxx", { data });
}

/** 考勤机 - 上传用户信息 */
export function uploadUserData(params, onUploadProgress: (progressEvent: AxiosProgressEvent) => void) {
  return http.request("post", "/upload/xxxx", { data: params }, { headers: { "Content-Type": "multipart/form-data" }, onUploadProgress });
}

/** ========================= 考勤记录 ========================= */

/** 考勤记录: 查询 */
export function fetchAttendanceRecord(data) {
  return http.request("post", "/oa/hr/attendancerecord/select", { data });
}

/** 考勤机操作日志: 查询 */
export function fetchAttendanceLog(data) {
  return http.request("post", "/oa/hr/AttendanceMachineLog/selectLog", { data });
}

/** 考勤记录: 导出 */
export function exportAttendanceRecord(data) {
  return http.request("post", "/oa/hr/attendancerecord/export", { data });
}

/** 考勤人员映射: 查询 */
export function fetchAttendanceUserList(data) {
  return http.request("post", "/oa/hr/attendanceusermapping/select", { data });
}

/** 考勤人员映射: 数据上传 */
export function uploadAttendanceData(data) {
  return http.request("post", "/oa/hr/attendanceusermapping/uploadMachineUserInfo", { data });
}

/** 考勤人员映射: 修改 */
export function updateAttendanceUser(data) {
  return http.request("post", "/oa/hr/attendanceusermapping/update", { data });
}

/** 考勤人员映射: 删除 */
export function deleteAttendanceUser(data) {
  return http.request("post", "/oa/hr/attendanceusermapping/deleteUserMapping", { params: data });
}

/** 考勤人员映射: 导出 */
export function exportAttendanceUser(data) {
  return http.request("post", "/oa/hr/attendanceusermapping/export", { data });
}

/** 考勤明细: 查询 */
export function fetchAttendanceDetail(data) {
  return http.request("post", "/oa/hr/AttendanceDetailInfo/selectAttDetail", { data });
}

/** 考勤明细: 导出 */
export function exportAttendancePageDetail(data) {
  return http.request("post", "/oa/hr/AttendanceDetailInfo/exportAttDetail", { data });
}

/** ========================= 内购后台 ========================= */
/** 商品管理: 列表 */
export function goodsManageList(data) {
  return http.request<TablePagingResType<GoodsManageItemType>>("post", "/oa/hr/commodityManagement/selectallcommodities", { data });
}
/** 商品管理: 拖拽排序 */
export function dragSort(data) {
  return http.request("get", "/oa/hr/commodityManagement/adjustcommoditiessort", { params: data });
}
/** 商品管理: 添加 */
export function addGoodsManage(data) {
  return http.request<string>("post", "/oa/hr/commodityManagement/insertcommodities", { data });
}
/** 商品管理: 修改 */
export function updateGoodsManage(data) {
  return http.request<string>("post", "/oa/hr/commodityManagement/updatecommoditiesbyid", { data });
}
/** 商品管理: 删除 */
export function deleteGoodsManage(params) {
  return http.request("get", `/oa/hr/commodityManagement/deletecommoditiesbycommodityidandcommoditiesspecid`, { params });
}
/** 商品管理: 导出 */
export function exportGoodsManage(data) {
  return http.request<string>("post", "/oa/hr/commodityManagement/exportcommodities", { data });
}

/** 订单管理: 列表 */
export function orderManageList(data) {
  return http.request<TablePagingResType<OrderManageItemType>>("post", "/oa/hr/insideorder/selectallinsideorder", { data });
}
/** 订单管理: 修改状态 */
export function changeOrderState(data) {
  return http.request<boolean>("post", "/oa/hr/insideorder/updateinsideorderstate", { data });
}
/** 订单管理: 导出 */
export function exportOrderManage(data) {
  return http.request<string>("post", "/oa/hr/insideorder/export", { data });
}
/** ========================= 人事档案 ========================= */
/** 人事档案: 列表 */
export function staffInfoList(data) {
  return http.request<TablePagingResType<StaffInfoItemType>>("post", "/oa/hr/staffinfo/select", { data });
}
/** 人事档案: 检测权限 */
export function permissionCheck(params) {
  return http.request<boolean>("get", "/oa/hr/staffinfo/permissionverdictpage", { params });
}
/** 人事档案: 获取修改详情 */
export function getStaffDetail(params) {
  return http.request<StaffInfoItemType>("get", "/oa/hr/staffinfo/selectbyedit", { params });
}
/** 人事档案: 获取部门下的组别信息 */
export function getStaffDeptGroup(data) {
  return http.request<StaffDeptGroupItemType[]>("post", "/sys/sys/deptgroupinfo/selectgroup", { data, headers: { hideLoading: true } });
}
/** 人事档案: 新增 */
export function addStaff(data) {
  return http.request<boolean>("post", "/oa/hr/staffinfo/insert", { data });
}
/** 人事档案: 修改 */
export function updateStaff(data) {
  return http.request<boolean>("post", "/oa/hr/staffinfo/update", { data });
}
/** 人事档案: 删除 */
export function deleteStaff(params) {
  return http.request<boolean>("get", "/oa/hr/staffinfo/delete", { params });
}
/** 人事档案: 导出 */
export function exportStaff(data) {
  return http.request<string>("post", "/oa/hr/staffinfo/export", { data });
}
/** 人事档案: 离职 */
export function dimissionStaff(data) {
  return http.request<boolean>("post", "/oa/hr/staffinfo/dimission", { data });
}
/** 人事档案: 更新离职核算标准 */
export function updateAccountStandard(data) {
  return http.request<boolean>("post", "/oa/hr/staffinfo/updatewageaccountingType", { data });
}
/** 人事档案: 设置金蝶账号 */
export function setKingdeeId(id) {
  return http.request<boolean>("put", `/oa/hr/staffinfo/setKingdeeAccount/${id}`, {});
}
/** 人事档案: 设置企业微信账号 */
export function setQYWXID(id) {
  return http.request<boolean>("put", `/oa/hr/staffinfo/setQYWXAccount/${id}`, {});
}
/** 人事档案: 批量同步考勤机 */
export function manySyncMachineData(data) {
  return http.request("post", `/oa/hr/staffinfo/staffSynAttendanceMachine`, { data });
}
/** 人事档案: 打印详情数据获取 */
export function staffInfoPrintDetail(params) {
  return http.request<StaffInfoItemType[]>("get", `oa/hr/staffinfo/selectbatchbyprint?${params}`);
}

/** ========================= 零时工档案 ========================= */
/** 零时工档案: 列表 */
export function tempStaffInfoList(data) {
  return http.request<TablePagingResType<StaffInfoItemType>>("post", "/oa/hr/tempstaffinfo/select", { data });
}
/** 人事档案: 获取修改详情 */
export function getTempStaffDetail(params) {
  return http.request<StaffInfoItemType>("post", "/oa/hr/tempstaffinfo/selectbyedit", { params });
}
/** 人事档案: 新增 */
export function addTempStaff(data) {
  return http.request<boolean>("post", "/oa/hr/tempstaffinfo/insert", { data });
}
/** 人事档案: 修改 */
export function updateTempStaff(data) {
  return http.request<boolean>("post", "/oa/hr/tempstaffinfo/update", { data });
}
/** 人事档案: 删除 */
export function deleteTempStaff(params) {
  return http.request<boolean>("post", "/oa/hr/tempstaffinfo/delete", { params });
}
/** 人事档案: 导出 */
export function exportTempStaff(data) {
  return http.request<string>("post", "/oa/hr/tempstaffinfo/export", { data });
}
/** 人事档案: 离职 */
export function dimissionTempStaff(data) {
  return http.request<boolean>("post", "/oa/hr/tempstaffinfo/dimission", { data });
}

/** 编外人员: 查询 */
export function fetchNoStaffUser(data) {
  return http.request<NoStaffItemType[]>("post", "/oa/hr/extraStaff/selectExtraStaff", { data });
}

/** 编外人员: 新增 */
export function addNoStaffUser(data) {
  return http.request("post", "/oa/hr/extraStaff/insertExtraStaff", { data });
}

/** 编外人员: 修改 */
export function updateNoStaffUser(data) {
  return http.request("post", "/oa/hr/extraStaff/updateExtraStaff", { data });
}

/** 编外人员: 离职 */
export function leaveNoStaffUser(data) {
  return http.request("post", "/oa/hr/extraStaff/dimissionExtraStaff", { data });
}

/** ========================= 入职审核 ========================= */
/** 入职审核: 列表 */
export function inductionAuditList(data) {
  return http.request<TablePagingResType<InductionAuditItemType>>("post", "/oa/hr/inductioncheckin/select", { data });
}
/** 入职审核: 获取部门下的组别信息 */
export function getInductionAuditDeptGroup(data) {
  return http.request<StaffDeptGroupItemType[]>("post", "/sys/sys/deptgroupinfo/select", { data });
}
/** 入职审核: 获取部门下的岗位别信息 */
export function getInductionAuditRoleInfo(data) {
  return http.request<StaffDeptRoleInfoItemType[]>("post", "/sys/sys/roleinfo/select", { data });
}
/** 入职审核: 获取部门下的岗位别信息 */
export function getInductionAuditRoleInfoByDeptId(data) {
  return http.request<StaffDeptRoleInfoItemType[]>("get", "/sys/sys/roleinfo/getRoleInfoByDeptId", { params: data, headers: { hideLoading: true } });
}
/** 入职审核: 提交审核 */
export function submitInductionAudit(data) {
  return http.request<boolean>("post", "/oa/hr/inductioncheckin/update", { data });
}

/** 入职审核 详情: 下拉框数据(包含校验规则) */
export function InductionDetailOptions(params) {
  return http.request<any>("get", "/app/qywx/workspace/approval/getDatasByBillId", { params });
}
/** 入职审核 详情: 接口获取入职审核数据 */
export function InductionDetailData(data) {
  return http.request<any>("post", "/app/qywx/workspace/approval/getformdata", { data });
}

/** ========================= 人员分析 ========================= */
/** 人员分析: 图表数据 */
export function staffAnalysis() {
  return http.request<StaffAnalysisType>("get", "/oa/hr/staffanalysis/staffanalysis");
}
/** ========================= 请假单 ========================= */
/** 请假单: 列表 */
export function leaveApplyList(data) {
  return http.request<TablePagingResType<LeaveApplyItemType>>("post", "/oa/hr/askforleave/selectPage", { data });
}
/** 请假单: 删除 */
export function deleteLeaveApply(params) {
  return http.request<boolean>("get", "/oa/hr/askforleave/delete", { params });
}
/** 请假单: 修改详情列表 */
export function modifyLeaveApplyDetailList(params) {
  return http.request<LeaveApplyDetailItemType[]>("get", "/oa/hr/askforleave/SelectByEdits", { params });
}
/** 请假单: 提交 */
export function submitLeaveApply(params) {
  return http.request<boolean>("get", "/oa/hr/askforleave/submit", { params });
}
/** 请假单: 导出 */
export function exportLeaveApply(data) {
  return http.request<string>("post", "/oa/hr/askforleave/export", { data });
}
/** 请假单: 添加请假人员 */
export function addUserLeaveApply(data) {
  return http.request<LeaveApplyDetailItemType[]>("post", "/oa/hr/askforleave/calctimes", { data });
}
/** 请假单: 新增修改 */
export function addSaveUserLeaveApply(data) {
  return http.request<boolean>("post", "/oa/hr/askforleave/insert", { data });
}
/** 请假单: 修改更新 */
export function saveUserLeaveApply(data) {
  return http.request<boolean>("post", "/oa/hr/askforleave/update", { data });
}
/** 请假单: 获取部门用户列表 */
export function deptUserInfo(data: UserInfoReqType) {
  return http.request<TablePagingResType<UserInfoItemType>>("post", "/oa/hr/staffinfo/selectgroupstaffinfolist", { data });
}

/** ========================= 休息日设定 ========================= */
/** 休息日设定: 工作日数据 */
export function holidaySettingData(params) {
  return http.request<HolidaySettingDataType[]>("get", "/oa/hr/holidaySetting/holidaysettingdata", { params });
}
/** 休息日设定: 日历数据 */
export function holidaySettingList(data) {
  return http.request<HolidaySettingItemType[]>("post", "/oa/hr/holidaySetting/getHolidayInfoVoByParam", { data });
}
/** 休息日设定: 保存提交 */
export function saveHolidaySetting(data) {
  return http.request<boolean>("post", "/oa/hr/holidaySetting/saveholidaysetting", { data });
}
/** ========================= 加班单 ========================= */
/** 加班单: 表格数据 */
export function overtimeOrderList(data) {
  return http.request<TablePagingResType<OvertimeOrderItemType>>("post", "/oa/hr/overtimeapply/selectPage", { data });
}
/** 加班单: 自动生成 */
export function generateOvertimeOrderList(data) {
  return http.request("get", "/oa/hr/overtimeapply/getrecentovertimeapply", { params: data });
}
/** 加班单: 删除 */
export function deleteOvertimeOrder(params) {
  return http.request<boolean>("post", "/oa/hr/overtimeapply/delete", { params });
}
/** 加班单: 导出 */
export function exportOvertimeOrder(data) {
  return http.request<string>("post", "/oa/hr/overtimeapply/export", { data });
}
/** 加班单: 修改详情列表 */
export function modifyOvertimeDetailList(params) {
  return http.request<OvertimeOrderItemType[]>("post", "/oa/hr/overtimeapply/selectbyedits", { params });
}
/** 加班单: 提交 */
export function submitOvertime(params) {
  return http.request<boolean>("post", "/oa/hr/overtimeapply/submit", { params });
}
/** 加班单: 添加加班人员 */
export function addUserOvertime(data) {
  return http.request<OvertimeDetailItemType[]>("post", "/oa/hr/overtimeapply/calctimes", { data });
}
/** 加班单: 新增保存 */
export function saveUserOvertime(data) {
  return http.request<boolean>("post", "/oa/hr/overtimeapply/insert", { data });
}
/** 加班单: 修改更新 */
export function updateUserOvertime(data) {
  return http.request<boolean>("post", "/oa/hr/overtimeapply/update", { data });
}

/** 绩效管理: 查询列表 */
export function fetchPerformanceList(data) {
  return http.request<TablePagingResType<PerformanceManageItemType>>("post", "/oa/hr/performancemanagement/select", { data });
}

/** 绩效管理: 删除 */
export function deletePerformanceInfo(data) {
  return http.request("post", "/oa/hr/performancemanagement/delete", { data: data });
}

/** 绩效管理: 修改金额 */
export function editPerformanceDataInfo(data) {
  return http.request("post", "/oa/hr/performancemanagement/update", { data });
}

/** 绩效管理: 验证年月 */
export function validYearAndMonthPerformance(data) {
  return http.request("get", "/oa/hr/performancemanagement/verify", { params: data });
}

/** 绩效管理: 导入 */
export function importPerformanceSheet(data) {
  return http.request("post", "/oa/hr/performancemanagement/uploadfile", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 绩效管理: 导出 */
export function exportPerformanceSheet(data) {
  return http.request("post", "/oa/hr/performancemanagement/export", { data });
}
/** 入职审核: 详情信息 */
export function inductionAuditDetail(params) {
  return http.request<InductionAuditDetailResType>("post", "/oa/hr/inductioncheckin/selectbyedit", { params });
}
/** 入职审核: 删除 */
export function deleteInductionAudit(data) {
  return http.request<boolean>("post", "/oa/hr/inductioncheckin/delete", { data });
}

/** 宿舍水电管理: 宿舍水电列表查询 */
export function fetchDormitoryWaterElectricity(data) {
  return http.request("post", "/oa/hr/dormitorywaterelectricity/select", { data });
}

/** 宿舍水电管理: 宿舍水电列表导出 */
export function exportDormitoryWaterElectricity(data) {
  return http.request("post", "/oa/hr/dormitorywaterelectricity/export", { data });
}

/** 宿舍水电管理: 公摊水电列表查询 */
export function fetchPublicDormitoryWaterElectricity(data) {
  return http.request("post", "/oa/hr/dormitorywaterelectricity/selectpublic", { data });
}

/** 宿舍水电管理: 公摊水电修改 */
export function updatePublicDormitoryWaterElectricity(data) {
  return http.request("post", "/oa/hr/dormitorywaterelectricity/updateorinsert", { data });
}

/** 宿舍水电管理: 分摊水电 */
export function devideDormitoryWaterElectricity(data) {
  return http.request("get", "/oa/hr/dormitorywaterelectricity/sharetheutilities", { params: data });
}

/** 宿舍水电管理: 修改水电 */
export function updateDormitoryWaterElectricity(data) {
  return http.request("post", "/oa/hr/dormitorywaterelectricity/updatewaterelectricity", { data });
}

/** 宿舍水电管理: 新增水电 */
export function addDormitoryWaterElectricity(data) {
  return http.request("post", "/oa/hr/dormitorywaterelectricity/insert", { data });
}

/** 宿舍水电管理: 导入前验证 */
export function validDormitoryWaterElectricity(data) {
  return http.request("get", "/oa/hr/dormitorywaterelectricity/verify", { params: data });
}

/** 宿舍水电管理: 个人水电详情 */
export function detailDormitoryWaterElectricity(data) {
  return http.request("post", "/oa/hr/dormitorywaterelectricity/selectutilitybillspage", { data });
}

/** 宿舍水电管理: 个人水电详情导出 */
export function exportDetailDormitoryWaterElectricity(data) {
  return http.request("post", "/oa/hr/dormitorywaterelectricity/exportUtility", { data });
}

/** 宿舍水电管理: 导入 */
export function importDormitoryWaterElectricity(data) {
  return http.request(
    "post",
    "/oa/hr/dormitorywaterelectricity/insertuploadfile",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
}

/** 个人水电详情导入 */
export function importUserWaterElectricityDetail(data) {
  return http.request(
    "post",
    "/oa/hr/dormitorywaterelectricity/insertuploadfileUtility",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
}

/** 水电表更换: 列表查询 */
export function fetchChangeWaterElectricity(data) {
  return http.request("post", "/oa/hr/waterElectricityAlter/select", { data });
}

/** 水电表更换: 列表导出 */
export function exportChangeWaterElectricity(data) {
  return http.request("post", "/oa/hr/waterElectricityAlter/export", { data });
}

/** 水电表更换: 列表删除 */
export function deleteChangeWaterElectricity(data) {
  return http.request("get", "/oa/hr/waterElectricityAlter/delete", { params: data });
}

/** 水电表更换: 列表新增 */
export function insertChangeWaterElectricity(data) {
  return http.request("post", "/oa/hr/waterElectricityAlter/insert", { data });
}

/** 水电表更换: 列表修改 */
export function updateChangeWaterElectricity(data) {
  return http.request("post", "/oa/hr/waterElectricityAlter/update", { data });
}

/** 宿舍管理: 楼栋查询 */
export function fetchAllBuliding(data) {
  return http.request("get", "/oa/hr/dormitorymanagement/selectallbuliding", { params: data });
}

/** 宿舍管理: 楼栋删除 */
export function deleteBuliding(data) {
  return http.request("get", "/oa/hr/dormitorymanagement/deletedormitorybuilding", { params: data });
}

/** 宿舍管理: 宿舍查询 */
export function fetchDormitoryAllBuliding(data) {
  return http.request("post", "/oa/hr/dormitorymanagement/selectalldormitory", { data });
}

/** 宿舍管理: 房间删除 */
export function deleteZoom(data) {
  return http.request("get", "/oa/hr/dormitorymanagement/deletedormitory", { params: data });
}

/** 宿舍管理: 宿舍人员查询 */
export function fetchDormitoryAllUser(data) {
  return http.request("get", "/oa/hr/dormitorymanagement/selectstaffbydormitory", { params: data, headers: { hideLoading: true } });
}

/** 宿舍管理: 修改人员的入住日期*/
export function updateDormitoryAllUserDate(data) {
  return http.request("post", "/oa/hr/dormitorymanagement/updatemoveindatebyid", { data });
}

/** 宿舍管理: 搬迁/搬离 */
export function changeDormitory(data) {
  return http.request("post", "/oa/hr/dormitorymanagement/setdormitorybyuser", { data });
}

/** 宿舍管理: 导出 */
export function exportUserDormitory(data) {
  return http.request("post", "/oa/hr/dormitorymanagement/export", { data });
}

/** 宿舍管理: 新增楼栋 */
export function addUserDormitoryBuildings(data) {
  return http.request("post", "/oa/hr/dormitorymanagement/insertdormitorybuilding", { data });
}

/** 宿舍管理: 修改楼栋 */
export function updateUserDormitoryBuildings(data) {
  return http.request("post", "/oa/hr/dormitorymanagement/updatedormitorybuilding", { data });
}

/** 宿舍管理: 新增宿舍 */
export function addUserDormitory(data) {
  return http.request("post", "/oa/hr/dormitorymanagement/adddormitory", { data });
}

/** 宿舍管理: 修改宿舍 */
export function updateUserDormitory(data) {
  return http.request("post", "/oa/hr/dormitorymanagement/updatedormitory", { data });
}

/** 宿舍管理: 入住宿舍 */
export function insertUserDormitory(data) {
  return http.request("post", "/oa/hr/dormitorymanagement/insertdormitory", { data });
}

/** 宿舍管理: 人员列表选择 */
export function selectUserDormitory(data) {
  return http.request("get", "/oa/hr/staffinfo/querystaffinfo", { params: data });
}

/** 餐卡管理: 列表查询 */
export function fetchMealCardList(data) {
  return http.request("post", "/oa/hr/mealcardmanagement/select", { data });
}

/** 餐卡管理: 部门统计列表查询 */
export function fetchMealCardDeptTotalList(data) {
  return http.request("post", "/oa/hr/mealcardmanagement/getdeptall", { data });
}

/** 餐卡管理: 导出汇总 */
export function exportMealCardRightTotalRecords(data) {
  return http.request("post", "/oa/hr/mealcardmanagement/exportAll", { data });
}

/** 餐卡管理: 导出明细 */
export function exportMealCardLeftDetailRecords(data) {
  return http.request("post", "/oa/hr/mealcardmanagement/export", { data });
}

/** 餐卡管理: 更新状态 */
export function updateMealCardLeftDetailRecords(data) {
  return http.request("post", "/oa/hr/mealcardmanagement/update", { data });
}

/** 餐卡管理: 扣款金额更新 */
export function updateMealCardMoney(data) {
  return http.request("post", "/oa/hr/mealcardmanagement/updatemoney", { data });
}

/** 餐卡管理: 导入 */
export function importMealCardDetailRecords(data) {
  return http.request(
    "post",
    "/oa/hr/mealcardmanagement/insertuploadfile",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
}

/** 餐卡管理: 退卡导入 */
export function importExitMealCardDetailRecords(data) {
  return http.request(
    "post",
    "/oa/hr/mealcardmanagement/uploadFileCancelCard",
    { data },
    {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
}

/** ========================= 餐费管理 ========================= */

/** 餐费管理: 列表查询 */
export function mealCostManageList(data) {
  return http.request<TablePagingResType<MealCostManageListItemType>>("post", "/oa/hr/mealTicketManagement/getMealTicketData", { data });
}

/** 餐费管理: 修改 */
export function updateMealCostManage(data) {
  return http.request("put", "/oa/hr/mealTicketManagement/updateMealTicketData", { data });
}
/** 餐费管理: 删除 */
export function deleteMealCostManage(data) {
  return http.request("delete", "/oa/hr/mealTicketManagement/deleteMealTicketDatas", { data });
}

/** 餐费管理: 导出 */
export function exportMealCostManage(data) {
  return http.request("post", "/oa/hr/mealTicketManagement/export", { data });
}

/** 餐费管理: 导入 */
export function importMealCostManage(data) {
  return http.request("post", "/oa/hr/mealTicketManagement/upload", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** ========================= 车辆管理 ========================= */

/** 车辆管理: 列表查询 */
export function carInfoList(data) {
  return http.request<CarInfoItemType[]>("post", "/oa/hr/carinfo/select", { data });
}
/** 车辆管理: 获取车辆是否空闲 */
export function carInfoStatus(data) {
  return http.request<boolean>("post", "/oa/hr/carinfo/carisletsure", { data });
}
/** 车辆管理: 新增 */
export function addCarInfo(data) {
  return http.request<boolean>("post", "/oa/hr/carinfo/insert", { data });
}
/** 车辆管理: 修改 */
export function updateCarInfo(data) {
  return http.request<boolean>("post", "/oa/hr/carinfo/update", { data });
}
/** 车辆管理: 删除 */
export function deleteCarInfo(data) {
  return http.request<boolean>("post", "/oa/hr/carinfo/delete", { data });
}

/** 安全证书管理: 列表查询 */
export function fetchSafeCertificate(data) {
  return http.request("get", "/oa/hr/securitycertificatemanagement/select", { params: data });
}

/** 安全证书管理: 新增 */
export function addSafeCertificate(data) {
  return http.request("post", "/oa/hr/securitycertificatemanagement/insert", { data });
}

/** 安全证书管理: 删除 */
export function delSafeCertificate(data) {
  return http.request("post", "/oa/hr/securitycertificatemanagement/delect", { data });
}

/** 安全证书管理: 修改 */
export function updateSafeCertificate(data) {
  return http.request("post", "/oa/hr/securitycertificatemanagement/update", { data });
}

/** 安全证书管理: 导出 */
export function exportSafeCertificate(data) {
  return http.request("post", "/oa/hr/securitycertificatemanagement/export", { data });
}

/** 出差记录: 列表查询 */
export function fetchGoOutRecords(data) {
  return http.request("post", "/oa/hr/gooutapply/selectapply", { data });
}

/** 出差记录: 修改 */
export function updateGoOutRecords(data) {
  return http.request("post", "/oa/hr/gooutapply/updateapply", { data });
}

/** 出差记录: 删除 */
export function deleteGoOutRecords(data) {
  return http.request("post", "/oa/hr/gooutapply/deleteapply", { data });
}

/** 出差记录: 导出 */
export function exportGoOutRecords(data) {
  return http.request("post", "/oa/hr/gooutapply/export", { data });
}

/** 获取车辆下拉选项 */
export function getCarOptions(data) {
  return http.request("post", "/oa/hr/carinfo/select", { data });
}

/** 访客接待——新增 */
export function insertVisitorInfo(data) {
  return http.request("post", "/oa/hr/visitreception/save", { data });
}

/** 访客接待——修改 */
export function updateVisitorInfo(data) {
  return http.request("post", "/oa/hr/visitreception/update", { data });
}

/** 访客接待——删除 */
export function deleteVisitorInfo(data) {
  return http.request("get", "/oa/hr/visitreception/delete", { params: data });
}

/** 访客接待——分页查询 */
export function fetchVisitorList(data) {
  return http.request("post", "/oa/hr/visitreception/query", { data });
}

/** 访客接待——导出 */
export function exportVisitorList(data) {
  return http.request("post", "/oa/hr/visitreception/export", { data });
}

/** 访客接待——提交 */
export function submitVisitorInfo(data) {
  return http.request("post", "/oa/hr/visitreception/submitapply", { data });
}

/** 受控文件——查询列表 */
export function fetchControllFileList(data) {
  return http.request("post", "/oa/hr/controllerdocument/select", { data });
}

/** 受控文件——删除 */
export function deleteControllFileList(data) {
  return http.request("post", "/oa/hr/controllerdocument/delete", { params: data });
}

/** 受控文件——新增 */
export function insertControllFileList(data) {
  return http.request("post", "/oa/hr/controllerdocument/insert", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 受控文件——修改 */
export function updateControllFileList(data) {
  return http.request("post", "/oa/hr/controllerdocument/update", { data }, { headers: { "Content-Type": "multipart/form-data" } });
}

/** 受控文件——启用禁用 */
export function enableOrDisableFile(id) {
  return http.request("put", "/oa/hr/controllerdocument/enableOrDisable/" + id);
}

/** ========================= 人员统计 ========================= */

/**  部门统计 */
export function deptStatistics() {
  return http.request<DeptStatisticsItemType[]>("get", "/oa/hr/StaffDataStatistics/getDeptCountPeople");
}
/**  职级统计 */
export function jobLevelStatistics() {
  return http.request<JobLevelStatisticsItemType[]>("get", "/oa/hr/StaffDataStatistics/getRankCountPeople");
}
/**  职级详情 */
export function statisticsPeopleDetail(params) {
  return http.request<StatisticsPeopleDetailItemType[]>("get", "/oa/hr/StaffDataStatistics/getStaffInfoByDeptOrRank", { params });
}
/** ========================= 人员流动统计 ========================= */

/**  人员流动统计 列表 */
export function personFlowStatisticsList(params) {
  return http.request<Array<Record<string, any>>>("get", "/oa/hr/StaffTurnoverStatistics/getStaffTurnover", { params });
}
/**  详情 */
export function personFlowStatisticsDetail(params) {
  return http.request<PersonFlowStatisticsDetailItemType[]>("get", "/oa/hr/StaffTurnoverStatistics/getStaffTurnoverDetail", {
    params,
    headers: { hideLoading: true }
  });
}

/** ========================= 人事异动 ========================= */

/**  人事异动 列表 */
export function staffChangeList(data) {
  return http.request<TablePagingResType<StaffChangeItemType>>("post", "/oa/hr/StaffTransfer/selectTransfer", { data });
}
/**  人事异动 新增 */
export function addStaffChange(data) {
  return http.request<boolean>("post", "/oa/hr/StaffTransfer/insert", { data });
}
/**  人事异动 修改 */
export function updateStaffChange(data) {
  return http.request<boolean>("put", "/oa/hr/StaffTransfer/updateTransfer", { data });
}
/**  人事异动 删除 */
export function deleteStaffChange(params) {
  return http.request<boolean>("delete", "/oa/hr/StaffTransfer/deleteTransfer", { params });
}
/**  人事异动 详情 */
export function getUserBasicInfo(params) {
  return http.request<UserBasicInfoItemType[]>("get", "/oa/hr/StaffTransfer/queryBeforeInsert", { params, headers: { hideLoading: true } });
}
/**  人事异动 单据详情 */
export function staffChangeBillDetail(params) {
  return http.request<boolean>("get", "/oa/hr/StaffTransfer/selectTransferByBillNo", { params });
}

/** ========================= 离职申请 ========================= */

/**  离职申请 - 列表 */
export function resignApplyList(data) {
  return http.request<TablePagingResType<ResignApplyItemType>>("post", "/oa/hr/StaffResign/selectStaffResign", { data });
}
/**  离职申请 - 新增 */
export function addResignApply(data) {
  return http.request<boolean>("post", "/oa/hr/StaffResign/insert", { data });
}
/**  离职申请 - 修改 */
export function updateResignApply(data) {
  return http.request<boolean>("put", "/oa/hr/StaffResign/update", { data });
}
/**  离职申请 - 删除 */
export function deleteResignApply(params) {
  return http.request<boolean>("delete", "/oa/hr/StaffResign/deleteStaffResign", { params });
}

/**  离职申请 - 获取详情 */
export function detailResignApply(params) {
  return http.request<ResignApplyItemType>("get", "/oa/hr/StaffResign/getStaffResignById", { params, headers: { hideLoading: true } });
}
/**  离职申请 - 审批信息 */
export function approveResignApply(params) {
  return http.request<ResignApplyApproveNodeItemType[]>("get", "/oa/hr/StaffResign/getApprove", { params, headers: { hideLoading: true } });
}

/** ========================= 数据大屏 ========================= */

/** 数据大屏 - 审批数据 */
export function approvalData(data) {
  return http.request<ApprovalDataType>("post", "/sys/sys/approvalMonitor/getpageapprovaldatasbysystemsource", { data });
}

/** 补签卡数据获取 */
export function supplementaryCard(data) {
  return http.request("post", "/sys/sys/qywxReissue/selectList", { data });
}
