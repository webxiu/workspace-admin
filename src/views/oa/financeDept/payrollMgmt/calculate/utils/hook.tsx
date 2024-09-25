import {
  calcMoneyCheckList,
  fetchStaffMoneyCheckList,
  importStaffMoneyCheckList,
  updateClerkMoneyCheckList,
  uploadMoneySettingsInfo,
  exportStaffMoneyCheckList
} from "@/api/oaManage/financeDept";
import { downloadDataToExcel, getMenuColumns, setColumn, getExportConfig, updateButtonList } from "@/utils/table";
import { formConfigs, formConfigs1, formRules, formRules1, updateItem } from "./config";
import { h, onMounted, reactive, ref } from "vue";
import { ElMessageBox } from "element-plus";

import EditForm from "@/components/EditForm/index.vue";
import MoneyForm from "../moneyForm.vue";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";
import { PAGE_CONFIG } from "@/config/constant";
import { getDeptTreeData } from "@/api/systemManage";
import { type PaginationProps } from "@pureadmin/table";
import { deleteClassifyTableInfo } from "@/api/plmManage";
import { treeArrayTraverse, getTreeArrItem, getChildIDs, downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { getDeptOptions } from "@/utils/requestApi";

enum UserType {
  employee = "员工",
  clerk = "职员"
}

export const useConfig = () => {
  const treeData = ref([]);
  const dataList = ref([]);
  const currentRow = ref();
  const moneyRef = ref();
  const currentId = ref("");
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 96);
  const yearMonthStr = dayjs(new Date()).add(-1, "month").format("YYYY-MM");
  const tempUserType = ref("");

  const formData = reactive({
    month: +yearMonthStr?.split("-")[1],
    year: +yearMonthStr?.split("-")[0],
    userType: UserType.employee,
    staffName: "",
    staffCode: "",
    deptId: "",
    deptIdList: [],
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "staffName" },
    { label: "工号", value: "staffCode" },
    { label: "日期", value: "date", type: "month", format: "YYYY-MM" },
    {
      label: "核算标准",
      value: "userType",
      children: [
        { label: "员工", value: UserType.employee },
        { label: "职员", value: UserType.clerk }
      ]
    },
    { label: "部门", value: "deptId", children: [] }
  ]);

  const queryParams = reactive<QueryParamsType>({
    date: yearMonthStr,
    userType: { value: "员工", valueLabel: UserType.employee }
  });

  onMounted(() => {
    getOptions();
  });

  const getOptions = () => {
    getDeptOptions().then((data: any) => {
      treeData.value = data;
      searchOptions[4].children = data;
    });
  };

  const getColumnConfig = async () => {
    if (tempUserType.value === formData.userType) return;
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

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    // 判断员工表与职员表列配置
    if (data?.length) {
      columnData = formData.userType === UserType.employee ? data : data2;
      tempUserType.value = formData.userType;
    }
    columns.value = setColumn({ columnData: columnData, operationColumn: false });
  };

  const handleTagSearch = (values) => {
    formData.staffName = values.staffName;
    formData.staffCode = values.staffCode;
    formData.userType = values.userType;
    formData.deptId = values.deptId;
    formData.deptIdList = [];
    formData.year = +values.date?.split("-")[0];
    formData.month = +values.date?.split("-")[1];
    if (values.deptId) {
      const result = getTreeArrItem(treeData.value, "value", values.deptId);
      formData.deptIdList = getChildIDs([result], "value");
    }
    onSearch();
    getColumnConfig();
  };

  const onSearch = (_rowIndex?) => {
    loading.value = true;
    fetchStaffMoneyCheckList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        if (typeof _rowIndex === "number" && _rowIndex >= 0) {
          currentRow.value = dataList.value[_rowIndex];
        } else {
          currentRow.value = undefined;
        }
      })
      .catch((err) => {
        dataList.value = [];
        loading.value = false;
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
      id: ""
    });

    if (row) {
      fetchStaffMoneyCheckList({ ...formData, staffCode: row.staffCode, staffId: row.staffId })
        .then((res: any) => {
          const data = res.data;
          const rowRes = data.records[0] || {};

          Object.keys(_formData).forEach((item) => {
            _formData[item] = rowRes[item];
          });
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
        formProps: { labelWidth: 90 },
        formConfigs: type === "add" ? formConfigs1(addFormData) : formConfigs(formData.userType)
      },
      width: type === "add" ? "600px" : "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const { choose, file, yearAndMonth, ...reset } = addFormData as any;
        updateItem({ [choose]: reset }); // 存储提交过的数据
        const FormRef = formRef.value.getRef();
        FormRef.validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要${type === "add" ? "导入" : title}吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitChange(type, title, type === "add" ? addFormData : _formData, () => {
                done();
                const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value?.id);
                onSearch(_rowIndex);
              });
            });
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
        month: +data.yearAndMonth.split("-")[1]
      };

      delete reqFormData.file;

      const reqParams = new FormData();
      reqParams.append("files", data.file);
      reqParams.append("param", JSON.stringify(reqFormData));

      importStaffMoneyCheckList(reqParams).then((res) => {
        if (res.status === 200) {
          message("导入成功");
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
        startDate: data.startDate
      };
    }

    updateClerkMoneyCheckList(finalData)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  // 导出
  const onExport = async () => {
    if (!dataList.value.length) return message("没有可导出的数据", { type: "warning" });
    const cols = columns.value.filter((item) => !/(序号)/.test(item.label));
    const headConfig = getExportConfig("工资核算明细", cols, formData, true);
    exportStaffMoneyCheckList(headConfig)
      .then((res) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, formData.userType + fileName, true);
        } else {
          message("导出失败", { type: "error" });
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
      message("上传格式不正确，请上传xls或者xlsx格式", { type: "warning" });
      return false;
    } else {
      loading.value = true;
      const formData = new FormData();
      formData.append("files", files[0]);
      uploadMoneySettingsInfo(formData)
        .then((res) => {
          if (res.data) {
            message("导入成功");
          }
        })
        .finally(() => {
          loading.value = false;
          const dom = document.getElementById("imporMoneyCheckInput");
          (dom as any).value = null;
        });
    }
  };

  const onDelete = (row) => {
    ElMessageBox.confirm(`确认要删除编码为【${row.categoryNo}】的分类吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loading.value = true;
        deleteClassifyTableInfo({ id: row.id }).then((res) => {
          if (res.data) {
            message("删除成功");
            onSearch();
          }
        });
      })
      .catch(() => {})
      .finally(() => (loading.value = false));
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
        ElMessageBox.confirm(`确认要核算${year}年${+month}月的工资吗?`, "系统提示", {
          type: "warning",
          draggable: true,
          cancelButtonText: "取消",
          confirmButtonText: "确定",
          dangerouslyUseHTMLString: true
        })
          .then(() => {
            const formBackRef = moneyRef.value?.ruleFormRef;
            formBackRef
              ?.validate()
              .then(() => {
                loading.value = true;
                calcMoneyCheckList(formRuleData)
                  .then((res) => {
                    if (res.data) {
                      message("核算成功");
                      done();
                    }
                  })
                  .finally(() => (loading.value = false));
              })
              .catch(() => {
                console.log("catch");
              });
          })
          .catch(() => {});
      }
    });
  };

  const onBeforeEdit = () => {
    if (!currentRow.value) {
      return message("请选择一条记录", { type: "warning" });
    } else {
      onEdit();
    }
  };

  const rowClick = (row) => {
    currentRow.value = row;
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

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onBeforeEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onCheck, type: "primary", text: "核算工资", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true },
    { clickHandler: onImport, type: "info", text: "导入", isDropDown: true }
  ]);

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    searchOptions,
    queryParams,
    pagination,
    buttonList,
    onSearch,
    onEdit,
    onChangeFileInput,
    handleTagSearch,
    rowDbClick,
    rowClick,
    onRefresh,
    handleSizeChange,
    handleCurrentChange
  };
};
