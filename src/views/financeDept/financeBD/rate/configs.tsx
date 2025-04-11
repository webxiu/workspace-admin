import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  beginDate: [{ required: true, message: "生效日期为必填项", trigger: "submit" }],
  endDate: [{ required: true, message: "失效日期为必填项", trigger: "submit" }],
  sourceCurrencyId: [{ required: true, message: "原币为必填项", trigger: "submit" }],
  exchangeRate: [{ required: true, message: "汇率为必填项", trigger: "submit" }],
  targetCurrencyId: [{ required: true, message: "目标币为必填项", trigger: "submit" }]
});

export const formConfigs = ({ optionInfo }): FormConfigItemType[] => {
  return [
    {
      label: "原币",
      prop: "sourceCurrencyId",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择原币" filterable clearable class="ui-w-100">
            {optionInfo.value.moneyOpts?.map((item) => (
              <el-option key={item.optionValue} value={item.optionValue} label={item.optionName} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "目标币",
      prop: "targetCurrencyId",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择目标币" clearable filterable class="ui-w-100">
            {optionInfo.value.moneyOpts?.map((item) => (
              <el-option key={item.optionValue} value={item.optionValue} label={item.optionName} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "汇率",
      prop: "exchangeRate",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-input-number controls={false} class="ui-w-100" v-model={formModel[row.prop]} placeholder="请填写汇率" />;
      }
    },
    {
      label: "生效日期",
      prop: "beginDate",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-date-picker valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" v-model={formModel[row.prop]} type="date" placeholder="选择生效日期" />;
      }
    },

    {
      label: "失效日期",
      prop: "endDate",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-date-picker valueFormat="YYYY-MM-DD" format="YYYY-MM-DD" v-model={formModel[row.prop]} type="date" placeholder="选择失效日期" />;
      }
    }
  ];
};
