import { FormRules } from "element-plus";
import { reactive } from "vue";

const formRules = reactive<FormRules>({
  name: [{ required: true, message: "交付物名称为必填项", trigger: "change" }],
  number: [{ required: true, message: "交付物编码为必填项", trigger: "change" }]
});

const formRules1 = reactive<FormRules>({
  valueAll: [{ required: true, message: "要求描述为必填项", trigger: "change" }]
});

const formConfigs = (groupNameOpts = [], valueTypeOpts = []) => [
  {
    label: "所属类型",
    prop: "groupName",
    labelWidth: 80,
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择所属类型" style={{ width: "100%" }}>
          {groupNameOpts.map((item) => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "新增分组",
    labelWidth: 80,

    prop: "newGroupName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="如果上面没有分组，可以在此添加" clearable />;
    }
  },
  {
    label: "类型名",
    labelWidth: 80,

    prop: "typeName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入分类名称" clearable />;
    }
  },
  {
    label: "值类型",
    labelWidth: 80,

    prop: "valueType",
    render: ({ formModel, row }) => {
      return (
        <el-select v-model={formModel[row.prop]} placeholder="请选择值类型" style={{ width: "100%" }}>
          {valueTypeOpts.map((item) => (
            <el-option key={item.value} label={item.label} value={item.value} />
          ))}
        </el-select>
      );
    }
  },
  {
    label: "备注",
    labelWidth: 80,

    prop: "remark",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入备注" clearable />;
    }
  }
];

const formConfigs1 = () => [
  {
    label: "要求描述",
    prop: "valueAll",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入要求描述" clearable />;
    }
  }
];

export { formConfigs, formRules, formRules1, formConfigs1 };
