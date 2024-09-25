import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  sn: [{ required: true, message: "设备序列号为必填项", trigger: "submit" }],
  attMachineName: [{ required: true, message: "考勤机名称为必填项", trigger: "submit" }]
});

export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "名称",
      prop: "attMachineName",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "设备序列号",
      prop: "sn",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "断网重连间隔(秒)",
      prop: "errorDelay",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "心跳(秒)",
      prop: "delay",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "服务器支持协议版本",
      prop: "serverVer",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "服务器开发协议版本",
      prop: "pushProtVer",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "加密传输",
      prop: "encrypt",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-radio-group v-model={formModel[row.prop]}>
            <el-radio label={1}>是</el-radio>
            <el-radio label={0}>否</el-radio>
          </el-radio-group>
        );
      }
    },
    {
      label: "自动上传标识",
      prop: "transFlag",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "支持设备推送",
      prop: "pushOptionsFlag",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-radio-group v-model={formModel[row.prop]}>
            <el-radio label={1}>是</el-radio>
            <el-radio label={0}>否</el-radio>
          </el-radio-group>
        );
      }
    },
    {
      label: "推送配置参数",
      prop: "pushOptions",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input type="textarea" autosize v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "数据加密的标识",
      prop: "encryptFlag",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "支持ping协议",
      prop: "supportPing",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-radio-group v-model={formModel[row.prop]}>
            <el-radio label={1}>是</el-radio>
            <el-radio label={0}>否</el-radio>
          </el-radio-group>
        );
      }
    },
    {
      label: "实时上传",
      prop: "realTime",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-radio-group v-model={formModel[row.prop]}>
            <el-radio label={1}>是</el-radio>
            <el-radio label={0}>否</el-radio>
          </el-radio-group>
        );
      }
    },
    {
      label: "时区",
      prop: "timeZone",
      labelWidth: 160,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    }
  ];
};
