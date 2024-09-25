import { FormRules } from "element-plus";
import ImportUpload from "./importUpload.vue";
import ModalFileUpload from "../modalFileUpload.vue";
import { reactive } from "vue";

const formRules = reactive<FormRules>({
  money: [{ required: true, message: "金额为必填项", trigger: "change" }]
});

const formDetailRules = reactive<FormRules>({
  yearAndMonth: [{ required: true, message: "年月为必填项", trigger: "change" }],
  startRow: [{ required: true, message: "数据起始行为必填项", trigger: "change" }],
  nameCol: [{ required: true, message: "姓名列为必填项", trigger: "change" }],
  staffCodeCol: [{ required: true, message: "工号列为必填项", trigger: "change" }],
  daysCol: [{ required: true, message: "天数列为必填项", trigger: "change" }],
  costCol: [{ required: true, message: "个人水电费列为必填项", trigger: "change" }],
  dateCol: [{ required: true, message: "日期列为必填项", trigger: "change" }],
  file: [{ required: true, message: "请选择文件", trigger: "change" }]
});

const formRules1 = reactive<FormRules>({
  row: [{ required: true, message: "数据起始行必填", trigger: "change" }],
  userCodeCol: [{ required: true, message: "工号列必填", trigger: "change" }],
  moneyCol: [{ required: true, message: "金额列必填", trigger: "change" }],
  file: [{ required: true, message: "未选择任何文件", trigger: "change" }]
});

const formConfigs = () => [
  {
    label: "金额",
    prop: "money",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入金额" clearable />;
    }
  }
];

const formConfigs1 = () => [
  {
    label: "数据起始行",
    labelWidth: 100,
    prop: "row",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入数据起始行" clearable />;
    }
  },
  {
    label: "工号列",
    labelWidth: 100,
    prop: "userCodeCol",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入工号列" clearable />;
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
    label: "文件",
    labelWidth: 100,
    prop: "file",
    slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
    render: ({ formModel, row }) => {
      return <ImportUpload v-model={formModel[row.prop]} />;
    }
  }
];

const formDetailConfigs = () => [
  {
    label: "年月",
    labelWidth: 100,
    prop: "yearAndMonth",
    render: ({ formModel, row }) => {
      return <el-date-picker style={{ width: "100%" }} value-format="YYYY-MM" v-model={formModel[row.prop]} type="month" />;
    }
  },
  {
    label: "数据起始行",
    labelWidth: 100,
    prop: "startRow",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入数据起始行" clearable />;
    }
  },
  {
    label: "姓名列",
    labelWidth: 100,
    prop: "nameCol",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入姓名列" clearable />;
    }
  },
  {
    label: "工号列",
    labelWidth: 100,
    prop: "staffCodeCol",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入工号列" clearable />;
    }
  },
  {
    label: "天数列",
    labelWidth: 100,
    prop: "daysCol",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入天数列" clearable />;
    }
  },
  {
    label: "日期列",
    labelWidth: 100,
    prop: "dateCol",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入日期列" clearable />;
    }
  },
  {
    label: "水电费用列",
    labelWidth: 100,
    prop: "costCol",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入个人水电费列" clearable />;
    }
  },
  {
    slots: { label: () => <span style={{ fontSize: "14px", color: "#606266", fontWeight: "700" }}>文件</span> },
    labelWidth: 100,
    prop: "file",
    render: ({ formModel, row }) => {
      return <ModalFileUpload v-model={formModel[row.prop]} style={{ width: "100%" }} />;
    }
  }
];

export { formConfigs, formRules, formRules1, formConfigs1, formDetailConfigs, formDetailRules };
