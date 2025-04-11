import {
  calcMoneyCheckList,
  importStaffMoneyCheckList,
  updateClerkMoneyCheckList,
  uploadMoneySettingsInfo,
  exportStaffMoneyCheckList,
  fetchMainStaffMoneyCheckList,
  fetchDetailStaffMoneyCheckList,
  makeCopyStaffMoneyCheckList,
  queryDetailStaffMoneyCheckList
} from "@/api/oaManage/financeDept";
import { getMenuColumns, setColumn, getExportConfig, updateButtonList, getEnumDictList, getChildDeptIds } from "@/utils/table";
import { formConfigs, formConfigs1, formRules, formRules1, updateItem } from "./config";
import { h, nextTick, onMounted, reactive, ref } from "vue";
import NodeDetailList from "@/components/NodeDetailList/index.vue";

import EditForm from "@/components/EditForm/index.vue";
import MoneyForm from "../moneyForm.vue";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import dayjs from "dayjs";
import { message, showMessageBox } from "@/utils/message";
import { useEleHeight } from "@/hooks";
import { PAGE_CONFIG } from "@/config/constant";
import { type PaginationProps } from "@pureadmin/table";
import { deleteClassifyTableInfo } from "@/api/plmManage";
import { downloadFile, getFileNameOnUrlPath, commonBackLogic } from "@/utils/common";
import { getDeptOptions } from "@/utils/requestApi";
import { AuditState } from "@/views/humanResources/leaveApply/utils/hook";
import { commonRevoke, commonSubmit } from "@/api/systemManage";

enum UserType {
  employee = "员工",
  clerk = "职员"
}

export const useConfig = () => {
  const treeData = ref([]);
  const dataList = ref([]);
  const dataList3 = ref([]);
  const currentRow = ref();
  const mainTableRef = ref();
  const currentLeftRow = ref();
  const moneyRef = ref();
  const currentId = ref("");
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const columns3 = ref<TableColumnList[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const pagination3 = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 96);
  const maxHeight2 = useEleHeight(".app-main > .el-scrollbar", 151);
  const yearMonthStr = dayjs(new Date()).add(-1, "month").format("YYYY-MM");
  const tempUserType = ref("");
  const activeName = ref(UserType.clerk);

  const formData = reactive({
    month: +yearMonthStr?.split("-")[1],
    year: +yearMonthStr?.split("-")[0],
    userType: activeName.value,
    staffName: "",
    yearMonth: yearMonthStr,
    staffCode: "",
    deptId: "",
    deptIdList: [],
    staffState: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const formData3 = reactive({
    month: +yearMonthStr?.split("-")[1],
    year: +yearMonthStr?.split("-")[0],
    yearMonth: yearMonthStr,
    billState: "",
    billNo: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions3 = reactive<SearchOptionType[]>([
    { label: "状态", value: "billState", children: [] },
    { label: "年月", value: "yearMonth", type: "month", format: "YYYY-MM" }
  ]);

  const searchOptions = reactive<SearchOptionType[]>([
    // { label: "姓名", value: "staffName" },
    { label: "工号", value: "staffCode" },
    // { label: "日期", value: "yearMonth", type: "month", format: "YYYY-MM" },
    // {
    //   label: "核算标准",
    //   value: "userType",
    //   children: [
    //     { label: "员工", value: UserType.employee },
    //     { label: "职员", value: UserType.clerk }
    //   ]
    // },
    { label: "部门", value: "deptId", children: [] },
    { label: "状态", value: "staffState", children: [] }
  ]);

  const queryParams = reactive<QueryParamsType>({
    yearMonth: yearMonthStr
  });

  const queryParams3 = reactive<QueryParamsType>({
    yearMonth: yearMonthStr
  });

  onMounted(() => {
    getOptions();
    getColumnConfig();
    onSearch3();
  });

  const getOptions = () => {
    getDeptOptions().then((data: any) => {
      treeData.value = data;
      searchOptions[1].children = data;
    });

    getEnumDictList(["BillStatus", "EmployeeStatus"]).then(({ BillStatus, EmployeeStatus }) => {
      searchOptions3[0].children = BillStatus;
      // 在职状态
      searchOptions[2].children = EmployeeStatus.map((item) => {
        return { ...item, label: item.optionName, value: item.optionValue };
      });
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "姓名", prop: "staffName" },
      { label: "身份证号", prop: "idCard", minWidth: 220 },
      { label: "工号", prop: "staffCode" },
      { label: "部门", prop: "deptName" },
      { label: "应出勤(H)", prop: "beOnDuty", align: "right" },
      { label: "实际出勤(H)", prop: "actualAttendance", align: "right" },
      { label: "应出勤(天)", prop: "beAttendanceDay", align: "right" },
      { label: "实际出勤(天)", prop: "actualAttendanceDay", align: "right" },
      { label: "入职日期", prop: "startDate" },
      { label: "正班工资", prop: "regularSalary" },
      { label: "正班工时", prop: "regularWorking" },
      { label: "加班工资/小时", prop: "overTimeSalarytohour" },
      { label: "加班工时", prop: "overTimeWorking" },
      { label: "加班工资", prop: "overTimeSalary" },
      { label: "公休加班工资/小时", prop: "restOverTimeSalarytohour", width: 180 },
      { label: "公休加班工时", prop: "restOverTimeWorking" },
      { label: "公休加班工资", prop: "restOverTimeSalary" },
      { label: "伙食补贴", prop: "foodSubsidy" },
      { label: "岗位津贴", prop: "positionSubsidy" },
      { label: "工龄津贴", prop: "workAgeSubsidy" },
      { label: "女工补贴", prop: "womanSubsidy" },
      { label: "综合绩效", prop: "synthesizePerformance" },
      { label: "全勤奖", prop: "allTheWorkSubsidy" },
      { label: "绩效", prop: "performance" },
      { label: "其他", prop: "other" },
      { label: "应发工资", prop: "salary" },
      { label: "水电费", prop: "waterAndElectricity" },
      { label: "养老保险", prop: "oldInsurance" },
      { label: "合作医疗", prop: "hospitalInsurance" },
      { label: "伙食费", prop: "food" },
      { label: "代缴个人所得税", prop: "tax", width: 180 },
      { label: "实发工资", prop: "endSalary" },
      { label: "级别工资", prop: "levelSalary" },
      { label: "保密费", prop: "confidentialitySubsidy" },
      { label: "提成", prop: "pushMoney" },
      { label: "失业保险", prop: "sybx" }
    ];

    let columnData3: TableColumnList[] = [];
    let columnData2: TableColumnList[] = [];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data, data2, data3] = columnArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    // 判断员工表与职员表列配置
    if (data?.length) {
      columnData = data;
    }
    if (data2?.length) {
      columnData2 = data2;
    }
    if (data3?.length) {
      columnData3 = data3;
    }
    columns.value = setColumn({ columnData: columnData, operationColumn: false });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: false });
    columns3.value = setColumn({ columnData: columnData3, operationColumn: false });
  };

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
    formData.year = +values.yearMonth?.split("-")[0];
    formData.month = +values.yearMonth?.split("-")[1];
    formData.deptIdList = getChildDeptIds(treeData.value, values.deptId);
    onSearch();
  };

  const handleTagSearch3 = (values) => {
    Object.assign(formData3, values);
    formData3.year = +values.yearMonth?.split("-")[0];
    formData3.month = +values.yearMonth?.split("-")[1];
    onSearch3();
  };

  const onSearch = (_rowIndex?) => {
    fetchDetailStaffMoneyCheckList(formData)
      .then((res: any) => {
        const data = res.data;
        if (data) {
          dataList.value = data.records || [];
          pagination.total = data.total;
        }

        if (typeof _rowIndex === "number" && _rowIndex >= 0) {
          currentRow.value = dataList.value[_rowIndex];
        } else {
          currentRow.value = undefined;
        }
      })
      .catch(() => {
        dataList.value = [];
        pagination.total = 0;
      });
  };

  const onSearch3 = (_rowIndex?) => {
    fetchMainStaffMoneyCheckList(formData3)
      .then((res: any) => {
        const data = res.data;
        if (data) {
          dataList3.value = data.records || [];
          pagination3.total = data.total;

          nextTick(() => {
            const tableRef = mainTableRef.value?.getTableRef();
            tableRef.setCurrentRow(dataList3.value[0]);
            rowLeftClick(dataList3.value[0]);
            currentLeftRow.value = dataList3.value[0];
          });

          // if (mainTableRef.value) {
          //   if (typeof _rowIndex === "number" && _rowIndex >= 0) {
          //     mainTableRef.value.getTableRef()?.setCurrentRow(dataList3.value[_rowIndex]);
          //     currentLeftRow.value = dataList3.value[_rowIndex] || {};
          //   } else {
          //     mainTableRef.value.getTableRef()?.setCurrentRow(dataList3.value[0]);
          //     currentLeftRow.value = dataList3.value[0];
          //   }
          // }
        }
      })
      .catch(() => {
        dataList3.value = [];
        pagination3.total = 0;
      });
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = () => {
    const row = currentRow.value;
    currentId.value = row.staffCode;
    openDialog("edit", row);
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "选择导入类型", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const formLoading = ref(true);

    const _formData = reactive({
      workAgeSubsidy: "",
      other: "",
      pushMoney: "",
      staffName: "",
      idCard: "",
      staffCode: "",
      deptName: "",
      regularSalary: "",
      regularWorking: "",
      overTimeSalarytohour: "",
      overTimeWorking: "",
      overTimeSalary: "",
      restOverTimeSalarytohour: "",
      restOverTimeWorking: "",
      restOverTimeSalary: "",
      foodSubsidy: "",
      positionSubsidy: "",
      womanSubsidy: "",
      synthesizePerformance: "",
      allTheWorkSubsidy: "",
      performance: "",
      salary: "",
      waterAndElectricity: "",
      oldInsurance: "",
      hospitalInsurance: "",
      food: "",
      tax: "",
      endSalary: "",
      levelSalary: "",
      confidentialitySubsidy: "",
      sybx: "",
      startDate: "",
      // 合并接口后新增的部分(24.3.5)
      actualpayrollresultId: "",
      rentAllowance: "",
      housingProvidentFund: "",
      realSalary: "",
      userCode: "",
      beOnDuty: "",
      actualAttendance: "",
      beAttendanceDay: "",
      actualAttendanceDay: "",
      id: "",
      paidSalary: ""
    });

    if (row) {
      queryDetailStaffMoneyCheckList({ id: row.id })
        .then((res: any) => {
          if (res.data) {
            const rowRes = res.data || {};

            Object.keys(_formData).forEach((item) => {
              _formData[item] = rowRes[item];
            });
          }
        })
        .finally(() => (formLoading.value = false));
    } else {
      formLoading.value = false;
    }

    const addFormData = reactive({
      row: "",
      yearAndMonth: dayjs(new Date()).add(-1, "month").format("YYYY-MM"),
      choose: "",
      cardCol: "",
      moneyCol: "",
      oldInsuranceCol: "",
      hospitalInsuranceCol: "",
      sybxCol: ""
    });

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: type === "add" ? addFormData : _formData,
        formRules: type === "add" ? formRules1 : formRules,
        formProps: { size: "small" },
        formConfigs: type === "add" ? formConfigs1(addFormData) : formConfigs(formData.userType)
      },
      width: type === "add" ? "600px" : "900px",
      draggable: true,
      class: "money-calc-modal",
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const { choose, file, yearAndMonth, ...reset } = addFormData as any;
        updateItem({ [choose]: reset }); // 存储提交过的数据
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${type === "add" ? "导入" : title}吗?`)
              .then(() => {
                onSubmitChange(type, title, type === "add" ? addFormData : _formData, () => {
                  done();
                  const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value?.id);
                  onSearch(_rowIndex);
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    if (type === "add") {
      const reqFormData = {
        ...data,
        year: +data.yearAndMonth.split("-")[0],
        month: +data.yearAndMonth.split("-")[1],
        yearAndMonth: undefined,
        yearMonth: data.yearAndMonth
      };

      delete reqFormData.file;

      const reqParams = new FormData();
      reqParams.append("files", data.file);
      reqParams.append("param", JSON.stringify(reqFormData));

      importStaffMoneyCheckList(reqParams).then((res) => {
        if (res.status === 200) {
          message.success("导入成功");
          callback();
        }
      });

      return;
    }

    let finalData = {};

    if (type === "edit") {
      const maps = { 员工: "1", 职员: "0" };
      data.staffCode = currentId.value;
      data.id = currentRow.value?.id;
      finalData = {
        workAgeSubsidy: data.workAgeSubsidy,
        other: data.other,
        pushMoney: data.pushMoney,
        staffCode: data.staffCode,
        userType: maps[formData.userType],
        staffId: currentRow.value.staffId,
        id: data.id,
        startDate: data.startDate,
        paidSalary: isNaN(+data.paidSalary) ? 0 : +data.paidSalary,
        actualpayrollresultId: data.actualpayrollresultId
      };
    }
    updateClerkMoneyCheckList(finalData)
      .then((res) => {
        if (res.data) {
          callback();
          message.success(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  // 导出
  const onExport = async () => {
    if (!currentLeftRow.value) return message.warning("请选择要导出的单据");
    const cols = columns.value.filter((item) => !/(序号)/.test(item.label));
    const headConfig = getExportConfig("工资核算明细", cols, formData, true);
    exportStaffMoneyCheckList(headConfig)
      .then((res) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, formData.userType + fileName, true);
        } else {
          message.error("导出失败");
        }
      })
      .catch(console.log);
  };

  const onImport = () => {
    onAdd();
  };

  // 上传导入
  const onChangeFileInput = (e) => {
    const files = e.target.files;
    if (files.length <= 0) {
      return false;
    } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
      message.warning("上传格式不正确，请上传xls或者xlsx格式");
      return false;
    } else {
      const formData = new FormData();
      formData.append("files", files[0]);
      uploadMoneySettingsInfo(formData)
        .then((res) => {
          if (res.data) {
            message.success("导入成功");
          }
        })
        .finally(() => {
          const dom = document.getElementById("imporMoneyCheckInput");
          (dom as any).value = null;
        });
    }
  };

  const onDelete = (row) => {
    showMessageBox(`确认要删除编码为【${row.categoryNo}】的分类吗?`)
      .then(() => {
        deleteClassifyTableInfo({ id: row.id }).then((res) => {
          if (res.data) {
            message.success("删除成功");
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const onCheck = () => {
    let formPropData = {};
    const setFormData = (v) => (formPropData = v);
    addDialog({
      title: "核算工资",
      width: "330px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(MoneyForm, { ref: moneyRef }),
      beforeSure: (done, { options }) => {
        const formRuleData = moneyRef.value?.ruleForm;
        const [year = "", month = ""] = formRuleData.yearAndMonth.split("-");
        showMessageBox(`确认要核算${year}年${+month}月的工资吗?`)
          .then(() => {
            const formBackRef = moneyRef.value?.ruleFormRef;
            formBackRef
              ?.validate()
              .then(() => {
                calcMoneyCheckList(formRuleData).then((res) => {
                  if (res.data) {
                    message.success("核算成功");
                    done();
                  }
                });
              })
              .catch(() => {
                console.log("catch");
              });
          })
          .catch(console.log);
      }
    });
  };

  const onBeforeEdit = () => {
    if (!currentRow.value) {
      return message.warning("请选择一条记录");
    } else {
      onEdit();
    }
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const rowLeftClick = (row) => {
    currentLeftRow.value = row;
    formData["actualpayrollresultId"] = row?.actualpayrollresultId;
    console.log("left", row);
    onSearch();
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit();
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

  // 分页相关
  function handleSizeChange3(val: number) {
    formData3.limit = val;
    onSearch();
  }

  function handleCurrentChange3(val: number) {
    formData3.page = val;
    onSearch();
  }

  const onSubmitAct = () => {
    if (!currentLeftRow.value) {
      return message.warning("请选择单据");
    }
    if (![AuditState.submit, AuditState.reAudit].includes(+currentLeftRow.value.stateValue)) {
      return message.error("只能提交【待提交/重新审核】的记录");
    }

    showMessageBox(`确认提交单据吗?`).then(() => {
      // TODO: 绩效流程id
      commonSubmit({ billId: "10076", billNo: currentLeftRow.value.billNo })
        .then((res) => {
          if (!res.data) return message.error("提交失败");
          message.success("提交成功");
          const _rowIndex = dataList3.value.findIndex((item) => item.billNo === currentLeftRow.value?.billNo);
          onSearch3(_rowIndex);
        })
        .catch(console.log);
    });
  };
  const onRevokeAct = () => {
    if (!currentLeftRow.value) {
      return message.warning("请选择单据");
    }
    if (![AuditState.auditing].includes(+currentLeftRow.value.stateValue)) {
      return message.error("只能撤销【审核中】的记录");
    }

    showMessageBox(`确认撤销单据吗?`).then(() => {
      commonRevoke({ billNo: currentLeftRow.value.billNo })
        .then((res) => {
          if (!res.data) return message.error("撤销失败");
          message.success("撤销成功");
          const _rowIndex = dataList3.value.findIndex((item) => item.billNo === currentLeftRow.value?.billNo);
          onSearch3(_rowIndex);
        })
        .catch(console.log);
    });
  };
  const onBackAct = () => {
    if (!currentLeftRow.value) {
      return message.warning("请选择单据");
    }
    if (![AuditState.auditing, AuditState.audited].includes(+currentLeftRow.value.stateValue)) {
      return message.error("当前状态不能进行回退");
    }
    commonBackLogic(currentLeftRow.value.billNo, () => {
      const _rowIndex = dataList3.value.findIndex((item) => item.billNo === currentLeftRow.value?.billNo);
      onSearch3(_rowIndex);
    });
  };
  const onViewNodeDetail = () => {
    if (!currentLeftRow.value) {
      return message.warning("请选择单据");
    }
    addDialog({
      title: "查看审批详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: currentLeftRow.value.billNo, billType: "salaryCalc", billState: currentLeftRow.value.stateValue })
    });
  };

  const onMakeCopy = () => {
    if (!currentLeftRow.value) return message.warning("请选择一条单据");
    showMessageBox(`确认要抄送单据【${currentLeftRow.value.billNo}】吗?`)
      .then(() => {
        makeCopyStaffMoneyCheckList({ billNo: currentLeftRow.value.billNo }).then((res) => {
          if (res.data) {
            message.success("抄送成功");
            const _rowIndex = dataList3.value.findIndex((item) => item.billNo === currentLeftRow.value?.billNo);
            onSearch3(_rowIndex);
          }
        });
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onBeforeEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onCheck, type: "primary", text: "核算工资", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true },
    { clickHandler: onImport, type: "info", text: "导入", isDropDown: true },
    { clickHandler: onMakeCopy, type: "info", text: "抄送", isDropDown: true },
    { clickHandler: onSubmitAct, type: "info", text: "提交", isDropDown: true },
    { clickHandler: onRevokeAct, type: "info", text: "撤销", isDropDown: true },
    { clickHandler: onBackAct, type: "info", text: "回退", isDropDown: true },
    { clickHandler: onViewNodeDetail, type: "info", text: "审批详情", isDropDown: true }
  ]);

  const onRefresh3 = () => {
    getColumnConfig();
    onSearch();
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleClickTag = ({ paneName }) => {
    formData.userType = paneName;
    onSearch();
  };

  return {
    rowLeftClick,
    columns,
    dataList,
    dataList3,
    columns3,
    maxHeight,
    searchOptions,
    searchOptions3,
    queryParams,
    queryParams3,
    pagination,
    columns2,
    mainTableRef,
    pagination3,
    buttonList,
    onSearch,
    onEdit,
    onChangeFileInput,
    handleTagSearch,
    handleTagSearch3,
    rowDbClick,
    activeName,
    maxHeight2,
    handleClickTag,
    rowClick,
    onRefresh,
    onRefresh3,
    handleSizeChange,
    handleSizeChange3,
    handleCurrentChange,
    handleCurrentChange3
  };
};
