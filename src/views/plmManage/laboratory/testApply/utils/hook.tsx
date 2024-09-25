import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { delTestReportList, fetchTestReportInfo, fetchTestReportList, saveTestReportList, submitTestReport } from "@/api/plmManage";

import { getBillStateNameList } from "@/api/plmManage";
import dayjs from "dayjs";
import EditForm from "@/components/EditForm/index.vue";
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { viewSignBackAttrList } from "@/api/supplyChain";
import SelectUserModal from "../../selectUserModal/modal.vue";
import { formConfigs, formRules } from "./config";
import { deleteTestApply, exportTestApply, fetchTestApplyList, submitTestApply, saveTestApply } from "@/api/plmManage/laboratory";
import { detartMentList } from "@/api/systemManage";
import { handleTree } from "@/utils/tree";
import { PAGE_CONFIG } from "@/config/constant";

export const useTestReportConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const currentRow: any = ref({});
  const stateOptionList: any = ref([]);
  const currentViewRow: any = ref({});
  const dialogVisible = ref(false);
  const modalRef = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 46);
  const backRows: any = ref([]);
  const fileList: any = ref([]);
  const curType = ref("");
  const formLoading = ref(false);
  const curMultipeUserList: any = ref([]);
  const treeSelectData: any = ref([]);

  onMounted(() => {
    getColumnConfig();
    // fetchBillOptionList();
    onSearch();
  });

  let formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "申请表编号", value: "billNo" },
    { label: "申请人", value: "applyUserName" }
  ]);

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "申请表编号", prop: "billNo", minWidth: 130 },
      { label: "申请表名称", prop: "applyName", minWidth: 140 },
      {
        label: "审批状态",
        prop: "billStateName",
        minWidth: 80
      },
      { label: "项目评估", prop: "projectAssess" },
      { label: "评估人", prop: "projectAssessUserName", minWidth: 80 },
      {
        label: "样机名称",
        prop: "prototypeName",
        minWidth: 150
      },
      { label: "产品型号", prop: "productModel", minWidth: 80 },

      { label: "申请测试原因", prop: "applyTestReason", minWidth: 110 },
      { label: "差异说明", prop: "divideRemark", minWidth: 80 },
      {
        label: "完成日期",
        prop: "completionDate",
        minWidth: 150,
        formatter: (data) => {
          return data.completionDate ? dayjs(new Date(data.completionDate)).format("YYYY-MM-DD") : "";
        }
      },

      { label: "申请人", prop: "createUserName", minWidth: 80 },
      {
        label: "申请时间",
        prop: "createDate",
        minWidth: 150,
        formatter: (data) => {
          return data.createDate ? dayjs(new Date(data.createDate)).format("YYYY-MM-DD HH:mm:ss") : "";
        }
      },
      { label: "修改人", prop: "modifyUserName", minWidth: 80 },
      {
        label: "修改时间",
        prop: "modifyDate",
        minWidth: 150,
        formatter: (data) => {
          return data.modifyDate ? dayjs(new Date(data.modifyDate)).format("YYYY-MM-DD HH:mm:ss") : "";
        }
      }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) {
      columnData = menuCols;
    }
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = (_rowIndex?) => {
    loading.value = true;

    fetchTestApplyList(formData)
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

  const onFresh = () => {
    getColumnConfig();
    onSearch();
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
    loading.value = true;
    const excelHeader = await getColumnConfig();
    const calcHeader = excelHeader
      .map((item, index) => {
        return { field: item.prop, title: item.label, width: 160, key: `0-${index}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
      })
      .filter((el) => el.field && el.field !== "index");

    const headConfig = {
      excelName: "测试申请",
      excelHeader: JSON.stringify(calcHeader)
    };

    exportTestApply({ excel: headConfig, ...formData })
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const onAdd = () => {
    curType.value = "add";
    openDialog("add");
  };

  const onEdit = () => {
    const row = currentRow.value;
    if ([0, 3].includes(row.billState)) {
      curType.value = "edit";
      openDialog("edit", row);
    } else {
      ElMessage({ message: "当前单据处于不可修改状态", type: "warning" });
    }
  };

  const unique = (arr) => {
    const res = new Map();
    return arr.filter((arr) => !res.has(arr.userCode) && res.set(arr.userCode, 1));
  };

  const handleAdd = (formData) => {
    const setA = (v) => {
      curMultipeUserList.value = v;

      console.log(v, "选择的value");
    };
    addDialog({
      title: "选择用户",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectUserModal, { setA, curRows: currentRow }),
      beforeSure: (done, { options }) => {
        if (JSON.stringify(curMultipeUserList.value) === "[]") {
          ElMessage({ message: "未选定人员", type: "warning" });
        } else {
          formData.projectAssessUserName = curMultipeUserList.value[0]?.userName;
          formData.projectAssessUserId = curMultipeUserList.value[0]?.id + "";
          done();
        }
      }
    });
  };

  const handleUp = (index) => {
    if (index) {
      backRows.value.splice(index - 1, 1, ...backRows.value.splice(index, 1, backRows.value[index - 1]));
    }
  };

  const handleDown = (index) => {
    if (backRows.value[index + 1]) {
      backRows.value.splice(index, 1, ...backRows.value.splice(index + 1, 1, backRows.value[index]));
    }
  };

  const fetchRowData = (_formData, formLoading) => {
    fetchTestApplyList({
      page: formData.page,
      id: currentRow.value.id,
      limit: formData.limit
    })
      .then((res: any) => {
        if (res.data && Array.isArray(res.data.records) && res.data.records.length === 1) {
          const rowData = res.data.records[0] || {};
          const keys = Object.keys(_formData);
          keys.forEach((item) => (_formData[item] = rowData[item]));
        }
      })
      .finally(() => (formLoading.value = false));
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改", view: "查看" };
    console.log(row, "row");
    const title = titleObj[type];
    const formRef = ref();
    const formLoading = ref(true);

    const _formData = reactive({
      applyName: "",
      applyTestReason: "",
      applyUserName: "",
      billNo: "",
      billStateName: "",
      changeContent: "",
      completionDate: "",
      divideRemark: "",
      id: "",
      productModel: "",
      projectAssess: "",
      projectAssessUserName: "",
      projectAssessUserId: "",
      prototypeName: "",
      referenceModel: "",
      sampleNum: "",
      specialTestRequire: "",
      testRequire: "",
      validationCode: ""
    });
    const configList = formConfigs({
      curType,
      backRows,
      curMultipeUserList,
      handleDown,
      fileList,
      handleAdd,
      handleUp,
      formData: _formData,
      treeSelectData: []
    });

    const filterConfigs = configList.filter((item) => {
      if (type === "add") {
        return !["billStateName", "applyUserName", "billNo"].includes(item.prop);
      }
      if (type === "edit" || type === "view") {
        return item;
      }
    });

    fetchRowData(_formData, formLoading);

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: filterConfigs
      },
      width: "1000px",
      draggable: true,
      fullscreenIcon: true,
      hideFooter: curType.value === "view",
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
    console.log(data, "data===");
    // return;
    data.completionDate = new Date(data.completionDate).toISOString();

    saveTestApply(data).then((res) => {
      if (res.data) {
        console.log(res.data, "保存返回");
        ElMessage({ message: "保存成功", type: "success" });
        callback();
      }
    });
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

      ElMessageBox.confirm(`确认要删除名称为【${currentRow.value.applyName}】的申请吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          deleteTestApply([currentRow.value.id]).then((res) => {
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

    if (text === "提交") {
      if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
        ElMessage({ message: "请选择一条记录", type: "warning" });
        return;
      } else {
        onSubmitAction();
      }
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler, type: "primary", text: "新增", isDropDown: false },
    { clickHandler, type: "warning", text: "修改", isDropDown: false },
    { clickHandler, type: "danger", text: "删除", isDropDown: false },
    { clickHandler, type: "primary", text: "查看", isDropDown: true },
    { clickHandler, type: "primary", text: "提交", isDropDown: true },
    { clickHandler, type: "primary", text: "导出", isDropDown: true }
  ]);

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
        submitTestApply({ id: row.id }).then((res) => {
          if (res.data) {
            message(`提交成功`, { type: "success" });
            const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value.id);
            onSearch(_rowIndex);
          }
        });
      })
      .catch(() => {});
  };

  return {
    loading,
    formLoading,
    dialogVisible,
    columns,
    dataList,
    modalRef,
    fresh,
    onView,
    onSubmitAction,
    maxHeight,
    pagination,
    searchOptions,
    onSearch,
    onFresh,
    onExport,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    buttonList,
    rowClick,
    handleCurrentChange
  };
};
