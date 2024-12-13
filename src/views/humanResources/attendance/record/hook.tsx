import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import {
  delAttendanceRecord,
  exportAttendanceRecord,
  fetchAttendanceRecord,
  fetchMachine,
  revertAttendanceRecord,
  updateAttendanceRecord
} from "@/api/oaManage/humanResources";
import { formConfigs, formRules } from "./configs";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { utils, write } from "xlsx";

import EditForm from "@/components/EditForm/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import SelectUserModal from "../mapping/selectUserModal/modal.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { getDeptOptions } from "@/utils/requestApi";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const machineOptions = ref([]);
  const curRow = ref();
  const treeSelectData = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData: any = reactive({
    attMachineName: "",
    staffCode: "",
    deptId: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const nowDate = dayjs().format("YYYY-MM-DD");

  const queryParams = reactive({ date: `${nowDate} ~ ${nowDate}` });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "工号", value: "staffCode" },
    { label: "部门", value: "deptId", children: [] },
    { label: "考勤机名称", value: "attMachineName", children: [] },
    {
      label: "状态",
      value: "deleteStatus",
      children: [
        { label: "未删除", value: 0 },
        { label: "已删除", value: 1 }
      ]
    },
    { label: "考勤时间", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" }
  ]);

  const fetchOptions = () => {
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
  };

  onMounted(() => {
    fetchOptions();
    getColumnConfig();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "工号", prop: "staffCode" },
      { label: "姓名", prop: "staffName" },
      { label: "部门", prop: "deptName" },
      { label: "考勤机", prop: "attMachineName" },
      { label: "打卡时间", prop: "attTime" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    fetchAttendanceRecord(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data.records || [];
        pagination.total = res.data.total;
      }
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
    exportAttendanceRecord({ ...formData, limit: 1000000 }).then((res: any) => {
      if (res.data) {
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName);
      }
    });
  };

  const openDialog = async (type: "add" | "view" | "edit", row) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const modalRow = ref();
    const formLoading = ref(false);
    const _formData = reactive({
      id: row?.id ?? "",
      sn: row?.sn ?? "",
      // staffId: row?.staffId ?? "",
      deptId: row?.deptId ? row?.deptId + "" : "",
      attTime: row?.attTime ?? "",
      recordTotal: row?.recordTotal ?? null,
      orgId: row?.orgId ?? null,
      staffCode: row?.staffCode ?? null,
      staffName: row?.staffName ?? null,
      deptName: row?.deptName ?? null,
      pin: row?.pin ?? null,
      attMachineName: row?.attMachineName ?? ""
    });

    const handleAddUserNames = () => {
      const setA = (v) => (modalRow.value = v);
      addDialog({
        title: "选择人员",
        width: "950px",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        contentRenderer: () => h(SelectUserModal, { setA, curRows: curRow }),
        beforeSure: (done) => {
          if (!modalRow.value) {
            message.warning("未选定人员");
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
    const apiType = { edit: updateAttendanceRecord };
    apiType[type](data).then((res) => {
      if (res.data) {
        message.success(title + "成功");
        callback();
      }
    });
  };

  const onEdit = () => {
    if (!curRow.value) return message.warning("请选择一条记录");
    openDialog("edit", curRow.value);
  };

  const onDel = () => {
    if (!curRow.value) return message.warning("请选择一条记录");
    showMessageBox(`确认要删除【${curRow.value.staffName} ${dayjs(curRow.value.attTime).format("YYYY-MM-DD HH:mm:ss")}】的考勤记录吗?`)
      .then(() => {
        delAttendanceRecord({ id: curRow.value.id }).then((res) => {
          if (res.data || res.status === 200) {
            message.success("删除成功");
            curRow.value = null;
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const restore = () => {
    if (!curRow.value) return message.warning("请选择一条记录");
    if (curRow.value.deleteStatus != 1) return message.warning("数据未删除无需恢复");
    showMessageBox(`确认要恢复【${curRow.value.staffName} ${dayjs(curRow.value.attTime).format("YYYY-MM-DD HH:mm:ss")}】的考勤记录吗?`)
      .then(() => {
        revertAttendanceRecord({ id: curRow.value.id }).then((res) => {
          if (res.data || res.status === 200) {
            message.success("恢复成功");
            curRow.value = null;
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const buttonList = ref([
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDel, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: restore, type: "danger", text: "恢复", isDropDown: false },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
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

  const rowClick = (row) => {
    curRow.value = row;
  };

  const rowDbClick = (row) => {
    curRow.value = row;
    onEdit();
  };

  return {
    columns,
    onFresh,
    queryParams,
    rowClick,
    handleTagSearch,
    searchOptions,
    buttonList,
    maxHeight,
    loading,
    dataList,
    pagination,
    rowDbClick,
    onSizeChange,
    onCurrentChange
  };
};
