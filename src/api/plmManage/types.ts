/** ========================= 产品管理 ========================= */

import { UploadFile } from "element-plus";

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
  billId: string;
  billNo: string;
  billState: number;
  staffId: number;
  staffCode: string;
  staffName: string;
  deptName: string;
  roleName: string;
  startDate: string;
  applyDate: string;
  resignationType: string;
  resignationReason: string;
  createUserName: string;
  createDate: string;
  modifyUserName: string;
  modifyDate: string;
  orgId: string;
}

/** 开模申请 - 附件列表 */
export interface MoldFileItemType {
  id: number;
  billId: string;
  billNo: string;
  createDate: string;
  createUserId: number;
  orgId: string;
  filePath: string;
  fileName: string;
}
