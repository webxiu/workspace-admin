/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 17:47:52
 */

import { LoadingType } from "@/components/ButtonList/index.vue";
import { type UploadProps } from "element-plus";
import { h, computed, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { PAGE_CONFIG } from "@/config/constant";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { onDownload, downloadFile, getFileNameOnUrlPath, formatDate, commonBackLogic } from "@/utils/common";
import { setColumn, getMenuColumns, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { Download, Folder, Upload, View, Tickets, Position, Document } from "@element-plus/icons-vue";
import { getkkViewUrl } from "@/utils/storage";
import { addDialog } from "@/components/ReDialog";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import Detail from "../detail/index.vue";

import {
  statementFileList,
  submitStatement,
  downloadStatement,
  uploadInvoice,
  uploadStatement,
  supplierListOptions,
  statementList,
  statementDetailList,
  StatementItemType,
  submitInvoice,
  StatementDetailItemType,
  exportStatement
} from "@/api/supplyChain";

export enum StateInfo {
  /** 待提交  */
  submit = 0,
  /** 审核中 */
  audit = 1,
  /** 已审核 */
  audited = 2,
  /** 重新审核 */
  reAudit = 3
}

export const useConfig = () => {
  const tableRef = ref();
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const rowData = ref<StatementItemType>();
  const dataList = ref<StatementItemType[]>([]);
  const dataList2 = ref<StatementDetailItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 104);

  const formData = reactive({
    page: 1,
    date: "",
    supplierCode: "",
    shortName: "",
    limit: PAGE_CONFIG.pageSize
  });
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "供应商简称", value: "shortName" },
    { label: "供应商编号", value: "supplierCode" },
    { label: "对账单日期", value: "date", type: "month", format: "YYYY-MM" }
  ]);

  onMounted(() => {
    getColumnConfig();
    // getOptionList();
    getTableList();
  });

  const getOptionList = () => {
    supplierListOptions().then(({ data }) => {
      if (Array.isArray(data?.records)) {
        searchOptions[1].children = data?.records.map((m) => {
          return { label: m.fshortName, value: m.fnumber };
        });
      }
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "单据编号", prop: "fbillno", sortable: true, minWidth: 160 },
      { label: "供应商", prop: "userCode", sortable: true },
      { label: "采购员", prop: "userName", sortable: true },
      { label: "币别", prop: "currencyname" },
      { label: "价税合计", prop: "fallamountfor", align: "right", sortable: true, minWidth: 160 },
      { label: "业务日期", prop: "fdate", minWidth: 160, sortable: true, cellRenderer: ({ row }) => <span>{formatDate(row.fdate)}</span> },
      { label: "付款条件", prop: "fpayconditon", sortable: true },
      { label: "整单折扣金额", prop: "forderdiscountamountfor", minWidth: 160, sortable: true },
      {
        label: "对账单上传状态",
        prop: "statementOAVO.uploadFile",
        cellRenderer: ({ row }) => <span>{row.statementOAVO.uploadFile ? "已上传" : "未上传"}</span>
      },
      { label: "对账单审批状态", prop: "statementOAVO.billStateDescribe" },
      { label: "对账单上传人", prop: "statementOAVO.kingdeeUploadUserName" },
      {
        label: "对账单上传日期",
        prop: "statementOAVO.modifyDate",
        minWidth: 160,
        cellRenderer: ({ row }) => <span>{formatDate(row.statementOAVO?.modifyDate)}</span>
      },
      {
        label: "发票上传状态",
        prop: "statementInvoiceOAVO.uploadFile",
        cellRenderer: ({ row }) => <span>{row.statementInvoiceOAVO.uploadFile ? "已上传" : "未上传"}</span>
      },
      { label: "发票审批状态", prop: "statementInvoiceOAVO.billStateDescribe" },
      { label: "发票上传人", prop: "statementInvoiceOAVO.kingdeeUploadUserName" },
      {
        label: "发票上传日期",
        prop: "statementInvoiceOAVO.modifyDate",
        minWidth: 160,
        cellRenderer: ({ row }) => <span>{formatDate(row.statementInvoiceOAVO?.modifyDate)}</span>
      },
      { label: "备注", prop: "fremark", minWidth: 160 }
    ];
    let columnData2: TableColumnList[] = [
      { label: "物料编码", prop: "fmaterialid", sortable: true },
      { label: "物料名称", prop: "materialname" },
      { label: "物料规格 ", prop: "fspecification", minWidth: 160, sortable: true },
      { label: "计价单位", prop: "fpriceunitid", align: "right", sortable: true },
      { label: "单价", prop: "fprice", align: "right", sortable: true },
      { label: "计价数量", prop: "fpriceqty", align: "right", minWidth: 160 },
      { label: "含税单价", prop: "ftaxprice", align: "right", sortable: true, minWidth: 160 },
      { label: "税率(%)", prop: "fentrytaxrate", align: "right", minWidth: 160 },
      { label: "折扣率(%)", prop: "fentrydiscountrate", align: "right" },
      { label: "折扣额 ", prop: "fdiscountamountfor", align: "right", minWidth: 160, sortable: true },
      { label: "不含税金额", prop: "fnotaxamountfor", align: "right", minWidth: 160, sortable: true },
      { label: "税额", prop: "ftaxamountfor", align: "right", minWidth: 160, sortable: true },
      { label: "价税合计", prop: "fallamountfor", align: "right", minWidth: 160, sortable: true },
      { label: "批号", prop: "fnumber", minWidth: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: { minWidth: 190 } });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values) => {
    formData.supplierCode = values.supplierCode;
    formData.shortName = values.shortName;
    formData.date = values.date;
    getTableList();
  };

  // 主表
  const getTableList = (row?: StatementItemType) => {
    loading.value = true;
    statementList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        let curRow = dataList.value[0];
        if (row) {
          curRow = dataList.value.find((item) => item.fbillno === row.fbillno);
        }
        tableRef.value?.getTableRef().setCurrentRow(curRow);
      })
      .catch((err) => (loading.value = false));
  };

  // 从表
  const getTableList2 = (row: StatementItemType) => {
    rowData.value = row;
    loading2.value = true;
    statementDetailList({
      ...formData,
      id: row?.id,
      fbillNo: row?.fbillno,
      statementBillNo: row?.statementOAVO?.billNo
    })
      .then(({ data }) => {
        loading2.value = false;
        dataList2.value = data || [];
      })
      .catch((err) => (loading2.value = false));
  };

  /** 提交对账单 */
  const onSubmitStatement = (row: StatementItemType) => {
    const { limit, page } = formData;
    const { fbillno, fdate, id, userCode, statementOAVO } = row;
    showMessageBox(`确认提交对账单吗?`).then(() => {
      submitStatement({
        date: fdate,
        fbillNo: fbillno,
        id: id,
        limit: limit,
        page: page,
        statementBillNo: statementOAVO.billNo,
        supplierCode: userCode
      }).then((res) => {
        if (res.data) {
          message("对账单提交成功");
          getTableList(row);
        } else {
          message("对账单提交失败", { type: "error" });
        }
      });
    });
  };

  /** 提交发票流程进入审批 */
  const onSubmitInvoice = (row: StatementItemType) => {
    const { limit, page } = formData;
    const { fbillno, fdate, id, userCode, statementInvoiceOAVO } = row;
    showMessageBox("确认提交发票吗?").then(() => {
      submitInvoice({
        date: fdate,
        fbillNo: fbillno,
        id: id,
        limit: limit,
        page: page,
        statementBillNo: statementInvoiceOAVO?.billNo,
        supplierCode: userCode
      }).then((res) => {
        if (res.data) {
          message("发票提交成功");
          getTableList(row);
        } else {
          message("发票提交失败", { type: "error" });
        }
      });
    });
  };

  // 校验文件
  const verifyFile = (rawFile: File) => {
    if (!["application/pdf"].includes(rawFile.type)) {
      message("文件必须为pdf格式!", { type: "warning" });
      return false;
    }
    return true;
  };

  /** 上传对账单(先上传) */
  const onUploadStatement: UploadProps["onChange"] = wrapFn(rowData, (uploadFile) => {
    const text = "上传对账单";
    const row = rowData.value;
    const rawFile = uploadFile.raw;
    if (!verifyFile(rawFile)) return;
    const fd = new FormData();
    fd.append("file", rawFile);
    fd.append("fbillNo", row.fbillno);
    loadingStatus.value = { text, loading: true };
    uploadStatement(fd)
      .then((res) => {
        loadingStatus.value = { text, loading: false };
        if (res.data) {
          message("上传成功");
          getTableList(row);
        } else {
          message("上传失败", { type: "error" });
        }
      })
      .catch(() => {
        loadingStatus.value = { text, loading: false };
      });
  });

  /** 上传发票(后上传) */
  const maxLen = ref(0);
  const onUploadInvoice: UploadProps["onChange"] = wrapFn(rowData, (uploadFile, uploadFiles) => {
    const text = "上传发票";
    const row = rowData.value;
    const len = uploadFiles.length;
    maxLen.value = Math.max(len, maxLen.value);
    const timer = setTimeout(() => {
      if (len === maxLen.value) {
        const fd = new FormData();
        for (let i = 0; i < uploadFiles.length; i++) {
          const uploadFile = uploadFiles[i];
          const file = uploadFile.raw;
          if (!verifyFile(file)) return false;
          fd.append("files", file);
        }
        fd.append("fbillNo", row.fbillno);
        loadingStatus.value = { text, loading: true };
        uploadInvoice(fd)
          .then((res) => {
            loadingStatus.value = { text, loading: false };
            if (res.data) {
              message("上传发票成功");
              getTableList(row);
            } else {
              message("上传发票失败, 请检查是否有对账单未审批完成", { type: "error" });
            }
          })
          .catch(() => {
            loadingStatus.value = { text, loading: false };
          });
      }
      clearTimeout(timer);
    });
  });

  /** 下载对账单 */
  const onDownloadStatement = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    const filePath = row.statementOAVO?.filePath;
    if (!filePath) return message("没有可下载的单据", { type: "error" });
    downloadStatement({ fbillNo: row.fbillno })
      .then((res: any) => {
        const fileName = filePath.slice(filePath.lastIndexOf("/") + 1);
        onDownload(res, fileName);
      })
      .catch(console.log);
  });

  /** 预览对账单(单个) */
  const onPreviewStatement = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    const filePath = row.statementOAVO?.filePath;
    if (!filePath) return message("没有可预览的单据", { type: "error" });
    window.open(getkkViewUrl(filePath));
  });

  /** 预览详情 */
  const onView = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    addDialog({
      title: "详情信息",
      props: { fbillNo: row.fbillno, id: row.id, type: "edit" },
      width: "960px",
      draggable: true,
      fullscreenIcon: false,
      closeOnClickModal: true,
      hideItem: ["ok"],
      cancelButtonText: "关闭",
      contentRenderer: () => h(Detail),
      beforeSure: (done) => done()
    });
  });

  // 导出
  const onExport = wrapFn(rowData, () => {
    exportStatement({ billNo: rowData.value.fbillno }).then(({ data }) => {
      if (!data) return message("导出失败", { type: "error" });
      const fileName = getFileNameOnUrlPath(data);
      downloadFile(data, fileName, true);
    });
  });

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }
  function onPageCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }
  function onCurrentChange(row: StatementItemType) {
    getTableList2(row);
  }

  const invoiceDetail = wrapFn(rowData, () => {
    const row = rowData.value;
    addDialog({
      title: "查看发票审批节点详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: row.statementInvoiceOAVO.billNo, billType: "invoice", billState: +row?.statementInvoiceOAVO?.billState })
    });
  });

  const statementDetail = wrapFn(rowData, () => {
    const row = rowData.value;
    addDialog({
      title: "查看对账单审批节点详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: row.statementOAVO.billNo, billType: "statement", billState: +row?.statementOAVO?.billState })
    });
  });

  const onBackStatement = wrapFn(rowData, () => {
    const { statementOAVO } = rowData.value;
    const { billNo, billState } = statementOAVO || {};
    if (!billNo || ![StateInfo.audit, StateInfo.audited].includes(billState)) {
      return message("只有审核中和已审核的单据才能进行回退", { type: "warning" });
    }
    commonBackLogic(billNo, getTableList);
  });

  const onBackInvoice = wrapFn(rowData, () => {
    const { statementInvoiceOAVO } = rowData.value;
    const { billNo, billState } = statementInvoiceOAVO || {};
    if (!billNo || ![StateInfo.audit, StateInfo.audited].includes(billState)) {
      return message("只有审核中和已审核的单据才能进行回退", { type: "warning" });
    }
    commonBackLogic(billNo, getTableList);
  });

  const buttonList = ref<ButtonItemType[]>([
    {
      type: "primary",
      text: "上传对账单",
      icon: Upload,
      disabled: false,
      uploadProp: { action: "#", accept: ".pdf", autoUpload: false, onChange: onUploadStatement }
    },
    {
      type: "success",
      text: "上传发票",
      icon: Tickets,
      disabled: false,
      uploadProp: { action: "#", accept: ".pdf", autoUpload: false, multiple: true, onChange: onUploadInvoice }
    },
    { clickHandler: onDownloadStatement, type: "default", text: "下载对账单", icon: Download, isDropDown: true },
    { clickHandler: onPreviewStatement, type: "danger", text: "预览对账单", icon: View, isDropDown: true },
    { clickHandler: onView, type: "warning", text: "预览详情", icon: Folder, isDropDown: true },
    { clickHandler: invoiceDetail, type: "warning", text: "发票审批详情", icon: Folder, isDropDown: true },
    { clickHandler: statementDetail, type: "warning", text: "对账单审批详情", icon: Folder, isDropDown: true },
    { clickHandler: onBackStatement, type: "primary", text: "回退对账单", icon: Tickets, isDropDown: true },
    { clickHandler: onBackInvoice, type: "primary", text: "回退发票", icon: Document, isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", icon: Position, isDropDown: true }
  ]);

  const buttonListTemp = computed<ButtonItemType[]>(() => {
    const statementOAVO = rowData.value?.statementOAVO;
    const InvoiceOAVO = rowData.value?.statementInvoiceOAVO;
    const disabled1 = statementOAVO?.billState && ![StateInfo.submit, StateInfo.reAudit].includes(statementOAVO.billState);
    // 移除对账单状态判断
    // const disabled2 = statementOAVO?.billState !== 2 || (InvoiceOAVO?.billState && ![StateInfo.submit, StateInfo.reAudit].includes(InvoiceOAVO?.billState));
    const disabled2 = InvoiceOAVO?.billState && ![StateInfo.submit, StateInfo.reAudit].includes(InvoiceOAVO?.billState);
    return buttonList.value.map((item) => {
      if (item.text === "上传对账单") return { ...item, disabled: disabled1 };
      if (item.text === "上传发票") return { ...item, disabled: disabled2 };
      return item;
    });
  });

  return {
    tableRef,
    loading,
    columns,
    dataList,
    columns2,
    loading2,
    dataList2,
    maxHeight,
    pagination,
    buttonList: buttonListTemp,
    loadingStatus,
    searchOptions,
    onTagSearch,
    onSubmitStatement,
    onSubmitInvoice,
    onRefresh,
    onSizeChange,
    onPageCurrentChange,
    onCurrentChange
  };
};
