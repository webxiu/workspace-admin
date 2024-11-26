import { Delete, Setting } from "@element-plus/icons-vue";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import {
  exportAttendancePageDetail,
  fetchAttendanceDetail,
  fetchAttendanceRecord,
  fetchGoOutRecordsOnAtt,
  getStaffDetail,
  getTimeStandardAttendancel,
  leaveApplyListOnAtt,
  overtimeOrderListOnAtt,
  reCalcAttDetail,
  sendMissCardNotice,
  supplementaryCardOnAtt,
  timeSettingList,
  updateAttendancePageDetail
} from "@/api/oaManage/humanResources";
import { getEnumDictList, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";

import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { getDeptOptions } from "@/utils/requestApi";
import { message, showMessageBox } from "@/utils/message";
import { useEleHeight } from "@/hooks";

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
    { label: "考勤时间", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" },
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
      return data.row.morningWorkTimeFlag !== 0 ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{data.row.morningWorkTime}</span>
            {[2, 3].includes(data.row.morningWorkTimeFlag) && (
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

          {data.row.morningWorkTimeFlag === 1 && (
            <el-button
              onClick={() => onSetTimeValue(data.row, "morningWorkTime")}
              size="small"
              type="success"
              style={{ width: "10px", height: "20px" }}
              icon={<Setting />}
            />
          )}
        </div>
      ) : (
        <span>{data.row.morningWorkTime}</span>
      );
    };

    const morningDownWorkTimeRender = (data) => {
      return data.row.morningDownWorkTimeFlag !== 0 ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{data.row.morningDownWorkTime}</span>
            {[2, 3].includes(data.row.morningDownWorkTimeFlag) && (
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

          {data.row.morningDownWorkTimeFlag === 1 && (
            <el-button
              onClick={() => onSetTimeValue(data.row, "morningDownWorkTime")}
              size="small"
              type="success"
              style={{ width: "10px", height: "20px" }}
              icon={<Setting />}
            />
          )}
        </div>
      ) : (
        <span>{data.row.morningDownWorkTime}</span>
      );
    };

    const afternoonWorkTimeRender = (data) => {
      return data.row.afternoonWorkTimeFlag !== 0 ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{data.row.afternoonWorkTime}</span>
            {[2, 3].includes(data.row.afternoonWorkTimeFlag) && (
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

          {data.row.afternoonWorkTimeFlag === 1 && (
            <el-button
              onClick={() => onSetTimeValue(data.row, "afternoonWorkTime")}
              size="small"
              type="success"
              style={{ width: "10px", height: "20px" }}
              icon={<Setting />}
            />
          )}
        </div>
      ) : (
        <span>{data.row.afternoonWorkTime}</span>
      );
    };

    const afternoonDownWorkTimeRender = (data) => {
      return data.row.afternoonDownWorkTimeFlag !== 0 ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{data.row.afternoonDownWorkTime}</span>
            {[2, 3].includes(data.row.afternoonDownWorkTimeFlag) && (
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

          {data.row.afternoonDownWorkTimeFlag === 1 && (
            <el-button
              onClick={() => onSetTimeValue(data.row, "afternoonDownWorkTime")}
              size="small"
              type="success"
              style={{ width: "10px", height: "20px" }}
              icon={<Setting />}
            />
          )}
        </div>
      ) : (
        <span>{data.row.afternoonDownWorkTime}</span>
      );
    };

    const eveningWorkTimeRender = (data) => {
      return data.row.eveningWorkTimeFlag !== 0 ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{data.row.eveningWorkTime}</span>
            {[2, 3].includes(data.row.eveningWorkTimeFlag) && (
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

          {data.row.eveningWorkTimeFlag === 1 && (
            <el-button
              onClick={() => onSetTimeValue(data.row, "eveningWorkTime")}
              size="small"
              type="success"
              style={{ width: "10px", height: "20px" }}
              icon={<Setting />}
            />
          )}
        </div>
      ) : (
        <span>{data.row.eveningWorkTime}</span>
      );
    };

    const eveningDownWorkTimeRender = (data) => {
      return data.row.eveningDownWorkTimeFlag !== 0 ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span>{data.row.eveningDownWorkTime}</span>
            {[2, 3].includes(data.row.eveningDownWorkTimeFlag) && (
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

          {data.row.eveningDownWorkTimeFlag === 1 && (
            <el-button
              onClick={() => onSetTimeValue(data.row, "eveningDownWorkTime")}
              size="small"
              type="success"
              style={{ width: "10px", height: "20px" }}
              icon={<Setting />}
            />
          )}
        </div>
      ) : (
        <span>{data.row.eveningDownWorkTime}</span>
      );
    };

    const { columnArrs, buttonArrs } = await getMenuColumns([
      {
        morningWorkTime: morningWorkTimeRender,
        morningDownWorkTime: morningDownWorkTimeRender,
        afternoonWorkTime: afternoonWorkTimeRender,
        afternoonDownWorkTime: afternoonDownWorkTimeRender,
        eveningWorkTime: eveningWorkTimeRender,
        eveningDownWorkTime: eveningDownWorkTimeRender
      }
    ]);
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);

    allFetchCols.value = menuCols;
    columns.value = setColumn({ columnData: columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
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

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  const saveRow = (row) => {
    console.log("update===");
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
    if (currentRow.value) {
      currentRow.value[commandKey] = data;
      currentRow.value[`${commandKey}Flag`] = 3;
      saveRow(currentRow.value);
    }
  };

  const onSetTimeValue = (row, actionKey) => {
    const reqParams = { staffId: row.staffId, attDate: row.attDate };
    reqParams[`${actionKey}Flag`] = row[`${actionKey}Flag`];

    getTimeStandardAttendancel(reqParams).then((res) => {
      if (res.data) {
        switch (actionKey) {
          case "morningWorkTime":
            row.morningWorkTime = res.data;
            row.morningWorkTimeFlag = 2;
            saveRow(row);
            break;
          case "morningDownWorkTime":
            row.morningDownWorkTime = res.data;
            row.morningDownWorkTimeFlag = 2;
            saveRow(row);
            break;
          case "afternoonWorkTime":
            row.afternoonWorkTime = res.data;
            row.afternoonWorkTimeFlag = 2;
            saveRow(row);
            break;
          case "afternoonDownWorkTime":
            row.afternoonDownWorkTime = res.data;
            row.afternoonDownWorkTimeFlag = 2;
            saveRow(row);
            break;
          case "eveningWorkTime":
            row.eveningWorkTime = res.data;
            row.eveningWorkTimeFlag = 2;
            saveRow(row);
            break;
          case "eveningDownWorkTime":
            row.eveningDownWorkTime = res.data;
            row.afternoonDownWorkTimeFlag = 2;
            saveRow(row);
            break;
          default:
            break;
        }
      }
    });
  };

  const rowClassName = ({ row }) => {
    let className = "";
    if (row.id === currentRow.value?.id) {
      className = "current-row";
    }
    return className;
  };

  const onExport = () => {
    exportAttendancePageDetail({ ...formData, limit: 100000 }).then((res: any) => {
      if (res.data) {
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName);
      }
    });
  };

  const onSendNotice = () => {
    if (!dataList.value.length) return message("还没有考勤明细数据", { type: "warning" });
    sendMissCardNotice({ attDate: dataList.value[0].attDate }).then((res) => {
      if (res.data) {
        message("发送补卡提醒成功", { type: "success" });
        onSearch();
      }
    });
  };

  const reCalcAtt = () => {
    const { startDate, endDate } = formData;

    if (!startDate || !endDate) return message("日期不能为空", { type: "error" });

    if (startDate !== endDate) return message("开始日期和结束日期不一致", { type: "error" });
    showMessageBox(`确定要重算【${startDate}】的考勤吗?`)
      .then(() => {
        reCalcAttDetail({ attDate: startDate }).then((res) => {
          if (res.data) {
            message("重算成功", { type: "success" });
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const buttonList = ref([
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true },
    { clickHandler: onSendNotice, type: "info", text: "补卡提醒", isDropDown: true },
    { clickHandler: reCalcAtt, type: "info", text: "重算考勤", isDropDown: true }
  ]);

  return {
    columns,
    onFresh,
    rowClassName,
    rightTableRef,
    queryParams,
    currentRow,
    setCurLeftRowByKey,
    handleTagSearch,
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
