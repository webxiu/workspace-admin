import { $t, transformI18n } from "@/plugins/i18n";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import type { FormRules } from "element-plus";
import { reactive } from "vue";
import regExp from "@/utils/regExp";

const layout = { span: 8 };

/** 登录校验 */
export const loginRules = reactive<FormRules>({
  password: [
    { trigger: "blur", message: transformI18n($t("login.passwordReg")), required: true },
    { trigger: "blur", min: 3, max: 16, message: transformI18n($t("login.passwordReg")) }
  ]
});

/** 重置密码校验 */
export const formRules = reactive<FormRules>({
  ruleNo: [{ trigger: "blur", message: "请输入规则编号", required: true }],
  remark: [{ trigger: "blur", message: "请输入备注", required: true }],
  forenoonStart: [{ trigger: "blur", message: "请输入打卡时间", required: true }], // 上午上班时间
  minForenoonStart: [{ trigger: "blur", message: "请输入打卡时间", required: true }], // 上午上班最早打卡时间
  maxForenoonStart: [{ trigger: "blur", message: "请输入打卡时间", required: true }], // 上午上班最晚打卡时间
  forenoonEnd: [{ trigger: "blur", message: "请输入打卡时间", required: true }], // 上午下班时间
  minForenoonEnd: [{ trigger: "blur", message: "请输入打卡时间", required: true }], // 上午下班最早打卡时间
  maxForenoonEnd: [{ trigger: "blur", message: "请输入打卡时间", required: true }], // 上午下班最晚打卡时间
  afternoonStart: [{ trigger: "blur", message: "请输入打卡时间", required: true }], // 下午上班时间
  minAfternoonStart: [{ trigger: "blur", message: "请输入打卡时间", required: true }], // 下午上班最早打卡时间
  maxAfternoonStart: [{ trigger: "blur", message: "请输入打卡时间", required: true }], // 下午上班最晚打卡时间
  afternoonEnd: [{ trigger: "blur", message: "请输入打卡时间", required: true }], // 下午下班时间
  minAfternoonEnd: [{ trigger: "blur", message: "请输入打卡时间", required: true }], // 下午下班最早打卡时间
  maxAfternoonEnd: [{ trigger: "blur", message: "请输入打卡时间", required: true }] // 下午下班最晚打卡时间
});

// 重置密码表单
export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "规则编号",
      prop: "ruleNo",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "备注",
      prop: "remark",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "",
      prop: "",
      colProp: layout,
      render: ({ formModel, row }) => null
    },
    {
      label: "上午上班时间",
      prop: "forenoonStart",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "上午上班最早打卡时间",
      prop: "minForenoonStart",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "上午上班最晚打卡时间",
      prop: "maxForenoonStart",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "上午下班时间",
      prop: "forenoonEnd",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "上午下班最早打卡时间",
      prop: "minForenoonEnd",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "上午下班最晚打卡时间",
      prop: "maxForenoonEnd",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "下午上班时间",
      prop: "afternoonStart",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "下午上班最早打卡时间",
      prop: "minAfternoonStart",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "下午上班最晚打卡时间",
      prop: "maxAfternoonStart",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "下午下班时间",
      prop: "afternoonEnd",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "下午下班最早打卡时间",
      prop: "minAfternoonEnd",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "下午下班最晚打卡时间",
      prop: "maxAfternoonEnd",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    }
  ];
};
