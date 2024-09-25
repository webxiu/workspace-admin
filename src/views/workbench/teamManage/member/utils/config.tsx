import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

const layout = { span: 24 };

// 修改岗位验证
export const formRules = reactive<FormRules>({
  roleId: [{ required: true, message: "岗位为必选项", trigger: "blur" }],
  deptId: [{ required: true, message: "部门为必选项", trigger: "blur" }]
});

// 修改部门验证
export const formRules2 = reactive<FormRules>({
  groupName: [{ required: true, message: "分组名称为必填项", trigger: "blur" }],
  groupCode: [{ required: true, message: "分组编号为必填项", trigger: "blur" }],
  deptName: [{ required: true, message: "所属部门为必填项", trigger: "blur" }]
});

// 修改岗位
export const formConfigs = ({ roleInfoList, deptInfoTree, depGroupList }): FormConfigItemType[] => {
  return [
    {
      label: "姓名",
      prop: "staffName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入姓名" clearable />
    },
    {
      label: "岗位",
      prop: "roleId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select
            v-model={formModel[row.prop]}
            placeholder="请选择岗位"
            filterable
            value-key="id"
            clearable
            collapse-tags
            collapse-tags-tooltip
            class="ui-w-100"
          >
            {roleInfoList.value.map((item) => (
              <el-option key={item.id} label={item.roleName} value={item.id} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "部门",
      prop: "deptId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            clearable
            v-model={formModel[row.prop]}
            data={deptInfoTree}
            check-strictly={true}
            check-on-click-node={true}
            render-after-expand={false}
            node-key="id"
            class="ui-w-100"
            placeholder="请选择部门"
            props={{ children: "children", label: "name", value: "id" }}
          />
        );
      }
    },
    {
      label: "组别",
      prop: "groupId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            clearable
            v-model={formModel[row.prop]}
            data={depGroupList.value}
            check-strictly={true}
            check-on-click-node
            render-after-expand={false}
            class="ui-w-100"
            placeholder="请选择组别"
            props={{ label: "title", value: "id" }}
          />
        );
      }
    }
  ];
};

// 修改部门
export const formConfigs2 = ({ leaderList, depGroupList }): FormConfigItemType[] => {
  return [
    {
      label: "分组名称",
      prop: "groupName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入分组名称" clearable />
    },
    {
      label: "分组编号",
      prop: "groupCode",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入分组编号" clearable />
    },
    {
      label: "所属分组",
      prop: "parentId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            clearable
            v-model={formModel[row.prop]}
            data={depGroupList.value}
            check-strictly={true}
            check-on-click-node
            render-after-expand={false}
            class="ui-w-100"
            placeholder="请选择所属分组"
            props={{ label: "title", value: "id" }}
          />
        );
      }
    },
    {
      label: "所属部门",
      prop: "deptName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入所属部门" clearable />
    },
    {
      label: "组别负责人",
      prop: "leaderId",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select
            v-model={formModel[row.prop]}
            placeholder="请选组别负责人"
            filterable
            value-key="id"
            clearable
            collapse-tags
            collapse-tags-tooltip
            class="ui-w-100"
          >
            {leaderList.value.map((item) => (
              <el-option key={item.id} label={item.userName} value={item.id} />
            ))}
          </el-select>
        );
      }
    }
  ];
};
