import { useEleHeight } from "@/hooks";
import { v4 as uuidv4 } from "uuid";
import { h, onMounted, reactive, ref } from "vue";
import { addDialog } from "@/components/ReDialog";
import { type PaginationProps } from "@pureadmin/table";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { BillState_Color, BillState, PAGE_CONFIG } from "@/config/constant";
import { getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { Tickets, Plus, Edit, Delete, Position, Download } from "@element-plus/icons-vue";
import { quoteApplyList, QuoteApplyItemType, addQuoteApply, updateQuoteApply, deleteQuoteApply, exportQuoteApply } from "@/api/oaManage/marketing";
import Print from "../print.vue";
import { orderOptions } from "./config";
import { commonSubmit } from "@/api/systemManage";
import { commonBackLogic, downloadFile, getFileNameOnUrlPath } from "@/utils/common";

export function combineArrays(countArr = [], priceArr = [], currencyArr = []) {
  let list = [];
  if (countArr?.length) list = countArr;
  if (priceArr?.length) list = priceArr;
  if (currencyArr?.length) list = currencyArr;
  return list.map((item, index) => {
    return { id: uuidv4(), count: countArr?.[index], price: priceArr?.[index], currency: currencyArr?.[index] };
  });
}

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<QuoteApplyItemType[]>([]);
  const rowData = ref<QuoteApplyItemType>();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 46);

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "申请人", value: "createUserName" },
    { label: "申请单号", value: "billNo" },
    { label: "申请日期", value: "createDate", type: "date", format: "YYYY-MM-DD" },
    { label: "产品编码", value: "productCode" },
    { label: "客户名称", value: "customerName" },
    { label: "是否翻单", value: "isRepeatOrder", children: orderOptions },
    { label: "参考单号", value: "referenceBillNo" },
    { label: "参考物料编码", value: "referenceMaterialCode" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "申请单号", prop: "billNo", minWidth: 160 },
      { label: "申请日期", prop: "createDate", minWidth: 120 },
      { label: "申请人", prop: "createUserName", minWidth: 100 },
      { label: "产品编码", prop: "productCode", minWidth: 140 },
      { label: "客户名称", prop: "customerName", minWidth: 140 },
      {
        label: "是否翻单",
        prop: "isRepeatOrder",
        minWidth: 100,
        cellRenderer: ({ row }) => {
          const item = orderOptions.find((item) => item.value === row.isRepeatOrder);
          return <span>{item?.label}</span>;
        }
      },
      { label: "报价数量", prop: "quoteQuantity", minWidth: 100 },
      { label: "报价金额", prop: "quoteQuantityMoney", minWidth: 100 },
      {
        label: "单据状态",
        prop: "billState",
        minWidth: 140,
        align: "center",
        cellRenderer({ row, column }) {
          const value = row[column["property"]];
          if (!BillState_Color[value]) return value;
          const item = BillState_Color[value];
          const styleBox = { color: "#fff", padding: "3px 6px", borderRadius: "4px", background: item.color };
          return <span style={styleBox}>{item.name}</span>;
        }
      },
      { label: "参考单号", prop: "referenceBillNo", minWidth: 140 },
      { label: "参考物料编码", prop: "referenceMaterialCode", minWidth: 140 },
      { label: "工艺要求", prop: "processRequirements", minWidth: 140 },
      { label: "电源线/USB线要求", prop: "powerCableRequirements", minWidth: 140 },
      { label: "包装要求", prop: "packagingRequirements", minWidth: 140 }
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
    quoteApplyList(formData)
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

  function onAdd() {
    openDialog("add", {} as QuoteApplyItemType);
  }

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  const openDialog = (type: "add" | "edit", row?: QuoteApplyItemType) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const isEdit = [BillState.submit, BillState.reject].includes(row.billState);
    const quoteList = combineArrays(row.quoteQuantityLists, row.quoteQuantityMoneyLists, row.currencyLists);
    addDialog({
      title: `${title}报价申请单`,
      props: { row: { ...row, quoteList }, isEdit: type === "add" || isEdit },
      width: "80%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(Print, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            const { quoteList, ...formData } = formRef.value.formData;
            const jointArr = (list: string[], key: string) => {
              const _arr = list.map((m) => m[key]);
              return _arr.filter(Boolean).join(",");
            };
            const quoteQuantity = jointArr(quoteList, "count");
            const quoteQuantityMoney = jointArr(quoteList, "price");
            const currencys = jointArr(quoteList, "currency");
            const params = { ...formData, quoteQuantity, quoteQuantityMoney, currencys };

            if (type === "edit" && !isEdit) {
              return message.error("只能提交【待提交/重新审核】的记录");
            }
            showMessageBox("确认提交吗")
              .then(() => {
                const reqApi = { add: addQuoteApply, edit: updateQuoteApply };
                reqApi[type](params).then((res) => {
                  if (res.data) {
                    message.success(`${title}成功`);
                    getTableList();
                    done();
                  } else {
                    message.error(`${title}失败`);
                  }
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onDelete = wrapFn(rowData, () => {
    const { billNo } = rowData.value;
    showMessageBox(`确认要删除申请单号【${billNo}】吗?`).then(() => {
      deleteQuoteApply({ deleteIds: [rowData.value.id] }).then(({ data }) => {
        if (!data) return message.error("删除失败");
        message.success("删除成功");
        getTableList();
      });
    });
  });

  const onSubmit = wrapFn(rowData, () => {
    const { id, billNo, billState } = rowData.value;
    if (![BillState.submit, BillState.reject].includes(billState)) {
      return message.error("只能提交【待提交/重新审核】的记录");
    }
    showMessageBox(`确认要提交单据【${billNo}】吗?`).then(() => {
      commonSubmit({ id, billNo, billId: "10063" }).then(({ data }) => {
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
    const headConfig = getExportConfig("报价申请单", columns.value, formData);
    exportQuoteApply(headConfig)
      .then(({ data }) => {
        if (!data) return message.error("导出失败");
        const fileName = getFileNameOnUrlPath(data);
        downloadFile(data, fileName, true);
      })
      .catch(console.log);
    exportQuoteApply["cancel"]();
  };

  const onDblclick = (row: QuoteApplyItemType) => {
    openDialog("edit", row);
  };

  const onCurrentChange = (row: QuoteApplyItemType) => {
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
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", icon: Edit, isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", icon: Delete, isDropDown: false },
    { clickHandler: onSubmit, type: "primary", text: "提交", icon: Position, isDropDown: true },
    { clickHandler: onRevoke, type: "default", text: "撤销", icon: Tickets, isDropDown: true },
    { clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true }
    // { clickHandler: onDetail, type: "default", text: "审批详情", icon: Tickets, isDropDown: true },
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
