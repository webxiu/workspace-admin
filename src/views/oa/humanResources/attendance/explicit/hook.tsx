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
import { Setting, Delete } from "@element-plus/icons-vue";

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
  const editFlag = ref(true);
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

    const morningWorkTimeRender = (data) => {
      return data.row.morningWorkTime ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>{data.row.morningWorkTime}</span>
          {data.row.morningWorkTimeFlag !== 0 && (
            <el-button
              onClick={() => {
                data.row.morningWorkTime = null;
                data.row.morningWorkTimeFlag = 1;
                saveRow(data.row);
              }}
              size="small"
              type="danger"
              icon={<Delete />}
              style={{ width: "10px", height: "20px" }}
            />
          )}
        </div>
      ) : (
        <el-button
          onClick={() => onSetTimeValue(data.row, "morningWorkTime")}
          size="small"
          type="success"
          style={{ width: "10px", height: "20px" }}
          icon={<Setting />}
        />
      );
    };

    const morningDownWorkTimeRender = (data) => {
      return data.row.morningDownWorkTime ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>{data.row.morningDownWorkTime}</span>
          {data.row.morningDownWorkTimeFlag !== 0 && (
            <el-button
              onClick={() => {
                data.row.morningDownWorkTime = null;
                data.row.morningDownWorkTimeFlag = 1;
                saveRow(data.row);
              }}
              size="small"
              type="danger"
              icon={<Delete />}
              style={{ width: "10px", height: "20px" }}
            />
          )}
        </div>
      ) : (
        <el-button
          onClick={() => onSetTimeValue(data.row, "morningDownWorkTime")}
          size="small"
          type="success"
          style={{ width: "10px", height: "20px" }}
          icon={<Setting />}
        />
      );
    };

    const afternoonWorkTimeRender = (data) => {
      return data.row.afternoonWorkTime ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>{data.row.afternoonWorkTime}</span>
          {data.row.afternoonWorkTimeFlag !== 0 && (
            <el-button
              onClick={() => {
                data.row.afternoonWorkTime = null;
                data.row.afternoonWorkTimeFlag = 1;
                saveRow(data.row);
              }}
              size="small"
              type="danger"
              icon={<Delete />}
              style={{ width: "10px", height: "20px" }}
            />
          )}
        </div>
      ) : (
        <el-button
          onClick={() => onSetTimeValue(data.row, "afternoonWorkTime")}
          size="small"
          type="success"
          style={{ width: "10px", height: "20px" }}
          icon={<Setting />}
        />
      );
    };

    const afternoonDownWorkTimeRender = (data) => {
      return data.row.afternoonDownWorkTime ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>{data.row.afternoonDownWorkTime}</span>
          {data.row.afternoonDownWorkTimeFlag !== 0 && (
            <el-button
              onClick={() => {
                data.row.afternoonDownWorkTime = null;
                data.row.afternoonDownWorkTimeFlag = 1;
                saveRow(data.row);
              }}
              size="small"
              type="danger"
              icon={<Delete />}
              style={{ width: "10px", height: "20px" }}
            />
          )}
        </div>
      ) : (
        <el-button
          onClick={() => onSetTimeValue(data.row, "afternoonDownWorkTime")}
          size="small"
          type="success"
          style={{ width: "10px", height: "20px" }}
          icon={<Setting />}
        />
      );
    };

    const eveningWorkTimeRender = (data) => {
      return data.row.eveningWorkTime ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>{data.row.eveningWorkTime}</span>
          {data.row.eveningWorkTimeFlag !== 0 && (
            <el-button
              onClick={() => {
                data.row.eveningWorkTime = null;
                data.row.eveningWorkTimeFlag = 1;
                saveRow(data.row);
              }}
              size="small"
              type="danger"
              icon={<Delete />}
              style={{ width: "10px", height: "20px" }}
            />
          )}
        </div>
      ) : (
        <el-button
          onClick={() => onSetTimeValue(data.row, "eveningWorkTime")}
          size="small"
          type="success"
          style={{ width: "10px", height: "20px" }}
          icon={<Setting />}
        />
      );
    };

    const eveningDownWorkTimeRender = (data) => {
      return data.row.eveningDownWorkTime ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span>{data.row.eveningDownWorkTime}</span>
          {data.row.eveningDownWorkTimeFlag !== 0 && (
            <el-button
              onClick={() => {
                data.row.eveningDownWorkTime = null;
                data.row.eveningDownWorkTimeFlag = 1;
                saveRow(data.row);
              }}
              size="small"
              type="danger"
              icon={<Delete />}
              style={{ width: "10px", height: "20px" }}
            />
          )}
        </div>
      ) : (
        <el-button
          onClick={() => onSetTimeValue(data.row, "eveningDownWorkTime")}
          size="small"
          type="success"
          style={{ width: "10px", height: "20px" }}
          icon={<Setting />}
        />
      );
    };

    const { columnArrs } = await getMenuColumns([
      {
        morningWorkTime: morningWorkTimeRender,
        morningDownWorkTime: morningDownWorkTimeRender,
        afternoonWorkTime: afternoonWorkTimeRender,
        afternoonDownWorkTime: afternoonDownWorkTimeRender
        // TODO: 打卡班次规则中还没有晚上上下班的时间
        // eveningWorkTime: eveningWorkTimeRender,
        // eveningDownWorkTime: eveningDownWorkTimeRender
      }
    ]);
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    allFetchCols.value = menuCols;
    columns.value = setColumn({ columnData: columnData, operationColumn: false });
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

        const newRowData = res.data.records.find((el) => el.id === currentRow.value?.id);

        if (newRowData) currentRow.value = newRowData;

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

  const saveRow = (row) => {
    updateAttendancePageDetail([row]).then((res) => {
      if (res.data) {
        message("保存成功", { type: "success" });
        onSearch();
      }
    });
  };

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
  };

  const setCurLeftRowByKey = (commandKey, data) => {
    if (["eveningWorkTime", "eveningDownWorkTime"].includes(commandKey)) return message("没有相关数据", { type: "warning" });
    if (currentRow.value) {
      currentRow.value[commandKey] = data;
      currentRow.value[`${commandKey}Flag`] = 3;
      saveRow(currentRow.value);
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
              row.morningWorkTimeFlag = 2;
              saveRow(row);
              break;
            case "morningDownWorkTime":
              row.morningDownWorkTime = workTimeInfo.forenoonEnd;
              row.morningDownWorkTimeFlag = 2;
              saveRow(row);
              break;
            case "afternoonWorkTime":
              row.afternoonWorkTime = workTimeInfo.afternoonStart;
              row.afternoonWorkTimeFlag = 2;
              saveRow(row);
              break;
            case "afternoonDownWorkTime":
              row.afternoonDownWorkTime = workTimeInfo.afternoonEnd;
              row.afternoonDownWorkTimeFlag = 2;
              saveRow(row);
              break;
            case "eveningWorkTime":
              // row.eveningWorkTime = workTimeInfo.xxx; // TODO: 还没有晚上上下班的考勤规则
              message("没有对应数据", { type: "warning" });
              // row.eveningWorkTimeFlag = 2;
              // saveRow(row);
              break;
            case "eveningDownWorkTime":
              // row.eveningDownWorkTime = workTimeInfo.xxx;
              message("没有对应数据", { type: "warning" });
              // row.afternoonDownWorkTimeFlag = 2;
              // saveRow(row);
              break;
            default:
              break;
          }
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
    currentRow,
    setCurLeftRowByKey,
    handleTagSearch,
    rowDbClick,
    leftRowClick,
    searchOptions,
    maxHeight,
    loading,
    dataList,
    pagination,
    onSetTimeValue,
    onSizeChange,
    onCurrentChange
  };
};
