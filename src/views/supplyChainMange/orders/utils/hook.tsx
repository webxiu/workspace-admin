import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { saveAs } from "file-saver";

import { ElMessage, ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { utils, write } from "xlsx";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import {
  delOrderAttr,
  fetchSupMaterialList,
  fetchSupOrderList,
  getSupOrderBillId,
  submitOrderAttr,
  uploadOrderAttr,
  viewSignBackAttrList,
  getFileStatusBeforeUpload,
  getFileNumBeforeChange,
  changePurchaseOrder
} from "@/api/supplyChain";
import { PAGE_CONFIG } from "@/config/constant";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import dayjs from "dayjs";
import { addDialog } from "@/components/ReDialog";
import OrderDetail from "./orderDetail.vue";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { commonBackLogic } from "@/utils/common";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(true);
  const loading2 = ref<boolean>(false);
  const dataList = ref([]);
  const dataList2 = ref([]);
  const modalRef = ref();
  const rowData = ref();
  const dialogVisible = ref(false);
  const signRowData = ref({});
  const currentViewRow = ref({});
  const currentActiveRow: any = ref({});
  const orderRef = ref(null);
  const signBackStatus = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 105);
  // 回签状态
  const signBackConstantInfo = {
    0: "待提交",
    1: "审核中",
    2: "已回签",
    3: "已驳回",
    null: "待回签"
  };

  const formData: any = reactive({
    startTime: "",
    endTime: "",
    fbillno: "",
    fnumber: "",
    supCode: "",
    date: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    fclosestatus: "",
    fileNumParam: "",
    fname: "",
    authFlag: true
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const before90DayDate = dayjs().startOf("month").format("YYYY-MM-DD");
  const nowDate = dayjs().format("YYYY-MM-DD");

  const queryParams = reactive({ date: `${before90DayDate} ~ ${nowDate}` });

  const searchOptions: SearchOptionType[] = [
    { label: "物料编码", value: "fnumber" },
    { label: "物料名称", value: "fname" },
    { label: "回签单号", value: "fhqdh" },
    { label: "供应商编号", value: "supCode" },
    {
      label: "订单状态",
      value: "fclosestatus",
      children: [
        { label: "未完成", value: "A" },
        { label: "已完成", value: "B" }
      ]
    },

    {
      label: "回签状态",
      value: "fileNumParam",
      children: [
        { label: "未回签", value: "no" },
        { label: "已回签", value: "yes" }
      ]
    },
    { label: "采购日期", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ];

  onMounted(async () => {
    getColumnConfig();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "订单日期", prop: "fdate", sortable: true },
      { label: "订单编号", prop: "fbillno", minWidth: 150 },
      { label: "回签单号", prop: "billNo", minWidth: 150 },
      { label: "采购员", prop: "userName" },
      { label: "供应商编号", prop: "supCode" },
      { label: "总税额", prop: "fbilltaxamount" },
      { label: "总金额", prop: "fbillamount" },
      { label: "总价税合计", prop: "fbillallamount" },
      {
        label: "状态",
        prop: "fclosestatus",
        cellRenderer: ({ row }) => <span>{row.fclosestatus === "A" ? "未关闭" : "已关闭"}</span>
      },
      { label: "回签状态", prop: "billState", slot: "billState" },
      { label: "金蝶附件数", prop: "fileCount" }
    ];

    let columnData2: any[] = [
      { label: "物料编码", prop: "fnumber" },
      { label: "物料名称", prop: "fname" },
      { label: "规格", prop: "fspecification" },
      { label: "单位", prop: "unit" },
      { label: "数量", prop: "fqty" },
      { label: "收货数量", prop: "freceiveqty" },
      { label: "入库数量", prop: "fstockinqty" },
      { label: "退货数量", prop: "fmrbqty" },
      { label: "不含税单价", prop: "fprice" },
      { label: "含税单价", prop: "ftaxprice" },
      { label: "税率%", prop: "ftaxrate" },
      { label: "价税合计", prop: "fallamount" },
      { label: "金额", prop: "famount" },
      {
        label: "状态",
        prop: "fmrpclosestatus",
        slot: "fmrpclosestatus"
        // cellRenderer: ({ row }) => (row.fmrpclosestatus === "A" ? "正常" : "业务关闭") //operation
      }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: false });
    return columnData;
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };
  const onSearch = (idx?) => {
    const { date = "" } = formData;
    const [startTime, endTime] = date.split("~").map((item) => item.trim());
    formData.startTime = startTime;
    formData.endTime = endTime;
    fetchSupOrderList(formData)
      .then((res: any) => {
        // console.log(res.data.records, "records");
        const data = res.data;
        dataList.value = data.records || [];
        pagination.total = data.total;
        if (orderRef.value) {
          if (typeof idx === "number" && idx >= 0) {
            orderRef.value.getTableRef()?.setCurrentRow(dataList.value[idx]);
            currentActiveRow.value = dataList.value[idx] || {};
          } else {
            orderRef.value.getTableRef()?.setCurrentRow(dataList.value[0]);
            currentActiveRow.value = dataList.value[0];
          }
        }
        onSearch2();
      })
      .catch(() => console.log)
      .finally(() => (loading.value = false));
  };

  const fetchOpts = () => {
    getBOMTableRowSelectOptions({ optioncode: "SignBackState" }).then((res) => {
      if (res.data) {
        const optionList = res.data[0]?.optionList || [];
        signBackStatus.value = optionList;
      }
    });
  };

  fetchOpts();

  const onSearch2 = (v?) => {
    loading2.value = true;
    if (!dataList.value?.length) {
      loading2.value = false;
      dataList2.value = [];
      return;
    }
    fetchSupMaterialList({ fbillno: v ?? currentActiveRow.value.fbillno })
      .then((res: any) => {
        const data = res.data;
        dataList2.value = data;
        // getColumnConfig2();
      })
      .catch(() => console.log)
      .finally(() => (loading2.value = false));
  };

  const handleTagSearch = (values) => {
    formData.fnumber = values.fnumber;
    formData.fname = values.fname;
    formData.fhqdh = values.fhqdh;
    formData.supCode = values.supCode;
    formData.fclosestatus = values.fclosestatus;
    formData.fileNumParam = values.fileNumParam;
    formData.date = values.date;
    formData.fname = values.fname;
    formData.fbillno = values.fbillno;

    onSearch();
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const onCurrentChange = (row) => {
    if (!row) return;
    rowData.value = row;
  };

  // 删除单据
  const onDelete = (row) => {
    delOrderAttr({ id: row.fileId }).then((res) => {
      if (res.data) {
        message("删除成功");
        const _rowIndex = dataList.value.findIndex((item) => item.fbillno === row.fbillno);
        onSearch(_rowIndex);
      }
    });
  };

  const onViewDetail = (row) => {
    console.log(row, "view detail row");
    addDialog({
      title: "采购订单详情",
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideItem: ["ok"],
      cancelButtonText: "关闭",
      contentRenderer: () => h(OrderDetail, { fbillno: row.fbillno, source: "home" })
    });
  };

  // 表格双击
  const dbSelected = (row) => {
    currentActiveRow.value = row;
    onViewDetail(row);
  };

  // 查看
  const onView = (row) => {
    currentViewRow.value = row;
    dialogVisible.value = true;
    setTimeout(() => {
      modalRef.value.loading = true;
      viewSignBackAttrList({ billno: row.fbillno })
        .then((res: any) => {
          if (res.data) {
            modalRef.value.tableData = res.data;
          }
        })
        .finally(() => (modalRef.value.loading = false));
    }, 0);
  };

  const fresh = () => {
    if (JSON.stringify(currentViewRow.value) !== "{}") {
      onView(currentViewRow.value);
      onSearch();
    }
  };

  // 回签
  const onSignBack = (row) => {
    signRowData.value = { ...row, type: "新增" };
    loading.value = true;
    getFileStatusBeforeUpload({ billno: row.fbillno })
      .then((res) => {
        if (res.data) {
          document.getElementById("signFile").click();
        }
      })
      .finally(() => (loading.value = false));
  };

  // 表格单据
  const rowClickSelected = (row) => {
    currentActiveRow.value = row;
    setTimeout(() => {
      onSearch2(row.fbillno);
    }, 200);
  };

  // 表格行样式
  const rowStyle = ({ row }) => {
    if (row.billState == 2) {
      return { cursor: "pointer" };
    }
    return {
      background: row.billState !== null ? "#056608" : "#8b0000",
      color: "#fff",
      cursor: "pointer"
    };
  };

  // 单元格样式
  const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
    if (column.id === "el-table_1_column_2") {
      if (row.billState == 2) {
        return { cursor: "pointer" };
      }
      return {
        background: row.billState !== null ? "#056608" : "#8b0000",
        color: "#fff",
        cursor: "pointer"
      };
    }
  };

  // 上传变化的input事件
  const onUpload = () => {
    const files: any = (document.getElementById("signFile") as HTMLInputElement).files;

    const fileList: any = new Map();
    for (let i = 0; i < files.length; i++) {
      // if (files[i]?.size > 1024 * 1024 * 10) {
      //   ElMessage({ message: "上传文件不能超过10M", type: "error" });
      //   return;
      // }
      fileList.set(i, files[i]);
    }

    const fileArray = Array.from(fileList.values());
    const fileData = new FormData();
    fileArray.forEach((item: any) => fileData.append("files", item));
    fileData.append("file", fileList);
    fileData.append("param", JSON.stringify(signRowData.value));
    uploadOrderAttr(fileData)
      .then((res) => {
        if (res.data) {
          ElMessage({
            message: "上传成功",
            type: "success"
          });
          const _rowIndex = dataList.value.findIndex((item) => item.fbillno === currentActiveRow.value.fbillno);
          onSearch(_rowIndex);
        }
      })
      .finally(() => {
        const dom = document.getElementById("signFile");
        (dom as any).value = null;
      });
  };

  // 提交订单回签
  const onSubmit = (row) => {
    submitOrderAttr({ billno: row.fbillno }).then((res) => {
      if (res.data) {
        ElMessage({
          message: "提交成功",
          type: "success"
        });
        const _rowIndex = dataList.value.findIndex((item) => item.fbillno === row.fbillno);
        onSearch(_rowIndex);
      }
    });
  };

  const onChangePo = (row) => {
    getFileNumBeforeChange({ billno: row.fbillno }).then((res) => {
      if (res.data === 1) {
        changePurchaseOrder({ billno: row.fbillno }).then((resp) => {
          if (resp.data) {
            ElMessage({ message: "变更成功", type: "success" });
            const _rowIndex = dataList.value.findIndex((item) => item.fbillno === row.fbillno);
            onSearch(_rowIndex);
          }
        });
      }
    });
  };

  const beforeClickBtn = (fn) => {
    if (JSON.stringify(currentActiveRow.value) == "{}") {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    } else {
      fn();
    }
  };

  const submitOrder = () => {
    const row = currentActiveRow.value;
    if (![0, 3].includes(row.billState)) {
      ElMessage({ message: "当前状态不能提交", type: "error" });
      return;
    }
    ElMessageBox.confirm(`确认要提交【${row.fbillno}】?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        onSubmit(currentActiveRow.value);
      })
      .catch(() => {});
  };

  const delOrder = () => {
    const row = currentActiveRow.value;
    if (![0, 3].includes(row.billState)) {
      ElMessage({ message: "当前状态不能删除", type: "error" });
      return;
    }
    ElMessageBox.confirm(`确认要删除【${row.fbillno}】?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        onDelete(currentActiveRow.value);
      })
      .catch(() => {});
  };

  const uploadOrder = () => {
    const row = currentActiveRow.value;
    if (![null, 0, 3].includes(row.billState)) {
      ElMessage({ message: "当前状态不能上传回签", type: "error" });
      return;
    }
    ElMessageBox.confirm(`确认要上传回签【${row.fbillno}】?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        onSignBack(currentActiveRow.value);
      })
      .catch(() => {});
  };

  const changeOrder = () => {
    const row = currentActiveRow.value;
    if (row.billState !== 2) {
      ElMessage({ message: "只有状态为【已回签】的才能进行变更", type: "error" });
      return;
    }
    ElMessageBox.confirm(`确定变更采购订单为\n【${row.fbillno}】的订单吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        onChangePo(currentActiveRow.value);
      })
      .catch(() => {});
  };

  const viewOrder = () => {
    onView(currentActiveRow.value);
  };

  const exportHandle = () => {
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#purchaseOrderId"), {
      raw: true //有的是日期、小数等格式，直接乱码#。所以这里直接保留原始字符串
    });
    workbook.Sheets.Sheet1["!cols"][0] = { hidden: true };
    const wbout = write(workbook, {
      bookType: "xlsx",
      bookSST: true,
      type: "array"
    });
    saveAs(
      new Blob([wbout], {
        type: "application/octet-stream"
      }),
      `采购订单表${timeStep}.xlsx`
    );
  };

  const onViewNodeDetail = () => {
    if (JSON.stringify(currentActiveRow.value) == "{}" || !currentActiveRow.value) {
      return ElMessage({ message: "请选择一条记录", type: "warning" });
    }
    addDialog({
      title: "查看审批节点详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: currentActiveRow.value.billNo, billType: "signBack", billState: +currentActiveRow.value.billState })
    });
  };

  const backHandle = () => {
    if (JSON.stringify(currentActiveRow.value) == "{}" || !currentActiveRow.value) {
      return ElMessage({ message: "请选择一条记录", type: "warning" });
    }
    if (![1, 2].includes(currentActiveRow.value.billState)) {
      return message("当前状态不能进行回退", { type: "error" });
    }
    commonBackLogic(currentActiveRow.value.billNo, onSearch);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: () => beforeClickBtn(submitOrder), type: "primary", text: "提交", isDropDown: true },
    { clickHandler: () => beforeClickBtn(uploadOrder), type: "warning", text: "回签上传", isDropDown: true },
    { clickHandler: () => beforeClickBtn(delOrder), type: "danger", text: "删除" },
    { clickHandler: () => beforeClickBtn(changeOrder), type: "info", text: "变更", isDropDown: true },
    { clickHandler: () => exportHandle(), type: "info", text: "导出", isDropDown: true },
    { clickHandler: () => backHandle(), type: "info", text: "回退", isDropDown: true },
    { clickHandler: () => onViewNodeDetail(), type: "info", text: "审批详情", isDropDown: true }
  ]);

  return {
    columns,
    columns2,
    dataList,
    dataList2,
    loading,
    loading2,
    maxHeight,
    pagination,
    searchOptions,
    modalRef,
    dialogVisible,
    signBackConstantInfo,
    orderRef,
    buttonList,
    onRefresh,
    dbSelected,
    rowClickSelected,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    queryParams,
    handleCurrentChange,
    rowStyle,
    cellStyle,
    signBackStatus,
    fresh,
    onUpload
  };
};
