import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";
import BeforeTask from "./components/beforeTask.vue";
import Deliverable from "./components/deliverable.vue";

export const groupFormRules = reactive<FormRules>({
  groupName: [{ required: true, message: "分组名称为必填项", trigger: "submit" }]
});

export const taskFormRules = reactive<FormRules>({
  name: [{ required: true, message: "任务名称为必填项", trigger: "submit" }],
  duration: [{ required: true, message: "工期为必填项", trigger: "submit" }],
  taskUser: [{ required: true, message: "责任人为必填项", trigger: "submit" }],
  deliverable: [{ required: true, message: "交付物为必填项", trigger: "submit" }],
  beforeTask: [{ required: true, message: "前置任务为必填项", trigger: "submit" }],
  relationUser: [{ required: true, message: "相关人为必填项", trigger: "submit" }],
  taskDeptId: [{ required: true, message: "负责岗位为必填项", trigger: "submit" }]
});

export const groupFormConfgs = (): FormConfigItemType[] => {
  return [
    {
      label: "分组名称",
      colProp: { span: 24 },
      labelWidth: 80,
      prop: "groupName",
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} />;
      }
    }
  ];
};

export const taskFormConfgs = ({ taskOpts, roleList, changeTaskDeptId, userList, relationUserList, topFormData, beforeTaskRef }): FormConfigItemType[] => {
  return [
    {
      label: "任务名称",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "name",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} style={{ width: "100%" }} filterable placeholder="选择任务">
            {taskOpts.value?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} disabled={item.disabled} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "工期(天)",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "duration",
      render: ({ formModel, row }) => {
        return <el-input-number style={{ width: "100%" }} controls={false} v-model={formModel[row.prop]} min={1} />;
      }
    },
    {
      label: "负责岗位",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "taskDeptId",
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} style={{ width: "100%" }} placeholder="选择负责岗位" filterable onChange={changeTaskDeptId}>
            {roleList.value?.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "负责人",
      colProp: { span: 8 },
      labelWidth: 80,
      prop: "taskUser",
      render: ({ formModel, row }) => {
        return (
          <el-select filterable v-model={formModel[row.prop]} style={{ width: "100%" }} placeholder="选择负责人">
            {userList.value?.map((item) => (
              <el-option key={item.value} label={item.label} value={item.value} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "相关人",
      colProp: { span: 16 },
      labelWidth: 80,
      prop: "relationUser",
      render: ({ formModel, row }) => {
        return (
          <el-select
            multiple
            collapse-tags
            filterable
            collapse-tags-tooltip
            max-collapse-tags={8}
            v-model={formModel[row.prop]}
            style={{ width: "100%" }}
            placeholder="选择相关人"
          >
            {relationUserList.value?.map((item) => (
              <el-option key={item.key} label={item.label} value={item.key} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "",
      prop: "",
      colProp: { span: 24 },
      render: () => null
    },
    {
      label: "",
      prop: "",
      colProp: { span: 24 },
      render: () => null
    },
    {
      label: "",
      colProp: { span: 12 },
      prop: "beforeTask",
      labelWidth: 80,
      render: ({ formModel, row }) => {
        return <BeforeTask topFormData={topFormData} ref={beforeTaskRef} v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "",
      colProp: { span: 12 },
      labelWidth: 80,
      prop: "deliverable",
      render: ({ formModel, row }) => {
        return <Deliverable v-model={formModel[row.prop]} />;
      }
    }
  ];
};
