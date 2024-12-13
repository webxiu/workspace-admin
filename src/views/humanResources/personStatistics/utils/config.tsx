import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";
import regExp from "@/utils/regExp";

const GridSpan = 12;
const layout = { span: GridSpan, xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  authorityFlagId: [{ required: true, message: "权限为必选项", trigger: "blur" }]
});

// 查询角色
export const roleFormConfig: FormConfigItemType[] = [
  {
    label: "角色名称",
    prop: "roleName",
    colProp: { span: 6 },
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入角色名称" clearable />;
    }
  }
];

// 查询菜单
export const menuFormConfig = ({ stateOptions }): FormConfigItemType[] => {
  return [
    {
      label: "菜单名称",
      prop: "menuNameParam",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入角色名称" clearable />;
      }
    }
  ];
};

// 编辑员工信息表单
export const formConfigs = ({ selectOptions }): FormConfigItemType[] => {
  return [
    {
      label: "权限选项",
      prop: "authorityFlagId",
      colProp: { span: 20 },
      render: ({ formModel, row }) => {
        return (
          <el-select
            v-model={formModel[row.prop]}
            placeholder="请选择"
            filterable
            value-key="id"
            clearable
            collapse-tags
            collapse-tags-tooltip
            class="ui-w-100"
          >
            {selectOptions.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    }
  ];
};
