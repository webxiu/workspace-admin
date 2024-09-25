import { reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import regExp from "@/utils/regExp";

// 修改车辆验证
export const formRules = reactive<FormRules>({
  plateNumber: [{ required: true, message: "请输入车牌号码", trigger: "blur" }],
  vinNo: [{ required: true, message: "请输入车架号", trigger: "blur" }],
  color: [{ required: true, message: "请输入车辆颜色", trigger: "blur" }],
  initMileage: [
    { required: true, message: "请输入初始里程", trigger: "blur" },
    { message: "输入格式不正确", trigger: "blur", pattern: regExp.price }
  ]
});
const layout = { span: 12 };

// 1.修改车辆
export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "车牌号码",
      prop: "plateNumber",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "车架号",
      prop: "vinNo",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "车辆颜色",
      prop: "color",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "初始里程(km)",
      prop: "initMileage",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={[formModel[row.prop], ["trim"]]} placeholder="请输入" clearable />
    },
    {
      label: "创建用户",
      prop: "createUserName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled />
    },
    {
      label: "创建日期",
      prop: "createDate",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} placeholder="请选择" type="datetime" format="YYYY-MM-DD HH:mm:ss" disabled style={{ width: "100%" }} />
      )
    },
    {
      label: "修改用户",
      prop: "modifyUserName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled />
    },
    {
      label: "修改日期",
      prop: "modifyDate",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-date-picker v-model={formModel[row.prop]} placeholder="请选择" type="datetime" format="YYYY-MM-DD HH:mm:ss" disabled style={{ width: "100%" }} />
      )
    }
  ];
};
