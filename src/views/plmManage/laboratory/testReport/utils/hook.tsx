import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { utils, write } from "xlsx";
import { saveAs } from "file-saver";

import { downloadDataToExcel, setColumn, getMenuColumns, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import {
  delTestReportList,
  fetchTestReportInfo,
  fetchTestReportList,
  getBOMTableRowSelectOptions,
  saveTestReportList,
  submitTestReport
} from "@/api/plmManage";

import { getBillStateNameList } from "@/api/plmManage";
import dayjs from "dayjs";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import EditForm from "@/components/EditForm/index.vue";
import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { viewSignBackAttrList } from "@/api/supplyChain";
import SelectUserModal from "../../selectUserModal/modal.vue";
import { formConfigs, formRules } from "./config";
import { PAGE_CONFIG } from "@/config/constant";
import Detail from "../Detail.vue";
import { commonSubmit } from "@/api/systemManage";
import { commonBackLogic } from "@/utils/common";

export const useTestReportConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const currentRow: any = ref({});
  const curViewNodeRow: any = ref({});
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

  onMounted(() => {
    fetchBillOptionList();
    getColumnConfig();
    onSearch();
  });

  let formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "报告编号", value: "billNo" },
    { label: "创建人", value: "createUserName" },
    { label: "单据状态", value: "billState", children: [] }
  ]);

  const fetchBillOptionList = () => {
    getBOMTableRowSelectOptions({ optioncode: "BillStatus" }).then((res) => {
      if (res.data) {
        const result = res.data[0]?.optionList || [];
        stateOptionList.value = result;
        searchOptions[2].children = result.map((item) => ({ label: item.optionName, value: item.optionValue }));
      }
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "序号", type: "index", minWidth: 50, align: "center", headerAlign: "center" },
      { label: "测试报告编号", prop: "billNo", minWidth: 130 },
      { label: "测试报告名称", prop: "reportName", minWidth: 140 },
      {
        label: "单据状态",
        prop: "billState",
        minWidth: 80,
        formatter: (data) => {
          const stateInfo = stateOptionList.value?.find((item) => item.optionValue == data.billState);
          return stateInfo?.optionName || "";
        }
      },
      { label: "备注", prop: "remark" },
      { label: "创建人", prop: "createUserName", minWidth: 80 },
      {
        label: "创建时间",
        prop: "createDate",
        minWidth: 150,
        formatter: (data) => {
          return dayjs(new Date(data.createDate)).format("YYYY-MM-DD HH:mm:ss");
        }
      },
      { label: "提交人", prop: "submitUserName", minWidth: 80 },
      {
        label: "提交时间",
        prop: "submitDate",
        minWidth: 150,
        formatter: (data) => {
          return data.submitDate ? dayjs(new Date(data.submitDate)).format("YYYY-MM-DD HH:mm:ss") : "";
        }
      },
      { label: "修改人", prop: "updateUserName", minWidth: 80 },
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

    fetchTestReportList(formData)
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
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#testMgmtReportTableId"), {
      raw: true //有的是日期、小数等格式，直接乱码#。所以这里直接保留原始字符串
    });
    workbook.Sheets.Sheet1["!cols"][0] = { hidden: true };
    const wbout = write(workbook, {
      bookType: "xlsx",
      bookSST: true,
      type: "array"
    });
    saveAs(
      new Blob([wbout], {
        type: "application/octet-stream"
      }),
      `测试管理报告表${timeStep}.xlsx`
    );
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

  const handleAdd = () => {
    const setA = (v) => {
      curMultipeUserList.value = v;
    };
    addDialog({
      title: "选择用户",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(SelectUserModal, { setA, curRows: currentRow }),
      beforeSure: (done, { options }) => {
        if (JSON.stringify(backRows.value) === "{}") {
          ElMessage({ message: "未选定人员", type: "warning" });
        } else {
          const mergeArr = backRows.value.concat(curMultipeUserList.value);

          backRows.value = unique(mergeArr);
          formData.approval = backRows.value;
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

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改", view: "查看" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      id: "",
      reportName: "",
      remark: "",
      billNo: "",
      createUserName: "",
      createDate: ""
    });

    const onChange = (data) => {
      backRows.value = data.backRows;
      fileList.value = data.fileList;
    };

    addDialog({
      title: `${title}`,
      props: {
        id: row?.id,
        type: type,
        formInline: _formData,
        backRows,
        fileList,
        handleDown,
        handleAdd,
        handleUp
      },
      width: "600px",
      draggable: true,
      fullscreenIcon: true,
      hideFooter: type === "view",
      closeOnClickModal: false,
      okButtonText: "保存",
      contentRenderer: () => h(Detail, { ref: formRef, onChange }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        if (!fileList.value.length) {
          ElMessage({ message: "附件未上传", type: "warning" });
          return;
        }

        if (!backRows.value.length) {
          ElMessage({ message: "请选择审批人", type: "warning" });
          return;
        }
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
                onSearch();
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    // 组装请求参数
    const _formData = new FormData();
    const reqObj: any = {
      nodePerson: { userCodeList: String(backRows.value.map((item) => item.userCode)), taskId: "customerOrderTask" },
      ptr: { remark: data.remark, reportName: data.reportName }
    };
    if (data.id) {
      reqObj.ptr.id = data.id;
      reqObj.ptr.billNo = data.billNo;
      reqObj.fileList = fileList.value.map((item) => {
        item.filePath = data.billNo; // 修改的时候给filePath赋值为Null
        return item;
      });
    }
    const param = JSON.stringify(reqObj);
    _formData.append("param", param);

    fileList.value.map((item) => {
      if (!item.id) {
        _formData.append("files", item);
      } else {
        _formData.append("files", null);
      }
    });

    saveTestReportList(_formData).then((res) => {
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
      if (JSON.stringify(currentRow.value) === "{}" || !currentRow.value) {
        ElMessage({ message: "请选择记录", type: "warning" });
        return;
      } else {
        onEdit();
      }
    }

    if (text === "导出") {
      onExport();
    }

    if (text === "查看") {
      if (JSON.stringify(currentRow.value) === "{}") {
        ElMessage({ message: "请选择记录", type: "warning" });
        return;
      }
      onView();
    }
    if (text === "提交") {
      if (JSON.stringify(currentRow.value) === "{}") {
        ElMessage({ message: "请选择记录", type: "warning" });
        return;
      }
      onSubmitAction();
    }

    if (text === "删除") {
      if (JSON.stringify(currentRow.value) === "{}") {
        ElMessage({ message: "请选择记录", type: "warning" });
        return;
      }

      ElMessageBox.confirm(`确认要删除名称为【${currentRow.value.reportName}】的报告吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          delTestReportList({ id: currentRow.value.id }).then((res) => {
            if (res.data) {
              message(`删除成功`, { type: "success" });
              currentRow.value = {};
              onSearch();
            }
          });
        })
        .catch(() => {});
    }

    if (text === "审批详情") {
      if (JSON.stringify(curViewNodeRow.value) === "{}") {
        ElMessage({ message: "请选择记录", type: "warning" });
        return;
      }
      addDialog({
        title: "查看审批详情",
        width: "900px",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: true,
        hideFooter: true,
        contentRenderer: ({ options }) =>
          h(NodeDetailList, { options, billNo: currentRow.value.billNo, billType: "testReport", billState: currentRow.value.billState })
      });
    }

    if (text === "回退") {
      if (JSON.stringify(currentRow.value) === "{}") {
        ElMessage({ message: "请选择记录", type: "warning" });
        return;
      }
      onBackAction();
    }
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler, type: "primary", text: "新增", isDropDown: false },
    { clickHandler, type: "warning", text: "修改", isDropDown: false },
    { clickHandler, type: "danger", text: "删除", isDropDown: false },
    { clickHandler, type: "primary", text: "导出", isDropDown: true },
    { clickHandler, type: "primary", text: "审批详情", isDropDown: true },
    { clickHandler, type: "primary", text: "查看", isDropDown: true },
    { clickHandler, type: "primary", text: "提交", isDropDown: true },
    { clickHandler, type: "primary", text: "回退", isDropDown: true }
  ]);

  const rowClick = (row) => {
    currentRow.value = row;
    curViewNodeRow.value = row;
  };

  // 查看
  const onView = () => {
    const row = currentRow.value;
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
      onView();
      onSearch();
    }
  };

  const onSubmitAction = () => {
    const row = currentRow.value;
    ElMessageBox.confirm(`确认要提交名称为【${row.reportName}】的报告吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        commonSubmit({ id: row.id, billId: "10039" }).then((res) => {
          if (res.data) {
            message(`提交  成功`, { type: "success" });
            currentRow.value = {};
            onSearch();
          }
        });
      })
      .catch(() => {});
  };

  const onBackAction = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return ElMessage({ message: "请选择一条记录", type: "warning" });
    }
    if (![1, 2].includes(currentRow.value.billState)) {
      return message("当前状态不能进行回退", { type: "error" });
    }
    commonBackLogic(currentRow.value.billNo, onSearch);
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onView();
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
    rowDbClick,
    stateOptionList,
    handleCurrentChange
  };
};
