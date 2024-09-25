import type { FormRules, UploadInstance, UploadProps, UploadRawFile } from "element-plus";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { OptionsType } from "@/utils/table";
import { Question } from "@/config/elements";
import UploadButton from "@/components/UploadButton.vue";
import { ref } from "vue";

const layout = { span: 12 };

/** 提醒时间范围 */
export const timeTypeList: OptionsType[] = [
  { optionName: "分钟", optionValue: "min" },
  { optionName: "小时", optionValue: "hour" },
  { optionName: "天", optionValue: "day" }
];
/** 是否强制更新 */
export const updateTypeList: OptionsType[] = [
  { optionName: "是", optionValue: true },
  { optionName: "否", optionValue: false }
];

/** 校验规则 */
export const formRules = (formData): FormRules => ({
  version: [
    { message: "请输入发布版本", required: true, trigger: "blur" },
    { message: "版本格式不正确", pattern: /^\d+\.\d+\.\d+$/, trigger: "blur" }
  ],
  minTime: [{ message: "请输入提醒最小时间", required: true, trigger: "blur" }],
  maxTime: [
    { message: "请输入提醒最大时间", required: true, trigger: "blur" },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value <= formData.minTime) {
          callback(new Error("最大时间必须大于最小时间"));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  timeType: [{ message: "请选择提醒类型", required: true, trigger: "blur" }],
  forceUpdate: [{ message: "请选择强制更新", required: true, trigger: "blur" }],
  downloadUrl: [{ message: "请上传安装包", required: true, trigger: "blur" }],
  updateLog: [{ message: "请输入发布日志", required: true, trigger: "blur" }]
});

// 表单配置
export const formConfigs = ({ timeTypeList }): FormConfigItemType[] => {
  return [
    {
      label: "发布版本",
      prop: "version",
      colProp: layout,
      slots: {
        label: ({ label }) => (
          <span>
            {label}
            <el-tooltip placement="top" content="新版本号必须大于已发布版本号, App端才能检测到软件更新">
              <Question />
            </el-tooltip>
          </span>
        )
      },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="版本格式: 1.0.0" clearable />
    },
    {
      label: "强制更新",
      prop: "forceUpdate",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {updateTypeList.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "最小时间",
      prop: "minTime",
      colProp: layout,
      slots: {
        label: ({ label }) => (
          <span>
            {label}
            <el-tooltip placement="top" content="设置为0不提醒更新">
              <Question />
            </el-tooltip>
          </span>
        )
      },
      render: ({ formModel, row }) => (
        <el-input-number class="ui-w-100" controls-position="right" placeholder="更新提醒最小时间" clearable min={0} v-model={formModel[row.prop]} />
      )
    },
    {
      label: "最大时间",
      prop: "maxTime",
      colProp: layout,
      slots: {
        label: ({ label }) => (
          <span>
            {label}
            <el-tooltip placement="top" content="设置为0不提醒更新">
              <Question />
            </el-tooltip>
          </span>
        )
      },
      render: ({ formModel, row }) => (
        <el-input-number class="ui-w-100" controls-position="right" placeholder="更新提醒最大时间" clearable min={0} v-model={formModel[row.prop]} />
      )
    },
    {
      label: "提醒周期",
      prop: "timeType",
      colProp: layout,
      slots: {
        label: () => (
          <span>
            提醒周期
            <el-tooltip placement="top" content="提醒时间间隔在最大时间和最小时间范围内随机选择, 时间单位为提醒周期所选择值(如: 3-8小时内随机提醒)">
              <Question />
            </el-tooltip>
          </span>
        )
      },
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
          {timeTypeList.map((item) => (
            <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
          ))}
        </el-select>
      )
    },
    {
      label: "上传安装包",
      prop: "downloadUrl",
      colProp: layout,
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => <UploadButton limit={1} accept={".apk"} v-model={formModel[row.prop]} />
    },
    {
      label: "发布日志",
      prop: "updateLog",
      colProp: { span: 24 },
      render: ({ formModel, row }) => (
        <el-input v-model={formModel[row.prop]} rows={3} resize="none" type="textarea" autosize={{ minRows: 4, maxRows: 4 }} placeholder="请输入" clearable />
      )
    }
  ];
};
