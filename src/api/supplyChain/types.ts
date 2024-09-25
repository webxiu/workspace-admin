/** ========================= 供应商 ========================= */

/** 供应商 - 列表项类型 */
export interface SupplierItemType {
  noDefaultFContact: string;
  userCode: string;
  fnumber: string;
  fname: string;
  fmobile: string;
  fshortName: string;
  fcontact: string;
  femail: string;
}
/** ========================= 对账单 ========================= */

/** 对账单列表项类型 */
export interface StatementItemType {
  id: number;
  userName: string;
  userCode: string;
  statementOAVO: {
    id: string;
    billNo: string;
    billState: number;
    filePath: string;
    kingdeeBillNo: string;
    uploadFile: boolean;
    kingdeeUploadFile: boolean;
    kingdeeUploadUserName: string;
    kingdeeUploadDate: string;
    billStateDescribe: string;
    createDate: string;
    modifyDate: string;
    createUserId: number;
    modifyUserId: number;
    orgId: string;
  };
  statementInvoiceOAVO: {
    id: string;
    billNo: string;
    billState: number;
    filePath: string;
    kingdeeBillNo: string;
    statementId: string;
    uploadFile: boolean;
    kingdeeUploadFile: boolean;
    kingdeeUploadUserName: string;
    kingdeeUploadDate: string;
    billStateDescribe: string;
    createDate: string;
    modifyDate: string;
    createUserId: number;
    modifyUserId: number;
    orgId: string;
  };
  fbillno: string;
  fallamountfor: string;
  fpayconditon: string;
  fdate: string;
  currencyname: string;
  fremark: string;
}
/** 对账单详情列表类型 */
export interface StatementDetailItemType {
  fmaterialid: string;
  materialname: string;
  fpriceqty: string;
  ftaxprice: string;
  fentrytaxrate: string;
  fentrydiscountrate: string;
  fnotaxamountfor: string;
  ftaxamountfor: string;
  fspecification: string;
  fpriceunitid: string;
  fprice: string;
  fallamountfor: string;
}
/** 查看文件列表 */
export interface FileListItemType {
  fileName: string;
  filePath: string;
  billState: number;
  billNo: string;
  status: number;
}
/** 查看详情(单据详情) */
export interface StatementDetailFileItemType {
  id: string;
  billNo: string;
  billState: number;
  filePath: string;
  kingdeeBillNo: string;
  statementId: string;
  uploadFile: boolean;
  kingdeeUploadFile: boolean;
  kingdeeUploadUserName: boolean;
  kingdeeUploadDate: boolean;
  billStateDescribe: string;
  createDate: string;
  modifyDate: string;
  createUserId: number;
  modifyUserId: number;
  orgId: string;
  status?: number;
}
/** 查看详情(单据详情) */
export interface StatementDetailType {
  id: string;
  userName: string;
  userCode: string;
  shortName: string;
  statementOAVO: StatementDetailFileItemType;
  statementInvoiceOAVO: StatementDetailFileItemType;
  statementDetails: StatementDetailItemType[];
  fbillno: string;
  fpayconditon: string;
  fdate: string;
  currencyname: string;
  fallamountfor: number;
  fremark: string;
  forderdiscountamountfor: number;
}
