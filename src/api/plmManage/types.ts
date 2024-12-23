/** ========================= 物料管理 ========================= */

/** 物料管理 - 项目分类下拉列表类型 */
export interface MaterialGroupItemType {
  id: string;
  parentId: string;
  name: string;
  title: string;
  groupCode: string;
  spread: false;
  children: MaterialGroupItemType[];
}
/** ========================= 变更申请 ========================= */

export interface ChangeApplyItemType {
  id: string;
  billNo: string;
  productName: string;
  productModel: string;
  billState: string;
  customerName: string;
  changeType: string;
  changePhase: string;
  changeTheme: string;
  createDate: string;
  applyDepartment: string;
  applyUserName: string;
  modifyUserName: string;
  modifyDate: string;
}

/** ========================= 实验室管理 ========================= */

/** 测试项目 - 项目分类下拉列表类型 */
export interface ProjectClassifyItemType {
  orgId: string;
  createUserId: number;
  createDate: string;
  modifyUserId: string;
  modifyDate: string;
  deleteStatus: number;
  id: string;
  typeName: string;
}
/** 测试项目 - 列表类型 */
export interface TestProjectItemType {
  orgId: string;
  createUserId: number;
  createDate: string;
  modifyUserId: string;
  modifyDate: string;
  deleteStatus: number;
  id: string;
  typeId: string;
  projectName: string;
  createUserName: string;
  updateUserName: string;
  page: number;
  limit: number;
}

/** 测试模板 - 列表项类型 */
export interface TestTemplateItemType {
  id: string;
  templateCode: string;
  templateName: string;
  orgId: string;
  createDate: string;
  createUserId: number;
  createUserName: string;
  modifyDate: string;
  modifyUserId: string;
  modifyUserName: string;
  anGuiDetails: TemplateDataItemType[];
  customerDetails: TemplateDataItemType[];
  facadeDetails: TemplateDataItemType[];
  dldetails: TemplateDataItemType[];
}

/** 测试模板 - 列表详情Tab表格类型 */
export interface TemplateDataItemType {
  id: string;
  templatePId: string;
  testCategory: string;
  testCode: string;
  testQuantity: string;
  testProject: string;
  judgmentCriteria: string;
  testRequire: string;
  required: string;
  testStage: string | string[];
  templateType: number;
}

/** ========================= 模具管理 ========================= */

/** 开模申请 - 列表类型 */
export interface MoldApplyItemType {
  id: string;
  billNo: string;
  billState: number;
  billId: string;
  productId: string;
  productCode: string;
  productName: string;
  modelOpeningDate: string;
  trialDate: string;
  modelType: string;
  draftModelQuantity: number;
  dataProvides: string;
  createUserId: string;
  createUserName: string;
  createDate: string;
  modifyUserId: string;
  modifyUserName: string;
  modifyDate: string;
  plmBillFiles: MoldFileItemType[];
  orgId: string;
}

/** 开模申请 - 附件列表 */
export interface MoldFileItemType {
  id: number;
  billId: string;
  billNo: string;
  createDate: string;
  createUserId: string;
  orgId: string;
  fileName: string;
  filePath: string;
}
/** ========================= PLM设置 ========================= */

/** 产品分类管理 - 列表项类型 */
export interface ProductClassifyManageItemType {
  id: number;
  categoryNo: string;
  categoryName: string;
  createUserId: string;
  createDate: string;
  modifyUserId: string;
  modifyDate: string;
  createUserName: string;
  modifyUserName: string;
  label: string;
  value: number;
  [key: string]: any;
}
/** ========================= 订单模板 ========================= */

/** 订单模板列表类型 */
export interface OrderTemplateItemType {
  id: string;
  productModelId: string;
  productCode: string;
  billNo: string;
  billState: number;
  createUserId: number;
  createDate: string;
  modifyUserId: number;
  modifyDate: string;
  orgId: string;
  partNames: string;
  remarks: string;
  modelNumbers: string;
  createUserName: string;
  modifyUserName: string;
  orderTemplateDetailDTOS: OrderTemplatePartNameItemType[];
  orderTemplatePictureVOS: OrderTemplatePictureItemType[];
}

/** 订单模板-部件列表类型 */
export interface OrderTemplatePartNameItemType {
  id: string;
  orderTemplateId: string;
  modelNumber: string;
  partName: string;
  remarks: string;
  orgId: string;
  isNew?: boolean;
}
/** 订单模板-图片列表类型 */
export interface OrderTemplatePictureItemType {
  id: string;
  orderTemplateId: string;
  resourcePath: string;
  imageName: string;
  imageResourceName: string;
  virtualPath: string;
  orgId: string;
}
