import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

const GridSpan = 12;
const layout = { span: GridSpan, xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };

// 1.部门编辑弹窗表单校验规则
export const formRules = reactive<FormRules>({
  deptCode: [{ required: true, message: "部门编号为必填项", trigger: "blur" }],
  deptName: [{ required: true, message: "部门名称为必填项", trigger: "blur" }],
  displayOrder: [{ required: true, message: "显示顺序必填项", trigger: "blur" }],
  parentId: [{ required: true, message: "父级部门为必选项", trigger: "blur" }]
});
// 2.分组编辑弹窗表单校验规则
export const formGroupRules = reactive<FormRules>({
  groupCode: [{ required: true, message: "分组编号为必填项", trigger: "blur" }],
  groupName: [{ required: true, message: "分组名称为必填项", trigger: "blur" }],
  parentId: [{ required: true, message: "所属分组为必填项", trigger: "blur" }],
  deptCode: [{ required: true, message: "所属部门编号必填项", trigger: "blur" }],
  deptName: [{ required: true, message: "所属部门为必选项", trigger: "blur" }]
});

// 1.部门编辑弹窗表单配置
export const formConfigs = ({ depUserInfo, deptInfoTree, type }): FormConfigItemType[] => {
  return [
    {
      label: "部门编号",
      prop: "deptCode",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入部门编号" clearable />;
      }
    },
    {
      label: "部门名称",
      prop: "deptName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入部门名称" clearable />;
      }
    },
    {
      label: "显示顺序",
      prop: "displayOrder",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入显示顺序" clearable />;
      }
    },
    {
      label: "父级部门",
      prop: "parentId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            clearable
            filterable
            data={deptInfoTree.value}
            check-strictly={true}
            check-on-click-node
            render-after-expand={false}
            placeholder="请选择父级部门"
            class="ui-w-100"
            props={{ label: "name", value: "id" }}
          />
        );
      }
    },
    {
      label: "企业微信部门ID",
      prop: "qyWeiXinDeptId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入企业微信部门ID" disabled clearable />;
      }
    },
    {
      label: "金蝶系统部门ID",
      prop: "k3DeptId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入金蝶系统部门ID" disabled clearable />;
      }
    },
    {
      label: "金蝶系统部门编号",
      prop: "k3DeptCode",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入金蝶系统部门编号" disabled clearable />;
      }
    },

    {
      label: "部门负责人",
      prop: "principalId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select
            v-model={formModel[row.prop]}
            placeholder="请选择部门负责人"
            filterable
            value-key="id"
            clearable
            collapse-tags
            collapse-tags-tooltip
            class="ui-w-100"
          >
            {depUserInfo.value.map((item) => (
              <el-option key={item.value} label={item.userName} value={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "部门文员",
      prop: "clerkId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select
            v-model={formModel[row.prop]}
            placeholder="请选择部门文员"
            multiple
            value-key="id"
            filterable
            clearable
            collapse-tags
            max-collapse-tags={2}
            collapse-tags-tooltip
            class="ui-w-100"
          >
            {depUserInfo.value.map((item) => (
              <el-option key={item.value} label={item.userName} value={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "部门层级",
      prop: "level",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-input-number
            disabled={type === "add"}
            controls={false}
            style={{ width: "100%" }}
            min={1}
            max={10}
            precision={0}
            v-model={formModel[row.prop]}
            clearable
          />
        );
      }
    }
  ];
};
// 2.分组编辑弹窗表单配置
export const formConfigGroups = ({ depGroupLeaderList, belongGroupList }): FormConfigItemType[] => {
  return [
    {
      label: "分组编号",
      prop: "groupCode",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入分组编号" disabled />;
      }
    },
    {
      label: "分组名称",
      prop: "groupName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入分组名称" clearable />;
      }
    },
    {
      label: "组别负责人",
      prop: "leaderId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            clearable
            filterable
            data={depGroupLeaderList.value}
            check-strictly={true}
            check-on-click-node
            render-after-expand={false}
            placeholder="请选择组别负责人"
            class="ui-w-100"
            props={{ label: "userName", value: "id" }}
          />
        );
      }
    },
    {
      label: "所属分组",
      prop: "parentId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            clearable
            filterable
            data={belongGroupList.value}
            check-strictly={true}
            check-on-click-node
            render-after-expand={false}
            placeholder="请选择所属分组"
            class="ui-w-100"
            props={{ label: "name", value: "id" }}
          />
        );
      }
    },
    {
      label: "所属部门编号",
      prop: "deptCode",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入所属部门编号" disabled clearable />;
      }
    },
    {
      label: "所属部门",
      prop: "deptName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入所属部门" disabled clearable />;
      }
    }
  ];
};
