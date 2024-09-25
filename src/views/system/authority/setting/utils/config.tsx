import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";
import regExp from "@/utils/regExp";

const GridSpan = 12;
const layout = { span: GridSpan, xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  deptName: [{ required: true, message: "所属部门为必选项", trigger: "blur" }],
  roleCode: [{ required: true, message: "角色编号为必填项", trigger: "blur" }],
  roleName: [{ required: true, message: "角色名称为必填项", trigger: "blur" }],
  staffingPeopleCount: [{ required: true, message: "编制人数为必填项", trigger: "blur" }]
});

// 编辑角色
export const formConfigs = ({ deptOptions }): FormConfigItemType[] => {
  return [
    {
      label: "所属部门",
      prop: "deptId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            clearable
            filterable
            data={deptOptions.value}
            check-strictly={true}
            check-on-click-node
            default-expand-all={true}
            render-after-expand={false}
            placeholder="请选择所属部门"
            class="ui-w-100"
            props={{ label: "name", value: "id" }}
          />
        );
      }
    },
    {
      label: "角色编号",
      prop: "roleCode",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入角色编号" clearable />;
      }
    },
    {
      label: "角色名称",
      prop: "roleName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入角色名称" clearable />;
      }
    },
    {
      label: "企业微信标签ID",
      prop: "tagid",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入标签ID" clearable />;
      }
    },
    {
      label: "编制人数",
      prop: "staffingPeopleCount",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入编制人数" clearable />;
      }
    },

    {
      label: "金蝶ID",
      prop: "k3RoleId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入金蝶ID" clearable disabled />;
      }
    },
    {
      label: "金蝶编号",
      prop: "k3RoleCode",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入金蝶编号" clearable disabled />;
      }
    },
    {
      label: "说明",
      prop: "remark",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入说明" clearable />;
      }
    }
  ];
};
