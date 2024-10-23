import { Ref, reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";

const checkEmailAdviceWay = (formData, rule: any, value: any, callback: any) => {
  if (formData.adviceByEmail && !value) {
    callback(new Error("请选择通知方式"));
  } else {
    callback();
  }
};

// 修改参数校验
export const formRules = (formData): FormRules => {
  return {
    jobName: [{ required: true, message: "请输入任务标识", trigger: "blur" }],
    taskName: [{ required: true, message: "请输入任务名称", trigger: "blur" }],
    jobGroup: [{ required: true, message: "请输入任务组别", trigger: "blur" }],
    disabled: [{ required: true, message: "请选择状态", trigger: "blur" }],
    cronSchedule: [{ required: true, message: "请输入定时表达式", trigger: "blur" }],
    dataSources: [{ required: true, message: "请选择数据来源", trigger: "blur" }],
    toType: [{ required: true, message: "请选择推送类型", trigger: "blur" }],
    taskType: [{ required: true, message: "请选择任务类型", trigger: "blur" }],
    emailAdviceWay: [{ validator: checkEmailAdviceWay.bind(null, formData), trigger: "blur" }]
  };
};

const GridSpan = 24;
const layout = { span: GridSpan, xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };

// 修改参数名称
export const formConfigs = ({ statusOptions, onSetCronSchedule, dataSourceOptions, pushTypeOptions, taskTypeOption, formData }): Ref<FormConfigItemType[]> => {
  const formConfs = [
    {
      label: "任务标识",
      prop: "jobName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入任务标识" clearable />;
      }
    },
    {
      label: "任务名称",
      prop: "taskName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入任务名称" clearable />;
      }
    },
    {
      label: "任务组别",
      prop: "jobGroup",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入任务组别" clearable />;
      }
    },
    {
      label: "状态",
      prop: "disabled",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择状态" clearable class="ui-w-100">
            {statusOptions.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "定时表达式",
      prop: "cronSchedule",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请输入定时表达式" clearable>
            {{ append: () => <el-button onClick={onSetCronSchedule}>设置</el-button> }}
          </el-input>
        );
      }
    },
    {
      label: "数据来源",
      prop: "dataSources",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择数据来源" clearable class="ui-w-100">
            {dataSourceOptions.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "推送标题",
      prop: "toTitle",
      colProp: layout,
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入推送标题" clearable />;
      }
    },
    {
      label: "推送类型",
      prop: "toType",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select onChange={onChangeToType} v-model={formModel[row.prop]} placeholder="请选择" clearable class="ui-w-100">
            {pushTypeOptions.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "任务类型",
      prop: "taskType",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-select onChange={onChangeTaskType} v-model={formModel[row.prop]} placeholder="请选择" clearable class="ui-w-100">
            {taskTypeOption.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    { label: "", prop: "taskType", colProp: { span: 12 }, render: () => null }, // 占位
    {
      label: "企业微信通知",
      prop: "adviceByQywx",
      colProp: { span: 8 },
      render: ({ formModel, row }) => {
        return <el-switch v-model={formModel[row.prop]} active-value={true} inactive-value={false} />;
      }
    },
    {
      label: "邮件通知",
      prop: "adviceByEmail",
      colProp: { span: 8 },
      render: ({ formModel, row }) => <el-switch onChange={onChangeEmail} v-model={formModel[row.prop]} active-value={true} inactive-value={false} />
    },
    {
      label: "限定工作日",
      prop: "limitedWorkingDay",
      colProp: { span: 8 },
      render: ({ formModel, row }) => <el-switch v-model={formModel[row.prop]} active-value={true} inactive-value={false} />
    },
    {
      label: "邮件通知方式",
      prop: "emailAdviceWay",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-radio-group v-model={formModel[row.prop]}>
            <el-radio label={1} border>
              文本
            </el-radio>
            <el-radio label={2} border>
              附件
            </el-radio>
          </el-radio-group>
        );
      }
    },
    {
      label: "webhook",
      prop: "webhookUrl",
      hide: true,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入webhook地址" clearable />;
      }
    },
    {
      label: "URL地址",
      prop: "url",
      hide: false,
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入URL地址" clearable />;
      }
    },
    {
      label: "推送消息体查询语句",
      prop: "messageBody",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} type="textarea" rows={6} placeholder="请输入推送消息体查询语句" clearable />;
      }
    },
    {
      label: "描述",
      prop: "directions",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} type="textarea" resize="none" rows={4} placeholder="请输入描述" clearable />;
      }
    }
  ];

  const filterConf = formConfs.filter((f) => !["emailAdviceWay"].includes(f.prop));
  const newFormConfig = ref<FormConfigItemType[]>(filterConf);
  const onChangeEmail = (checked: boolean) => {
    newFormConfig.value = checked ? formConfs : filterConf;
  };
  const onChangeTaskType = (taskType) => {
    const findTaskInfoIdx = newFormConfig.value.findIndex((el) => el.prop === "url");
    if (taskType !== "0") {
      newFormConfig.value[findTaskInfoIdx].hide = false;
    } else {
      newFormConfig.value[findTaskInfoIdx].hide = true;
      formData.url = "";
    }
  };
  onChangeTaskType(formData.taskType);
  const onChangeToType = (toType) => {
    const findtoTypeInfoIdx = newFormConfig.value.findIndex((el) => el.prop === "webhookUrl");
    if (toType === "机器人") {
      newFormConfig.value[findtoTypeInfoIdx].hide = false;
    } else {
      newFormConfig.value[findtoTypeInfoIdx].hide = true;
      formData.webhookUrl = "";
    }
  };
  onChangeToType(formData.toType);
  return newFormConfig;
};
