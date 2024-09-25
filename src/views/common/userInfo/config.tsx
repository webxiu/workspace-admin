import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

const formRules = reactive<FormRules>({
  name: [{ required: true, message: "秘钥名称为必填项", trigger: "submit" }]
});

const formBaseRules = reactive<FormRules>({});

const formRules2 = reactive<FormRules>({
  password: [{ required: true, message: "密码为必填项", trigger: "submit" }]
});

const formConfigs = () => [
  {
    label: "密钥名称",
    labelWidth: 80,
    prop: "name",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入密钥名称" />;
    }
  },
  {
    label: "备注",
    labelWidth: 80,
    prop: "secretRemarks",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入备注" />;
    }
  }
];

const formBaseConfigs = (updateBaseUserInfo): FormConfigItemType[] => [
  {
    label: "工号",
    labelWidth: 90,
    colProp: { span: 8 },
    prop: "userCode",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled={true} />;
    }
  },
  {
    label: "姓名",
    labelWidth: 90,
    colProp: { span: 8 },
    prop: "userName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled={true} />;
    }
  },
  {
    label: "移动电话",
    labelWidth: 90,
    colProp: { span: 8 },
    prop: "mobile",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled={true} />;
    }
  },

  {
    label: "部门",
    labelWidth: 90,
    colProp: { span: 8 },
    prop: "deptName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled={true} />;
    }
  },
  {
    label: "岗位",
    labelWidth: 90,
    colProp: { span: 8 },
    prop: "postName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled={true} />;
    }
  },
  {
    label: "状态",
    labelWidth: 90,
    colProp: { span: 8 },
    prop: "userState",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} disabled={true} />;
    }
  },
  {
    label: "企业微信",
    labelWidth: 90,
    colProp: { span: 24 },
    prop: "wxOpenid",
    render: ({ formModel, row }) => {
      return (
        <div style={{ width: "720px" }}>
          <el-input v-model={formModel[row.prop]} disabled={true} />
        </div>
      );
    }
  },
  {
    label: "群晖账号",
    labelWidth: 90,
    colProp: { span: 8 },
    prop: "qunhuiAccount",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入群晖账号" />;
    }
  },
  {
    label: "群晖密码",
    labelWidth: 90,
    colProp: { span: 8 },
    prop: "qunhuiPassword",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入群晖密码" />;
    }
  },
  {
    label: " ",
    labelWidth: 90,
    colProp: { span: 8 },
    prop: "",
    render: () => {
      return (
        <div>
          <el-button type="primary" size="small" onClick={() => updateBaseUserInfo("qunhui")}>
            更新群晖信息
          </el-button>
        </div>
      );
    }
  },
  {
    labelWidth: 90,
    label: "金蝶账号",
    colProp: { span: 8 },
    prop: "k3UserAccount",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder="请输入金蝶账号" />;
    }
  },
  {
    label: " ",
    labelWidth: 90,
    colProp: { span: 8 },
    prop: "",
    render: () => {
      return (
        <div>
          <el-button type="primary" size="small" onClick={() => updateBaseUserInfo("k3")}>
            更新金蝶信息
          </el-button>
        </div>
      );
    }
  }
];

const formConfigs2 = () => [
  {
    label: "工号",
    labelWidth: 80,
    prop: "userNo",
    render: ({ formModel, row }) => {
      return <el-input disabled v-model={formModel[row.prop]} placeholder="请输入工号" />;
    }
  },
  {
    label: "密码",
    labelWidth: 80,
    prop: "password",
    render: ({ formModel, row }) => {
      return <el-input type="password" show-password v-model={formModel[row.prop]} placeholder="请输入密码" />;
    }
  }
];

export { formRules, formConfigs, formBaseRules, formBaseConfigs, formRules2, formConfigs2 };
