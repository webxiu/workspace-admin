import { reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import ImportUpload from "./importUpload.vue";
import { useLocalStorage } from "@/utils/storage";

const { getItem, updateItem } = useLocalStorage("payroll-calculate");

const formRules1 = reactive<FormRules>({
  row: [
    { required: true, message: "数据起始行必填", trigger: "change" },
    { pattern: /^[1-9][0-9]*$/, message: "行号为数字类型" }
  ],
  cardCol: [
    { required: true, message: "身份证列必填", trigger: "change" },
    { pattern: /^[A-Z]+$/, message: "列为26个英文大写字母的组合" }
  ],
  userCodeCol: [
    { required: true, message: "工号列必填", trigger: "change" },
    { pattern: /^[A-Z]+$/, message: "列为26个英文大写字母的组合" }
  ],
  moneyCol: [{ pattern: /^[A-Z]+$/, message: "列为26个英文大写字母的组合" }],
  yearAndMonth: [{ required: true, message: "年月必填", trigger: "change" }],
  sybxCol: [{ required: true, message: "失业保险必填", trigger: "change" }],
  choose: [{ required: true, message: "导入类型必填", trigger: "change" }],
  file: [{ required: true, message: "未选择任何文件", trigger: "change" }]
});

const formRules = reactive<FormRules>({});

export const importType = {
  个税: { row: "2", cardCol: "D", moneyCol: "AQ", oldInsuranceCol: "0", hospitalInsuranceCol: "0", sybxCol: "0" },
  已发工资: { row: "2", moneyCol: "C", userCodeCol: "A", cardCol: "0", oldInsuranceCol: "0", hospitalInsuranceCol: "0", sybxCol: "0" }
};

const formConfigs1 = (addFormData) => {
  let moneyReadonly = false,
    oldReadonly = false,
    hospReadonly = false;
  let withNotWorkReadonly = false;
  const confArr = ref<FormConfigItemType[]>([]);

  const formConfs = (chooseType): FormConfigItemType[] => {
    return [
      {
        label: "年月",
        labelWidth: 100,
        prop: "yearAndMonth",
        render: ({ formModel, row }) => {
          return <el-date-picker style={{ width: "100%" }} valueFormat="YYYY-MM" v-model={formModel[row.prop]} type="month" placeholder="选择年月" />;
        }
      },
      {
        label: "导入类型",
        labelWidth: 100,
        prop: "choose",
        render: ({ formModel, row }) => {
          return (
            <el-select onChange={changeSelectValue} style={{ width: "100%" }} v-model={formModel[row.prop]} placeholder="请选择导入类型">
              <el-option label="个税" value="个税" />
              <el-option label="已发工资" value="已发工资" />
            </el-select>
          );
        }
      },
      {
        label: "数据起始行",
        labelWidth: 100,
        prop: "row",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} placeholder="请输入数据起始行" />;
        }
      },
      {
        label: "身份证列",
        hide: ["已发工资"].includes(chooseType),
        labelWidth: 100,
        prop: "cardCol",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} placeholder="请输入身份证列" />;
        }
      },
      {
        label: "工号列",
        hide: !["已发工资"].includes(chooseType),
        labelWidth: 100,
        prop: "userCodeCol",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} placeholder="请输入工号列" />;
        }
      },
      {
        label: "金额列",
        labelWidth: 100,
        prop: "moneyCol",
        hide: chooseType && !["个税", "已发工资"].includes(chooseType),
        render: ({ formModel, row }) => {
          return <el-input readonly={moneyReadonly} v-model={formModel[row.prop]} placeholder="请输入金额列" />;
        }
      },
      {
        label: "养老保险列",
        labelWidth: 100,
        prop: "oldInsuranceCol",
        hide: chooseType,
        render: ({ formModel, row }) => {
          return <el-input readonly={oldReadonly} v-model={formModel[row.prop]} placeholder="请输入养老保险列" />;
        }
      },
      {
        label: "医疗保险列",
        labelWidth: 100,
        prop: "hospitalInsuranceCol",
        hide: chooseType && !["社保"].includes(chooseType),
        render: ({ formModel, row }) => {
          return <el-input readonly={hospReadonly} v-model={formModel[row.prop]} placeholder="请输入医疗保险列" />;
        }
      },
      {
        label: "失业保险列",
        labelWidth: 100,
        prop: "sybxCol",
        hide: chooseType && !["社保"].includes(chooseType),
        render: ({ formModel, row }) => {
          return <el-input readonly={withNotWorkReadonly} v-model={formModel[row.prop]} placeholder="请输入失业保险列" />;
        }
      },
      {
        label: "文件",
        labelWidth: 100,
        prop: "file",
        slot: { label: ({ label }) => <span class="fw-700">{label}</span> },
        render: ({ formModel, row }) => {
          return <ImportUpload v-model={formModel[row.prop]} style={{ width: "100%" }} />;
        }
      }
    ];
  };
  const changeSelectValue = (val) => {
    if (val) {
      const dataItem = getItem(); // 获取输入存储数据
      const confCol = dataItem[val] || importType[val];
      // 填充表单数据
      Object.keys(confCol).forEach((key) => {
        addFormData[key] = confCol[key];
      });
    }

    if (val === "个税") {
      moneyReadonly = false;
      oldReadonly = true;
      hospReadonly = true;
      withNotWorkReadonly = true;
    }

    if (val === "已发工资") {
      addFormData.cardCol = "0";
      addFormData.oldInsuranceCol = "0";
      addFormData.hospitalInsuranceCol = "0";
      addFormData.sybxCol = "0";
    }

    confArr.value = formConfs(val);
  };
  changeSelectValue("");
  return confArr;
};

const formConfigs = (userType): FormConfigItemType[] =>
  [
    {
      label: "姓名",
      prop: "staffName",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "身份证号",
      prop: "idCard",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "工号",
      prop: "staffCode",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "部门",
      prop: "deptName",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "入职日期",
      prop: "startDate",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "正班工资",
      prop: "regularSalary",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "正班工时",
      prop: "regularWorking",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "加班工资/H",
      prop: "overTimeSalarytohour",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "加班工时",
      prop: "overTimeWorking",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "加班工资",
      prop: "overTimeSalary",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "公休加班工资/H",
      prop: "restOverTimeSalarytohour",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "公休加班工时",
      prop: "restOverTimeWorking",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "公休加班工资",
      prop: "restOverTimeSalary",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "伙食补贴",
      prop: "foodSubsidy",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "岗位津贴",
      prop: "positionSubsidy",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "女工补贴",
      prop: "womanSubsidy",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "综合绩效",
      prop: "synthesizePerformance",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "全勤奖",
      prop: "allTheWorkSubsidy",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "绩效",
      prop: "performance",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "级别工资",
      prop: "levelSalary",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "保密费",
      prop: "confidentialitySubsidy",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "失业保险",
      prop: "sybx",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "应发工资",
      prop: "salary",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "水电费",
      prop: "waterAndElectricity",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "养老保险",
      prop: "oldInsurance",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "合作医疗",
      prop: "hospitalInsurance",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "伙食费",
      prop: "food",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "代缴个人所得税",
      prop: "tax",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "实发工资",
      prop: "endSalary",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "工龄津贴",
      prop: "workAgeSubsidy",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "其他",
      prop: "other",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "已发工资",
      prop: "paidSalary",
      colProp: { span: 8 },
      labelWidth: 110,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    }
  ].concat(
    userType === "1"
      ? [
          {
            label: "提成",
            prop: "pushMoney",
            colProp: { span: 8 },
            labelWidth: 110,
            render: ({ formModel, row }) => {
              return <el-input v-model={formModel[row.prop]} />;
            }
          }
        ]
      : []
  );

export { formRules1, formConfigs1, formConfigs, formRules, updateItem };
