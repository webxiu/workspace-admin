import { FormRules } from "element-plus";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  parentid: [{ required: true, message: "父级分组为必填项", trigger: "submit" }],
  groupname: [{ required: true, message: "分组名称为必填项", trigger: "submit" }],
  groupnumber: [{ required: true, message: "分组编号为必填项", trigger: "submit" }]
});

export const formConfigs = (treeSelectData) => {
  console.log(treeSelectData, "ddd");
  return [
    {
      label: "父级分组",
      labelWidth: 120,
      prop: "parentid",
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            props={{ children: "children", label: "title", value: "id" }}
            v-model={formModel[row.prop]}
            data={treeSelectData.value}
            filterable
            default-expanded-keys={["0"]}
            check-strictly
            node-key="id"
            render-after-expand={false}
            class="ui-w-100"
          />
        );
      }
    },
    {
      label: "分组名称",
      labelWidth: 120,
      prop: "groupname",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入分组名称" />;
      }
    },
    {
      label: "分组编号",
      labelWidth: 120,
      prop: "groupnumber",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入分组编号" />;
      }
    }
  ];
};
