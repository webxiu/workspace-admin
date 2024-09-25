import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import ImportUpload from "./ImportUpload.vue";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  mealTicket: [{ required: true, message: "金额为必填项", trigger: "change" }]
});

export const formRules2 = reactive<FormRules>({
  dataStartRow: [{ required: true, message: "数据起始行必填", trigger: "change" }],
  yearMonth: [{ required: true, message: "年月必填", trigger: "change" }],
  nameCol: [{ required: true, message: "姓名列必填", trigger: "change" }],
  staffCodeCol: [{ required: true, message: "工号列必填", trigger: "change" }],
  moneyCol: [{ required: true, message: "金额列必填", trigger: "change" }],
  remarkCol: [{ required: true, message: "备注列必填", trigger: "change" }],
  file: [{ required: true, message: "未选择任何文件", trigger: "change" }]
});

export const formConfigs = (): FormConfigItemType[] => [
  {
    label: "年月",
    prop: "yearMonth",
    labelWidth: 60,
    colProp: { span: 12 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  },
  {
    label: "工号",
    prop: "staffCode",
    labelWidth: 60,
    colProp: { span: 12 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  },
  {
    label: "姓名",
    prop: "staffName",
    labelWidth: 60,
    colProp: { span: 12 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  },
  {
    label: "金额",
    labelWidth: 60,
    colProp: { span: 12 },
    prop: "mealTicket",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入金额" clearable />;
    }
  },
  {
    label: "备注",
    labelWidth: 60,
    colProp: { span: 12 },
    prop: "remark",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入备注" clearable />;
    }
  }
];

export const formConfigs2 = (): FormConfigItemType[] => [
  {
    label: "年月",
    labelWidth: 100,
    prop: "yearMonth",
    render: ({ formModel, row }) => {
      return <el-date-picker style={{ width: "100%" }} value-format="YYYY-MM" v-model={formModel[row.prop]} type="month" />;
    }
  },
  {
    label: "数据行",
    labelWidth: 100,
    prop: "dataStartRow",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入数据起始行" clearable />;
    }
  },
  // {
  //   label: "工号列",
  //   labelWidth: 100,
  //   prop: "staffCodeCol",
  //   render: ({ formModel, row }) => {
  //     return <el-input v-model={formModel[row.prop]} placeholder="请输入工号列" clearable />;
  //   }
  // },
  {
    label: "姓名列",
    labelWidth: 100,
    prop: "nameCol",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入姓名列" clearable />;
    }
  },
  {
    label: "金额列",
    labelWidth: 100,
    prop: "moneyCol",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入金额列" clearable />;
    }
  },
  {
    label: "备注列",
    labelWidth: 100,
    prop: "remarkCol",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入备注列" clearable />;
    }
  },
  {
    label: "文件",
    slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
    labelWidth: 100,
    prop: "file",
    render: ({ formModel, row }) => {
      return <ImportUpload v-model={formModel[row.prop]} />;
    }
  }
];
