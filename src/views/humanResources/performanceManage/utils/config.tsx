import { FormRules } from "element-plus";
import ImportUpload from "./importUpload.vue";
import { reactive } from "vue";

const formRules = reactive<FormRules>({
  money: [{ required: true, message: "金额为必填项", trigger: "change" }]
});

const formRules1 = reactive<FormRules>({
  row: [{ required: true, message: "数据起始行必填", trigger: "change" }],
  deptId: [{ required: true, message: "部门必填", trigger: "change" }],
  yearAndMonth: [{ required: true, message: "年月必填", trigger: "change" }],
  userCodeCol: [{ required: true, message: "工号列必填", trigger: "change" }],
  moneyCol: [{ required: true, message: "金额列必填", trigger: "change" }],
  file: [{ required: true, message: "未选择任何文件", trigger: "change" }]
});

const formConfigs = () => [
  {
    label: "年月",
    prop: "yearAndMonth",
    labelWidth: 60,
    colProp: { span: 8 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  },
  {
    label: "部门",
    prop: "deptName",
    labelWidth: 60,
    colProp: { span: 8 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  },
  {
    label: "工号",
    prop: "userCode",
    labelWidth: 60,
    colProp: { span: 8 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  },
  {
    label: "姓名",
    prop: "staffName",
    labelWidth: 60,
    colProp: { span: 8 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled />;
    }
  },
  {
    label: "金额",
    labelWidth: 60,
    colProp: { span: 8 },
    prop: "money",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入金额" clearable />;
    }
  }
];

const formConfigs1 = (treeData) => [
  {
    label: "年月",
    labelWidth: 100,
    prop: "yearAndMonth",
    render: ({ formModel, row }) => {
      return <el-date-picker style={{ width: "100%" }} value-format="YYYY-MM" v-model={formModel[row.prop]} type="month" />;
    }
  },
  {
    label: "部门",
    labelWidth: 100,
    prop: "deptId",
    render: ({ formModel, row }) => {
      console.log(treeData, "treeData");
      console.log(formModel[row.prop], "formModel[row.prop]");
      return (
        <el-tree-select
          style={{ width: "100%" }}
          default-expanded-keys={["0"]}
          v-model={formModel[row.prop]}
          filterable
          data={treeData}
          node-key="value"
          check-strictly={true}
          check-on-click-node
          render-after-expand={false}
          class="ui-w-100"
          props={{ label: "name", value: "value" }}
        />
      );
    }
  },
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

export { formConfigs, formRules, formRules1, formConfigs1 };
