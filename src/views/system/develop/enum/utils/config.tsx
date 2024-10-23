import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

const layout = { span: 24, xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };

// 修改信息校验
export const formRules = reactive<FormRules>({
  optionName: [{ required: true, message: "信息名称为必填项", trigger: "blur" }],
  optionCode: [{ required: true, message: "信息编码为必填项", trigger: "blur" }],
  memo: [{ required: true, message: "说明为必填项", trigger: "blur" }]
});

// 修改字典选项校验
export const formRules2 = reactive<FormRules>({
  displaySeq: [{ required: true, message: "序号为必填项", trigger: "blur" }],
  optionName: [{ required: true, message: "key值为必填项", trigger: "blur" }],
  optionValue: [{ required: true, message: "value值为必填项", trigger: "blur" }]
});

// 修改信息
export const formConfig1 = (): FormConfigItemType[] => [
  {
    label: "信息名称",
    prop: "optionName",
    labelWidth: 100,
    colProp: { span: 24 },
    render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入信息名称" clearable />
  },
  {
    label: "信息编码",
    prop: "optionCode",
    labelWidth: 100,
    colProp: { span: 24 },
    render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入信息编码" clearable />
  },
  {
    label: "说明",
    prop: "memo",
    labelWidth: 100,
    colProp: { span: 24 },
    render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入说明" clearable />
  }
];

// 修改字典选项
export const formConfig2 = (): FormConfigItemType[] => {
  return [
    {
      label: "序号",
      prop: "displaySeq",
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={1} controls-position="right" placeholder="请输入序号" clearable style={{ width: "100%" }} />
      )
    },
    {
      label: "key值",
      prop: "optionName",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入key值" clearable />
    },
    {
      label: "value值",
      prop: "optionValue",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入value值" clearable />
    },
    {
      label: "金蝶key",
      prop: "kingdeeValue",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入金蝶key" clearable />
    },
    {
      label: "预留1",
      prop: "reserve1",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入预留1" clearable />
    }
  ];
};
