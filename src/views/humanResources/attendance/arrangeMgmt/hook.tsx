import { dayjs } from "element-plus";
import { formConfigs, formRules } from "./config";
import { getMenuColumns, setColumn, updateButtonList, usePageSelect } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import { LoadingType } from "@/components/ButtonList/index.vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { useEleHeight } from "@/hooks";
import { getDeptOptions } from "@/utils/requestApi";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";

export const useMachine = () => {
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const currentRow = ref();
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const formData: any = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });
  const tableRef = ref();
  const rowsData = ref([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "工号", value: "userCode" },
    { label: "部门", value: "deptId", children: [] },
    { label: "排班日期", value: "arrangeDate", type: "date", format: "YYYY-MM-DD" }
  ]);

  const nowDate = dayjs().format("YYYY-MM-DD");

  const queryParams = reactive({ arrangeDate: nowDate });

  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

  onMounted(() => {
    getColumnConfig();
    getOptions();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "工号", prop: "userCode" },
      { label: "姓名", prop: "userName" },
      { label: "部门", prop: "deptName" },
      { label: "排班日期", prop: "arrangeDate" },
      { label: "上午上班", prop: "morningStartTime" },
      { label: "上午下班", prop: "morningEndTime" },
      { label: "下午上班", prop: "afternoonStartTime" },
      { label: "下午下班", prop: "afternoonEndTime" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false, selectionColumn: { hide: false }, radioColumn: { hide: true } });
    return columnData;
  };

  const getOptions = () => {
    getDeptOptions().then((data) => {
      searchOptions[1].children = data[0].children;
    });
  };

  const getTableList = () => {
    console.log(formData, "formData===");
    // fetchAttendanceRecord(formData).then((res: any) => {
    //   if (res.data) {
    //     dataList.value = res.data.records || [];
    //     pagination.total = res.data.total;
    //     setSelectCheckbox();
    //   }
    // });
  };

  const onFresh = () => {
    getColumnConfig();
    getTableList();
  };

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const onExport = () => {
    message.warning("接口未开发");
  };

  const openDialog = async (type: "add" | "view" | "edit", rows?) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const formLoading = ref(false);
    const _formData = reactive({});

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs()
        // formProps: { "label-position": "top" }
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done) => {
        const formIns = formRef.value.getRef();
        formIns?.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`)
              .then(() => {
                // onSubmitChange(type, title, _formData, () => {
                //   done();
                //   getTableList();
                // });
                console.log(_formData, "fd===");
                message.warning("接口未开发");
                done();
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    // console.log(type, data);
    // const apiType = { edit: updateMachine };
    // apiType[type](data).then((res) => {
    //   if (res.data) {
    //     message.success(`${title}成功`);
    //     callback();
    //   }
    // });
  };

  const onEdit = () => {
    // if (!rowsData.value.length) {
    //   message.warning("请选择一条记录");
    //   return;
    // }
    openDialog("edit", rowsData.value);
  };

  const rowDbclick = (row) => {
    onEdit();
  };
  const rowClick = (row) => {
    currentRow.value = row;
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: false }
  ]);

  function onSelect(rows, row) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows) {
    setSelectAllChange(rows);
  }

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  return {
    loading,
    onSizeChange,
    onCurrentChange,
    pagination,
    dataList,
    columns,
    queryParams,
    maxHeight,
    buttonList,
    searchOptions,
    loadingStatus,
    onFresh,
    onSelect,
    onSelectAll,
    tableRef,
    rowClick,
    rowDbclick,
    handleTagSearch
  };
};
