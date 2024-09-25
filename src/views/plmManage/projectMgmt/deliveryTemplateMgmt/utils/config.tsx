import { FormRules } from "element-plus";
import URLTable from "./URLTable.vue";
import { reactive } from "vue";

const formRules = reactive<FormRules>({
  name: [{ required: true, message: "交付物名称为必填项", trigger: "change" }],
  number: [{ required: true, message: "交付物编码为必填项", trigger: "change" }]
});

const formConfigs = (id) => [
  {
    label: "交付物编码",
    labelWidth: 100,
    prop: "number",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入交付物编码" clearable />;
    }
  },
  {
    label: "交付物名称",
    labelWidth: 100,
    prop: "name",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入交付物名称" clearable />;
    }
  },
  {
    label: "页面路由",
    labelWidth: 100,
    prop: "pageUrl",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入页面路由" clearable />;
    }
  },
  {
    label: "服务名称",
    labelWidth: 100,
    prop: "serviceName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} maxlength={100} placeholder="请输入服务名称" clearable />;
    }
  },
  {
    label: "",
    prop: "deliverableTemplateEntryList",
    render: ({ formModel, row }) => {
      return <URLTable v-model={formModel[row.prop]} leftId={id} />;
    }
  }
];

export { formConfigs, formRules };
