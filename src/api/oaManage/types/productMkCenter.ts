import type { UploadUserFile } from "element-plus";

/** ========================= 物控部(生产排产) ========================= */
/** 生产排产列表类型 */
export interface ProductScheduleItemType {
  materialNumber: string;
  shippingDate: string;
  prdOrderBillNo: string;
  finishTotal: number;
  saleOrderBillNo: string;
  prdLineName: string;
  orderQuantity: number;
  [key: string]: any;
}
/** ========================= 生产制造中心(松下二维码) ========================= */
/** 松下二维码列表类型 */
export interface PanasonicQrcodeItemType {
  id: string;
  model: string;
  baseUrl: string;
  createDate: string;
  createUserId: string;
  modifyDate: string;
  modifyUserId: string;
}
/** ========================= 生产制造中心(作业指导书) ========================= */
/** 作业指导书列表类型 */
export interface OperateBookItemType {
  id: string;
  materialId: number;
  materialNumber: string;
  billNo: string;
  billId: string;
  billState: number;
  createUserName: string;
  createDate: string;
  auditing: string;
  auditingDate: string;
  approveName: string;
  approveDate: string;
  manualName: string;
  ver: string;
  fileNumber: string;
  country: string;
  productCode: string;
  workStationVOS: string;
  peuserId: string;
  peuserName: string;
}
/** 工位列表类型 */
export interface OperateBookStationItemType {
  capacity: number;
  contentVO: {
    id?: string;
    jobContent?: string;
    precautions?: string;
    withToolFixture?: string;
    workStationId?: string;
  };
  id: string;
  manHour: number;
  pid: string;
  stationNo: string;
  workContent: string;
  workerCount: number;
  /** 是否为新增 */
  isNew?: boolean;
  /** 物料表 */
  materialVOS: MaterialItemType[];
  /** 检测记录 */
  checkRuleVOS: CheckRecordItemType[];
  /** 工作工程 */
  jobEngineeringVOS: JobEngineeringItemType[];
}

/** 物料表类型 */
export interface MaterialItemType {
  id: string;
  materialId: number;
  materialName: string;
  materialNumber: string;
  specification: string;
  qty: number;
  workStationId: string;
  unit: string;
  isNew?: boolean;
}

/** 工作工程 */
export interface JobEngineeringItemType {
  description: string;
  filePath?: string;
  tempPath?: string;
  multipartFile?: File;
  id: string;
  sort: number;
  workStationId: string;
  isNew?: boolean;
  file: Array<UploadUserFile>;
}

/** 检测记录表 */
export interface CheckRecordItemType {
  confirm: string;
  confirmFrequency: string;
  deptId: number;
  deptName: string;
  id: string;
  manageMethod: string;
  workStationId: string;
  toolParametersVOS: ToolParamItemType[];
  isNew?: boolean;
}
/** 工具参数 */
export interface ToolParamItemType {
  checkRuleId: string;
  id: string;
  quantity: number;
  standardParam: string;
  tool: string;
  isNew?: boolean;
}
/** 子物料列表类型 */
export interface MaterialChildItemType {
  id: number;
  billNo: string;
  number: string;
  name: string;
  specification: string;
  model: string;
  cbcertification: number;
  isfrozen: number;
  purchaseUnit: number;
  stockUnit: number;
  saleUnti: number;
  oldCode: string;
  erpClsid: number;
  goodsType: number;
  erpMaterialId: number;
  materialGroup: number;
  baseUnit: number;
  materialType: string;
  createUserId: number;
  createDate: string;
  submiteUserId: number;
  submitDate: string;
  modifyUserId: number;
  modifyDate: string;
  customerProvided: number;
  productType: string;
  manufacturingShop: string;
  warehouse: number;
  remark: string;
  state: number;
  pushState: number;
  goodName: string;
  goodModel: string;
  goodColor: string;
  orgId: string;
  frozenUserId: string;
  frozenDate: string;
}
/** 打印列表类型 */
export interface PrintOperateBookStationResType {
  id: string;
  materialId: number;
  materialNumber: string;
  billNo: string;
  billId: string;
  billState: number;
  createUserName: string;
  createDate: string;
  auditing: string;
  auditingDate: string;
  approveName: string;
  controlledName: string;
  controlledDate: string;
  approveDate: string;
  manualName: string;
  ver: string;
  fileNumber: string;
  country: string;
  productCode: string;

  workStationVOS: {
    id: string;
    stationNo: string;
    workContent: string;
    workerCount: number;
    capacity: number;
    manHour: number;
    materialVOS: {
      id: string;
      workStationId: string;
      materialId: number;
      materialName: string;
      materialNumber: string;
      specification: string;
      unit: string;
      qty: number;
    }[];
    contentVO: {
      id: string;
      workStationId: string;
      withToolFixture: string;
      jobContent: string;
      precautions: string;
    };
    jobEngineeringVOS: {
      id: string;
      workStationId: string;
      filePath: string;
      description: string;
      sort: number;
    }[];
    checkRuleVOS: {
      id: string;
      workStationId: string;
      confirm: string;
      confirmFrequency: string;
      deptId: number;
      deptName: string;
      manageMethod: string;
      toolParametersVOS: {
        id: string;
        checkRuleId: string;
        tool: string;
        quantity: number;
        standardParam: string;
      }[];
    }[];
    pid: string;
  }[];
}

/** 分发列表响应类型 */
export interface DistributeOperateBookResType {
  id: string;
  manualId: string;
  productionLine: string;
  manualDistributeDetail: DistributeOperateBookItemType[];
  workStations: {
    id: string;
    stationNo: string;
    workContent: string;
    workerCount: string;
    capacity: string;
    manHour: string;
    pid: string;
  }[];
}
/** 分发列表类型 */
export interface DistributeOperateBookItemType {
  id: string;
  tabletsId: string;
  workStationId: string;
  workContent: string;
  tabletsName: string;
  tabletsCode: string;
  tabletsPosition: number;
  tabletsSlot: string;
  pid: string;
}

/** ========================= 平板管理 ========================= */

/** 平板管理列表类型 */
export interface TabletManageItemType {
  id: string;
  tabletsName: string;
  tabletsCode: string;
  productionLine: number;
  tabletsPosition: number;
  tabletsSlot: number;
  tabletsID: string;
  createUserId: number;
  createUserName: string;
  createDate: string;
  modifyUserId: number;
  modifyDate: string;
}
/** ========================= 生产线 ========================= */

/** 生产线列表类型 */
export interface ProductLineItemType {
  distributeTime: string;
  productionLine: string;
  distributeUserName: string;
  productionLineName: string;
  manualName: string;
}
