/*
 * @Author: Hailen
 * @Date: 2024-03-15 16:49:20
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-12-11 17:34:23
 */

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

/** 布局类型 */
export const formTypeOptions = [
  { optionName: "表单头", optionValue: "1" },
  { optionName: "表单明细", optionValue: "2" }
];

export const formRules = reactive<FormRules>({
  groupName: [{ required: true, message: "请输入名称", trigger: "blur" }],
  tableName: [{ required: true, message: "请输入表名", trigger: "blur" }],
  groupType: [{ required: true, message: "请选择类型", trigger: "blur" }]
});

// 表单配置
export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "名称",
      prop: "groupName",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "表名",
      prop: "tableName",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "类型",
      prop: "groupType",
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          {formTypeOptions.map((item) => (
            <el-radio key={item.optionValue} label={item.optionValue}>
              {item.optionName}
            </el-radio>
          ))}
        </el-radio-group>
      )
    }
  ];
};
