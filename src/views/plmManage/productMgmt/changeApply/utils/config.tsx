import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { Question } from "@/config/elements";
import { reactive } from "vue";

const layout = { span: 12 };

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  tabletsCode: [{ required: true, message: "请输入平板编号", trigger: "blur" }],
  tabletsName: [{ required: true, message: "请输入平板名称", trigger: "blur" }],
  productionLine: [{ required: true, message: "请输入生产线", trigger: "blur" }],
  tabletsPosition: [{ required: true, message: "请输入平板方位", trigger: "blur" }],
  tabletsSlot: [{ required: true, message: "请输入平板位号", trigger: "blur" }],
  tabletsID: [{ required: true, message: "请输入平板ID", trigger: "blur" }]
});

export const formConfigs = ({ productLineOption, positionOption }): FormConfigItemType[] => {
  return [
    {
      label: "单据编号",
      prop: "tabletsSlot",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-input-number v-model={formModel[row.prop]} min={1} max={1000} controls-position="right" placeholder="请输入" style="width: 100%" clearable />
      )
    },
    {
      label: "平板编号",
      prop: "tabletsCode",
      colProp: layout,
      slots: {
        label: () => (
          <span>
            平板编号
            <el-tooltip placement="top" content="平板编号以P开头命名">
              <Question />
            </el-tooltip>
          </span>
        )
      },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "平板名称",
      prop: "tabletsName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "生产线",
      prop: "productionLine",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" class="ui-w-100">
            {productLineOption.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "平板方位",
      prop: "tabletsPosition",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" class="ui-w-100">
            {positionOption.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "修改时间",
      prop: "modifyDate",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled clearable />
    },
    {
      label: "平板ID",
      prop: "tabletsID",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled clearable />
    }
  ];
};
