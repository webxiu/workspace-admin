import { fetchMaterialList, getMaterialGroupTreeData, pushDownMaterialV2List, selectMaterialV2List, updateMaterialV2List } from "@/api/plmManage";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { getMenuColumns, RendererType, setColumn, updateButtonList } from "@/utils/table";
import { h, nextTick, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { useEleHeight } from "@/hooks";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import EditForm from "@/components/EditForm/index.vue";
import { ElMessageBox } from "element-plus";
import { formConfigs, formRules } from "./config";
import type { ColDef } from "ag-grid-community";
import { getAgGridColumns } from "@/components/AgGridTable/config";

export const useTable = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const tableRef = ref();
  const dataList = ref([]);
  const categoryTreeData = ref([]);
  const columns = ref([]);
  const loading = ref(false);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const curNodeName = ref("0");
  const curNodeLabel = ref("0");
  const currentRow: any = ref({});
  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    date: "",
    startDate: "",
    endDate: "",
    materialGroups: "",
    isfrozen: "0"
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "物料名称", value: "name" },
    { label: "规格型号", value: "specification" },
    { label: "模号", value: "model" },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" },
    {
      label: "物料状态",
      value: "state",
      children: [
        { label: "待提交", value: "0" },
        { label: "审核中", value: "1" },
        { label: "已审核", value: "2" },
        { label: "重新审核", value: "3" }
      ]
    },
    {
      label: "是否禁用",
      value: "isfrozen",
      children: [
        { label: "否", value: "0" },
        { label: "是", value: "1" }
      ]
    }
  ]);

  onMounted(() => {
    getConfig();
    getLeftTreeData();
  });

  const getConfig = async () => {
    const pushState: RendererType = ({ row }) => (row.pushState == 1 ? "已下推" : "待下推");
    const cbcertification: RendererType = ({ row }) => (row.cbcertification == 1 ? "是" : "否");
    const isfrozen: RendererType = ({ row }) => (row.isfrozen == 1 ? "是" : "否");
    const miniQuantity: RendererType = ({ row }) => row.materialOtherVO?.fMinIssueQty ?? "";

    let columnData: TableColumnList[] = [
      { label: "物料编号", prop: "number" },
      { label: "物料名称", prop: "name" },
      { label: "规格型号", prop: "specification" },
      { label: "最小发料批量", prop: "miniQuantity", slot: "miniQuantity" },
      { label: "模号", prop: "model" },
      { label: "基本单位", prop: "baseUnitName" },
      { label: "物料属性", prop: "erpClsidName" },
      { label: "物料种类", prop: "materialTypeName" },
      { label: "物料分组", prop: "materialGroupName" },
      { label: "客供物料", prop: "customerProvidedName" },
      { label: "成品类型", prop: "goodsTypeName" }, //
      { label: "仓库", prop: "warehouseName" },
      { label: "采购单位", prop: "purchaseUnitName" },
      { label: "库存单位", prop: "stockUnitName" },
      { label: "销售单位", prop: "saleUnitName" },
      { label: "生产车间", prop: "manufacturingShopName" }, //
      { label: "物料状态", prop: "stateName" },
      { label: "下推状态", prop: "pushState" },
      { label: "是否认证", prop: "cbcertification" },
      { label: "是否禁用", prop: "isfrozen" },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate" },
      { label: "提交人", prop: "submitUserName" },
      { label: "提交时间", prop: "submitDate" },
      { label: "最后修改人", prop: "modifyUserName" },
      { label: "最后修改时间", prop: "modifyDate" },
      { label: "旧物料编码", prop: "oldCode" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) {
      columnData = menuCols;
    }
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, formData, operationColumn: false });
    columnDefs.value = getAgGridColumns({
      columnData,
      formData,
      operationColumn: false,
      columnsRender: { pushState, cbcertification, isfrozen, miniQuantity }
    });
  };

  const onSearch = (rowIndex?) => {
    currentRow.value = {};
    loading.value = true;
    selectMaterialV2List(formData)
      .then((res: any) => {
        const { total, records } = res.data;
        pagination.total = total;
        dataList.value = records;
        if (typeof rowIndex === "number" && rowIndex >= 0) {
          currentRow.value = dataList.value[rowIndex];
          nextTick(() => {
            setRowSelected(dataList.value[rowIndex], true);
            currentRow.value = dataList.value[rowIndex];
          });
        } else {
          currentRow.value = {};
        }
      })
      .finally(() => (loading.value = false));
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    formData.page = 1;
    onSearch();
  };

  // 添加、编辑弹窗
  function openEditDialog(row) {
    const formRef = ref();

    const _formData = {
      materialGroupName: row?.materialGroupName,
      number: row?.number,
      name: row?.name,
      oldCode: row?.oldCode,
      specification: row?.specification,
      model: row?.model,
      productTypeName: row?.productTypeName,
      customerProvidedName: row?.customerProvidedName,
      baseUnitName: row?.baseUnitName,
      purchaseUnitName: row?.purchaseUnitName,
      stockUnitName: row?.stockUnitName,
      goodColor: row?.goodColor,
      goodModel: row?.goodModel,
      goodName: row?.goodName,
      warehouseName: row?.warehouseName,
      id: row?.id,

      materialTypeName: row?.materialTypeName,
      goodsTypeName: row?.goodsTypeName,
      nation: row?.nation,
      cbcertification: row?.cbcertification,
      remark: row?.remark,
      erpClsidName: row?.erpClsidName,
      manufacturingShopName: row?.manufacturingShopName,
      createUserName: row?.createUserName,
      createDate: row?.createDate,
      modifyUserName: row?.modifyUserName,
      modifyDate: row?.modifyDate,
      miniQuantity: row?.materialOtherVO?.fMinIssueQty
    };

    addDialog({
      title: `修改物料`,
      width: "1300px",
      draggable: true,
      class: "modal-class",
      fullscreenIcon: true,
      closeOnClickModal: false,
      props: {
        formInline: _formData,
        formRules,
        formConfigs: formConfigs({ selectOpts: {} })
        // formProps: { disabled: true }
      },
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要修改编号为【${row.number}】的物料吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            })
              .then(() => {
                onSubmitGroup(_formData, () => {
                  done();
                  onSearch();
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  }

  // 添加、编辑提交
  const onSubmitGroup = (data, callback: Function) => {
    const updateParams = {
      ...currentRow.value,
      materialOtherVO: undefined,
      materialOtherDTO: {
        id: currentRow.value?.materialOtherVO?.id,
        materialId: data.id,
        fMinIssueQty: data.miniQuantity
      }
    };

    console.log(updateParams, "updateParams==");

    updateMaterialV2List({ ...updateParams })
      .then((res) => {
        if (!res.data) throw res.message;
        callback();
        message.success(`修改成功`);
      })
      .catch(console.log);
  };

  const onEdit = () => {
    if (JSON.stringify(currentRow.value) !== "{}") {
      openEditDialog(currentRow.value);
    } else {
      message.warning("请选择一条记录");
    }
  };

  const onExport = () => {
    return message.warning("功能暂未开发");
  };

  const getLeftTreeData = () => {
    getMaterialGroupTreeData({}).then((res: any) => {
      if (res.data) {
        categoryTreeData.value = res.data;
        onSearch();
      }
    });
  };

  const onPushDown = () => {
    if (!currentRow.value.id) return message.warning("请选择一条记录");
    ElMessageBox.confirm(`确认要下推编号为【${currentRow.value.number}】的物料吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        pushDownMaterialV2List({ id: currentRow.value.id }).then((res) => {
          if (res.status === 200 || res.data) {
            message.success("下推成功");
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const onRefresh = () => {
    getConfig();
    onSearch();
  };

  const handleNodeClick = (treeItem) => {
    curNodeName.value = treeItem.id;
    curNodeLabel.value = treeItem.groupCode;
    const finalArr = [];
    const loopFindId = (item) => {
      finalArr.push(item.id);
      if (item.children && Array.isArray(item.children) && item.children.length) {
        item.children.forEach((el) => {
          loopFindId(el);
        });
      }
    };
    loopFindId(treeItem);
    formData.materialGroups = String(finalArr);
    onSearch();
  };

  const dbClick = (row) => {
    onEdit();
  };

  const rowClick = (row) => {
    currentRow.value = row;
    setRowSelected(row);
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

  function setRowSelected(row, isSelect?) {
    if (tableRef.value?.getTableRef) {
      tableRef.value?.getTableRef()?.toggleRowSelection(row, isSelect);
    } else {
      tableRef.value?.setRowSelected(row["id"]);
    }
  }

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    currentRow.value = undefined;
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onPushDown, type: "warsning", text: "下推", isDropDown: false },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true }
  ]);

  return {
    columnDefs,
    isAgTable,
    columns,
    dataList,
    loading,
    pagination,
    maxHeight,
    buttonList,
    curNodeName,
    searchOptions,
    categoryTreeData,
    tableRef,
    onRefresh,
    dbClick,
    rowClick,
    onTagSearch,
    handleNodeClick,
    handleSizeChange,
    handleCurrentChange,
    onSwitchTable
  };
};
