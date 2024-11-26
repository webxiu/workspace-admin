import { useEleHeight } from "@/hooks";
import { h, onMounted, reactive, ref } from "vue";
import { addDialog } from "@/components/ReDialog";
import { type PaginationProps } from "@pureadmin/table";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { BillState_Color, BillState, PAGE_CONFIG } from "@/config/constant";
import { getExportConfig, getMenuColumns, RendererType, setColumn, updateButtonList } from "@/utils/table";
import { Tickets, Edit, Position, Download } from "@element-plus/icons-vue";
import { quoteSaleList, QuoteSaleItemType, addQuoteSale, updateQuoteSale, deleteQuoteSale, exportQuoteSale } from "@/api/oaManage/marketing";
import { orderOptions } from "@/views/oa/marketing/saleManage/quoteApply/utils/config";
import { commonBackLogic, downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { commonSubmit } from "@/api/systemManage";
import Print from "../print.vue";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<QuoteSaleItemType[]>([]);
  const rowData = ref<QuoteSaleItemType>();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize, mkQuoteRequestVO: {} });
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
    const isRepeatOrderRender: RendererType = ({ row }) => {
      const item = orderOptions.find((item) => item.value === row.mkQuoteRequestVO.isRepeatOrder);
      return <span>{item?.label}</span>;
    };
    let columnData: TableColumnList[] = [
      { label: "报价单号", prop: "billNo", minWidth: 160 },
      { label: "申请单号", prop: "mkQuoteRequestVO.billNo", minWidth: 160 },
      { label: "申请人", prop: "mkQuoteRequestVO.createUserName", minWidth: 100 },
      { label: "申请日期", prop: "mkQuoteRequestVO.createDate", minWidth: 120 },
      { label: "创建日期", prop: "createDate", minWidth: 120 },
      { label: "产品编码", prop: "mkQuoteRequestVO.productCode", minWidth: 140 },
      { label: "客户名称", prop: "mkQuoteRequestVO.customerName", minWidth: 140 },
      { label: "是否翻单", prop: "mkQuoteRequestVO.isRepeatOrder", minWidth: 100, cellRenderer: isRepeatOrderRender },
      { label: "报价数量", prop: "mkQuoteRequestVO.quoteQuantity", minWidth: 100 },
      { label: "报价金额", prop: "mkQuoteRequestVO.quoteQuantityMoney", minWidth: 100 },
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
      { label: "参考单号", prop: "mkQuoteRequestVO.referenceBillNo", minWidth: 140 },
      { label: "参考物料编码", prop: "mkQuoteRequestVO.referenceMaterialCode", minWidth: 140 },
      { label: "工艺要求", prop: "mkQuoteRequestVO.processRequirements", minWidth: 140 },
      { label: "电源线/USB线要求", prop: "mkQuoteRequestVO.powerCableRequirements", minWidth: 140 },
      { label: "包装要求", prop: "mkQuoteRequestVO.packagingRequirements", minWidth: 140 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns([{ isRepeatOrder: isRepeatOrderRender }]);
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const getTableList = () => {
    loading.value = true;
    quoteSaleList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch(() => (loading.value = false));
  };

  const onReFresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values) => {
    formData.mkQuoteRequestVO = values;
    getTableList();
  };

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  const openDialog = (type: "edit", row?: QuoteSaleItemType) => {
    const title = { edit: "修改" }[type];
    const formRef = ref();
    const isEdit = [BillState.submit, BillState.reject].includes(row.billState);
    addDialog({
      title: `${title}销售报价单`,
      props: { row, isEdit },
      width: "90%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(Print, { ref: formRef }),
      beforeSure: (done, { options }) => {
        if (type === "edit" && !isEdit) {
          return message("只能提交【待提交/重新审核】的记录", { type: "error" });
        }
        const { FormRef, formData, variableCost, materialBomLists, packMaterialBomLists, ...rowInfo } = formRef.value.getRef();
        const { quoteList, ...reset } = formData;
        const materialCodes1 = materialBomLists.filter((f) => !f.materialCode && !f.materialGroup);
        const materialCodes2 = packMaterialBomLists.filter((f) => !f.materialCode && !f.materialGroup);
        if (materialCodes1.length || materialCodes2.length) {
          return message("物料编码为空时，物料分组必填", { type: "error" });
        }
        const jointArr = (list: string[], key: string) => {
          const _arr = list.map((m) => m[key]);
          return _arr.filter(Boolean).join(",");
        };
        const quoteQuantity = jointArr(quoteList, "count");
        const quoteQuantityMoney = jointArr(quoteList, "price");
        const currencys = jointArr(quoteList, "currency");
        const mkQuoteRequestVO = { ...row.mkQuoteRequestVO, quoteQuantity, quoteQuantityMoney, currencys };
        const params = { ...row, ...rowInfo, mkQuoteRequestVO, variableCost, materialBomLists, packMaterialBomLists };
        console.log("params", params);
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox("确认提交吗")
              .then(() => {
                const reqApi = { add: addQuoteSale, edit: updateQuoteSale };
                reqApi[type](params).then((res) => {
                  if (res.data) {
                    message(`${title}成功`);
                    getTableList();
                    done();
                  } else {
                    message(`${title}失败`, { type: "error" });
                  }
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmit = wrapFn(rowData, () => {
    const { id, billNo, billState } = rowData.value;
    if (![BillState.submit, BillState.reject].includes(billState)) {
      return message("只能提交【待提交/重新审核】的记录", { type: "error" });
    }
    showMessageBox(`确认要提交单据【${billNo}】吗?`).then(() => {
      commonSubmit({ id, billNo, billId: "10065" }).then(({ data }) => {
        if (!data) return message("提交失败", { type: "error" });
        message("提交成功");
        getTableList();
      });
    });
  });

  const onRevoke = wrapFn(rowData, () => {
    const { billState, billNo } = rowData.value;
    if (![BillState.auditing, BillState.audited].includes(billState)) {
      return message("当前状态不能进行回退", { type: "error" });
    }
    commonBackLogic(billNo, getTableList, { dbKey: "sysmaster" });
  });

  const onExport = () => {
    const headConfig = getExportConfig("销售报价单", columns.value, formData);
    exportQuoteSale(headConfig)
      .then(({ data }) => {
        if (!data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(data);
        downloadFile(data, fileName, true);
      })
      .catch(console.log);
  };

  const onDblclick = (row: QuoteSaleItemType) => {
    openDialog("edit", row);
  };

  const onCurrentChange = (row: QuoteSaleItemType) => {
    rowData.value = row;
  };
  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onEdit, type: "warning", text: "修改", icon: Edit, isDropDown: false },
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
