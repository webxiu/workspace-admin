import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  operatorId: [{ required: true, message: "采购员为必选项", trigger: "blur" }]
});

// 编辑角色
export const formConfigs = ({ deptOptions }): FormConfigItemType[] => {
  return [
    {
      label: "采购员",
      prop: "operatorId",
      required: true,
      colProp: { span: 24 },
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            clearable
            filterable
            data={deptOptions}
            check-strictly={true}
            check-on-click-node
            render-after-expand={false}
            placeholder="请选择采购员"
            class="ui-w-100"
            props={{ label: "optionKey", value: "optionValue" }}
          />
        );
      }
    }
  ];
};
