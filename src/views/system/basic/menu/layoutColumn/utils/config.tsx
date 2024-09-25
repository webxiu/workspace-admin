import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { Question } from "@/config/elements";
import { reactive } from "vue";
import regExp from "@/utils/regExp";

//======================= 添加分组弹窗 =======================

export const formGroupRules = reactive<FormRules>({
  groupName: [{ required: true, message: "请输入分组名称", trigger: "blur" }],
  groupCode: [
    { required: true, message: "请输入分组编号", trigger: "blur" },
    { message: "输入格式错误", trigger: "blur", pattern: regExp.quantity }
  ]
});

/** 布局类型 */
export const layoutOptions = [
  { optionName: "表格", optionValue: "table" },
  { optionName: "表单", optionValue: "form" },
  { optionName: "按钮", optionValue: "button" }
];
// 添加分组配置
export const formGroupConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "创建人",
      prop: "createUserName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="创建人" disabled />
    },
    {
      label: "创建时间",
      prop: "createDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-date-picker v-model={formModel[row.prop]} type="date" valueFormat="YYYY-MM-DD" disabled />
    },
    {
      label: "最后修改人",
      prop: "modifyUserName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "修改时间",
      prop: "modifyDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-date-picker v-model={formModel[row.prop]} type="date" valueFormat="YYYY-MM-DD" disabled />
    },
    {
      label: "分组名称",
      prop: "groupName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "分组编号",
      prop: "groupCode",
      colProp: { span: 12 },
      slots: {
        label: () => (
          <span>
            分组编号
            <el-tooltip placement="top" content="分组编号最小的为主表格(默认表格), 其余表格按顺序对应">
              <Question />
            </el-tooltip>
          </span>
        )
      },
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={1} max={100} controls-position="right" placeholder="请输入分组编号" style="width: 100%" />
      )
    },
    {
      label: "备注",
      prop: "remark",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    }
  ];
};

// 添加布局配置
export const formLayoutConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "创建人",
      prop: "createUserName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="创建人" disabled />
    },
    {
      label: "创建时间",
      prop: "createDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-date-picker v-model={formModel[row.prop]} type="date" valueFormat="YYYY-MM-DD" disabled />
    },
    {
      label: "最后修改人",
      prop: "modifyUserName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "修改时间",
      prop: "modifyDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-date-picker v-model={formModel[row.prop]} type="date" valueFormat="YYYY-MM-DD" disabled />
    },
    {
      label: "布局名称",
      prop: "groupName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "布局类型",
      prop: "layoutType",
      colProp: { span: 12 },
      slots: {
        label: () => (
          <span>
            布局类型
            <el-tooltip placement="top" content="分组编号最小的为主表格(默认表格), 其余表格按顺序对应">
              <Question />
            </el-tooltip>
          </span>
        )
      },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {layoutOptions.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "备注",
      prop: "remark",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    }
  ];
};
