import {
  deleteAttendanceUser,
  exportAttendanceUser,
  fetchAttendanceUserList,
  fetchMachine,
  updateAttendanceUser,
  uploadAttendanceData
} from "@/api/oaManage/humanResources";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { formConfigs, formRules } from "./config";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { utils, write } from "xlsx";

import EditForm from "@/components/EditForm/index.vue";
import { ElMessage } from "element-plus";
import MachineUserModal from "./machineUserModal/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import SelectUserModal from "./selectUserModal/modal.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { getDeptOptions } from "@/utils/requestApi";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const currentRow = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const treeSelectData = ref([]);
  const curMultipeUserList: any = ref([]);
  const machineOptions = ref([]);

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "工号", value: "staffCode" },
    { label: "部门", value: "deptId", children: [] },
    { label: "考勤机名称", value: "attMachineName", children: [] },
    { label: "考勤机工号", value: "pin" },
    { label: "考勤机姓名", value: "name" },
    { label: "映射状态", value: "mappingState", children: [] }
  ]);

  onMounted(() => {
    getOptions();
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "工号", prop: "staffCode" },
      { label: "姓名", prop: "staffName" },
      { label: "部门", prop: "deptName" },
      { label: "考勤机", prop: "attMachineName" },
      { label: "考勤机工号", prop: "pin" },
      { label: "考勤机姓名", prop: "name" },
      { label: "修改人", prop: "modifyUserName" },
      { label: "修改时间", prop: "modifyDate" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    fetchAttendanceUserList(formData).then((res: any) => {
      if (res.data) {
        const data = res.data;
        dataList.value = data.records || [];
        pagination.total = data.total;
      }
    });
  };

  const getOptions = () => {
    getDeptOptions().then((data: any) => {
      treeSelectData.value = data;
      searchOptions[1].children = data;
    });

    fetchMachine({}).then((res: any) => {
      if (res.data) {
        machineOptions.value = res.data.map((item) => ({ label: item.attMachineName, value: item.attMachineName }));
        searchOptions[2].children = machineOptions.value;
      }
    });

    getBOMTableRowSelectOptions({ optioncode: "MappingStatus" }).then((res) => {
      if (res.data) {
        const result = res.data.find((item) => item.optionCode === "MappingStatus")?.optionList || [];
        searchOptions[5].children = result.map((item) => ({ label: item.optionName, value: item.optionValue }));
      }
    });
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (val) => {
    formData.staffName = val.staffName;
    formData.staffCode = val.staffCode;
    formData.deptId = val.deptId;
    formData.attMachineName = val.attMachineName;
    formData.pin = val.pin;
    formData.name = val.name;
    formData.mappingState = val.mappingState;

    onSearch();
  };

  const onExport = () => {
    exportAttendanceUser({ ...formData, limit: 1000000 })
      .then((res: any) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName);
        }
      })
      .catch(() => {
        const timeStep = Date.now();
        const workbook = utils.table_to_book(document.querySelector("#mappingTableId"), {
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
          `考勤人员${timeStep}.xlsx`
        );
      });
  };

  const openDialog = async (type: "add" | "view" | "edit", row?) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const formLoading = ref(false);
    const modalRow = ref();
    const _formData = reactive({
      id: row?.id ?? "",
      staffCode: row?.staffCode ?? "",
      staffName: row?.staffName ?? "",
      deptId: row?.deptId ? row?.deptId + "" : "",
      attMachineName: row?.attMachineName ?? "",
      pin: row?.pin ?? "",
      name: row?.name ?? ""
    });

    const handleAddUserNames = () => {
      const setA = (v) => (modalRow.value = v);
      addDialog({
        title: "选择人员",
        width: "900px",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        contentRenderer: () => h(SelectUserModal, { setA, curRows: currentRow }),
        beforeSure: (done) => {
          if (!modalRow.value) {
            ElMessage({ message: "未选定人员", type: "warning" });
            return;
          } else {
            _formData.deptId = modalRow.value.deptId + "";
            _formData.staffCode = modalRow.value.userCode;
            _formData.staffName = modalRow.value.userName;
            done();
          }
        }
      });
    };

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ treeSelectData, formData: _formData, handleAddUserNames })
      },
      width: "700px",
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
                onSubmitChange(type, title, _formData, () => {
                  done();
                  onSearch();
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    const apiType = { edit: updateAttendanceUser };
    const copyData = cloneDeep(data);
    delete copyData.deptId;
    apiType[type](copyData).then((res) => {
      if (res.data) {
        message(title + "成功", { type: "success" });
        callback();
      }
    });
  };

  const onEdit = () => {
    if (!currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    openDialog("edit", currentRow.value);
  };

  const onUploadData = () => {
    const formRef = ref();
    addDialog({
      title: `导入考勤机人员数据`,
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(MachineUserModal, { ref: formRef }),
      beforeSure: (done) => {
        const selectedIds: any[] = formRef.value?.selectedRows?.map((item) => item.id);
        if (selectedIds.length) {
          showMessageBox(`确认要导入考勤人员数据吗?`)
            .then(() => {
              uploadAttendanceData(selectedIds).then((res) => {
                if (res.data) {
                  ElMessage({ message: "导入成功", type: "success" });
                  done();
                  onSearch();
                }
              });
            })
            .catch(console.log);
        } else {
          message("请选择至少一条记录", { type: "warning" });
        }
      }
    });
  };

  const onDelete = () => {
    if (!currentRow.value) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }

    showMessageBox(`确认要删除【${currentRow.value.staffName}】的数据吗?`)
      .then(() => {
        deleteAttendanceUser({ id: currentRow.value.id }).then((res) => {
          if (res.status === 200) {
            ElMessage({ message: "删除成功", type: "success" });
            currentRow.value = null;
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true },
    { clickHandler: onUploadData, type: "info", text: "导入", isDropDown: true }
  ]);

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const rowDbclick = (row) => {
    openDialog("edit", row);
  };
  const rowClick = (row) => {
    currentRow.value = row;
  };

  return {
    columns,
    onFresh,
    handleTagSearch,
    searchOptions,
    buttonList,
    rowDbclick,
    rowClick,
    maxHeight,
    loading,
    dataList,
    pagination,
    onSizeChange,
    onCurrentChange
  };
};
