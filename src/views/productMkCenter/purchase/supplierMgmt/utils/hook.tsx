import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox } from "@/utils/message";
import { useEleHeight } from "@/hooks";
import { type PaginationProps } from "@pureadmin/table";
import { PAGE_CONFIG } from "@/config/constant";
import {
  deleteSupplierList,
  exportSupplierList,
  fetchSupplierGroupList,
  fetchSupplierList,
  insertSupplierList,
  updateSupplierList
} from "@/api/oaManage/productMkCenter";
import TableEditList from "@/components/TableEditList/index.vue";
import { CustomPropsType } from "@/utils/form";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { fetchBomLeftTreeData } from "@/api/plmManage";
import SupUserItem from "./supUserItem.vue";

export const useConfig = (emits, contextMenuRef) => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref([]);
  const currentId = ref("");
  const curNodeLabel = ref();
  const currentRow = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 45);
  const categoryTreeData = ref([]);
  const curNodeName = ref("0");

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([{ label: "供应商编号", value: "supplierNumber" }]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  onMounted(() => {
    getColumnConfig(buttonList);
    fetchLeftData();
    onSearch();
  });

  const handleNodeClick = (treeItem) => {
    curNodeName.value = treeItem.id;
    curNodeLabel.value = treeItem.id;

    if (treeItem.id != "0") {
      formData.supplierGroupId = treeItem.id;
    } else {
      formData.supplierGroupId = "";
    }
    onSearch();
  };

  const fetchLeftData = () => {
    fetchSupplierGroupList({})
      .then((res: any) => {
        if (res.data) {
          const fullData = [
            {
              groupName: "供应商分组",
              id: "0",
              number: "",
              children: res.data
            }
          ];
          categoryTreeData.value = fullData;
          contextMenuRef.value.treeSelectData = fullData;
        }
      })
      .catch(console.log);
  };

  const getColumnConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "供应商编号", prop: "supplierNumber" },
      { label: "供应商名称", prop: "supplierName" },
      { label: "供应商简称", prop: "shortName" },
      { label: "通讯地址", prop: "address" },
      { label: "邮编", prop: "zipCode" },
      { label: "公司网址", prop: "website" },
      { label: "联系电话", prop: "tel" },
      { label: "工商登记号", prop: "registerCode" },
      { label: "生产经营许可证", prop: "tendPermit" },
      { label: "供应商分类", prop: "supplierClassify" },
      { label: "供应类别", prop: "supplyClassify" },
      { label: "供应商等级", prop: "supplierGrade" },
      { label: "付款币种", prop: "payCurrencyId" },
      { label: "付款条件", prop: "payCondition" },
      { label: "付款方式", prop: "paymentType" },
      { label: "预付额度", prop: "payAdvanceAmount" },
      { label: "预付比例%", prop: "payAdvanceRate" },
      { label: "税分类", prop: "taxType" },
      { label: "税率", prop: "taxRateId" },
      { label: "税务登记号", prop: "taxRegisterCode" },
      { label: "增值税登记号", prop: "addedTaxRegisterCode" },
      { label: "经营类型", prop: "tendType" },
      { label: "发票类型", prop: "invoiceType" },
      { label: "最小订单量", prop: "minPOValue" },
      { label: "交货周期（天）", prop: "leadTime" },
      { label: "银行类型", prop: "bankType" },
      { label: "开户行名称", prop: "openBankName" },
      { label: "开户行编号", prop: "openBankNumber" },
      { label: "银行账户", prop: "bankCode" },
      { label: "户主", prop: "bankHolder" },
      { label: "币种", prop: "currencyId" },
      { label: "银行类型", prop: "bankType" },
      { label: "银行类型", prop: "bankType" },
      { label: "银行类型", prop: "bankType" },
      { label: "银行类型", prop: "bankType" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) {
      columnData = menuCols;
    }
    // updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData: JSON.parse(JSON.stringify(columnData)), operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    fetchSupplierList(formData).then((res: any) => {
      if (res.data) {
        const data = res.data;
        dataList.value = data.records;
        pagination.total = data.total;
      }
    });
  };

  const onFresh = () => {
    getColumnConfig(buttonList);
    onSearch();
  };

  const handleTagSearch = (values) => {
    formData.supplierName = values.supplierName;
    formData.supplierNumber = values.supplierNumber;
    onSearch();
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = () => {
    currentId.value = currentRow.value?.id;
    openDialog("edit", currentRow.value);
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      id: row?.id ?? "",
      supplierNumber: row?.supplierNumber ?? "",
      supplierName: row?.supplierName ?? "",
      shortName: row?.shortName ?? "",
      website: row?.website ?? "",
      address: row?.address ?? "",
      zipCode: row?.zipCode ?? "",
      tel: row?.tel ?? "",
      registerCode: row?.registerCode ?? "",
      tendPermit: row?.tendPermit ?? "",
      sellerId: row?.sellerId ?? "",
      supplierClassify: row?.supplierClassify ?? "",
      supplyClassify: row?.supplyClassify ?? "",
      supplierGrade: row?.supplierGrade ?? "",
      customerId: row?.customerId ?? "",
      payCurrencyId: row?.payCurrencyId ?? "",
      payCondition: row?.payCondition ?? "",
      paymentType: row?.paymentType ?? "",
      payAdvanceAmount: row?.payAdvanceAmount ?? "",
      payAdvanceRate: row?.payAdvanceRate ?? "",
      taxType: row?.taxType ?? "",
      taxRateId: row?.taxRateId ?? "",
      taxRegisterCode: row?.taxRegisterCode ?? "",
      addedTaxRegisterCode: row?.addedTaxRegisterCode ?? "",
      tendType: row?.tendType ?? "",
      invoiceType: row?.invoiceType ?? "",
      minPOValue: row?.minPOValue ?? "",
      leadTime: row?.leadTime ?? "",
      bankType: row?.bankType ?? "",
      openBankName: row?.openBankName ?? "",
      openBankNumber: row?.openBankNumber ?? "",
      bankCode: row?.bankCode ?? "",
      bankHolder: row?.bankHolder ?? "",
      currencyId: row?.currencyId ?? "",
      supplierGroupId: formData.supplierGroupId,
      linkmanList: row?.linkmanList ?? []
    });

    const customProps = reactive<{ [key: string]: CustomPropsType }>({
      payCurrencyId: {
        apiParams: { page: 1, limit: 100000 },
        formatAPI(data) {
          return data.records;
        }
      },
      currencyId: {
        apiParams: { page: 1, limit: 100000 },
        formatAPI(data) {
          return data.records;
        }
      }
    });

    const customElement = {
      linkmanList: () => {
        return (
          <div style={{ width: "100%" }}>
            <SupUserItem formInline={_formData} />
          </div>
        );
      }
    };

    addDialog({
      title: `${title}`,
      props: {
        params: { groupCode: "1" },
        formConfig: [{ formData: _formData, customProps, customElement, formProps: { labelWidth: "90px", size: "small" } }]
      },
      width: "1200px",
      class: "supplier-modal-mkt",
      draggable: true,
      destroyOnClose: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ valid, data }) => {
          const { formData } = data.forms[0];
          if (valid) {
            formData.linkmanList.forEach((el) => {
              if (typeof el.id === "string" && el.id.includes("-")) {
                el.id = undefined;
              }
            });
            showMessageBox(`确认${title}吗?`).then(() => {
              const API = { add: insertSupplierList, edit: updateSupplierList };
              API[type](formData)
                .then((res) => {
                  if (res.data) {
                    done();
                    onSearch();
                    message.success(`${title}成功`);
                  } else {
                    message.error(`${title}失败`);
                  }
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  };

  // 导出
  const onExport = async () => {
    exportSupplierList(formData)
      .then((res: any) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName);
        }
      })
      .catch(console.log);
  };

  const onDelete = () => {
    const row = currentRow.value || {};
    showMessageBox(`确认要删除名称为【${row.supplierNumber}】的供应商吗?`).then(() => {
      deleteSupplierList({ id: row.id })
        .then((res) => {
          if (res.status === 200 || res.data) {
            message.success("删除成功");
            currentRow.value = null;
            onSearch();
          }
        })
        .catch(console.log);
    });
  };

  const beforeOnEdit = () => {
    if (!currentRow.value) {
      return;
    } else {
      onEdit();
    }
  };

  const beforeOnDelete = () => {
    if (!currentRow.value) {
      message.warning("请选择一条记录");
      return;
    } else {
      onDelete();
    }
  };

  const rowClick = (row) => {
    currentRow.value = row;
    emits("select", row);
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit();
  };

  const onDisabled = () => {
    if (!currentRow.value) return message.warning("请选择一条记录");
    console.log(currentRow.value, "row..");
  };
  const onEnabled = () => {
    if (!currentRow.value) return message.warning("请选择一条记录");
    console.log(currentRow.value, "row..");
  };

  const clickHandler = ({ text }) => {
    switch (text) {
      case "导出":
        onExport();
        break;
      case "新增":
        onAdd();
        break;
      case "修改":
        beforeOnEdit();
        break;
      case "删除":
        beforeOnDelete();
        break;
      case "禁用":
        onDisabled();
        break;
      case "反禁用":
        onEnabled();
        break;
      default:
        break;
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler, type: "primary", text: "新增" },
    { clickHandler, type: "warning", text: "修改" },
    { clickHandler, type: "danger", text: "删除" },
    // { clickHandler, type: "primary", text: "禁用", isDropDown: true },
    // { clickHandler, type: "primary", text: "反禁用", isDropDown: true },
    { clickHandler, type: "primary", text: "导出", isDropDown: true }
  ]);

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
    currentRow.value = row;
  };

  return {
    columns,
    dataList,
    rowDbClick,
    rowClick,
    maxHeight,
    buttonList,
    handleSizeChange,
    handleCurrentChange,
    onCurrentChange,
    searchOptions,
    onFresh,
    pagination,
    handleTagSearch,
    categoryTreeData,
    curNodeName,
    handleNodeClick,
    contextMenuRef,
    fetchLeftData
  };
};
