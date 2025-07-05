import { TableColumnType } from "@/components/PrintTable/index.vue";
import { reactive } from "vue";

/** 工资发放表 */
export const salaryConfig = ({ formData, companyName, dateStr }) => {
  // 是否为职员
  const isClerk = formData.userType === "职员";
  // 标题
  const titleCols = reactive<TableColumnType[]>([
    {
      label: `${companyName}（${formData.userType}）${dateStr}份工资发放表`,
      prop: "",
      colspan: 27,
      headStyle: { height: "36px", background: "transparent", border: "none" },
      render: ({ column }) => <div class="flex-center fw-700 lh-36 fz-20">{column.label}</div>
    }
  ]);
  // 表头(合并列)
  const headCols = reactive<TableColumnType[]>([
    { label: "计算工资", prop: "", colspan: isClerk ? 17 : 19 },
    { label: "应发工资", prop: "salary", rowspan: 2, width: 60 },
    { label: "代扣项目", prop: "", colspan: isClerk ? 8 : 6 },
    { label: "实发工资", prop: "realSalary", rowspan: 2 }
  ]);
  // 表头(职员)
  const dataCols1 = reactive<TableColumnType[]>([
    { label: "序号", prop: "index", align: "center", width: 30 },
    { label: "姓名", prop: "staffName", align: "left", width: 45 },
    { label: "部门", prop: "deptName", align: "left", width: 65 },
    { label: "标准出勤", prop: "beOnDuty", width: 46 },
    { label: "实际出勤", prop: "actualAttendance", width: 46 },
    { label: "正班工资", prop: "regularSalary", width: 46 },
    { label: "级别工资", prop: "levelSalary", width: 46 },
    { label: "岗位津贴", prop: "positionSubsidy", width: 46 },
    { label: "大周加班费", prop: "bigWeekOverTime", width: 45 },
    { label: "保密费", prop: "confidentialitySubsidy", width: 40 },
    { label: "工龄津贴", prop: "workAgeSubsidy", width: 46 },
    { label: "伙食补贴", prop: "foodSubsidy", width: 46 },
    { label: "租房补贴", prop: "rentAllowance", width: 46 },
    { label: "提成", prop: "pushMoney", width: 40 },
    { label: "加班费", prop: "overTimeSalary", width: 40 },
    { label: "绩效", prop: "performance", width: 40 },
    { label: "其他", prop: "other", width: 40 },
    { label: "应发工资", prop: "salary", width: 50 }, // 合并行
    { label: "水电费", prop: "waterAndElectricity", width: 40 },
    { label: "养老保险", prop: "oldInsurance", width: 46 },
    { label: "医疗保险", prop: "hospitalInsurance", width: 46 },
    { label: "失业保险", prop: "sybx", width: 46 },
    { label: "住房公积金", prop: "housingProvidentFund", width: 46 },
    { label: "伙食费", prop: "food", width: 40 },
    { label: "已发工资", prop: "paidSalary", width: 46 },
    { label: "个人所得税", prop: "tax", width: 46 },
    { label: "实发工资", prop: "realSalary", width: 50 }
  ]);
  // 表头(员工)
  const dataCols2 = reactive<TableColumnType[]>([
    { label: "序号", prop: "index", align: "center", width: 30 },
    { label: "姓名", prop: "staffName", align: "left", width: 40 },
    { label: "部门", prop: "deptName", align: "left", width: 65 },
    { label: "正班工资", prop: "regularSalary", width: 40 },
    { label: "正班工时", prop: "regularWorking", width: 40 },
    { label: "加班工资/小时", prop: "overTimeSalarytohour", width: 50 },
    { label: "加班工时", prop: "overTimeWorking", width: 40 },
    { label: "加班工资", prop: "overTimeSalary", width: 40 },
    { label: "公休加班工资/小时", prop: "restOverTimeSalarytohour", width: 55 },
    { label: "公休加班工时", prop: "restOverTimeWorking", width: 40 },
    { label: "公休加班工资", prop: "restOverTimeSalary", width: 40 },
    { label: "伙食补贴", prop: "foodSubsidy", width: 40 },
    { label: "岗位津贴", prop: "positionSubsidy", width: 40 },
    { label: "工龄津贴", prop: "workAgeSubsidy", width: 40 },
    { label: "女工补贴", prop: "womanSubsidy", width: 40 },
    { label: "综合绩效", prop: "synthesizePerformance", width: 50 },
    { label: "全勤奖", prop: "allTheWorkSubsidy", width: 40 },
    { label: "绩效", prop: "performance", width: 40 },
    { label: "其他", prop: "other", width: 40 },
    { label: "应发工资", prop: "salary", width: 50 }, // 合并行
    { label: "水电费", prop: "waterAndElectricity", width: 40 },
    { label: "养老保险", prop: "oldInsurance", width: 50 },
    { label: "医疗保险", prop: "hospitalInsurance", width: 50 },
    { label: "失业保险", prop: "sybx", width: 50 },
    { label: "伙食费", prop: "food", width: 40 },
    { label: "个人所得税", prop: "tax", width: 40 },
    { label: "实发工资", prop: "realSalary", width: 52 }
  ]);
  const dataCols = isClerk ? dataCols1 : dataCols2;
  return { titleCols, headCols, dataCols };
};

/** 汇总表 */
export const summaryConfig = ({ companyName, dateStr, summaryTitle }) => {
  // 标题
  const titleCols = reactive<TableColumnType[]>([
    {
      label: `${companyName}${dateStr}工资汇总表（${summaryTitle}）`,
      prop: "",
      colspan: 29,
      headStyle: { height: "36px", background: "transparent", border: "none" },
      render: ({ column }) => <div class="flex-center fw-700 lh-36 fz-20">{column.label}</div>
    }
  ]);
  // 表头(数据列)
  const dataCols = reactive<TableColumnType[]>([
    { label: "序号", prop: "index", align: "center" },
    { label: "部门", prop: "deptName", align: "left" },
    { label: "应发工资", prop: "salary", align: "right" },
    { label: "水电费", prop: "waterAndElectricity", align: "right" },
    { label: "养老保险", prop: "oldInsurance", align: "right" },
    { label: "合作医疗", prop: "hospitalInsurance", align: "right" },
    { label: "失业保险", prop: "sybx", align: "right" },
    { label: "住房公积金", prop: "housingProvidentFund", align: "right" },
    { label: "伙食费", prop: "food", align: "right" },
    { label: "个税", prop: "tax", align: "right" },
    { label: "已发工资", prop: "paidSalary", align: "right" },
    { label: "实发工资", prop: "realSalary", align: "right" },
    { label: "员工类型", prop: "employeeKind", hide: true }
  ]);
  return { titleCols, dataCols };
};
