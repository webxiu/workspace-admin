import { DeptInfoTreeOptionType } from "@/api/systemManage/types";

/** OA管理:人事行政部 */

/** ========================= 考勤管理 ========================= */
/** 工作时间设定列表类型 */
export interface TimeSettingItemType {
  id: number;
  ruleNo: string;
  forenoonStart: string;
  forenoonEnd: string;
  afternoonStart: string;
  afternoonEnd: string;
  remark: string;
  minForenoonStart: string;
  maxForenoonStart: string;
  minForenoonEnd: string;
  maxForenoonEnd: string;
  minAfternoonStart: string;
  maxAfternoonStart: string;
  minAfternoonEnd: string;
  maxAfternoonEnd: string;
  worktime: string;
}

/** 考勤汇总响应类型 */
export interface AttendanceSummaryOption {
  deptInfo: {
    optionKey: string;
    optionValue: string;
  }[];
  status: {
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
}
/** ========================= 考勤机管理 ========================= */
/** 考勤机管理 - 列表类型 */
export interface AttendanceMachineItemType {
  id: string;
  sn: string;
  attMachineName: string;
  attLogStamp: string;
  operLogStamp: string;
  bioDataStamp: string;
  attPhotoStamp: string;
  errorDelay: string;
  delay: string;
  realTime: number;
  serverVer: string;
  pushProtVer: string;
  encrypt: number;
  encryptFlag: string;
  supportPing: number;
  transFlag: string;
  pushOptionsFlag: number;
  pushOptions: string;
  timeZone: string;
  orgId: string;
}

/** ========================= 内购后台 ========================= */

/** 商品管理 */
export interface AttendanceSummaryItemType {
  id: number;
  userCode: string;
  productionGroup: string;
  status: string;
  employeKind: string;
  staffName: string;
  sex: string;
  startDate: string;
  deptId: number;
  deptName: string;
  beOnDuty: number;
  actualAttendance: number;
  annualLeaveTerms: number;
  beLateTime: number;
  earlyTime: number;
  absenteeismTime: number;
  thingLeaveTime: number;
  peacetimeOverTime: number;
  beAttendanceDay: string;
  actualAttendanceDay: string;
  restOverTime: number;
  specialOverTime: number;
  overTimeSum: number;
  yearMonthTime: string;
  signature: string;
  description: string;
  createDate: string;
  modifyDate: string;
  jx: string;
  zhjx: number;
}

/** 商品管理列表类型 */
export interface GoodsManageItemType {
  id: number;
  billNo: string;
  commodityName: string;
  classifyId: number;
  classifyName: string;
  brandId: string;
  brandName: string;
  model: string;
  sort: number;
  stock: string;
  totalStock: number;
  commodityDescription: string;
  state: number;
  images: [{ id: number; commodityid: number; imagefilename: string; sort: number }];
  specs: [{ id: number; commodityid: number; spec: string; officialPrice: number; discountPrice: number; stock: number; createId: string; createDate: string }];
}
/** 商品管理列表类型 */
export interface GoodsManageOptionType {
  classifyList: {
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
  brandList: {
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
}

/** 订单管理列表类型 */
export interface OrderManageItemType {
  id: number;
  billNo: string;
  userId: string;
  state: number;
  amount: number;
  deliveryMothed: number;
  expressCompany: string;
  expressNumber: string;
  createId: string;
  createDate: string;
  modificationId: string;
  modificationDate: string;
  spec: string;
  commodityName: string;
  quantity: number;
  officalPrice: number;
  discountPrice: number;
  userName: string;
  addressee: string;
  addresseePhone: string;
  provinceName: string;
  cityName: string;
  detailAddress: string;
  classifyName: string;
  brandName: string;
  model: string;
  commodityDescription: string;
  imageFilename: string;
  stateName: string;
  totalStock: string;
}

/** ========================= 人事档案 ========================= */

/** 人事档案列表类型 */
export interface StaffInfoItemType {
  id: number;
  staffId: string;
  staffName: string;
  deptId: number | string;
  groupId: string;
  position: string;
  roleId: string;
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
  wageAccountingType: string;
  deptGroupInfoList: StaffDeptGroupItemType[];
  /** 工作经历 */
  staffInfoWorkVOS: StaffInfoWorkVOSType[];
  /** 家庭关系 */
  staffInfoFamilyVOS: StaffInfoFamilyVOSType[];
  /** 教育经历 */
  staffInfoEducationVOS: StaffInfoEducationVOSType[];
  /** 相关照片 */
  staffInfoPhotoVOS: StaffInfoPhotoVOSItemType[];
  permissionFlag: string;
  permissionDeptId: string;
  userCode: string;
  userName: string;
  idpicture: string;
  infoEduStartTime: string;
  infoEduEndTime: string;
  infoEduSchoolName: string;
  infoEducation: string;
  infoEduMajor: string;
  facePic: string;
  inDate: string;
  level: string;
  exmpetAttendance: boolean;
  machineId: string;
  orgId: string;
}

/** 工作经历类型 */
export interface StaffInfoWorkVOSType {
  id: number;
  inductionCheckInId: string;
  staffInfoId: string;
  startTime: string;
  endTime: string;
  companyName: string;
  jobName: string;
  money: string;
  leaveReason: string;
  certifierPhone: string;
  createDate: string;
}
/** 家庭关系类型 */
export interface StaffInfoFamilyVOSType {
  id: number;
  inductionCheckInId: string;
  staffInfoId: string;
  relation: string;
  name: string;
  workUnit: string;
  profession: string;
  contactNumber: string;
  createDate: string;
}
/** 教育经历类型 */
export interface StaffInfoEducationVOSType {
  id: number;
  inductionCheckInId: string;
  staffInfoId: string;
  startTime: string;
  endTime: string;
  schoolName: string;
  education: string;
  major: string;
  remark: string;
  createDate: string;
}
/** 相关照片类型 */
export interface StaffInfoPhotoVOSItemType {
  id: number;
  inductionCheckInId: string;
  staffInfoId: string;
  photoType: number;
  fileName: string;
  resourceName: string;
  resourceUrl: string;
  reserve1: string;
}

/** 人事档案: 获取部门下的组别类型 */
export interface StaffDeptGroupItemType {
  id: number;
  deptId: number;
  groupCode: string;
  groupName: string;
  deptCode: string;
  deptName: string;
  roleCode: string;
  roleName: string;
  itemId: string;
  leaderId: string;
  leaderName: string;
  parentId: string;
}
/** 人事档案: 获取部门下的岗位类型 */
export interface StaffDeptRoleInfoItemType {
  id: number;
  roleCode: string;
  roleName: string;
  k3RoleId: number;
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
  rolePeopleCount: number;
  deptPath: string;
}
/** 人事档案: 新增修改下拉框数据类型 */
export interface StaffInfoOptionType {
  apiUrl: string;
  temporaryFlag: number;
  optionList: {
    HaveOrNot: any[];
    MaritalStatus: any[];
    EmployeeStatus: any[];
    DegreeType: any[];
    IncuranceStatus: any[];
    DimissionReason: any[];
    DormitoryType: any[];
    LaborCompany: any[];
    GenderType: any[];
    Ethnic: any[];
    EmployeeType: any[];
  };
  deptInfoTree: any[];
  workTimeList: any[];
}
/** ========================= 入职审核 ========================= */

/** 入职审核列表类型 */
export interface InductionAuditItemType {
  id: number;
  billNo: string;
  level: string;
  state: number;
  createDate: string;
  auditUserId: string;
  auditDate: string;
  applyPosition: string;
  staffName: string;
  idCard: string;
  birthDate: string;
  sex: string;
  age: string;
  isStay: string;
  nation: string;
  education: string;
  drivingLicence: string;
  marital: string;
  children: string;
  height: string;
  weight: string;
  nativePlace: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  registeredResidence: string;
  currentStayAddress: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  emergencyResidence: string;
  insurance: string;
  socialSecurity: string;
  englishLevel: string;
  computerLevel: string;
  laborServiceCompany: string;
  temporaryFlag: number;
  staffId: string;
  employeKind: string;
  deptId: string;
  groupId: string;
  position: string;
  workRuleId: string;
  inductionDate: string;
  tryDate: string;
  tryDateMoney: string;
  moneyStartDate: string;
  validDate: string;
  authority: string;
  stateName: string;
  deptName: string;
  groupName: string;
  machineId?: string;
  staffInfoEducationVOList: StaffInfoEducationVOListType[];
  staffInfoFamilyVOList: StaffInfoFamilyVOListType[];
  staffInfoWorkVOList: StaffInfoWorkVOListType[];
  staffInfoPhotoVOList: StaffInfoPhotoVOListType[];
}

/** 入职审核-下拉框数据类型 */
export interface InductionAuditOptionDataType {
  EmployeeLevel: {
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
  YesOrNo: {
    id: number;
    optionId: number;
    optionValue: string;
    optionName: string;
    reserve1: string;
    reserve2: string;
    displaySeq: 1;
    kingdeeValue: string;
    title: string;
    optionCode: string;
  }[];
  deptInfoTree: DeptInfoTreeOptionType[];
  BillStatus: {
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
  workTimeList: {
    id: number;
    optionId: number;
    optionValue: string;
    optionName: string;
    reserve1: string;
    reserve2: string;
    displaySeq: string;
    kingdeeValue: string;
    title: string;
    optionCode: string;
  }[];
  EmployeeType: {
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

/** 入职详情-教育经历列表类型 */
export interface StaffInfoEducationVOListType {
  id: number;
  inductionCheckInId: string;
  staffInfoId: string;
  startTime: string;
  endTime: string;
  schoolName: string;
  education: string;
  major: string;
  remark: string;
  createDate: string;
}

/** 入职详情-家庭管理列表类型 */
export interface StaffInfoFamilyVOListType {
  id: number;
  inductionCheckInId: string;
  staffInfoId: string;
  relation: string;
  name: string;
  workUnit: string;
  profession: string;
  contactNumber: string;
  createDate: string;
}
/** 入职详情-工作经历列表类型 */
export interface StaffInfoWorkVOListType {
  id: number;
  inductionCheckInId: string;
  staffInfoId: string;
  startTime: string;
  endTime: string;
  companyName: string;
  jobName: string;
  money: string;
  leaveReason: string;
  certifierPhone: string;
  createDate: string;
}
/** 入职详情-入职人员相关照片列表 */
export interface StaffInfoPhotoVOListType {
  id: number;
  inductionCheckInId: string;
  staffInfoId: string;
  photoType: number;
  fileName: string;
  resourceName: string;
  resourceUrl: string;
  reserve1: string;
}

/** 入职人员详情信息类型 */
export interface InductionAuditDetailResType {
  id: number;
  billNo: string;
  level: string;
  state: string;
  createDate: string;
  auditUserId: string;
  auditDate: string;
  applyPosition: string;
  staffName: string;
  idCard: string;
  birthDate: string;
  sex: string;
  age: number;
  isStay: string;
  nation: string;
  education: string;
  drivingLicence: string;
  marital: string;
  children: string;
  height: string;
  weight: number;
  nativePlace: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  registeredResidence: string;
  currentStayAddress: string;
  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;
  emergencyResidence: string;
  insurance: string;
  socialSecurity: string;
  englishLevel: string;
  computerLevel: string;
  laborServiceCompany: string;
  temporaryFlag: number;
  staffId: string;
  employeKind: string;
  deptId: string;
  groupId: string;
  position: string;
  workRuleId: string;
  inductionDate: string;
  tryDate: number;
  tryDateMoney: number;
  moneyStartDate: string;
  validDate: string;
  authority: string;
  stateName: string;
  deptName: string;
  groupName: string;
  inductionCheckinEducationVOList: StaffInfoEducationVOListType[];
  inductionCheckinFamilyVOList: StaffInfoFamilyVOListType[];
  inductionCheckinWorkVOList: StaffInfoWorkVOListType[];
  inductionCheckinPhotoVOList: StaffInfoPhotoVOListType[];
  wageAccountingType: string;
  roleId: string;
}

/** ========================= 人员分析 ========================= */
/** 人员分析: 统计图表 */
export interface StaffAnalysisType {
  marital: { marital: string; rowCount: number }[];
  education: { displaySeq: number; education: string; rowCount: number }[];
  province: { province: string; rowCount: number }[];
  nation: { nation: string; rowCount: number }[];
  workingAge: { workingAge: string; rowCount: number }[];
  sex: { sex: string; rowCount: number }[];
  age: { rowCount: number; age: string }[];
}
/** ========================= 绩效管理 ========================= */

/** 绩效管理: 列表类型 */
export interface PerformanceManageItemType {
  id: string;
  userCode: string;
  money: string;
  orgId: string;
  yearAndMonth: string;
  staffName: string;
  deptName: string;
}
/** ========================= 编外人员 ========================= */

/** 编外人员 -  列表类型 */
export interface NoStaffItemType {
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
  age: string;
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
  level: string;
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
  userInfoId: string;
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
  wageAccountingType: string;
  exmpetAttendance: boolean;
  orgId: string;
  deptGroupInfoList: string;
  staffInfoWorkVOS: string;
  staffInfoFamilyVOS: string;
  staffInfoEducationVOS: string;
  staffInfoPhotoVOS: string;
  permissionFlag: string;
  permissionDeptId: string;
  userCode: string;
  userName: string;
  infoEduStartTime: string;
  infoEduEndTime: string;
  infoEduSchoolName: string;
  infoEducation: string;
  infoEduMajor: string;
  facePic: string;
  inDate: string;
  idpicture: string;
}

/** ========================= 请假单 ========================= */

/** 请假单列表类型 */
export interface LeaveApplyItemType {
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

/** 请假单详情列表类型 */
export interface LeaveApplyDetailItemType {
  deptId: number;
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
  isNew?: boolean;
}
/** 请假单详情列表类型 */
export interface LeaveApplyEditOptionItemType {
  deptUserInfoList: {
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
  }[];
  optionList: {
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

  deptId?: number | string;
}
/** ========================= 休息日设定 ========================= */
/** 休息日设定数据类型 */
export interface HolidaySettingDataType {
  id: number;
  workDate: string;
  isWork: number | string;
  isHoliday: number;
  inDate: string;
  keyIn: string;
  category: number;
  work: string;
}
/** 休息日设定列表类型 */
export interface HolidaySettingItemType {
  id: string;
  year: number;
  month: string;
  date: string;
  yearweek: string;
  yearday: number;
  lunarYear: number;
  lunarMonth: string;
  lunarDate: string;
  lunarYearday: number;
  week: number;
  weekend: number;
  workday: number;
  holiday: number;
  holidayOr: number;
  holidayOvertime: number;
  holidayToday: number;
  holidayLegal: number;
  holidayRecess: number;
  yearCn: string;
  monthCn: string;
  dateCn: string;
  yearweekCn: string;
  yeardayCn: string;
  lunarYearCn: string;
  lunarMonthCn: string;
  lunarDateCn: string;
  lunarYeardayCn: string;
  weekCn: string;
  weekendCn: string;
  workdayCn: string;
  holidayCn: string;
  holidayOrCn: string;
  holidayOvertimeCn: string;
  holidayTodayCn: string;
  holidayLegalCn: string;
  holidayRecessCn: string;
  orgId: string;
  createDate: string;
  modifyDate: string;
}

/** ========================= 加班单 ========================= */

/** 加班单: 表格数据类型 */
export interface OvertimeOrderItemType {
  id: string;
  billNo: string;
  deptId: number;
  itemSequence: number;
  userId: string;
  userName: string;
  productLine: string;
  overtimeType: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  days: number;
  hours: number;
  createDate: string;
  billState: number;
  operationType: string;
  remark: string;
  overtimeUUID: string;
  deptName: string;
  billStateName: string;
  createUserName: string;
  approver: string;
  priId: string;
  isNew?: boolean;
  staffCode?: string;
  staffName?: string;
}
/** 加班单: 详情列表类型 */
export interface OvertimeDetailItemType {
  id: string;
  billNo: string;
  itemSequence: string;
  userId: string;
  userName: string;
  productLine: string;
  overtimeType: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  days: number;
  hours: number;
  createUserId: string;
  createDate: string;
  billState: number;
  operationType: string;
  remark: string;
  deptIdList: string;
  overTimeApplyDTOList: string;
  deleteIdList: string;
  orgId: string;
  excel: string;
}
/** 加班单: 编辑弹窗新增的下拉框数据类型 */
export interface OvertimeOrderEditOptionItemType {
  deptGroupInfoList: {
    id: number;
    deptId: number;
    groupCode: string;
    groupName: string;
    deptCode: string;
    deptName: string;
    roleCode: string;
    roleName: string;
    itemId: string;
    leaderId: string;
    leaderName: string;
    parentId: string;
  }[];
  deptId?: number | string;
  userInfoList: {
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
  }[];
  optionList: {
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

/** ========================= 车辆管理 ========================= */

/** 列表查询类型 */
export interface CarInfoItemType {
  value: any;
  id: number;
  plateNumber: string;
  vinNo: string;
  color: string;
  initMileage: string;
  createUserId: string | number;
  createUserName: string;
  modifyUserName: string;
  createDate: string;
  modifyUserId: string | number;
  modifyDate: string;
  orgId: string;
}

/** ========================= 餐费管理 ========================= */

/** 餐费管理: 列表类型 */
export interface MealCostManageListItemType {
  id: string;
  mealTicket: number;
  orgId: string;
  remark: string;
  staffCode: number;
  staffName: string;
  staffId: number;
  yearMonth: string;
}

/** ========================= 人员统计 ========================= */

/** 部门统计 */
export interface DeptStatisticsItemType {
  deptName: string;
  deptId: number;
  displayOrder: number;
  deptTotal: number;
}
/** 职级统计 */
export interface JobLevelStatisticsItemType {
  rank: string;
  rankTotal: number;
}
/** 统计人员详情 */
export interface StatisticsPeopleDetailItemType {
  deptName: string;
  staffCode: string;
  staffName: string;
  roleName: string;
  startDate: string;
}
/** 人员流动统计类型详情列表 */
export interface PersonFlowStatisticsDetailItemType {
  deptName: string;
  staffCode: string;
  leaveofficeDate: string;
  staffName: string;
  roleName: string;
  startDate: string;
  id: number;
}

/** ========================= 人事异动 ========================= */

/** 人事异动列表类型 */
export interface StaffChangeItemType {
  adjustAfterSalary: number;
  adjustSalaryFlag: boolean;
  billId: string;
  billNo: string;
  billState: number;
  createDate: string;
  createUserName: string;
  deptName: string;
  effectiveDate: string;
  id: string;
  limit: number;
  modifyDate: string;
  modifyUserName: string;
  orgId: string;
  page: number;
  roleName: string;
  staffId: number;
  staffCode: string;
  staffName: string;
  startDate: string;
  transferAfterDeptId: number;
  transferAfterDeptName: string;
  transferAfterRoleId: number;
  transferAfterRoleName: string;
  transferDate: string;
  transferReason: string;
  transferType: string;
}
/** 工号获取人员信息列表类型 */
export interface UserBasicInfoItemType {
  deptName: string;
  staffCode: string;
  staffName: string;
  roleName: string;
  staffId: number;
  startDate: string;
}
/** ========================= 离职申请 ========================= */

/** 职员离职申请列表类型 */
export interface ResignApplyItemType {
  id: string;
  billId: string;
  billNo: string;
  billState: number;
  staffId: number;
  deptName: string;
  staffCode: string;
  staffName: string;
  roleName: string;
  startDate: string;
  applyDate: string;
  resignationType: string;
  resignationReason: string;
  createUserId: number;
  createDate: string;
  modifyUserId: number;
  modifyDate: string;
  orgId: string;
}
/** 职员离职申请列表类型 */
export interface ResignApplyApproveNodeItemType {
  activityId: string;
  handleComment: string;
  activityName: string;
  assignee: string;
}

/** ========================= 数据大屏 ========================= */

/** 数据大屏 - 其他审批(汇总数量) */
export interface OtherApprovalType {
  receiverId: string;
  receiverName: string;
  approvalCount: string;
  totalApprovalTime: string;
  averageEfficiency: string;
  rank: string;
  processInstanceId: string;
  deployName: string;
  billNo: string;
  yearMonth: string;
  currentApprover: string;
  currentApprovalTime: string;
  alreadFinishedCount: number;
  unFinishedCount: number;
  monthEfficiency: string;
  allEfficiency: string;
  monthLongestProcessInstanceId: string;
  longestApprovalTimeHour: string;
  shortestApprovalTimeHour: string;
}
/** 数据大屏 - 审批数据 */
export interface ApprovalDataType {
  mainBusinessCountApproval: {
    receiverId: string;
    receiverName: string;
    approvalCount: number;
    totalApprovalTime: number;
    averageEfficiency: string;
    rank: string;
    processInstanceId: string;
    deployName: string;
    billNo: string;
    yearMonth: string;
    currentApprover: string;
    currentApprovalTime: string;
    alreadFinishedCount: string;
    unFinishedCount: string;
    monthEfficiency: string;
    allEfficiency: string;
    monthLongestProcessInstanceId: string;
    longestApprovalTimeHour: string;
    shortestApprovalTimeHour: string;
  }[];
  realTimeConsumingCountApproval: {
    receiverId: string;
    receiverName: string;
    approvalCount: string;
    totalApprovalTime: string;
    averageEfficiency: string;
    rank: string;
    processInstanceId: string;
    deployName: string;
    billNo: string;
    yearMonth: string;
    currentApprover: string;
    currentApprovalTime: string;
    alreadFinishedCount: string;
    unFinishedCount: string;
    monthEfficiency: string;
    allEfficiency: string;
    monthLongestProcessInstanceId: string;
    longestApprovalTimeHour: string;
    shortestApprovalTimeHour: string;
  }[];
  countApprovalEfficiencyMin: {
    receiverId: string;
    receiverName: string;
    approvalCount: number;
    totalApprovalTime: number;
    averageEfficiency: number;
    rank: number;
  }[];
  countApprovalEfficiencyMax: {
    receiverId: string;
    receiverName: string;
    approvalCount: number;
    totalApprovalTime: number;
    averageEfficiency: number;
    rank: number;
  }[];
  countApprovalCount: {
    receiverId: string;
    receiverName: string;
    approvalCount: number;
    totalApprovalTime: string;
    averageEfficiency: string;
    rank: string;
    processInstanceId: string;
    deployName: string;
    billNo: string;
    yearMonth: string;
    currentApprover: string;
    currentApprovalTime: string;
    alreadFinishedCount: string;
    unFinishedCount: string;
    monthEfficiency: string;
    allEfficiency: string;
    monthLongestProcessInstanceId: string;
    longestApprovalTimeHour: string;
    shortestApprovalTimeHour: string;
  }[];
  avgEfficiencyByYear: {
    receiverId: string;
    receiverName: string;
    approvalCount: string;
    totalApprovalTime: string;
    averageEfficiency: string;
    rank: string;
    processInstanceId: string;
    deployName: string;
    billNo: string;
    yearMonth: string;
    currentApprover: string;
    currentApprovalTime: string;
    alreadFinishedCount: string;
    unFinishedCount: string;
    monthEfficiency: string;
    allEfficiency: string;
    monthLongestProcessInstanceId: string;
    longestApprovalTimeHour: string;
    shortestApprovalTimeHour: string;
  }[];
  avgEfficiencyByWeekend: {
    receiverId: string;
    receiverName: string;
    approvalCount: string;
    totalApprovalTime: string;
    averageEfficiency: string;
    rank: string;
    processInstanceId: string;
    deployName: string;
    billNo: string;
    yearMonth: string;
    currentApprover: string;
    currentApprovalTime: string;
    alreadFinishedCount: string;
    unFinishedCount: string;
    monthEfficiency: string;
    allEfficiency: string;
    monthLongestProcessInstanceId: string;
    longestApprovalTimeHour: string;
    shortestApprovalTimeHour: string;
  }[];
  otherCountApproval: OtherApprovalType[];
}
