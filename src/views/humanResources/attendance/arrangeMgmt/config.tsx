import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  morningStartTime: [{ required: true, message: "上午上班时间为必填项", trigger: "submit" }],
  morningEndTime: [{ required: true, message: "上午下班时间为必填项", trigger: "submit" }],
  afternoonStartTime: [{ required: true, message: "下午上班时间为必填项", trigger: "submit" }],
  afternoonEndTime: [{ required: true, message: "下午下班时间为必填项", trigger: "submit" }]
});

export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "上午上班",
      prop: "morningStartTime",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-time-picker
            v-model={formModel[row.prop]}
            value-format="HH:mm"
            format="HH:mm"
            arrowControl
            placeholder="请选择上午上班时间"
            style={{ width: "100%" }}
            clearable
          />
        );
      }
    },
    {
      label: "上午下班",
      prop: "morningEndTime",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-time-picker
            v-model={formModel[row.prop]}
            value-format="HH:mm"
            format="HH:mm"
            arrowControl
            placeholder="请选择上午下班时间"
            style={{ width: "100%" }}
            clearable
          />
        );
      }
    },
    {
      label: "下午上班",
      prop: "afternoonStartTime",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-time-picker
            v-model={formModel[row.prop]}
            value-format="HH:mm"
            format="HH:mm"
            arrowControl
            placeholder="请选择下午上班时间"
            style={{ width: "100%" }}
            clearable
          />
        );
      }
    },
    {
      label: "下午下班",
      prop: "afternoonEndTime",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-time-picker
            v-model={formModel[row.prop]}
            value-format="HH:mm"
            format="HH:mm"
            arrowControl
            placeholder="请选择下午下班时间"
            style={{ width: "100%" }}
            clearable
          />
        );
      }
    }
  ];
};
