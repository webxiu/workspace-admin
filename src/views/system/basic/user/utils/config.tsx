import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";
import regExp from "@/utils/regExp";

const GridSpan = 12;
const layout = { span: GridSpan, xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };

// 编辑员工信息校验
export const formRules = reactive<FormRules>({
  userCode: [{ required: true, message: "员工工号为必填项", trigger: "blur" }],
  userName: [{ required: true, message: "员工姓名为必填项", trigger: "blur" }],
  deptId: [{ required: true, message: "部门为必选项", trigger: "blur" }],
  mobile: [
    { required: true, message: "移动电话为必填项", trigger: "blur" },
    { message: "移动电话格式不正确", trigger: "blur", pattern: regExp.phone }
  ],
  userState: [{ required: true, message: "状态为必选项", trigger: "blur" }],
  email: [
    { required: false, message: "请输入邮箱号码", trigger: "blur" },
    { message: "邮箱格式不正确", trigger: "blur", pattern: regExp.email }
  ]
});

// 编辑员工信息表单
export const formConfigs = ({ type, stateOptions, deptOptions }): FormConfigItemType[] => {
  const configArr = [
    {
      label: "员工工号",
      prop: "userCode",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入员工工号" clearable disabled={type === "edit"} />;
      }
    },
    {
      label: "员工姓名",
      prop: "userName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入员工姓名" clearable />;
      }
    },
    {
      label: "部门",
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
            render-after-expand={false}
            placeholder="请选择所属分组"
            class="ui-w-100"
            props={{ label: "name", value: "value" }}
          />
        );
      }
    },
    {
      label: "岗位",
      prop: "roleName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入岗位" clearable />;
      }
    },

    {
      label: "移动电话",
      prop: "mobile",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入移动电话" clearable />;
      }
    },
    {
      label: "邮箱地址",
      prop: "email",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入邮箱地址" clearable />;
      }
    },
    {
      label: "群晖账户",
      prop: "qunhuiAccount",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入群晖账户" clearable />;
      }
    },
    {
      label: "群晖密码",
      prop: "qunhuiPassword",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入群晖密码" clearable />;
      }
    },
    {
      label: "企业微信",
      prop: "wxOpenid",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入企业微信" clearable />;
      }
    },
    {
      label: "金蝶账号",
      prop: "k3UserAccount",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled placeholder="请输入金蝶账号" clearable />;
      }
    },
    {
      label: "状态",
      prop: "userState",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select
            v-model={formModel[row.prop]}
            placeholder="请选择状态"
            filterable
            value-key="id"
            clearable
            collapse-tags
            collapse-tags-tooltip
            class="ui-w-100"
          >
            {stateOptions.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    }
  ];

  return type === "add" ? configArr.filter((item) => item.prop !== "k3UserAccount") : configArr;
};
