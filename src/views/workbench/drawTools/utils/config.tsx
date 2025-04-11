import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

const layout = { span: 24 };

export const formRules = reactive<FormRules>({
  processCode: [{ required: true, message: "请输入流程编号", trigger: "blur" }],
  processName: [{ required: true, message: "请输入流程名称", trigger: "blur" }],
  version: [{ required: true, message: "请输入流程版本", trigger: "blur" }]
});

export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "流程编号",
      prop: "processCode",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "流程名称",
      prop: "processName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "单据编号",
      prop: "billNo",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" disabled />
    },
    {
      label: "单据状态",
      prop: "billState",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="自动生成" disabled />
    },
    {
      label: "流程版本",
      prop: "version",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    }
  ];
};
