import { FormRules } from "element-plus";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  // parentid: [{ required: true, message: "父级分组为必填项", trigger: "submit" }],
  // groupname: [{ required: true, message: "分组名称为必填项", trigger: "submit" }],
  projectCategory: [{ required: true, message: "项目分类为必填项", trigger: "submit" }]
});

export const formConfigs = (treeSelectData, type) => {
  console.log(treeSelectData, "ddd");
  console.log(type, "left type");
  const arr = [
    {
      label: "项目分类",
      labelWidth: 120,
      prop: "projectCategory",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入项目分类" />;
      }
    }
  ];

  if (type === "add") {
    return arr;
  }

  if (type === "edit") {
    return arr.concat([
      // {
      //   label: "创建人",
      //   labelWidth: 120,
      //   prop: "createUserName",
      //   render: ({ formModel, row }) => {
      //     return <el-input disabled style={{ width: 50 }} v-model={formModel[row.prop]} />;
      //   }
      // },
      {
        label: "创建时间",
        labelWidth: 120,
        prop: "createDate",
        render: ({ formModel, row }) => {
          return <el-input disabled style={{ width: 50 }} v-model={formModel[row.prop]} />;
        }
      }
    ]);
  }
};
