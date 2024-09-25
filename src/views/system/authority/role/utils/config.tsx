import { FormConfigItemType } from "@/components/EditForm/index.vue";

// 权限树查询节点表单
export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "节点名称",
      prop: "title",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入节点名称" clearable />
    }
  ];
};
