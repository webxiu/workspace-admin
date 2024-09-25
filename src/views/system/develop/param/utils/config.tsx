import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

// 修改参数校验
export const nameFormRules = reactive<FormRules>({
  systemparamName: [{ required: true, message: "参数名称为必填项", trigger: "blur" }],
  systemparamCode: [{ required: true, message: "参数编号为必填项", trigger: "blur" }],
  remark: [{ required: true, message: "说明备注为必填项", trigger: "blur" }]
});
// 修改参数值校验
export const valueFormRules = reactive<FormRules>({
  systemparamValue: [{ required: true, message: "参数列表值为必填项", trigger: "blur" }],
  remark: [{ required: true, message: "说明备注为必填项", trigger: "blur" }]
});

// 修改参数名称
export const nameFormConfig = (): FormConfigItemType[] => [
  {
    label: "参数名称",
    prop: "systemparamName",
    colProp: { span: 24 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入参数名称" clearable />;
    }
  },
  {
    label: "参数编号",
    prop: "systemparamCode",
    colProp: { span: 24 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入参数编号" clearable />;
    }
  },
  {
    label: "说明备注",
    prop: "remark",
    colProp: { span: 24 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入说明备注" clearable />;
    }
  }
];

// 修改参数值
export const valueFormConfig = (): FormConfigItemType[] => {
  return [
    {
      label: "参数列表值",
      prop: "systemparamValue",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入参数列表值" clearable />;
      }
    },
    {
      label: "说明备注",
      prop: "remark",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入说明备注" clearable />;
      }
    }
  ];
};
