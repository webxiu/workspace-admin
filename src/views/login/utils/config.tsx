import { $t, transformI18n } from "@/plugins/i18n";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import type { FormRules } from "element-plus";
import { reactive } from "vue";
import regExp from "@/utils/regExp";

const layout = { span: 24 };

/** 登录校验 */
export const loginRules = reactive<FormRules>({
  password: [
    { trigger: "blur", message: transformI18n($t("login.passwordReg")), required: true },
    { trigger: "blur", min: 3, max: 16, message: transformI18n($t("login.passwordReg")) }
  ]
});

/** 重置密码校验 */
export const formRules = (formData): FormRules => ({
  userCode: [{ trigger: "blur", message: "请输入工号", required: true }],
  phone: [
    { trigger: "blur", message: "请输入手机号", required: true },
    { trigger: "blur", min: 11, max: 11, message: "手机号长度为11位数字" },
    { trigger: "blur", message: "手机号码格式不正确", pattern: regExp.phone }
  ],
  code: [
    { trigger: "blur", message: "请输入验证码", required: true },
    { trigger: "blur", message: "验证码长度为6位数字", pattern: regExp.code }
  ],
  newPassword: [
    { trigger: "blur", message: "请输入新密码", required: true },
    { trigger: "blur", message: transformI18n($t("login.passwordReg")) }
  ],
  confirmPassword: [
    { trigger: "blur", message: "请确认新密码", required: true },
    {
      trigger: "blur",
      validator: (rule: any, value: any, callback: any) => {
        if (value !== formData.newPassword) {
          callback(new Error("新密码和确认密码不一致"));
        } else {
          callback();
        }
      }
    }
  ]
});

// 重置密码表单
export const formConfigs = ({ getTelCode, countdown }): FormConfigItemType[] => {
  return [
    {
      label: "工号",
      prop: "userCode",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入工号" clearable />
    },
    {
      label: "手机号码",
      prop: "phone",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入手机号码" clearable />
    },
    {
      label: "验证码",
      prop: "code",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <div class="flex ui-w-100">
            <el-input v-model={formModel[row.prop]} placeholder="请输入验证码" max={11} clearable class="flex-1 mr-4" />
            <el-button onClick={getTelCode} disabled={countdown.value > 0}>
              {countdown.value > 0 ? `${countdown.value}s后重新获取` : "获取验证码"}
            </el-button>
          </div>
        );
      }
    },
    {
      label: "新密码",
      prop: "newPassword",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入新密码" clearable />
    },
    {
      label: "确认密码",
      prop: "confirmPassword",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请确认新密码" clearable />
    }
  ];
};
