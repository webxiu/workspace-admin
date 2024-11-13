/** ========================= 客户投诉(OA管理:市场营销中心) ========================= */

/** 投诉列表 */
export interface CustomerComplaintItemType {
  id: number;
  orderNo: string;
  title: string;
  customer: string;
  billNo: string;
  reply: string;
  cause: string;
  fileName: string;
  resourceName: string;
  resourceUrl: string;
  marketState: number;
  state: number;
  marketStateName: string;
  stateName: string;
  remindList: string;
  replyDate: string;
  createDate: string;
  modifyDate: string;
  marketSubmitDate: string;
  acceptDate: string;
  backDate: string;
  submitDate: string;
  auditDate: string;
  abolishDate: string;
  replyUserName: string;
  createUserName: string;
  modifyUserName: string;
  marketSubmitUserName: string;
  acceptUserName: string;
  backUserName: string;
  submitUserName: string;
  auditUserName: string;
  abolishUserName: string;
  complaintEntryList: CustomerComplaintDtailListItemType[];
}

/** 投诉详情列表 */
export interface CustomerComplaintDtailListItemType {
  entryid: number;
  complaintId: number;
  productModel: string;
  unit: string;
  orderQuantity: number | string;
  quantity: number | string;
  type: number | string;
  typeName: string;
  complaintDate: string;
  question: string;
  sampleSubmitDate: string;
  questionDescribe: string;
  fileName: string;
  resourceName: string;
  resourceUrl: string;
}
/** 投诉状态下拉类型 */
export interface MarketStateItemType {
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
}
/** 投诉功能下拉类型 */
export interface ComplaintTypeItemType {
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
}

/** 客户投诉下拉框数据类型 */
export interface CustomerComplaintOptionType {
  marketStateList: MarketStateItemType[];
  billStatus: ComplaintTypeItemType[];
  stateList: {
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
  complaintTypeList: any[];
}

/** ========================= 客户管理(OA管理:市场营销中心) ========================= */
/** 客户管理列表 */
export interface CustomerManageItemType {
  id: number;
  customerId: string;
  customerOANumber: string;
  customerNumber: string;
  customerName: string;
  customerLogo: string;
  customerAreaId: 100005;
  customerArea: string;
  customerCountryEntryId: string;
  customerCountryName: string;
  customerLocation: string;
  professionalMessage: string;
  createDate: string;
  modifyDate: string;
  mkCustomerLinkmanList: [
    {
      id: number;
      customerId: string;
      customerOANumber: string;
      linkmanContactId: string;
      fname: string;
      phone: string;
      email: string;
      createDate: string;
      modifyDate: string;
    }
  ];
  linkmanMessage: string;
  quantity: string;
  complaintYearTime: string;
  money: string;
  orderSum: string;
  stockSum: string;
  year: string;
}
/** 客户管理: 下拉框数据 */
export interface CustomerOptionDataType {
  customerData: any[];
  countryMessage: {
    optionKey: string;
    optionValue: string;
  }[];
  customerAreaResult: {
    optionKey: string;
    optionValue: number;
  }[];
}

/** ========================= 市场报表(OA管理:市场营销中心) ========================= */
/** 销售达成率列表类型 */
export interface SeleRateItemType {
  FYEAR: number;
  ItemValue: number;
  ItemName: string;
  FMonthName: string;
}
/** 客户占比响应类型 */
export interface CustomerRatioResType {
  echarts: CustomerRatioItemType[];
  num: number;
  table: CustomerRatioItemType[];
}
/** 客户占比列表类型 */
export interface CustomerRatioItemType {
  sale: number | string;
  total: number;
  FShortName: string;
  ratio: number | string;
}

/** 地区占比响应类型 */
export interface AreaRatioResType {
  echarts: AreaRatioItemType[];
  num: number;
  table: AreaRatioItemType[];
}
/** 地区占比列表类型 */
export interface AreaRatioItemType {
  sale: number | string;
  total: number;
  FDATAVALUE: string;
  ratio: number | string;
}
/** 产品类别响应类型 */
export interface ProductRatioResType {
  echarts: ProductRatioItemType[];
  num: number;
  table: ProductRatioItemType[];
}
/** 产品类别列表类型 */
export interface ProductRatioItemType {
  sale: number | string;
  total: number;
  testF: string;
  ratio: number | string;
}

/** 客户趋势列表类型 */
export interface CustomerTrendItemType {
  sale: string;
  FShortName: string;
  FCUSTID: number;
  FNUMBER: string;
}
/** 销售统计列表类型 */
export interface SaleStatisticsItemType {
  "01": number;
  "02": number;
  "03": number;
  "04": number;
  "05": number;
  "06": number;
  "07": number;
  "08": number;
  "09": number;
  "10": number;
  "11": number;
  "12": number;
  firstHalfYearSum: number;
  sYear: string;
  oneYearSum: number;
  oneYearSaleProprtion: string;
  modelName: string;
  firstHalfYearSaleProprtion: string;
  fnumber: string;
}
/** 销售统计下拉框数据类型 */
export interface SaleStatisticsOptionType {
  salePeopleLists: {
    optionKey: string;
    optionValue: number;
  }[];
  customerGroupLists: {
    optionKey: string;
    optionValue: number;
  }[];
}

/** 业绩统计列表类型 */
export interface AchievementStatisticsItemType {
  FBILLNO: string;
  saleMoney: number;
  FPRICE: number;
  F_DEG_MODEL: string;
  qty: number;
  opeName: string;
  FColor: string;
  FDATE: string;
  customerName: string;
}
/** 业绩统计人员列表类型 */
export interface AchievementStatisticsPeopleItemType {
  opeName: string;
  allSaleMoney: number;
}
/** 业绩统计下拉框数据列表 */
export interface AchievementStatisticsOptionType {
  customerGroupLists: {
    optionKey: string;
    optionValue: number;
  }[];
  endDate: string;
  customerNameLists: {
    optionKey: string;
    optionValue: number;
  }[];
  fnumber: string;
  salePeopleLists: {
    optionKey: string;
    optionValue: number;
  }[];
  startDate: string;
}
/** 销售汇总 */
export interface SaleNumberSummaryOptionType {
  customerGroupLists: {
    optionKey: string;
    optionValue: number;
  }[];
  salePeopleLists: {
    optionKey: string;
    optionValue: number;
  }[];
}

/** 赠送记录列表类型 */
export interface DonateRecordItemType {
  fdate: string;
  customerName: string;
  model: string;
  color: string;
  qty: number;
  note: string;
  opeName: string;
}
/** 赠送记录下拉数据类型 */
export interface DonateRecordOptionType {
  customerGroupLists: {
    optionKey: string;
    optionValue: number;
  }[];
  salePeopleLists: {
    optionKey: string;
    optionValue: number;
  }[];
}

/** 客户排名: 客户汇总数列表类型 */
export interface CustomerSummaryItemType {
  year: string;
  sumShimentQty: number;
  sumSaleMoney: number;
  customId: number;
  customerName: string;
}
/** 客户排名: 出货记录列表类型 */
export interface OutboundSummaryItemType {
  FQTY: number;
  FPRICE: number;
  sumMoney: number;
  orderBillNo: string;
  F_DEG_MODEL: string;
  stockBillNo: string;
  FColor: string;
  customerName: string;
  FDATE: string;
  FNUMBER: string;
}
/** 客户排名: 物料占比列表类型 */
export interface MaterialRatioSummaryItemType {
  proortion: number;
  F_DEG_MODEL: string;
  FNumberQTY: number;
  FColor: string;
  FNUMBER: string;
}
/** 客户排名: 下拉框数据类别 */
export interface CustomerRankingOptionType {
  salePeopleLists: {
    optionKey: string;
    optionValue: number;
  }[];
}

/** ========================= 报价申请 ========================= */

/** 报价申请列表类型 */
export interface QuoteApplyItemType {
  id: string;
  billNo: string;
  billState: number;
  createDate: string;
  createUserId: number;
  productCode: string;
  customerName: string;
  isRepeatOrder: boolean;
  referenceBillNo: string;
  referenceMaterialCode: string;
  processRequirements: string;
  createUserName: string;
  powerCableRequirements: string;
  packagingRequirements: string;
  quoteQuantity: string;
  quoteQuantityMoney: string;
  quoteQuantityLists: string[];
  quoteQuantityMoneyLists: string[];
  currencys: string;
  currencyLists: string[];
  orgId: string;
}
/** 参考单号列表类型 */
export interface QuoteApplyBillItemType {
  materialVOS: QuoteApplyMaterialItemType[];
  FID: string;
  FDATE: string;
  FBILLNO: string;
  FSALERID: string;
  FCUSTID: string;
}
/** 参考物料编码列表类型 */
export interface QuoteApplyMaterialItemType {
  FMATERIALID: string;
  FNUMBER: string;
  FNAME: string;
  FCREATEDATE: string;
}

/** ========================= 销售报价单 ========================= */

/** 销售报价单列表类型 */
export interface QuoteSaleItemType {
  billNo: string;
  billState: number;
  createDate: string;
  createUserId: number;
  createUserName: string;
  id: string;
  lastOrderDate: string;
  lastOrderExchangeRate: number;
  lastOrderGrossMargin: number;
  lastOrderPrice: number;
  lastOrderQuantity: number;
  materialBomLists: QuoteBomItemType[];
  mkQuoteRequestVO: {
    billNo: string;
    billState: number;
    createDate: string;
    createUserId: number;
    createUserName: string;
    currencyLists: string[];
    currencys: string;
    customerName: string;
    id: string;
    isRepeatOrder: boolean;
    orgId: string;
    packagingRequirements: string;
    powerCableRequirements: string;
    processRequirements: string;
    productCode: string;
    quoteQuantity: string;
    quoteQuantityLists: string[];
    quoteQuantityMoney: string;
    quoteQuantityMoneyLists: string[];
    referenceBillNo: string;
    referenceMaterialCode: string;
  };
  orgId: string;
  packMaterialBomLists: QuoteBomItemType[];
  quotationRequestId: string;
  variableCost: VariableCostItemType[];
}

/** 报价单BOM信息列表类型 */
export interface QuoteBomItemType {
  baseDenominator: number;
  baseNumerator: number;
  isPacked: boolean;
  createDate: string;
  createUserId: number;
  id: string;
  materialAmount: number;
  materialCode: string;
  materialName: string;
  materialProperty: string;
  materialUnitPrice: number;
  orgId: string;
  priceSource: string;
  purchaseDate: string;
  quotationId: string;
  specification: string;
  valuationUnit: string;
  valuationUnitQuantity: number;
  verificationState: number;
  uuid?: string;
  isNew?: boolean;
}

/** 变量成本列表类型 */
export interface VariableCostItemType {
  category: string;
  companyGrossMargin: number;
  createDate: string;
  createUserId: number;
  domesticPrice: number;
  exportPrice: number;
  id: string;
  incomeRatio: number;
  laborCost: number;
  manufacturingCost: number;
  moq: number;
  orgId: string;
  packagingCost: number;
  quotationId: string;
  rawMaterialCost: number;
  totalUnitCost: number;
  unitContributionMargin: number;
}

/** ========================= 采购询价单 ========================= */

/** 采购询价单列表类型 */
export interface QuotePurchaseItemType {
  id: string;
  inquiryNo: string;
  billNo: string;
  billState: number;
  inquiryDate: string;
  purchaser: string;
  materialCode: string;
  materialName: string;
  materialSpec: string;
  priceType: string;
  purchasePrice: number;
  quotationNo: string;
  applicationNo: string;
  orgId: string;
  createDate: string;
  createUserId: number;
  createUserName: string;
  mkPurchaseInquiryPriceVOS: QuotePurchaseStairItemType[];
}

/** 采购询价单价类型-阶梯列表类型 */
export interface QuotePurchaseStairItemType {
  id: string;
  inquiryId: string;
  purchasePrice: number;
  minQuantity: number;
  maxQuantity: number;
  createDate: string;
  createUserId: number;
}
