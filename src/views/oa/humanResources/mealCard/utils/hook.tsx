import { onMounted, reactive, ref, h } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { ElMessage, ElMessageBox } from "element-plus";
import { setColumn, getMenuColumns, getExportConfig, updateButtonList, usePageSelect } from "@/utils/table";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import EditForm from "@/components/EditForm/index.vue";
import { useEleHeight } from "@/hooks";
import { addDialog } from "@/components/ReDialog";
import { formConfigs, formConfigs1, formConfigs1Exit, formRules, formRules1, formRules1Exit } from "./config";
import { message } from "@/utils/message";
import dayjs from "dayjs";
import {
  editPerformanceDataInfo,
  exportMealCardLeftDetailRecords,
  exportMealCardRightTotalRecords,
  fetchMealCardDeptTotalList,
  fetchMealCardList,
  importExitMealCardDetailRecords,
  importMealCardDetailRecords,
  updateMealCardLeftDetailRecords,
  updateMealCardMoney
} from "@/api/oaManage/humanResources";

import { cloneDeep } from "@pureadmin/utils";
import { PAGE_CONFIG } from "@/config/constant";
import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { showMessageBox } from "@/utils/message";
import { TableGroupItemType } from "@/api/systemManage";
import { getDeptOptions } from "@/utils/requestApi";

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const dataList = ref([]);
  const dataList2: any = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const currentRows: any = ref([]);
  const tableRef = ref();
  const rowData = ref();
  const treeData = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const curDate = ref(dayjs(new Date()).format("YYYY-MM"));
  const groupArrsList = ref<TableGroupItemType[]>([]);

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    year: +curDate.value.split("-")[0],
    month: +curDate.value.split("-")[1],
    staffCode: "",
    staffName: "",
    deptId: 0,
    isDistribute: ""
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "staffName" },
    { label: "工号", value: "staffCode" },
    { label: "日期", value: "curDate", type: "month", format: "YYYY-MM" },
    { label: "状态", value: "isDistribute", children: [] },
    { label: "部门", value: "deptId", children: [] }
  ]);
  const queryParams = reactive<QueryParamsType>({ curDate: curDate.value });
  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData: currentRows, uniId: "id" });

  onMounted(() => {
    getColumnConfig();
    onSearchGroup();
    getOptions();
  });

  const onSearchGroup = () => {
    onSearch();
    currentRows.value = [];
    rowData.value = null;
    onSearch2();
  };

  const getOptions = () => {
    getBOMTableRowSelectOptions({ optioncode: "MealCardState" }).then((res) => {
      if (res.data) {
        const result = res.data[0]?.optionList || [];
        const resultArr = result.map((item) => ({ label: item.optionName, value: item.optionValue }));
        resultArr.unshift({ label: "全部", value: "" });
        searchOptions[3].children = resultArr;
      }
    });
    getDeptOptions().then((data: any) => {
      treeData.value = data;
      searchOptions[4].children = data;
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "序号", type: "index", width: 60, align: "center", headerAlign: "center" },
      { label: "年", prop: "year", width: 60 },
      { label: "月", prop: "month", width: 60 },
      { label: "姓名", prop: "staffName", width: 80 },
      { label: "工号", prop: "staffCode", width: 80 },
      { label: "卡号", prop: "cardCode", width: 80 },
      { label: "部门", prop: "deptName", width: 120 },
      { label: "状态", prop: "isDistribute", width: 100 },
      { label: "创建时间", prop: "createDate", minWidth: 140 },
      { label: "审核人", prop: "checkName", minWidth: 120 },
      { label: "审核时间", prop: "checkDate", minWidth: 140 },
      { label: "回退人", prop: "backName", minWidth: 120 },
      { label: "回退时间", prop: "backDate", minWidth: 140 },
      { label: "发卡人", prop: "disName", minWidth: 120 },
      { label: "发卡时间", prop: "distributeDate", minWidth: 140 },
      { label: "扣款金额", prop: "money", minWidth: 120 }
    ];
    let columnData2: TableColumnList[] = [
      { label: "部门", prop: "deptName" },
      { label: "待审核", prop: "check", width: 70 },
      { label: "已审核", prop: "back", width: 70 },
      { label: "已发放", prop: "isDis", width: 70 },
      { label: "已退卡", prop: "isBack", width: 70 }
    ];

    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false, selectionColumn: { hide: false }, indexColumn: false });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: false, selectionColumn: { hide: false } });
  };

  const handleTagSearch = (values) => {
    formData.staffName = values.staffName;
    formData.staffCode = values.staffCode;
    formData.year = +values.curDate?.split("-")[0];
    formData.month = +values.curDate?.split("-")[1];
    formData.isDistribute = values.isDistribute;
    formData.deptId = values.deptId;
    onSearchGroup();
  };

  const onSearch = () => {
    loading.value = true;
    fetchMealCardList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        setSelectCheckbox();
      })
      .catch((err) => (loading.value = false));
  };

  const onSearch2 = () => {
    loading2.value = true;
    fetchMealCardDeptTotalList(formData)
      .then((res: any) => {
        const data = res.data;
        loading2.value = false;
        dataList2.value = data;
      })
      .catch((err) => (loading2.value = false));
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    onSearchGroup();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    onSearchGroup();
  }

  const onCurrentChange = (row) => {
    if (!row) return;
    rowData.value = row;
  };

  // 导入
  const onAdd = () => {
    openDialog("add");
  };

  // 导入退卡
  const onAddExit = () => {
    openDialogExit("add");
  };

  const openDialogExit = async (type: string, row?) => {
    const titleObj = { add: "导入" };
    const title = titleObj[type];
    const formRef = ref();

    const addFormData = reactive({
      row: "2",
      userCodeCol: "3",
      file: "",
      moneyCol: "5",
      yearAndMonth: dayjs(new Date()).format("YYYY-MM")
    });

    addDialog({
      title: "退卡导入",
      props: {
        formInline: addFormData,
        formRules: formRules1Exit,
        formConfigs: formConfigs1Exit()
      },
      width: "350px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`).then(() => {
              onSubmitChangeExit(type, title, addFormData, () => {
                done();
                onSearchGroup();
              });
            });
          }
        });
      }
    });
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "导入", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      money: row?.money ?? "",
      id: row?.id ?? ""
    });

    const addFormData = reactive({
      row: "3",
      userCodeCol: "2",
      file: "",
      cardCodeCol: "5",
      yearAndMonth: dayjs(new Date()).format("YYYY-MM")
    });

    addDialog({
      title: type === "add" ? "导入" : "请输入修改金额",
      props: {
        formInline: type === "add" ? addFormData : _formData,
        formRules: type === "add" ? formRules1 : formRules,
        formConfigs: type === "add" ? formConfigs1() : formConfigs()
      },
      width: type === "add" ? "350px" : "200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`).then(() => {
              onSubmitChange(type, title, type === "add" ? addFormData : _formData, () => {
                done();
                onSearchGroup();
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    if (type === "add") {
      const param = {
        userCodeCol: data.userCodeCol,
        row: data.row,
        cardCodeCol: data.cardCodeCol,
        yearAndMonth: data.yearAndMonth,
        year: +data.yearAndMonth.split("-")[0],
        month: +data.yearAndMonth.split("-")[1]
      };
      const fData = new FormData();
      fData.append("files", data.file);
      fData.append("param", JSON.stringify(param));

      importMealCardDetailRecords(fData).then((res) => {
        if (res.data) {
          callback();
          ElMessage({ message: "导入成功", type: "success" });
        }
      });
      return;
    }
    const API = { edit: editPerformanceDataInfo };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const onSubmitChangeExit = (type: string, title: string, data, callback) => {
    if (type === "add") {
      const param = {
        userCodeCol: data.userCodeCol,
        row: data.row,
        moneyCol: data.moneyCol,
        yearAndMonth: data.yearAndMonth,
        year: +data.yearAndMonth.split("-")[0],
        month: +data.yearAndMonth.split("-")[1]
      };
      const fData = new FormData();
      fData.append("files", data.file);
      fData.append("dto", JSON.stringify(param));

      importExitMealCardDetailRecords(fData).then((res) => {
        if (res.data) {
          callback();
          ElMessage({ message: "退卡导入成功", type: "success" });
        }
      });
      return;
    }
  };

  const onExportTotal = () => {
    const headConfig = getExportConfig("餐卡管理", columns2.value, formData);
    exportMealCardRightTotalRecords(headConfig)
      .then((res: any) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  const onExportDetail = async () => {
    const headConfig = getExportConfig("餐卡管理", columns.value, formData);
    exportMealCardLeftDetailRecords(headConfig)
      .then((res: any) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  const onAudit = () => {
    if (JSON.stringify(currentRows.value) === "[]") {
      ElMessage({ message: "请选择至少一条记录", type: "warning" });
      return;
    }

    const cloneList = cloneDeep(currentRows.value);

    for (let i = 0; i < cloneList.length; i++) {
      if (cloneList[i].isDistribute !== "待审核") {
        const title = "审核失败," + cloneList[i].staffName + cloneList[i].month + "月的餐卡处于非待审核状态";
        ElMessage({ message: title, type: "error" });
        return;
      } else {
        cloneList[i].isDistribute = "已审核";
      }
    }

    showMessageBox("确认要审核所选定的记录吗?")
      .then(() => {
        updateMealCardLeftDetailRecords(cloneList).then((res) => {
          if (res.data) {
            ElMessage({ message: "审核成功", type: "success" });
            onSearchGroup();
          }
        });
      })
      .catch(() => {});
  };

  const onBack = () => {
    if (JSON.stringify(currentRows.value) === "[]") {
      ElMessage({ message: "请选择至少一条记录", type: "warning" });
      return;
    }

    const cloneList = cloneDeep(currentRows.value);

    for (let i = 0; i < cloneList.length; i++) {
      if (cloneList[i].isDistribute !== "已审核") {
        const title = "回退失败," + cloneList[i].staffName + cloneList[i].month + "月的餐卡处于不可回退状态";
        ElMessage({ message: title, type: "error" });
        return;
      } else {
        cloneList[i].isDistribute = "待审核";
      }
    }

    showMessageBox("确认要回退所选定的记录吗?")
      .then(() => {
        updateMealCardLeftDetailRecords(cloneList).then((res) => {
          if (res.data) {
            ElMessage({ message: "回退成功", type: "success" });
            onSearchGroup();
          }
        });
      })
      .catch(() => {});
  };

  const onDispatch = () => {
    if (JSON.stringify(currentRows.value) === "[]") {
      ElMessage({ message: "请选择至少一条记录", type: "warning" });
      return;
    }

    const cloneList = cloneDeep(currentRows.value);

    for (let i = 0; i < cloneList.length; i++) {
      if (cloneList[i].isDistribute !== "已审核") {
        const title = "分发失败," + cloneList[i].staffName + cloneList[i].month + "月的餐卡非审核中状态";
        ElMessage({ message: title, type: "error" });
        return;
      } else {
        cloneList[i].isDistribute = "已发放";
      }
    }

    showMessageBox("确认要分发所选定的记录吗?")
      .then(() => {
        updateMealCardLeftDetailRecords(cloneList).then((res) => {
          if (res.data) {
            ElMessage({ message: "分发成功", type: "success" });
            onSearchGroup();
          }
        });
      })
      .catch(() => {});
  };

  const onCancelDispatch = () => {
    if (JSON.stringify(currentRows.value) === "[]") {
      ElMessage({ message: "请选择至少一条记录", type: "warning" });
      return;
    }

    const cloneList = cloneDeep(currentRows.value);

    for (let i = 0; i < cloneList.length; i++) {
      if (cloneList[i].isDistribute !== "已发放") {
        const title = "取消发放失败," + cloneList[i].staffName + cloneList[i].month + "月的餐卡处于不可取消发放状态";
        ElMessage({ message: title, type: "error" });
        return;
      } else {
        cloneList[i].isDistribute = "已审核";
      }
    }

    showMessageBox("确认要取消发放所选定的记录吗?")
      .then(() => {
        updateMealCardLeftDetailRecords(cloneList).then((res) => {
          if (res.data) {
            ElMessage({ message: "取消发放成功", type: "success" });
            onSearchGroup();
          }
        });
      })
      .catch(() => {});
  };

  const onWithoutCard = () => {
    if (currentRows.value.length !== 1) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }

    const cloneList = cloneDeep(currentRows.value);

    if (cloneList[0].isDistribute !== "已发放") {
      const title = "退卡失败,当前状态不是已发放";
      ElMessage({ message: title, type: "error" });
      return;
    } else {
      ElMessageBox.prompt("请输入扣款金额", null, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\d/,
        inputErrorMessage: "扣款金额只能输入数字"
      })
        .then(({ value }) => {
          cloneList[0].money = value;
          updateMealCardMoney(cloneList[0]).then((res) => {
            if (res.data) {
              ElMessage({ message: "退卡成功", type: "success" });
              onSearchGroup();
            }
          });
        })
        .catch(() => {});
    }
  };

  const rowStyle = () => ({ cursor: "pointer" });

  function onSelect(rows, row) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows) {
    setSelectAllChange(rows);
  }

  const onRowClick = (row) => {
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAudit, type: "success", text: "审核", isDropDown: true },
    { clickHandler: onBack, type: "danger", text: "回退", isDropDown: true },
    { clickHandler: onDispatch, type: "warning", text: "分发", isDropDown: true },
    { clickHandler: onCancelDispatch, type: "warning", text: "取消发放", isDropDown: true },
    { clickHandler: onWithoutCard, type: "danger", text: "退卡", isDropDown: true },
    { clickHandler: onExportDetail, type: "info", text: "导出明细", isDropDown: true },
    { clickHandler: onExportTotal, type: "info", text: "导出汇总", isDropDown: true },
    { clickHandler: onAdd, type: "default", text: "导入", isDropDown: true },
    { clickHandler: onAddExit, type: "default", text: "导入退卡", isDropDown: true }
  ]);

  return {
    tableRef,
    columns,
    columns2,
    dataList,
    dataList2,
    loading,
    loading2,
    maxHeight,
    pagination,
    searchOptions,
    queryParams,
    buttonList,
    groupArrsList,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    rowStyle,
    onSearch,
    onSearch2,
    onSelect,
    onSelectAll,
    onRowClick,
    handleCurrentChange
  };
};
