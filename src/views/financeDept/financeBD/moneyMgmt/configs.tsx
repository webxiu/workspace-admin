import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  currencyNumber: [{ required: true, message: "币种编号为必填项", trigger: "submit" }],
  currencyName: [{ required: true, message: "币种名称为必填项", trigger: "submit" }]
  // automaticExchangeRates: [{ required: true, message: "自动采集汇率为必填项", trigger: "submit" }],
  // standardCurrency: [{ required: true, message: "本位币为必填项", trigger: "submit" }]
});

export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "币种编号",
      prop: "currencyNumber",
      labelWidth: 120,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "币种名称",
      prop: "currencyName",
      labelWidth: 120,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "自动采集汇率",
      prop: "automaticExchangeRates",
      labelWidth: 120,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-checkbox v-model={formModel[row.prop]} label="" />;
      }
    },
    {
      label: "本位币",
      prop: "standardCurrency",
      labelWidth: 120,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-checkbox v-model={formModel[row.prop]} label="" />;
      }
    },
    {
      label: "创建人",
      prop: "createUserName",
      labelWidth: 120,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "创建时间",
      prop: "createDate",
      labelWidth: 120,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "最后修改人",
      prop: "modifyUserName",
      labelWidth: 120,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "最后修改时间",
      prop: "modifyDate",
      labelWidth: 120,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    }
  ];
};
