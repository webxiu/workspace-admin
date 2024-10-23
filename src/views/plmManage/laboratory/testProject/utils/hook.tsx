import { computed, h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import ContextMenu from "./components/contextMenu.vue";
import { ContextMenuItem } from "../components/contextMenu.vue";
import { formatDate } from "@/utils/common";

import dayjs from "dayjs";
import EditForm from "@/components/EditForm/index.vue";
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { formConfigs, formRules } from "./config";
import {
  addTestProjectList,
  fetchClassifyList,
  fetchTestProjectList,
  deleteTestProjectList,
  exportTestProjectList,
  ProjectClassifyItemType,
  TestProjectItemType
} from "@/api/plmManage/laboratory";
import { PAGE_CONFIG } from "@/config/constant";

export const useTestProjectConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<TestProjectItemType[]>([]);
  const rowData = ref<TestProjectItemType>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 46);
  const leftTwoLevelData: any = ref([]);
  const classifyOptionList = ref<ProjectClassifyItemType[]>([]);
  const nodeItem = ref<{ label: string; id: string }>();
  const contextMenuRef = ref<InstanceType<typeof ContextMenu>>();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({
    createUserName: "淡淡的",
    projectName: "斯蒂芬",
    page: 1,
    typeId: "",
    limit: PAGE_CONFIG.pageSize
  });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "创建人", value: "createUserName" },
    { label: "项目名称", value: "projectName" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getOptions();
    getTableList();
  });

  const getOptions = () => {
    fetchClassifyList().then(({ data }) => {
      if (data) {
        classifyOptionList.value = data;
        const list = data?.map((item) => ({ label: item.typeName, id: item.id, children: [] }));
        leftTwoLevelData.value = [{ label: "项目分类", id: "0", children: list }];
      }
    });
  };

  const getColumnConfig = async () => {
    const columnData: TableColumnList[] = [
      { label: "测试项目名称", prop: "projectName", minWidth: 140 },
      { label: "创建人", prop: "createUserName", minWidth: 80 },
      { label: "创建时间", prop: "createDate", minWidth: 150, cellRenderer: ({ row }) => formatDate(row.createDate) },
      { label: "修改人", prop: "modifyUserName", minWidth: 80 },
      { label: "修改时间", prop: "modifyDate", minWidth: 150, cellRenderer: ({ row }) => formatDate(row.modifyDate) }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) {
      columns.value = setColumn({ columnData: menuCols, operationColumn: false });
    } else {
      columns.value = setColumn({ columnData, operationColumn: false, indexColumn: false });
    }
    updateButtonList(buttonList, buttonArrs[0]);
    return columnData;
  };

  const getTableList = () => {
    loading.value = true;
    fetchTestProjectList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch(() => (loading.value = false));
  };

  const onFresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values = {}) => {
    formData.createUserName = values.createUserName;
    formData.projectName = values.projectName;
    getTableList();
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

  // 导出单据
  const onExport = async () => {
    loading.value = true;
    const excelHeader = await getColumnConfig();
    const calcHeader = excelHeader
      .map((item, index) => {
        return { field: item.prop, title: item.label, width: 160, key: `0-${index}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
      })
      .filter((el) => el.field && el.field !== "index");

    const headConfig = {
      excelName: "测试项目表",
      excelHeader: JSON.stringify(calcHeader)
    };
    // console.log(headConfig, "req");

    exportTestProjectList(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const onAdd = () => {
    if (!nodeItem.value || nodeItem.value.id == "0") {
      return message("请先选择项目分类", { type: "warning" });
    }
    openDialog("add");
  };

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  const fetchRowData = (_formData, formLoading) => {
    formLoading.value = true;
    fetchTestProjectList({
      page: formData.page,
      id: rowData.value.id,
      limit: formData.limit
    })
      .then((res: any) => {
        if (res.data && Array.isArray(res.data.records) && res.data.records.length === 1) {
          const dataRow = res.data.records[0] || {};
          _formData.id = dataRow.id;
          _formData.createUserName = dataRow.createUserName;
          _formData.createDate = dayjs(dataRow.createDate).format("YYYY-MM-DD HH:mm:ss");
          _formData.projectCategory = classifyOptionList.value.find((item) => item.id === dataRow.typeId)?.typeName ?? nodeItem.value.label;
          _formData.projectCategoryId = dataRow?.typeId ?? nodeItem.value.id;
          _formData.projectName = dataRow.projectName;
        }
      })
      .finally(() => (formLoading.value = false));
  };

  const openDialog = async (type: string, row?) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const formLoading = ref(false);
    const _formData = reactive({
      id: "",
      createUserName: "",
      createDate: "",
      projectCategory: nodeItem.value?.label,
      projectCategoryId: nodeItem.value?.id,
      projectName: ""
    });
    if (type !== "add") {
      fetchRowData(_formData, formLoading);
    }

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ type })
      },
      width: "600px",
      draggable: true,
      fullscreenIcon: true,
      hideFooter: type === "view",
      closeOnClickModal: false,
      okButtonText: "保存",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();

        FormRef.validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要${title}吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                getTableList();
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const reqParams = {
      projectName: data.projectName,
      typeId: data.projectCategoryId,
      id: type === "edit" ? data.id : undefined
    };
    addTestProjectList(reqParams).then((res) => {
      if (res.data) {
        ElMessage({ message: "保存成功", type: "success" });
        callback();
      }
    });
  };

  const onDelete = wrapFn(rowData, () => {
    showMessageBox(`确认要删除名称为【${rowData.value.projectName}】的测试项目吗?`)
      .then(() => {
        deleteTestProjectList({ id: rowData.value.id }).then((res) => {
          if (res.data) {
            message(`删除成功`, { type: "success" });
            getTableList();
          }
        });
      })
      .catch(console.log);
  });

  const onRowClick = (row) => {
    rowData.value = row;
  };

  const onNodeClick = (item, a) => {
    nodeItem.value = item;
    formData.typeId = item.id === "0" ? "" : item.id;
    getTableList();
  };

  const menuItems = ref<ContextMenuItem[]>([
    { name: "新增", action: (item) => contextMenuRef.value.onAdd(item, getOptions) },
    { name: "修改", action: (item) => contextMenuRef.value.onEdit(item, getOptions, classifyOptionList) },
    { name: "删除", action: (item) => contextMenuRef.value.onDelete(item, getOptions, classifyOptionList) }
  ]);

  const newMenusItems = computed(() => {
    return menuItems.value.filter((item) => {
      const treeTypeId = contextMenuRef.value?.curTreeId;
      if (treeTypeId == "0") return item.name === "新增";
      return item.name !== "新增";
    });
  });

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }
  ]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    pagination,
    searchOptions,
    buttonList,
    leftTwoLevelData,
    nodeItem,
    contextMenuRef,
    newMenusItems,
    onFresh,
    onTagSearch,
    handleSizeChange,
    onRowClick,
    onNodeClick,
    handleCurrentChange
  };
};
