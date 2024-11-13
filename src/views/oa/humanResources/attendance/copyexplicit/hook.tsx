import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import {
  exportAttendancePageDetail,
  fetchAttendanceDetail,
  fetchAttendanceRecord,
  fetchGoOutRecordsOnAtt,
  getStaffDetail,
  leaveApplyListOnAtt,
  overtimeOrderListOnAtt,
  supplementaryCardOnAtt,
  timeSettingList,
  updateAttendancePageDetail
} from "@/api/oaManage/humanResources";
import { getEnumDictList, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";

import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import dayjs from "dayjs";
import { getDeptOptions } from "@/utils/requestApi";
import { useEleHeight } from "@/hooks";
import { message } from "@/utils/message";
import { cloneDeep } from "@pureadmin/utils";

export const useMachine = () => {
  const dataList = ref([]);
  const originList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const editFlag = ref(false);
  const allFetchCols = ref([]);
  const rightTableRef = ref();
  const currentRow = ref();

  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const preDay = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  const queryParams = reactive({ date: `${preDay} ~ ${preDay}` });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "工号", value: "staffCode" },
    { label: "部门", value: "deptId", children: [] },
    { label: "考勤时间", value: "date", type: "daterange", format: "YYYY-MM-DD" },
    { label: "异常出勤", value: "abnormalAtt", children: [] }
  ]);

  const fetchOptions = () => {
    getDeptOptions().then((data: any) => {
      searchOptions[1].children = data;
    });
    getEnumDictList(["AnomalousAttendance"]).then((res) => {
      searchOptions[3].children = res.AnomalousAttendance.map((item) => ({ label: item.optionName, value: item.optionValue }));
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
      { label: "考勤日期", prop: "attDate" },
      { label: "上午上班", prop: "morningWorkTime" },
      { label: "上午下班", prop: "morningDownWorkTime" },
      { label: "下午上班", prop: "afternoonWorkTime" },
      { label: "下午下班", prop: "afternoonDownWorkTime" },
      { label: "晚上上班", prop: "eveningWorkTime" },
      { label: "晚上下班", prop: "eveningDownWorkTime" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    allFetchCols.value = menuCols;
    updateButtonList(
      buttonList,
      buttonArrs[0].filter((el) => ["edit", "export"].includes(el.btnKey))
    );
    columns.value = setColumn({ columnData: columnData.filter((el) => el.label !== "操作"), operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    if (formData.date) {
      const [startDate, endDate] = formData.date.split("~").map((item) => item.trim());
      formData.startDate = startDate;
      formData.endDate = endDate;
    }
    fetchAttendanceDetail(formData).then((res: any) => {
      if (res.data) {
        const result = res.data.records || [];
        originList.value = cloneDeep(result);
        dataList.value = result;
        pagination.total = res.data.total;

        rightTableRef.value.dataList1 = [];
        rightTableRef.value.dataList2 = [];
        rightTableRef.value.dataList3 = [];
        rightTableRef.value.dataList4 = [];
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
    formData.date = val.date;
    formData.abnormalAtt = val.abnormalAtt;
    onSearch();
  };

  const onSave = () => {
    updateAttendancePageDetail(dataList.value).then((res) => {
      if (res.data) {
        message("保存成功", { type: "success" });
        buttonList.value = initButtons;
        onSearch();
      }
    });
    editFlag.value = false;
    getColumnConfig();
  };

  const onExport = () => {
    exportAttendancePageDetail({ ...formData, limit: 1000000 }).then((res: any) => {
      if (res.data) {
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName);
      }
    });
  };

  const onEditAction = () => {
    if (editFlag.value) return;
    columns.value = setColumn({ columnData: allFetchCols.value, operationColumn: false });
    editFlag.value = true;
    buttonList.value = editButtons;
  };

  const onCancelAction = () => {
    if (!editFlag.value) return;
    editFlag.value = false;
    columns.value = setColumn({ columnData: allFetchCols.value.filter((el) => el.label !== "操作"), operationColumn: false });
    dataList.value = cloneDeep(originList.value);
    buttonList.value = initButtons;
  };

  const editButtons = [
    { clickHandler: onSave, type: "warning", text: "保存", isDropDown: false },
    { clickHandler: onCancelAction, type: "danger", text: "取消", isDropDown: false },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ];

  const initButtons = [
    { clickHandler: onEditAction, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ];

  const buttonList = ref(initButtons);

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const rowDbClick = (row) => {};

  const leftRowClick = (row) => {
    currentRow.value = row;
    if (!editFlag.value) {
      const { attDate, staffCode } = row;
      leaveApplyListOnAtt({ attDate, staffCode }).then((res) => {
        if (res.data) {
          rightTableRef.value.dataList1 = res.data;
        }
      });

      overtimeOrderListOnAtt({ attDate, staffCode }).then((res) => {
        if (res.data) {
          rightTableRef.value.dataList2 = res.data;
        }
      });

      fetchGoOutRecordsOnAtt({ attDate, staffCode }).then((res: any) => {
        if (res.data) {
          rightTableRef.value.dataList3 = res.data;
        }
      });

      fetchAttendanceRecord({ page: 1, limit: 30, attDate, staffCode }).then((res: any) => {
        if (res.data) {
          rightTableRef.value.dataList5 = res.data.records;
        }
      });

      supplementaryCardOnAtt({ attDate, staffCode }).then((res: any) => {
        if (res.data) {
          const result = res.data || [];
          const flatArr = result
            .map((item) => {
              item.detailsVOList.forEach((el) => {
                el.applyDate = item.applyDate;
                el.applyDeptId = item.applyDeptId;
                el.applyDeptName = item.applyDeptName;
                el.createDate = item.createDate;
                el.spNo = item.spNo;
                el.spStatus = item.spStatus;
              });
              return item;
            })
            .map((el) => el.detailsVOList)
            .flat(Infinity);
          rightTableRef.value.dataList4 = flatArr;
        }
      });
    }
  };

  const onSetTimeValue = (row, actionKey) => {
    getStaffDetail({ id: row.staffId }).then((res: any) => {
      const workRuleId = res.data?.workRuleId;
      timeSettingList({ page: 1, limit: 10000 }).then((res) => {
        if (res.data && res.data.length) {
          const workTimeInfo = res.data.find((item) => item.id === workRuleId);
          switch (actionKey) {
            case "morningWorkTime":
              row.morningWorkTime = workTimeInfo.forenoonStart;
              break;
            case "morningDownWorkTime":
              row.morningDownWorkTime = workTimeInfo.forenoonEnd;
              break;
            case "afternoonWorkTime":
              row.afternoonWorkTime = workTimeInfo.afternoonStart;
              break;
            case "afternoonDownWorkTime":
              row.afternoonDownWorkTime = workTimeInfo.afternoonEnd;
              break;
            default:
              message("没有对应数据", { type: "warning" });
              break;
          }
          // TODO: 晚上上班和晚上下班待处理
        }
      });
    });
  };

  const rowClassName = ({ row }) => {
    let className = "";
    if (row.id === currentRow.value?.id) {
      className = "current-row";
    }
    return className;
  };

  return {
    columns,
    onFresh,
    rowClassName,
    rightTableRef,
    queryParams,
    handleTagSearch,
    rowDbClick,
    leftRowClick,
    searchOptions,
    buttonList,
    maxHeight,
    loading,
    dataList,
    pagination,
    onSetTimeValue,
    onSizeChange,
    onCurrentChange
  };
};
