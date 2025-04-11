/*
 * @Author: Hailen
 * @Date: 2024-06-17 17:26:03
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-03-14 15:28:08
 */

import { useEleHeight } from "@/hooks";
import { h, onMounted, reactive, ref } from "vue";
import { PAGE_CONFIG } from "@/config/constant";
import { OptionItemType } from "@/api/plmManage";
import { addDialog } from "@/components/ReDialog";
import { formConfigs, formRules } from "./config";
import EditForm from "@/components/EditForm/index.vue";
import { type PaginationProps } from "@pureadmin/table";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { setColumn, getMenuColumns, getExportConfig, updateButtonList, getEnumDictList, RendererType } from "@/utils/table";
import {
  tabletManageList,
  addTabletManage,
  updateTabletManage,
  deleteTabletManage,
  exportTabletManage,
  TabletManageItemType
} from "@/api/oaManage/productMkCenter";
import { Question } from "@/config/elements";
import type { ColDef } from "ag-grid-community";
import { getAgGridColumns } from "@/components/AgGridTable/config";

export const useConfig = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<TabletManageItemType[]>([]);
  const rowData = ref<TabletManageItemType>();
  const productLineOption = ref<OptionItemType[]>([]);
  const positionOption = ref<OptionItemType[]>([]);
  const loading = ref<boolean>(false);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const formData = reactive({
    productionLine: "",
    tabletsName: "",
    tabletsID: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "平板名称", value: "tabletsName" },
    { label: "平板编号", value: "tabletsCode" },
    { label: "生产线", value: "productionLine", children: [] },
    { label: "平板ID", value: "tabletsID" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
    getOptions();
  });

  const getOptions = () => {
    getEnumDictList(["ProductionLine", "TabletsPosition"])
      .then(({ ProductionLine, TabletsPosition }) => {
        productLineOption.value = ProductionLine;
        positionOption.value = TabletsPosition;
        searchOptions[2].children = ProductionLine;
      })
      .catch(console.log);
  };

  const getName = (arr: OptionItemType[], value: string) => {
    return arr.find((item) => item.optionValue === value + "")?.optionName;
  };

  const getColumnConfig = async () => {
    const cellRenderer1: RendererType = ({ row }) => <span>{getName(productLineOption.value, row.productionLine)}</span>;
    const cellRenderer2: RendererType = ({ row }) => <span>{getName(positionOption.value, row.tabletsPosition)}</span>;
    let columnData: TableColumnList[] = [
      { label: "平板编号", prop: "tabletsCode", sortable: true },
      { label: "平板名称", prop: "tabletsName", sortable: true },
      { label: "生产线", prop: "productionLine", sortable: true, cellRenderer: cellRenderer1 },
      { label: "平板方位", prop: "tabletsPosition", align: "center", cellRenderer: cellRenderer2 },
      { label: "平板位号", prop: "tabletsSlot", align: "center" },
      { label: "平板ID", prop: "tabletsID", align: "center", width: 300 },
      { label: "创建人", prop: "createUserName", align: "center" },
      { label: "创建时间", prop: "createDate", width: 160 },
      { label: "最后修改人", prop: "modifyUserName", align: "center" },
      { label: "最后修改时间", prop: "modifyDate", width: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns([{ productionLine: cellRenderer1 }]);
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    columnData.forEach((item) => {
      if (item.prop === "tabletsID") {
        item.headerRenderer = ({ column }) => {
          return <Question label={column.label} tipMsg="设备ID: 连接指导书服务自动注册" />;
        };
      }
    });
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    columnDefs.value = getAgGridColumns({ columnData, formData, operationColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  // 搜索
  const onTagSearch = (values) => {
    const dates = values.date ? values.date.split(" ~ ") : [];
    formData.startDate = dates[0];
    formData.endDate = dates[1];
    formData.tabletsID = values.tabletsID;
    formData.tabletsName = values.tabletsName;
    formData.productionLine = values.productionLine;
    getTableList();
  };

  const getTableList = () => {
    loading.value = true;
    tabletManageList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch(() => (loading.value = false));
  };

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  const openDialog = (type: "add" | "edit", row?: Partial<TabletManageItemType>) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const loading = ref<boolean>(false);
    const _formData = reactive({
      id: row?.id,
      tabletsCode: row?.tabletsCode,
      tabletsName: row?.tabletsName,
      productionLine: row?.productionLine ? `${row?.productionLine}` : "",
      tabletsPosition: row?.tabletsPosition ? `${row?.tabletsPosition}` : "",
      tabletsSlot: row?.tabletsSlot,
      tabletsID: row?.tabletsID,
      modifyDate: row?.modifyDate
    });

    addDialog({
      title: `${title}平板`,
      props: {
        formInline: _formData,
        formRules: formRules,
        loading: loading,
        formConfigs: formConfigs({ productLineOption, positionOption }),
        formProps: { labelWidth: "100px" }
      },
      width: "680px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: () => formRef.value.getRef()?.resetFields(),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox("确认提交吗").then(() => {
              const reqApi = { add: addTabletManage, edit: updateTabletManage };
              const { modifyDate, ...param } = _formData;
              reqApi[type](param).then((res) => {
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
        }).catch(console.log);
      }
    });
  };

  /** 删除 */
  const onDelete = wrapFn(rowData, () => {
    showMessageBox(`确认删除平板ID【${rowData.value.tabletsID}】吗?`).then(() => {
      deleteTabletManage({ id: rowData.value?.id })
        .then((res) => {
          if (!res.data) return message.error("删除失败");
          message.success("删除成功");
          getTableList();
        })
        .catch(console.log);
    });
  });

  const onExport = () => {
    exportTabletManage(formData)
      .then((res) => {
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };
  function onRowClick(row: TabletManageItemType) {
    rowData.value = row;
  }
  function onDbClick(row: TabletManageItemType) {
    openDialog("edit", row);
  }

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    rowData.value = undefined;
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onEdit, type: "success", text: "修改", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: true },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }
  ]);

  return {
    columnDefs,
    isAgTable,
    loading,
    columns,
    dataList,
    maxHeight,
    searchOptions,
    buttonList,
    pagination,
    onRefresh,
    onTagSearch,
    onDbClick,
    onRowClick,
    handleSizeChange,
    handleCurrentChange,
    onSwitchTable
  };
};
