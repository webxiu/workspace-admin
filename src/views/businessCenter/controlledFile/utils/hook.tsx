import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { FormItemConfigType } from "@/utils/form";
import dayjs from "dayjs";
import TableEditList from "@/components/TableEditList/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { PAGE_CONFIG } from "@/config/constant";
import {
  deleteControllFileList,
  fetchControllFileList,
  insertControllFileList,
  enableOrDisableFile,
  updateControllFileList
} from "@/api/oaManage/humanResources";
import { getDeptOptions } from "@/utils/requestApi";
import type { ColDef } from "ag-grid-community";
import { getAgGridColumns } from "@/components/AgGridTable/config";

export const useTestReportConfig = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const currentViewRow: any = ref({});
  const dialogVisible = ref(false);
  const modalRef = ref();
  const baseApi = import.meta.env.VITE_BASE_API;
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 46);
  const backRows: any = ref([]);
  const fileList: any = ref([]);
  const curType = ref("");
  const deptTreeData = ref([]);

  onMounted(() => {
    getColumnConfig();
    getDeptInfoTree();
    onSearch();
  });

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "文件编号", value: "fileCode" },
    { label: "发出日期", value: "usedDate", type: "daterange", format: "YYYY-MM-DD", startKey: "useStartDate", endKey: "useEndDate" },
    { label: "保存期限", value: "shelfLife" },
    { label: "部门", value: "deptId", children: [] },
    {
      label: "状态",
      value: "disableState",
      children: [
        { label: "未禁用", value: false },
        { label: "禁用", value: true }
      ]
    },
    { label: "创建人姓名", value: "createUserName" },
    { label: "创建时间", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "createStartDateTime", endKey: "createEndDateTime" }
  ]);

  const disableInfoConst = { false: "未禁用", true: "禁用" };
  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "文件编号", prop: "fileCode", minWidth: 140 },
      { label: "文件名称", prop: "fileName", minWidth: 140 },
      { label: "页数", prop: "pageNumber", minWidth: 140 },
      { label: "版本", prop: "lastVersion", minWidth: 140 },
      { label: "发出日期", prop: "usedDate", minWidth: 140 },
      { label: "部门", prop: "deptName", minWidth: 140 },
      { label: "保存期限", prop: "shelfLife", minWidth: 140 },
      { label: "状态", prop: "disableState", minWidth: 140, slot: "disableState" },
      { label: "创建人", prop: "createUserName", minWidth: 140 },
      {
        label: "创建时间",
        prop: "createDate",
        minWidth: 140,
        formatter: (data) => (data.createDate ? dayjs(data.createDate).format("YYYY-MM-DD HH:mm:ss") : "")
      },
      { label: "最后修改人", prop: "modifyUserName", minWidth: 140 },
      {
        label: "最后修改时间",
        prop: "modifyDate",
        minWidth: 140,
        formatter: (data) => (data.modifyDate ? dayjs(data.modifyDate).format("YYYY-MM-DD HH:mm:ss") : "")
      }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    columnDefs.value = getAgGridColumns({ columnData, operationColumn: false });
    return columnData;
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onSearch = (_rowIndex?) => {
    loading.value = true;
    fetchControllFileList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;

        if (typeof _rowIndex === "number" && _rowIndex >= 0) {
          rowData.value = dataList.value[_rowIndex];
        } else {
          rowData.value = {};
        }
      })
      .catch((err) => (loading.value = false));
  };

  const getDeptInfoTree = () => {
    getDeptOptions().then((data: any) => {
      deptTreeData.value = data;
      searchOptions[3].children = data;
    });
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
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

  const rowClick = (row) => {
    rowData.value = row;
  };

  // 导出单据
  const onExport = async () => {
    downloadDataToExcel({
      dataList: dataList.value,
      columns: columns.value,
      sheetName: "受控文件表"
    });
  };

  const onAdd = () => {
    backRows.value = [];
    fileList.value = [];
    curType.value = "add";
    openDialog("add");
  };

  const onEdit = () => {
    const row = rowData.value;
    curType.value = "edit";
    openDialog("edit", row);
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改", view: "查看" };
    const title = titleObj[type];
    const formRef = ref();
    const formLoading = ref(false);
    const _file = row?.controllerDocumentFilesVOS?.map((m) => {
      const name = m.filePath?.split("/").at(-1);
      return { name: name, url: baseApi + m.filePath, id: m.id };
    });

    const _formData = reactive({
      fileCode: row?.fileCode ?? "",
      file: _file ?? [],
      fileName: row?.fileName ?? "",
      pageNumber: row?.pageNumber ?? undefined,
      lastVersion: row?.lastVersion ?? "",
      usedDate: row?.usedDate ?? "",
      deptId: row ? row?.deptId + "" : undefined,
      shelfLife: row?.shelfLife ?? "",
      id: row?.id
    });

    const formConfig: FormItemConfigType[] = [
      {
        formData: _formData,
        formProps: { labelWidth: "120px" }
      }
    ];
    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        params: { groupCode: "1" },
        formConfig: formConfig
      },
      width: "800px",
      draggable: true,
      fullscreenIcon: true,
      hideFooter: curType.value === "view",
      closeOnClickModal: false,
      okButtonText: "保存",
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then(({ valid, data }) => {
          const msgTextObj = {
            0: `确认要${title}吗?`,
            1: `当前后缀重复，确认添加吗?`,
            2: `当前前缀重复，确认添加吗?`,
            3: `当前前缀和后缀都重复，确认添加吗?`
          };
          if (valid) {
            const msgText = msgTextObj[0];
            ElMessageBox.confirm(msgText, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                const _rowIndex = dataList.value.findIndex((item) => item.id === rowData.value.id);
                onSearch(_rowIndex);
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const { file, ...reset } = data;
    const apiType = { add: insertControllFileList, edit: updateControllFileList };
    const formDataParams = new FormData();
    Object.keys(reset).forEach((key) => formDataParams.append(key, reset[key]));
    file?.forEach((item) => item.raw && formDataParams.append("file", item.raw));
    apiType[type](formDataParams).then((res) => {
      if (res.data) {
        ElMessage({ message: "保存成功", type: "success" });
        callback();
      }
    });
  };

  const onEnable = () => {
    if (rowData.value.disableState) {
      ElMessageBox.confirm(`确认要启用名称为【${rowData.value.fileName}】的文件吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          enableOrDisableFile(rowData.value.id).then((res) => {
            if (res.data || res.status === 200) {
              ElMessage({ message: "启用成功!", type: "success" });
              onSearch();
            }
          });
        })
        .catch(() => {});
    } else {
      ElMessage({ message: "当前已经处于启用状态", type: "warning" });
    }
  };

  const onDisable = () => {
    if (!rowData.value.disableState) {
      ElMessageBox.confirm(`确认要禁用名称为【${rowData.value.fileName}】的文件吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          enableOrDisableFile(rowData.value.id).then((res) => {
            if (res.data || res.status === 200) {
              ElMessage({ message: "禁用成功!", type: "success" });
              onSearch();
            }
          });
        })
        .catch(() => {});
    } else {
      ElMessage({ message: "当前已经处于禁用状态", type: "warning" });
    }
  };

  const clickHandler = ({ text }) => {
    if (text === "新增") {
      backRows.value = [];
      fileList.value = [];
      curType.value = "add";
      onAdd();
    }

    if (text === "修改") {
      if (JSON.stringify(rowData.value) === "{}") {
        ElMessage({ message: "请选择记录", type: "warning" });
        return;
      }
      onEdit();
    }

    if (text === "导出") {
      onExport();
    }

    if (text === "删除") {
      if (JSON.stringify(rowData.value) === "{}") {
        ElMessage({ message: "请选择记录", type: "warning" });
        return;
      }

      ElMessageBox.confirm(`确认要删除名称为【${rowData.value.fileName}】的记录吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          deleteControllFileList({ id: rowData.value.id }).then((res) => {
            if (res.data) {
              message.success(`删除成功`);
              onSearch();
            }
          });
        })
        .catch(() => {});
    }

    if (text === "查看") {
      if (JSON.stringify(rowData.value) == "{}" || !rowData.value) {
        ElMessage({ message: "请选择一条记录", type: "warning" });
        return;
      } else {
        onEdit();
      }
    }

    if (text === "启用") {
      if (JSON.stringify(rowData.value) == "{}" || !rowData.value) {
        ElMessage({ message: "请选择一条记录", type: "warning" });
        return;
      } else {
        onEnable();
      }
    }

    if (text === "禁用") {
      if (JSON.stringify(rowData.value) == "{}" || !rowData.value) {
        ElMessage({ message: "请选择一条记录", type: "warning" });
        return;
      } else {
        onDisable();
      }
    }

    if (text === "提交") {
      if (JSON.stringify(rowData.value) == "{}" || !rowData.value) {
        ElMessage({ message: "请选择一条记录", type: "warning" });
        return;
      } else {
        onSubmitAction();
      }
    }
  };

  // 查看
  const onView = (row) => {
    if (![0, 3].includes(row.billState)) {
      curType.value = "view";
      openDialog("view", row);
    } else {
      curType.value = "edit";
      openDialog("edit", row);
    }
  };

  const fresh = () => {
    if (JSON.stringify(currentViewRow.value) !== "{}") {
      onView(currentViewRow.value);
      onSearch();
    }
  };

  const onSubmitAction = () => {
    const row = rowData.value;
    ElMessageBox.confirm(`确认要提交名称为【${row.applyName}】的申请吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        // submitTestApply({ id: row.id }).then((res) => {
        //   if (res.data) {
        //     message.success(`提交成功`);
        //     const _rowIndex = dataList.value.findIndex((item) => item.id === rowData.value.id);
        //     onSearch(_rowIndex);
        //   }
        // });
      })
      .catch(() => {});
  };

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    rowData.value = undefined;
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler, type: "primary", text: "新增", isDropDown: false },
    { clickHandler, type: "warning", text: "修改", isDropDown: false },
    { clickHandler, type: "danger", text: "删除", isDropDown: false },
    { clickHandler, type: "primary", text: "禁用", isDropDown: true },
    { clickHandler, type: "primary", text: "启用", isDropDown: true },
    { clickHandler, type: "primary", text: "导出", isDropDown: true }
  ]);

  return {
    columnDefs,
    isAgTable,
    columns,
    dataList,
    loading,
    maxHeight,
    pagination,
    buttonList,
    searchOptions,
    modalRef,
    dialogVisible,
    disableInfoConst,
    onEdit,
    rowClick,
    fresh,
    onRefresh,
    onTagSearch,
    handleSizeChange,
    handleCurrentChange,
    onSwitchTable
  };
};
