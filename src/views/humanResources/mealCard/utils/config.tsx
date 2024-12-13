import { FormRules } from "element-plus";
import ImportUpload from "./importUpload.vue";
import { reactive } from "vue";

const formRules = reactive<FormRules>({
  money: [{ required: true, message: "金额为必填项", trigger: "change" }]
});

const formRules1 = reactive<FormRules>({
  row: [{ required: true, message: "数据起始行必填", trigger: "change" }],
  userCodeCol: [{ required: true, message: "工号列必填", trigger: "change" }],
  cardCodeCol: [{ required: true, message: "卡号列必填", trigger: "change" }],
  yearAndMonth: [{ required: true, message: "年月必填", trigger: "change" }],
  file: [{ required: true, message: "未选择任何文件", trigger: "change" }]
});

const formRules1Exit = reactive<FormRules>({
  row: [{ required: true, message: "数据起始行必填", trigger: "change" }],
  userCodeCol: [{ required: true, message: "工号列必填", trigger: "change" }],
  moneyCol: [{ required: true, message: "金额列必填", trigger: "change" }],
  yearAndMonth: [{ required: true, message: "年月必填", trigger: "change" }],
  file: [{ required: true, message: "未选择任何文件", trigger: "change" }]
});

const formConfigs = () => [
  {
    label: "金额",
    prop: "money",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入金额" />;
    }
  }
];

const formConfigs1 = () => [
  {
    label: "年月",
    labelWidth: 100,
    prop: "yearAndMonth",
    render: ({ formModel, row }) => {
      return <el-date-picker valueFormat="YYYY-MM" v-model={formModel[row.prop]} type="month" placeholder="选择年月" />;
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
    label: "工号列",
    labelWidth: 100,
    prop: "userCodeCol",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入工号列" />;
    }
  },
  {
    label: "卡号列",
    labelWidth: 100,
    prop: "cardCodeCol",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入卡号列" />;
    }
  },
  {
    slots: { label: () => <span style={{ fontSize: "14px", color: "#606266", fontWeight: "700" }}>文件</span> },
    labelWidth: 100,
    prop: "file",
    render: ({ formModel, row }) => {
      return <ImportUpload v-model={formModel[row.prop]} style={{ width: "100%" }} />;
    }
  }
];

const formConfigs1Exit = () => [
  {
    label: "年月",
    labelWidth: 100,
    prop: "yearAndMonth",
    render: ({ formModel, row }) => {
      return <el-date-picker valueFormat="YYYY-MM" v-model={formModel[row.prop]} type="month" placeholder="选择年月" />;
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
    label: "工号列",
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
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入金额列" />;
    }
  },
  {
    slots: { label: () => <span style={{ fontSize: "14px", color: "#606266", fontWeight: "700" }}>文件</span> },
    labelWidth: 100,
    prop: "file",
    render: ({ formModel, row }) => {
      return <ImportUpload v-model={formModel[row.prop]} style={{ width: "100%" }} />;
    }
  }
];

export { formConfigs, formRules, formRules1, formConfigs1, formRules1Exit, formConfigs1Exit };
