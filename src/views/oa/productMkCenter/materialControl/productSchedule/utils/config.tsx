/*
 * @Author: Hailen
 * @Date: 2024-08-01 15:18:56
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-08-05 17:52:25
 */

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import type { FormRules } from "element-plus";
import { Question } from "@/config/elements";
import UploadButton from "@/components/UploadButton.vue";
import { reactive } from "vue";

const layout = { span: 24 };

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  dataStartRow: [{ required: true, message: "请输入数据行", trigger: "blur" }],
  productionLineCol: [{ required: true, message: "请输入线别列", trigger: "blur" }],
  productionOrderCol: [{ required: true, message: "请输入生产订单列", trigger: "blur" }],
  materialCol: [{ required: true, message: "请输入物请输物料编码列", trigger: "blur" }],
  finishCountCol: [{ required: true, message: "请输入完成数量列", trigger: "blur" }],
  dateTitleRow: [{ required: true, message: "请输入排产日期所在行", trigger: "blur" }],
  schedulingStartCol: [{ required: true, message: "请输入排产开始列", trigger: "blur" }],
  schedulingEndCol: [{ required: true, message: "请输入排产结束列", trigger: "blur" }],
  planYearMonth: [{ required: true, message: "请输入计划年月列", trigger: "blur" }],
  file: [{ required: true, message: "请选择文件", trigger: "blur" }]
});

export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "数据行",
      prop: "dataStartRow",
      colProp: layout,
      slots: {
        label: ({ label }) => (
          <span>
            {label}
            <el-tooltip placement="top" content="请根据实际导入行列数值修改默认值(即: 核对上传Excel中的行序号和列序号, 下同)">
              <Question />
            </el-tooltip>
          </span>
        )
      },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={1} max={1000} controls-position="right" placeholder="请输入" style="width: 100%" clearable />
      )
    },
    {
      label: "线别列",
      prop: "productionLineCol",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "生产订单列",
      prop: "productionOrderCol",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "物料编码列",
      prop: "materialCol",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "完成数量列",
      prop: "finishCountCol",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "排产日期所在行",
      prop: "dateTitleRow",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={1} max={1000} controls-position="right" placeholder="请输入" style="width: 100%" clearable />
      )
    },
    {
      label: "排产开始列",
      prop: "schedulingStartCol",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "排产结束列",
      prop: "schedulingEndCol",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "计划年月",
      prop: "planYearMonth",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} type="month" format="YYYY-MM" placeholder="请选择" value-format="YYYY-MM" style={{ width: "100%" }} />
      )
    },
    {
      label: "选择文件",
      prop: "file",
      colProp: layout,
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => <UploadButton limit={1} accept={[".xlsx, .xls"].join(",")} v-model={formModel[row.prop]} />
    }
  ];
};
