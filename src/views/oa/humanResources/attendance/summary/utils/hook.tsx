/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 11:03:33
 */

import { LoadingType } from "@/components/ButtonList/index.vue";
import { dayjs, UploadProps, ElMessage } from "element-plus";
import {
  AttendanceSummaryItemType,
  attendanceSummaryList,
  editAttendanceSummary,
  dispatchAttendanceSummary,
  exportAttendanceDetail,
  uploadAttendanceExcel,
  queryHasRecords,
  deleteAttendanceDetail,
  deleteAttendanceSummary
} from "@/api/oaManage/humanResources";
import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import EditForm from "@/components/EditForm/index.vue";

import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { downloadFile, getFileNameOnUrlPath, onDownload } from "@/utils/common";
import { setColumn, getExportConfig, getMenuColumns, updateButtonList, usePageSelect } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { UploadFilled, Delete, Download, View, SetUp } from "@element-plus/icons-vue";
import { formRules, formConfigs, formRules2, formConfigs2, importFormRules, importFormConfigs } from "./config";
import axios from "axios";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { PAGE_CONFIG } from "@/config/constant";
import { getDeptOptions } from "@/utils/requestApi";

// 状态
const StatusKey = {
  "1": { name: "待分发", color: "#e6a23c" },
  "2": { name: "分发失败", color: "#DC143C" },
  "3": { name: "待签名", color: "#409eff" },
  "4": { name: "异常反馈", color: "#F56C6C" },
  "5": { name: "已签名", color: "#67c23a" },
  "6": { name: "归档", color: "#ecf5ff" }
};

const userTypeNum = {
  clerk: 0,
  staff: 1
};

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<AttendanceSummaryItemType[]>([]);
  const loading = ref<boolean>(false);
  const rowData = ref<AttendanceSummaryItemType>();
  const rowsData = ref<AttendanceSummaryItemType[]>([]);
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 68 + 51);
  const lastMonth = dayjs().add(-1, "month").startOf("month").format("YYYY-MM");
  const tableRef = ref();

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    userCode: "",
    staffName: "",
    deptId: "",
    status: "",
    date: lastMonth,
    employeeType: ""
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "staffName" },
    { label: "工号", value: "userCode" },
    { label: "部门", value: "deptId", children: [] },
    { label: "状态", value: "status", children: [] },
    { label: "考勤年月", value: "date", type: "month", format: "YYYY-MM" },
    {
      label: "雇员种类",
      value: "employeeType",
      children: [
        { label: "职员", value: "0" },
        { label: "员工", value: "1" }
      ]
    }
  ]);

  const queryParams = reactive<QueryParamsType>({ date: lastMonth });

  onMounted(() => {
    getColumnConfig();
    getOptionList();
    getTableList();
  });

  const getOptionList = () => {
    getBOMTableRowSelectOptions({ optioncode: "PayStubsStatus" }).then((res) => {
      if (res.data) {
        const resultData = res.data[0]?.optionList || [];
        const StatusOption = resultData.map((item) => ({ label: item.optionName, value: item.optionValue }));
        searchOptions[3].children = StatusOption;
      }
    });

    getDeptOptions().then((data: any) => {
      searchOptions[2].children = data;
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      {
        label: "状态",
        prop: "status",
        sortable: true,
        cellRenderer: ({ row, column }) => {
          const stateObj = StatusKey[row[column["property"]]];
          return (
            <span class="br-4 color-fff" style={{ background: stateObj?.color, padding: "4px 6px" }}>
              {stateObj?.name}
            </span>
          );
        }
      },
      { label: "人员编码", prop: "userCode" },
      { label: "姓名", prop: "staffName" },
      { label: "性别", prop: "sex" },
      { label: "入职日期", prop: "startDate", sortable: true },
      { label: "部门", prop: "deptName" },
      { label: "生产部组别", prop: "productionGroup" },
      { label: "应出勤(H)", prop: "beOnDuty", align: "right" },
      { label: "实际出勤(H)", prop: "actualAttendance", align: "right" },
      { label: "应出勤(天)", prop: "beAttendanceDay", align: "right" },
      { label: "实际出勤(天)", prop: "actualAttendanceDay", align: "right" },
      { label: "年假(H)", prop: "annualLeaveTerms", align: "right" },
      { label: "迟到时间(M)", prop: "beLateTime", align: "right" },
      { label: "早退时间(M)", prop: "earlyTime", align: "right" },
      { label: "旷工时间(H)", prop: "absenteeismTime", align: "right" },
      { label: "事假(H)", prop: "thingLeaveTime", align: "right" },
      { label: "平时加班时间(H)", prop: "peacetimeOverTime", align: "right", minWidth: 160, sortable: true },
      { label: "休息加班时间(H)", prop: "restOverTime", align: "right", minWidth: 160, sortable: true },
      { label: "特殊加班(H)", prop: "specialOverTime", align: "right", sortable: true },
      { label: "加班汇总(H)", prop: "overTimeSum", align: "right", sortable: true },
      { label: "时间月份信息(年-月)", prop: "yearMonthTime", minWidth: 160 },
      { label: "签名", prop: "signature" },
      { label: "备注", prop: "description" },
      { label: "绩效(H)", prop: "jx", align: "right", sortable: true },
      { label: "综合绩效", prop: "zhjx", align: "right", sortable: true }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: { width: 140 }, selectionColumn: { hide: false }, formData });
  };

  const getTableList = () => {
    loading.value = true;
    attendanceSummaryList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        setSelectCheckbox();
      })
      .catch((err) => (loading.value = false));
  };

  // 搜索
  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };
  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  // 上传过滤
  const onUploadChange: UploadProps["onChange"] = (uploadFile) => {
    const maxSize = 10;
    const rawFile = uploadFile.raw;
    if (!["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"].includes(rawFile.type)) {
      return message("文件必须为xls或xlsx格式!", { type: "warning" });
    }
    if (rawFile.size / 1024 / 1024 > maxSize) {
      return message(`文件大小不能超过${maxSize}MB！`, { type: "warning" });
    }
    const fd = new FormData();
    fd.append("file", rawFile);
    uploadAttendanceExcel(fd)
      .then((res) => {
        console.log("res", res);
        if (res.data) {
          message("导入成功");
        }
      })
      .catch((error) => {
        console.log("导入失败", error);
        message("导入失败", { type: "error" });
      });
  };

  /** 编辑 */
  const onEdit2 = wrapFn(rowData, () => {
    const row = rowData.value;
    onEdit(row);
  });

  /** 编辑 */
  const onEdit = (row: AttendanceSummaryItemType) => {
    const formRef = ref();
    const formData = reactive({
      ...row,
      beOnDuty: row?.beOnDuty ?? "",
      actualAttendance: row?.actualAttendance ?? "",
      beAttendanceDay: row?.beAttendanceDay ?? "",
      actualAttendanceDay: row?.actualAttendanceDay ?? "",
      annualLeaveTerms: row?.annualLeaveTerms ?? "",
      beLateTime: row?.beLateTime ?? "",
      earlyTime: row?.earlyTime ?? "",
      absenteeismTime: row?.absenteeismTime ?? "",
      peacetimeOverTime: row?.peacetimeOverTime ?? "",
      restOverTime: row?.restOverTime ?? "",
      overTimeSum: row?.overTimeSum ?? "",
      specialOverTime: row?.specialOverTime ?? "",
      description: row?.description ?? ""
    });

    addDialog({
      title: "修改考勤明细",
      props: {
        formInline: formData,
        formRules: formRules,
        formProps: { labelWidth: "140px" },
        formConfigs: formConfigs()
      },
      width: "800px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),

      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef?.validate((valid) => {
          if (valid) {
            showMessageBox("确认要提交吗?").then(() => {
              editAttendanceSummary(formData)
                .then((res) => {
                  if (res.data) {
                    done();
                    getTableList();
                    message("修改成功");
                  } else {
                    message("修改失败", { type: "error" });
                  }
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  };

  /** 导出考勤明细表 */
  const onExportAttendance = ({ text }) => {
    const headConfig = getExportConfig("考勤汇总", columns.value, { date: formData.date });
    exportAttendanceDetail(headConfig)
      .then((res) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName, true);
        }
      })
      .catch(console.log);
  };

  /** 考勤明细分发 */
  const onDispatch = () => {
    if (rowsData.value?.length === 0) {
      return message("请勾选考勤数据", { type: "error" });
    }
    const distributeIds = rowsData.value?.map((item) => item.id);
    const staffNames = rowsData.value?.map((item) => item.staffName);
    showMessageBox(`确认要将【${staffNames.join("、")}】这${distributeIds.length}条考勤明细分发吗?`).then(() => {
      dispatchAttendanceSummary({ distributeIds }).then((res) => {
        if (res.data) {
          getTableList();
          message("分发成功");
        } else {
          message("分发失败", { type: "error" });
        }
      });
    });
  };

  /** 查看异常状态 */
  const onPreview = wrapFn(rowData, ({ text }) => {
    const formRef = ref();
    const row = rowData.value;
    const formData = reactive({
      ...row,
      beOnDuty: row?.beOnDuty ?? "",
      actualAttendance: row?.actualAttendance ?? "",
      beAttendanceDay: row?.beAttendanceDay ?? "",
      actualAttendanceDay: row?.actualAttendanceDay ?? "",
      annualLeaveTerms: row?.annualLeaveTerms ?? "",
      beLateTime: row?.beLateTime ?? "",
      earlyTime: row?.earlyTime ?? "",
      absenteeismTime: row?.absenteeismTime ?? "",
      peacetimeOverTime: row?.peacetimeOverTime ?? "",
      restOverTime: row?.restOverTime ?? "",
      overTimeSum: row?.overTimeSum ?? "",
      specialOverTime: row?.specialOverTime ?? "",
      description: row?.description ?? ""
    });

    addDialog({
      title: "异常信息",
      props: {
        formInline: formData,
        formRules: formRules2,
        formProps: { labelWidth: "140px" },
        formConfigs: formConfigs2()
      },
      width: "800px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: false,
      contentRenderer: () => h(EditForm, { ref: formRef, class: "preview-disabled-form" }),
      beforeSure: (done, { options }) => {
        done();
      }
    });
  });

  const onSubmitChange = (data, callback) => {
    // const param = {
    //   userCodeCol: data.userCodeCol,
    //   row: data.row,
    //   moneyCol: data.moneyCol,
    //   yearAndMonth: data.yearAndMonth
    // };
    // const fData = new FormData();
    // fData.append("files", data.file);
    // fData.append("param", JSON.stringify(param));

    // importPerformanceSheet(fData).then((res) => {
    //   if (res.data) {
    //     callback();
    //     ElMessage({ message: "导入成功", type: "success" });
    //   }
    // });
    // return;

    const maxSize = 10;

    console.log(data.file.size / 1024 / 1024, "size");
    if (data.file.size / 1024 / 1024 > maxSize) {
      return message(`文件大小不能超过${maxSize}MB！`, { type: "warning" });
    }
    const fd = new FormData();
    fd.append("file", data.file);
    fd.append("date", data.yearAndMonth);
    fd.append("type", userTypeNum[data.category]);
    uploadAttendanceExcel(fd)
      .then((res) => {
        console.log("res", res);
        if (res.data) {
          message("导入成功");
          callback();
        }
      })
      .catch((error) => {
        console.log("导入失败", error);
        message("导入失败", { type: "error" });
      });
    console.log(data, "submit data");
  };

  // 导入Excel
  const onImportAction = () => {
    const importFormRef = ref();
    const _formData = reactive({
      yearAndMonth: dayjs().add(-1, "month").format("YYYY-MM"),
      category: "clerk",
      file: null
    });
    addDialog({
      title: "考勤导入",
      props: {
        formInline: _formData,
        formRules: importFormRules,
        formConfigs: importFormConfigs(_formData)
      },
      width: "400px",
      draggable: true,
      showResetButton: true,
      resetButtonText: "删除",
      fullscreenIcon: true,
      beforeReset: (done) => {
        const userTypeInfo = { clerk: "职员", staff: "员工" };
        showMessageBox(`确认删除${dayjs(_formData.yearAndMonth).format("YYYY年M月")}${userTypeInfo[_formData.category]}数据吗?`)
          .then(() => {
            deleteAttendanceDetail({ type: userTypeNum[_formData.category], yearMonth: _formData.yearAndMonth }).then((res) => {
              if (res.status === 200) {
                ElMessage({ message: "删除成功", type: "success" });
                done();
                getTableList();
              }
            });
          })
          .catch(() => {});
      },
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: importFormRef }),
      beforeSure: (done, { options }) => {
        const FormRef = importFormRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            const result = await queryHasRecords({ type: userTypeNum[_formData.category], yearMonth: _formData.yearAndMonth });
            if (result.data) {
              showMessageBox(`${dayjs(_formData.yearAndMonth).format("YYYY年M月")}已存在数据，是否要覆盖导入?`)
                .then(() => {
                  onSubmitChange(_formData, () => {
                    done();
                    getTableList();
                  });
                })
                .catch(() => {});
            } else {
              showMessageBox(`确认要导入${dayjs(_formData.yearAndMonth).format("YYYY年M月")}考勤数据吗?`).then(() => {
                onSubmitChange(_formData, () => {
                  done();
                  getTableList();
                });
              });
            }
          }
        });
      }
    });
  };

  // 批量删除
  const onBatchDelete = () => {
    const rows = rowsData.value;
    if (!rows?.length) return message("请选择要删除的内容", { type: "error" });
    showMessageBox("确认要删除所选记录吗?").then(() => onDelete(rows));
  };

  // 删除考勤
  const onDelete = (rows: AttendanceSummaryItemType[]) => {
    const ids = rows.map((item) => item.id);
    deleteAttendanceSummary({ ids })
      .then(({ data }) => {
        if (data) {
          getTableList();
          message("删除成功");
        } else {
          message("删除失败", { type: "error" });
        }
      })
      .catch(console.log);
  };

  /** 查看异常状态 */
  const onExportTemplate = (fileName: string, userType: string) => {
    return axios({
      method: "get",
      responseType: "blob",
      url: `${import.meta.env.VITE_PUBLIC_PATH}template/${fileName}`
    })
      .then(({ data }) => onDownload(data, fileName))
      .catch(() => {});
  };

  function onSelect(rows: AttendanceSummaryItemType[], row: AttendanceSummaryItemType) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows: AttendanceSummaryItemType[]) {
    setSelectAllChange(rows);
  }

  const onRowClick = (row: AttendanceSummaryItemType) => {
    rowData.value = row;
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }
  function onCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const onDownloadClerkTemplate = () => {
    onExportTemplate("职员考勤模板.xlsx", "clerk");
  };

  const onDownloadStaffTemplate = () => {
    onExportTemplate("员工考勤模板.xlsx", "staff");
  };

  // 按钮列表
  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onEdit2, type: "success", text: "修改", isDropDown: false },
    { clickHandler: onBatchDelete, type: "danger", text: "批量删除", icon: Delete, isDropDown: false },
    { clickHandler: onImportAction, type: "primary", text: "导入Excel", icon: UploadFilled, isDropDown: true },
    { clickHandler: onExportAttendance, type: "info", text: "导出考勤", icon: Download, isDropDown: true },
    { clickHandler: onDispatch, type: "primary", text: "考勤分发", icon: SetUp, isDropDown: true },
    { clickHandler: onPreview, type: "danger", text: "查看异常状态", icon: View, isDropDown: true },
    // { clickHandler: onDownloadTemplate, type: "default", text: "下载导入模板", icon: Download, isDropDown: true },
    { clickHandler: onDownloadClerkTemplate, type: "default", text: "下载职员模板", icon: Download, isDropDown: true },
    { clickHandler: onDownloadStaffTemplate, type: "default", text: "下载员工模板", icon: Download, isDropDown: true }
  ]);

  const rowDbClick = (row) => {
    rowData.value = row;
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
    onEdit(row);
  };

  return {
    tableRef,
    loading,
    columns,
    dataList,
    maxHeight,
    loadingStatus,
    buttonList,
    searchOptions,
    queryParams,
    pagination,
    onEdit,
    onDelete,
    onTagSearch,
    onRefresh,
    onSelect,
    onSelectAll,
    onRowClick,
    rowDbClick,
    onSizeChange,
    onCurrentChange
  };
};
