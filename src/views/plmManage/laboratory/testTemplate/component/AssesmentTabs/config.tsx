/*
 * @Author: Hailen
 * @Date: 2024-08-26 09:40:45
 * @Last Modified by:   Hailen
 * @Last Modified time: 2024-08-26 09:40:45
 */

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import type { FormRules } from "element-plus";
import UploadButton from "@/components/UploadButton.vue";
import { reactive } from "vue";

const layout = { span: 24 };

export const formRules = reactive<FormRules>({
  headerRow: [{ required: true, message: "请输入表头行", trigger: "blur" }],
  dataStartRow: [{ required: true, message: "请输入数据行", trigger: "blur" }],
  file: [{ required: true, message: "请选择文件", trigger: "blur" }]
});

export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "表头行",
      prop: "headerRow",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={1} max={100} controls-position="right" placeholder="请输入" style="width: 100%" clearable />
      )
    },
    {
      label: "数据行",
      prop: "dataStartRow",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={1} max={100} controls-position="right" placeholder="请输入" style="width: 100%" clearable />
      )
    },
    {
      label: "选择文件",
      prop: "file",
      colProp: layout,
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => <UploadButton limit={1} accept={[".xlsx, .xls"].join(",")} multiple={false} v-model={formModel[row.prop]} />
    }
  ];
};
