import { Delete, Setting } from "@element-plus/icons-vue";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import {
  exportAttendancePageDetail,
  fetchAttendanceDetail,
  fetchAttendanceDetailLog,
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
import { getEnumDictList, getMenuColumns, setColumn, updateButtonList, usePageSelect } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { getDeptOptions } from "@/utils/requestApi";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const dataList = ref([]);
  const dataList2 = ref([]);
  const originList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const editFlag = ref(true);
  const allFetchCols = ref([]);
  const rowsData = ref([]);
  const rightTableRef = ref();
  const tableRef = ref();
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

  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

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

    let columnData2: TableColumnList[] = [
      { label: "操作类型", prop: "operationType" },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate" },
      { label: "考勤日期", prop: "attDate" },
      { label: "考勤时间", prop: "attTime" },
      { label: "考勤类型", prop: "attType" },
      { label: "备注", prop: "remark" }
    ];

    const morningWorkTimeRender = (data) => {
      return data.row.morningWorkTimeFlag !== 0 ? (
        <div class="flex">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ marginRight: data.row.morningWorkTime ? "4px" : 0 }}>{data.row.morningWorkTime}</span>
            {(data.row.morningWorkTimeFlag > 1 || data.row.morningWorkTime) && (
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

          <div>
            {data.row.morningWorkTimeFlag === 1 && !data.row.morningWorkTime && (
              <el-button
                onClick={(e) => onSetTimeValueBefore(data.row, "morningWorkTime", e)}
                size="small"
                type="success"
                style={{ width: "10px", height: "20px" }}
                icon={<Setting />}
              />
            )}
          </div>
        </div>
      ) : (
        <span>{data.row.morningWorkTime}</span>
      );
    };

    const morningDownWorkTimeRender = (data) => {
      return data.row.morningDownWorkTimeFlag !== 0 ? (
        <div class="flex">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ marginRight: data.row.morningDownWorkTime ? "4px" : 0 }}>{data.row.morningDownWorkTime}</span>
            {(data.row.morningDownWorkTimeFlag > 1 || data.row.morningDownWorkTime) && (
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

          <div>
            {data.row.morningDownWorkTimeFlag === 1 && !data.row.morningDownWorkTime && (
              <el-button
                onClick={(e) => onSetTimeValueBefore(data.row, "morningDownWorkTime", e)}
                size="small"
                type="success"
                style={{ width: "10px", height: "20px" }}
                icon={<Setting />}
              />
            )}
          </div>
        </div>
      ) : (
        <span>{data.row.morningDownWorkTime}</span>
      );
    };

    const afternoonWorkTimeRender = (data) => {
      return data.row.afternoonWorkTimeFlag !== 0 ? (
        <div class="flex">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ marginRight: data.row.afternoonWorkTime ? "4px" : 0 }}>{data.row.afternoonWorkTime}</span>
            {(data.row.afternoonWorkTimeFlag > 1 || data.row.afternoonWorkTime) && (
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

          <div>
            {data.row.afternoonWorkTimeFlag === 1 && !data.row.afternoonWorkTime && (
              <el-button
                onClick={(e) => onSetTimeValueBefore(data.row, "afternoonWorkTime", e)}
                size="small"
                type="success"
                style={{ width: "10px", height: "20px" }}
                icon={<Setting />}
              />
            )}
          </div>
        </div>
      ) : (
        <span>{data.row.afternoonWorkTime}</span>
      );
    };

    const afternoonDownWorkTimeRender = (data) => {
      return data.row.afternoonDownWorkTimeFlag !== 0 ? (
        <div class="flex">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ marginRight: data.row.afternoonDownWorkTime ? "4px" : 0 }}>{data.row.afternoonDownWorkTime}</span>
            {(data.row.afternoonDownWorkTimeFlag > 1 || data.row.afternoonDownWorkTime) && (
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

          <div>
            {data.row.afternoonDownWorkTimeFlag === 1 && !data.row.afternoonDownWorkTime && (
              <el-button
                onClick={(e) => onSetTimeValueBefore(data.row, "afternoonDownWorkTime", e)}
                size="small"
                type="success"
                style={{ width: "10px", height: "20px" }}
                icon={<Setting />}
              />
            )}
          </div>
        </div>
      ) : (
        <span>{data.row.afternoonDownWorkTime}</span>
      );
    };

    const eveningWorkTimeRender = (data) => {
      return data.row.eveningWorkTimeFlag !== 0 ? (
        <div class="flex">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ marginRight: data.row.eveningWorkTime ? "4px" : 0 }}>{data.row.eveningWorkTime}</span>
            {(data.row.eveningWorkTimeFlag > 1 || data.row.eveningWorkTime) && (
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

          <div>
            {data.row.eveningWorkTimeFlag === 1 && !data.row.eveningWorkTime && (
              <el-button
                onClick={(e) => onSetTimeValueBefore(data.row, "eveningWorkTime", e)}
                size="small"
                type="success"
                style={{ width: "10px", height: "20px" }}
                icon={<Setting />}
              />
            )}
          </div>
        </div>
      ) : (
        <span>{data.row.eveningWorkTime}</span>
      );
    };

    const eveningDownWorkTimeRender = (data) => {
      return data.row.eveningDownWorkTimeFlag !== 0 ? (
        <div class="flex">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ marginRight: data.row.eveningDownWorkTime ? "4px" : 0 }}>{data.row.eveningDownWorkTime}</span>
            {(data.row.eveningDownWorkTimeFlag > 1 || data.row.eveningDownWorkTime) && (
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

          <div>
            {data.row.eveningDownWorkTimeFlag === 1 && !data.row.eveningDownWorkTime && (
              <el-button
                onClick={(e) => onSetTimeValueBefore(data.row, "eveningDownWorkTime", e)}
                size="small"
                type="success"
                style={{ width: "10px", height: "20px" }}
                icon={<Setting />}
              />
            )}
          </div>
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
    const [menuCols, menuCols2] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    if (menuCols2?.length) columnData2 = menuCols2;
    updateButtonList(buttonList, buttonArrs[0]);

    allFetchCols.value = menuCols;
    columns.value = setColumn({ columnData: columnData, operationColumn: false, selectionColumn: { hide: false } });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    fetchAttendanceDetail(formData).then((res: any) => {
      if (res.data) {
        const result = res.data.records || [];
        originList.value = cloneDeep(result);
        dataList.value = result;
        pagination.total = res.data.total;
        setSelectCheckbox();
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

  const saveRow = (row, remarkText?) => {
    console.log("update===");
    updateAttendancePageDetail({ attList: [row], remark: remarkText ?? "" }).then((res) => {
      if (res.data) {
        message.success("保存成功");
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

    const { attDate, staffCode, staffId } = row;
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

    // 获取下表格数据
    fetchAttendanceDetailLog({ attDate, staffId }).then((res: any) => {
      if (res.data) {
        dataList2.value = res.data;
      }
    });
  };

  const setCurLeftRowByKey = (commandKey, data, flagVal, remark) => {
    if (currentRow.value) {
      showMessageBox(`确认设置?`)
        .then(() => {
          onSetTimeValue(currentRow.value, commandKey, "", flagVal);
        })
        .catch(console.log);
    }
  };

  const onSetTimeValueBefore = (row, actionKey, e?) => {
    e?.stopPropagation();

    const _formData = reactive({ remark: "" });
    const formRef = ref();
    addDialog({
      title: `填写备注`,
      props: {
        formInline: _formData,
        formConfigs: [
          {
            label: "备注",
            prop: "remark",
            colProp: { span: 24 },
            render: ({ formModel, row }) => {
              return <el-input type="textarea" autosize={{ minRows: 5 }} v-model={formModel[row.prop]} />;
            }
          }
        ]
      },
      width: "700px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done) => {
        const formIns = formRef.value.getRef();
        formIns?.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认设置?`)
              .then(() => {
                done();
                onSetTimeValue(row, actionKey, _formData.remark);
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSetTimeValue = (row, actionKey, remark, extraFlag?) => {
    const reqParams = { staffId: row.staffId, attDate: row.attDate };
    reqParams[`${actionKey}Flag`] = row[`${actionKey}Flag`];
    getTimeStandardAttendancel(reqParams).then((res) => {
      if (res.data) {
        switch (actionKey) {
          case "morningWorkTime":
            row.morningWorkTime = res.data;
            row.morningWorkTimeFlag = extraFlag || 2;
            saveRow(row, remark);
            break;
          case "morningDownWorkTime":
            row.morningDownWorkTime = res.data;
            row.morningDownWorkTimeFlag = extraFlag || 2;
            saveRow(row, remark);
            break;
          case "afternoonWorkTime":
            row.afternoonWorkTime = res.data;
            row.afternoonWorkTimeFlag = extraFlag || 2;
            saveRow(row, remark);
            break;
          case "afternoonDownWorkTime":
            row.afternoonDownWorkTime = res.data;
            row.afternoonDownWorkTimeFlag = extraFlag || 2;
            saveRow(row, remark);
            break;
          case "eveningWorkTime":
            row.eveningWorkTime = res.data;
            row.eveningWorkTimeFlag = extraFlag || 2;
            saveRow(row, remark);
            break;
          case "eveningDownWorkTime":
            row.eveningDownWorkTime = res.data;
            row.afternoonDownWorkTimeFlag = extraFlag || 2;
            saveRow(row, remark);
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
    if (!dataList.value.length) return message.warning("还没有考勤明细数据");
    const ids = rowsData.value.map((item) => item.id);
    sendMissCardNotice(ids).then((res) => {
      if (res.data) {
        message.success("发送补卡提醒成功");
        onSearch();
      }
    });
  };

  const reCalcAtt = () => {
    const { startDate, endDate } = formData;

    if (!startDate || !endDate) return message.error("日期不能为空");

    if (startDate !== endDate) return message.error("开始日期和结束日期不一致");
    showMessageBox(`确定要重算【${startDate}】的考勤吗?`)
      .then(() => {
        reCalcAttDetail({ attDate: startDate }).then((res) => {
          if (res.data) {
            message.success("重算成功");
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

  function onSelect(rows, row) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows) {
    setSelectAllChange(rows);
  }

  return {
    columns,
    columns2,
    dataList2,
    onFresh,
    rowClassName,
    rightTableRef,
    tableRef,
    onSelect,
    onSelectAll,
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
