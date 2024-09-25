import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";

import dayjs from "dayjs";
import EditForm from "@/components/EditForm/index.vue";
import { ElMessage, ElMessageBox } from "element-plus";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import { formConfigs, formRules } from "./config";
import { PAGE_CONFIG } from "@/config/constant";
import {
  deleteControllFileList,
  fetchControllFileList,
  insertControllFileList,
  enableOrDisableFile,
  updateControllFileList
} from "@/api/oaManage/humanResources";
import { getDeptOptions } from "@/utils/requestApi";

export const useTestReportConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const currentRow: any = ref({});
  const currentViewRow: any = ref({});
  const dialogVisible = ref(false);
  const modalRef = ref();
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

  let formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "文件编号", value: "fileCode" },
    { label: "发出日期", value: "usedDate", type: "daterange", format: "YYYY-MM-DD" },
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
    { label: "创建时间", value: "date", type: "daterange", format: "YYYY-MM-DD" }
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
    return columnData;
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onSearch = (_rowIndex?) => {
    loading.value = true;

    const newFormData = cloneDeep(formData);
    if (formData.date) {
      const [startDate, endDate] = formData.date.split("~");
      newFormData.createStartDateTime = startDate.trim();
      newFormData.createEndDateTime = endDate.trim();
    }

    if (formData.usedDate) {
      const [startDate, endDate] = formData.usedDate.split("~");
      newFormData.useStartDate = startDate.trim();
      newFormData.useEndDate = endDate.trim();
    }

    delete newFormData.date;
    delete newFormData.usedDate;
    fetchControllFileList(newFormData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;

        if (typeof _rowIndex === "number" && _rowIndex >= 0) {
          currentRow.value = dataList.value[_rowIndex];
        } else {
          currentRow.value = {};
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

  const handleTagSearch = (values = {}) => {
    const { page, limit } = formData;
    Object.keys(values)?.forEach((key) => {
      formData[key] = values[key];
    });
    formData = { ...values };

    formData.page = page;
    formData.limit = limit;
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
    const row = currentRow.value;
    curType.value = "edit";
    console.log(row, "edit row");
    openDialog("edit", row);
  };

  const fetchRowData = (_formData, formLoading) => {
    fetchControllFileList({
      page: formData.page,
      id: currentRow.value.id,
      limit: formData.limit
    })
      .then((res: any) => {
        if (res.data && Array.isArray(res.data.records) && res.data.records.length === 1) {
          const rowData = res.data.records[0] || {};
          const keys = Object.keys(_formData);
          keys.forEach((item) => (_formData[item] = rowData[item]));
          _formData["deptId"] = rowData.deptId ? +rowData.deptId + "" : undefined;
        }
      })
      .finally(() => (formLoading.value = false));
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改", view: "查看" };
    const title = titleObj[type];
    const formRef = ref();
    const formLoading = ref(true);

    const _formData = reactive({
      fileCode: row?.fileCode ?? "",
      file: null,
      fileName: row?.fileName ?? "",
      pageNumber: row?.pageNumber ?? undefined,
      lastVersion: row?.lastVersion ?? "",
      usedDate: row?.usedDate ?? "",
      deptId: row ? row?.deptId + "" : undefined,
      shelfLife: row?.shelfLife ?? "",
      id: row?.id
    });

    if (type === "edit") {
      fileList.value = row.controllerDocumentFilesVOS;
    }

    const configList = formConfigs({ treeData: deptTreeData.value, type, formData: _formData, fileList: fileList.value, rowFileName: row?.fileName });

    const filterConfigs = configList.filter((item) => {
      if (type === "add") {
        formLoading.value = false;
        return !["billStateName", "applyUserName", "billNo"].includes(item.prop);
      }
      if (type === "edit" || type === "view") {
        return item;
      }
    });

    if (type === "edit") {
      fetchRowData(_formData, formLoading);
      delete formRules.file;
    }

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: filterConfigs
      },
      width: "800px",
      draggable: true,
      fullscreenIcon: true,
      hideFooter: curType.value === "view",
      closeOnClickModal: false,
      okButtonText: "保存",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();

        FormRef.validate(async (valid) => {
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
                const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
                onSearch(_rowIndex);
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const apiType = { add: insertControllFileList, edit: updateControllFileList };

    const formDataParams = new FormData();
    const keys = Object.keys(data).filter((item) => item && item !== "file" && data[item]);
    keys.forEach((key) => {
      formDataParams.append(key, data[key]);
    });

    if (fileList.value.at(0).name) {
      formDataParams.append("file", fileList.value.at(0));
    }
    apiType[type](formDataParams).then((res) => {
      if (res.data) {
        ElMessage({ message: "保存成功", type: "success" });
        callback();
      }
    });
  };

  const onEnable = () => {
    if (currentRow.value.disableState) {
      ElMessageBox.confirm(`确认要启用名称为【${currentRow.value.fileName}】的文件吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          enableOrDisableFile(currentRow.value.id).then((res) => {
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
    if (!currentRow.value.disableState) {
      ElMessageBox.confirm(`确认要禁用名称为【${currentRow.value.fileName}】的文件吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          enableOrDisableFile(currentRow.value.id).then((res) => {
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
      if (JSON.stringify(currentRow.value) === "{}") {
        ElMessage({ message: "请选择记录", type: "warning" });
        return;
      }
      onEdit();
    }

    if (text === "导出") {
      onExport();
    }

    if (text === "删除") {
      if (JSON.stringify(currentRow.value) === "{}") {
        ElMessage({ message: "请选择记录", type: "warning" });
        return;
      }

      ElMessageBox.confirm(`确认要删除名称为【${currentRow.value.fileName}】的记录吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          deleteControllFileList({ id: currentRow.value.id }).then((res) => {
            if (res.data) {
              message(`删除成功`, { type: "success" });
              onSearch();
            }
          });
        })
        .catch(() => {});
    }

    if (text === "查看") {
      if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
        ElMessage({ message: "请选择一条记录", type: "warning" });
        return;
      } else {
        onEdit();
      }
    }

    if (text === "启用") {
      if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
        ElMessage({ message: "请选择一条记录", type: "warning" });
        return;
      } else {
        onEnable();
      }
    }

    if (text === "禁用") {
      if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
        ElMessage({ message: "请选择一条记录", type: "warning" });
        return;
      } else {
        onDisable();
      }
    }

    if (text === "提交") {
      if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
        ElMessage({ message: "请选择一条记录", type: "warning" });
        return;
      } else {
        onSubmitAction();
      }
    }
  };

  const rowClick = (row) => {
    currentRow.value = row;
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
    const row = currentRow.value;
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
        //     message(`提交成功`, { type: "success" });
        //     const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
        //     onSearch(_rowIndex);
        //   }
        // });
      })
      .catch(() => {});
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler, type: "primary", text: "新增", isDropDown: false },
    { clickHandler, type: "warning", text: "修改", isDropDown: false },
    { clickHandler, type: "danger", text: "删除", isDropDown: false },
    { clickHandler, type: "primary", text: "禁用", isDropDown: true },
    { clickHandler, type: "primary", text: "启用", isDropDown: true },
    { clickHandler, type: "primary", text: "导出", isDropDown: true }
  ]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    pagination,
    searchOptions,
    disableInfoConst,
    buttonList,
    dialogVisible,
    modalRef,
    onRefresh,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    onEdit,
    rowClick,
    fresh,
    handleCurrentChange
  };
};
