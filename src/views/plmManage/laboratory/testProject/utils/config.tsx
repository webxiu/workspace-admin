import { ElMessage, FormRules } from "element-plus";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  projectCategory: [{ required: true, message: "项目分类为必填项", trigger: "submit" }],
  projectName: [{ required: true, message: "测试项目名称为必填项", trigger: "submit" }]
});

export const formConfigs = ({ type }): FormConfigItemType[] => {
  return [
    {
      label: "项目分类",
      labelWidth: 120,
      prop: "projectCategory",
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} placeholder="请选择项目分类" />;
      }
    },
    {
      label: "测试项目名称",
      labelWidth: 120,
      prop: "projectName",
      render: ({ formModel, row }) => {
        return <el-input disabled={type === "view"} v-model={formModel[row.prop]} placeholder="请输入测试项目名称" />;
      }
    },
    {
      label: "创建人",
      labelWidth: 120,
      prop: "createUserName",
      hide: type === "add",
      render: ({ formModel, row }) => {
        return <el-input disabled style={{ width: 50 }} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "创建时间",
      labelWidth: 120,
      prop: "createDate",
      hide: type === "add",
      render: ({ formModel, row }) => {
        return <el-input disabled style={{ width: 50 }} v-model={formModel[row.prop]} />;
      }
    }
  ];
};
