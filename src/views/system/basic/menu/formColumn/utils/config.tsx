/*
 * @Author: Hailen
 * @Date: 2024-03-15 16:49:20
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-11-26 16:33:10
 */

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

/** 布局类型 */
export const layoutOptions = [
  { optionName: "表单头", optionValue: "1" },
  { optionName: "表单明细", optionValue: "2" }
];

export const formRules = reactive<FormRules>({
  groupName: [{ required: true, message: "请输入名称", trigger: "blur" }],
  tableName: [{ required: true, message: "请输入表名", trigger: "blur" }],
  type: [{ required: true, message: "请选择类型", trigger: "blur" }]
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
      prop: "type",
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          {layoutOptions.map((item) => (
            <el-radio key={item.optionValue} label={item.optionValue}>
              {item.optionName}
            </el-radio>
          ))}
        </el-radio-group>
      )
    }
  ];
};
