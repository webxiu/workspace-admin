import { reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import ImportUpload from "./importUpload.vue";
import { useLocalStorage } from "@/utils/storage";

const { getItem, updateItem } = useLocalStorage("payroll-calculate-hr");

const formRules1 = reactive<FormRules>({
  row: [{ required: true, message: "数据起始行必填", trigger: "change" }],
  cardCol: [
    { required: true, message: "身份证列必填", trigger: "change" },
    { pattern: /^[A-Z]+$/, message: "列为26个英文大写字母的组合" }
  ],
  yearMonth: [{ required: true, message: "年月必填", trigger: "change" }],
  unemploymentInsuranceCol: [
    { required: true, message: "失业保险必填", trigger: "change" },
    { pattern: /^[A-Z]+$/, message: "列为26个英文大写字母的组合" }
  ],
  choose: [{ required: true, message: "导入类型必填", trigger: "change" }],
  file: [{ required: true, message: "未选择任何文件", trigger: "change" }],
  oldInsuranceCol: [
    { required: true, message: "养老保险必填", trigger: "change" },
    { pattern: /^[A-Z]+$/, message: "列为26个英文大写字母的组合" }
  ],
  hospitalInsuranceCol: [
    { required: true, message: "医疗保险必填", trigger: "change" },
    { pattern: /^[A-Z]+$/, message: "列为26个英文大写字母的组合" }
  ],
  reserveFundCol: [
    { required: true, message: "金额必填", trigger: "change" },
    { pattern: /^[A-Z]+$/, message: "列为26个英文大写字母的组合" }
  ],
  deptCol: [{ pattern: /^[A-Z]+$/, message: "列为26个英文大写字母的组合" }]
});

export const importType = {
  公积金: { row: "5", cardCol: "B", deptCol: "", reserveFundCol: "I", oldInsuranceCol: "0", hospitalInsuranceCol: "0", unemploymentInsuranceCol: "0" },
  社保: { row: "4", cardCol: "C", deptCol: "", reserveFundCol: "0", oldInsuranceCol: "M", hospitalInsuranceCol: "O", unemploymentInsuranceCol: "AK" }
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
        prop: "yearMonth",
        render: ({ formModel, row }) => {
          return <el-date-picker style={{ width: "100%" }} valueFormat="YYYY-MM" v-model={formModel[row.prop]} type="month" placeholder="选择年月" />;
        }
      },
      {
        label: "部门列",
        labelWidth: 100,
        prop: "deptCol",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} placeholder="请输入部门列" />;
        }
      },
      {
        label: "导入类型",
        labelWidth: 100,
        prop: "choose",
        render: ({ formModel, row }) => {
          return (
            <el-select onChange={changeSelectValue} style={{ width: "100%" }} v-model={formModel[row.prop]} placeholder="请选择导入类型">
              <el-option label="公积金" value="公积金" />
              <el-option label="社保" value="社保" />
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
        labelWidth: 100,
        prop: "cardCol",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} placeholder="请输入身份证列" />;
        }
      },
      {
        label: "金额列",
        labelWidth: 100,
        prop: "reserveFundCol",
        hide: chooseType && !["公积金"].includes(chooseType),
        render: ({ formModel, row }) => {
          return <el-input readonly={moneyReadonly} v-model={formModel[row.prop]} placeholder="请输入金额列" />;
        }
      },
      {
        label: "养老保险列",
        labelWidth: 100,
        prop: "oldInsuranceCol",
        hide: chooseType && !["社保"].includes(chooseType),
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
        prop: "unemploymentInsuranceCol",
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

    if (val === "社保") {
      moneyReadonly = true;
      oldReadonly = false;
      hospReadonly = false;
      withNotWorkReadonly = false;
    }

    if (val === "公积金") {
      moneyReadonly = false;
      oldReadonly = true;
      hospReadonly = true;
      withNotWorkReadonly = true;
    }

    confArr.value = formConfs(val);
  };
  changeSelectValue("社保");
  return confArr;
};

export { formRules1, formConfigs1, updateItem };
