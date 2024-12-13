import { useEleHeight } from "@/hooks";
import { h, onMounted, reactive, ref } from "vue";
import { addDialog } from "@/components/ReDialog";
import { type PaginationProps } from "@pureadmin/table";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { BillState_Color, BillState, PAGE_CONFIG } from "@/config/constant";
import { getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { Tickets, Edit, Position, Download } from "@element-plus/icons-vue";
import {
  quotePurchaseList,
  QuotePurchaseItemType,
  addQuotePurchase,
  updateQuotePurchase,
  deleteQuotePurchase,
  exportQuotePurchase
} from "@/api/oaManage/marketing";
import Print from "../print.vue";
import { commonBackLogic, downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { commonSubmit } from "@/api/systemManage";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<QuotePurchaseItemType[]>([]);
  const rowData = ref<QuotePurchaseItemType>();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 46);

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "申请单号", value: "billNo" },
    { label: "申请日期", value: "createDate", type: "date", format: "YYYY-MM-DD" },
    { label: "采购员", value: "createUserName", children: [] },
    { label: "物料编码", value: "productCode" },
    { label: "物料名称", value: "customerName" }
  ]);

  onMounted(() => {
    getOption();
    getColumnConfig();
    getTableList();
  });

  function getOption() {
    setTimeout(() => {
      searchOptions[2].children = [
        { label: "张三1", value: "张三" },
        { label: "李四", value: "李四" }
      ];
    }, 3000);
  }

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "询价单号", prop: "billNo", minWidth: 160 },
      { label: "询价日期", prop: "inquiryDate", minWidth: 120 },
      { label: "申请日期", prop: "createDate", minWidth: 120 },
      {
        label: "单据状态",
        prop: "billState",
        minWidth: 140,
        align: "center",
        cellRenderer({ row, column }) {
          const value = row[column["property"]] as string;
          if (!BillState_Color[value]) return value;
          const item = BillState_Color[value];
          const styleBox = { color: "#fff", padding: "3px 6px", borderRadius: "4px", background: item.color };
          return <span style={styleBox}>{item.name}</span>;
        }
      },
      { label: "采购员", prop: "purchaser", minWidth: 100 },
      { label: "物料编码", prop: "materialCode", minWidth: 140 },
      { label: "物料名称", prop: "materialName", minWidth: 140 },
      { label: "物料规格", prop: "materialSpec", minWidth: 100 },
      { label: "单价类型", prop: "priceType", minWidth: 100 },
      { label: "采购价格", prop: "purchasePrice", minWidth: 100 },
      { label: "申请单号", prop: "applicationNo", minWidth: 140 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const getTableList = () => {
    loading.value = true;
    quotePurchaseList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const onReFresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  const openDialog = (type: "edit", row?: QuotePurchaseItemType) => {
    const title = { edit: "修改" }[type];
    const formRef = ref();
    console.log("row", row);
    addDialog({
      title: `${title}采购询价单`,
      props: { row: { ...row } },
      width: "80%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(Print, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const formData = formRef.value.formData;
        if (type === "edit" && ![BillState.submit, BillState.reject].includes(row.billState)) {
          return message.error("只能提交【待提交/重新审核】的记录");
        }
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox("确认提交吗").then(() => {
              const reqApi = { add: addQuotePurchase, edit: updateQuotePurchase };
              reqApi[type](formData).then((res) => {
                if (res.data) {
                  message.success(`${title}成功`);
                  getTableList();
                  done();
                } else {
                  message.error(`${title}失败`);
                }
              });
            });
          }
        });
      }
    });
  };

  const onSubmit = wrapFn(rowData, () => {
    const { id, billNo, billState } = rowData.value;
    if (![BillState.submit, BillState.reject].includes(billState)) {
      return message.error("只能提交【待提交/重新审核】的记录");
    }
    showMessageBox(`确认要提交单据【${billNo}】吗?`).then(() => {
      commonSubmit({ id, billNo, billId: "10064" }).then(({ data }) => {
        if (!data) return message.error("提交失败");
        message.success("提交成功");
        getTableList();
      });
    });
  });

  const onRevoke = wrapFn(rowData, () => {
    const { billState, billNo } = rowData.value;
    if (![BillState.auditing, BillState.audited].includes(billState)) {
      return message.error("当前状态不能进行回退");
    }
    commonBackLogic(billNo, getTableList, { dbKey: "sysmaster" });
  });

  const onExport = () => {
    const headConfig = getExportConfig("采购询价单", columns.value, formData);
    exportQuotePurchase(headConfig)
      .then(({ data }) => {
        if (!data) return message.error("导出失败");
        const fileName = getFileNameOnUrlPath(data);
        downloadFile(data, fileName, true);
      })
      .catch(console.log);
  };

  const onDblclick = (row: QuotePurchaseItemType) => {
    openDialog("edit", row);
  };

  const onCurrentChange = (row: QuotePurchaseItemType) => {
    rowData.value = row;
  };

  function handleSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onEdit, type: "warning", text: "询价", icon: Edit, isDropDown: false },
    { clickHandler: onSubmit, type: "primary", text: "提交", icon: Position, isDropDown: true },
    { clickHandler: onRevoke, type: "default", text: "撤销", icon: Tickets, isDropDown: true },
    { clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    searchOptions,
    buttonList,
    onReFresh,
    onTagSearch,
    onDblclick,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
