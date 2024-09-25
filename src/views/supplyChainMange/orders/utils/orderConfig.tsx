import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  // createUserName: [{ required: true, message: "创建人为必填项", trigger: "change" }],
});

export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "订单编号",
      colProp: { span: 6 },
      labelWidth: 90,
      prop: "fbillno",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "订单日期",
      colProp: { span: 6 },
      labelWidth: 90,

      prop: "fdate",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "回签单号",
      colProp: { span: 6 },
      labelWidth: 90,

      prop: "billNo",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "采购员",
      colProp: { span: 6 },
      labelWidth: 90,

      prop: "userName",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "供应商编号",
      colProp: { span: 6 },
      labelWidth: 90,

      prop: "supCode",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "总税额",
      colProp: { span: 6 },
      labelWidth: 90,

      prop: "fbilltaxamount",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "总金额",
      colProp: { span: 6 },
      labelWidth: 90,

      prop: "fbillamount",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "总价税合计",
      colProp: { span: 6 },
      labelWidth: 90,

      prop: "fbillallamount",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "状态",
      colProp: { span: 6 },
      labelWidth: 90,

      prop: "fclosestatus",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    },
    {
      label: "回签状态",
      colProp: { span: 6 },
      labelWidth: 90,

      prop: "billState",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} readonly />
    }
  ];
};
