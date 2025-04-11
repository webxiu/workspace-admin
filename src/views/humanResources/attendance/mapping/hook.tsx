import {
  deleteAttendanceUser,
  exportAttendanceUser,
  fetchAttendanceUserFaceList,
  fetchAttendanceUserList,
  fetchMachine,
  staffInfoList,
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
import { FormItemConfigType } from "@/utils/form";
import HxModalInput from "@/components/HxModalInput/index.vue";
import MachineUserModal from "./machineUserModal/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import SelectUserModal from "./selectUserModal/modal.vue";
import TableEditList from "@/components/TableEditList/index.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { getDeptOptions } from "@/utils/requestApi";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const dataList = ref([]);
  const dataList1 = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const columns1 = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const currentRow = ref();
  const faceImageUrl = ref("");
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "staffName" },
    { label: "工号", value: "staffId" },
    { label: "部门", value: "deptId", children: [] }
    // { label: "考勤机名称", value: "attMachineName", children: [] },
    // { label: "考勤机工号", value: "pin" },
    // { label: "考勤机姓名", value: "name" },
    // { label: "映射状态", value: "mappingState", children: [] }
  ]);

  onMounted(() => {
    getOptions();
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "考勤机工号", prop: "pin" },
      { label: "考勤机姓名", prop: "name" },
      { label: "修改人", prop: "modifyUserName" },
      { label: "修改时间", prop: "modifyDate" }
    ];

    let columnData1: TableColumnList[] = [
      { label: "工号", prop: "staffCode" },
      { label: "姓名", prop: "staffName" },
      { label: "部门", prop: "deptName" },
      { label: "入职日期", prop: "startDate" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols, menuCols1] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    if (menuCols1?.length) columnData1 = menuCols1;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    columns1.value = setColumn({ columnData: columnData1, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    dataList.value = [];
    fetchAttendanceUserFaceList({ ...formData }).then((res: any) => {
      if (res.data) {
        const data = res.data;
        dataList1.value = data.records || [];
        pagination.total = data.total;
        faceImageUrl.value = "";
        // dataList.value = [];
      }
    });
  };

  const getOptions = () => {
    getDeptOptions().then((data: any) => {
      searchOptions[2].children = data;
    });
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
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

    const formConfig: FormItemConfigType[] = [
      {
        formData: _formData,
        customElement: {
          staffCode: ({ formModel, row }) => {
            return (
              <HxModalInput
                title="选择工号"
                placeholder="请选择工号"
                valueKey={row.prop}
                v-model={formModel[row.prop]}
                readonly={true}
                showButton={true}
                showModel="user"
                onSelect={(row) => {
                  _formData.deptId = row.deptId + "";
                  _formData.staffCode = row.userCode;
                  _formData.staffName = row.userName;
                }}
              />
            );
          }
        },
        formProps: { labelWidth: "120px" }
      }
    ];
    addDialog({
      title: `${title}`,
      props: {
        params: { groupCode: "1" },
        formConfig: formConfig
      },
      width: "700px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      hideFooter: type === "view",
      showResetButton: true,
      beforeReset: () => formRef.value.resetRef(),
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done) => {
        formRef.value.getRef().then(({ valid, data }) => {
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
        message.success(title + "成功");
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
          message.warning("请选择至少一条记录");
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

  const rowClick2 = (row) => {
    console.log(row, "left row..");
    const baseApi = import.meta.env.VITE_BASE_API;
    fetchAttendanceUserList({ staffCode: row.staffId, page: 1, limit: 10000 }).then((res: any) => {
      if (res.data) {
        const result = res.data.records || [];
        dataList.value = result;
      }
    });
    if (row.faceInfoUrl) {
      faceImageUrl.value = baseApi + row.faceInfoUrl;
    }
  };

  return {
    columns,
    columns1,
    onFresh,
    faceImageUrl,
    handleTagSearch,
    searchOptions,
    buttonList,
    rowDbclick,
    rowClick,
    maxHeight,
    loading,
    rowClick2,
    dataList,
    dataList1,
    pagination,
    onSizeChange,
    onCurrentChange
  };
};
