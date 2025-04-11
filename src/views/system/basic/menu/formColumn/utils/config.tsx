/*
 * @Author: Hailen
 * @Date: 2024-03-15 16:49:20
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-02-27 15:08:07
 */

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

export enum FormType {
  /** 表单头 */
  form = "1",
  /** 表单明细 */
  table = "2"
}

export enum LayoutType {
  /** 列表 */
  List = "list",
  /** 标签页 */
  Tab = "tab"
}

/** 单据类型 */
export const formTypeOptions = [
  { optionName: "表单头", optionValue: FormType.form },
  { optionName: "表单明细", optionValue: FormType.table }
];

/** 布局模式 */
export const layoutOptions = [
  { optionName: "列表", optionValue: LayoutType.List },
  { optionName: "标签页", optionValue: LayoutType.Tab }
];

export const formRules = reactive<FormRules>({
  groupName: [{ required: true, message: "请输入名称", trigger: "blur" }],
  tableName: [{ required: true, message: "请输入表名", trigger: "blur" }],
  // buttonType: [{ required: true, message: "请选择操作类别", trigger: "blur" }],
  groupType: [{ required: true, message: "请选择类型", trigger: "blur" }]
});

// 表单配置
export const formConfigs = ({ buttonList }): FormConfigItemType[] => {
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
      label: "操作类别",
      prop: "buttonType",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择操作类别" value-key="btnKey" multiple clearable class="ui-w-100">
            {buttonList.value.map((item) => (
              <el-option key={item.btnKey} label={item.btnName} value={item.btnKey} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "表单类型",
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
    },
    {
      label: "布局模式",
      prop: "layoutPattern",
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
