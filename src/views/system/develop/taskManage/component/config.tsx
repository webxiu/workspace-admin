import { FormRules, UploadProps } from "element-plus";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { TaskMangeOptionType } from "@/api/systemManage";
import { message } from "@/utils/message";
import { reactive } from "vue";

const layout = { span: 12, xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };

// 上传客诉文件
const accept = ["file"];
const maxSize = 10; // 最大上传5M

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

interface FormConfigType {
  onUploadChange: Function;
  taskOptions: TaskMangeOptionType;
  type?: string;
}

// 表单配置
export const formConfigs = (options: FormConfigType): FormConfigItemType[] => {
  const { onUploadChange, taskOptions } = options;

  const configArr = [
    {
      label: "任务名称",
      prop: "taskName",
      colProp: { span: 24 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入任务名称" clearable />
    },
    {
      label: "开始时间",
      prop: "startTime",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            style={{ width: "100%" }}
            v-model={formModel[row.prop]}
            type="date"
            placeholder="开始时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="ui-w-100"
          />
        );
      }
    },
    {
      label: "结束时间",
      prop: "endTime",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-date-picker
            style={{ width: "100%" }}
            v-model={formModel[row.prop]}
            type="date"
            placeholder="开始时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            class="ui-w-100"
          />
        );
      }
    },
    {
      label: "责任人",
      prop: "responsibleMan",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" filterable value-key="id" clearable class="ui-w-100">
            {taskOptions.userinfoList.map((item) => (
              <el-option key={item.userCode} label={item.userName} value={item.userCode} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "工时",
      prop: "duration",
      colProp: layout,
      render: ({ formModel, row }) => <el-input-number controls-position="right" min={0} v-model={formModel[row.prop]} placeholder="请输入" class="ui-w-100" />
    },
    {
      label: "优先级",
      prop: "priority",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" filterable value-key="id" clearable class="ui-w-100">
            {taskOptions.priorityList?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    // 2024.09.26隐藏
    // {
    //   label: "序号",
    //   prop: "number",
    //   colProp: layout,
    //   render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    // },
    {
      label: "上级任务",
      prop: "parentBillNo",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} clearable placeholder="请输入" />
    },
    {
      label: "任务类型",
      prop: "taskTypeCode",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" filterable value-key="id" clearable class="ui-w-100">
            {taskOptions.taskTypeCodeList?.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "分值",
      prop: "score",
      colProp: layout,
      render: ({ formModel, row }) => (
        <el-input-number controls-position="right" min={0} max={100} v-model={formModel[row.prop]} placeholder="请输入" class="ui-w-100" />
      )
    },
    {
      label: "任务编号",
      prop: "billNo",
      colProp: layout,
      render: ({ formModel, row }) => <el-input disabled={options.type === "add"} v-model={formModel[row.prop]} placeholder="自动生成" class="ui-w-100" />
    },
    {
      label: "文件",
      prop: "file",
      colProp: layout,
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => {
        const onChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
          const files = uploadFiles.map((item) => item.raw);
          formModel[row.prop] = files;
          // const ext = rawFile.type?.split("/")[1];
          // if (!accept.includes(`.${ext}`)) {
          //   return message("文件格式不正确!", { type: "error" });
          // }
          // if (rawFile.size / 1024 / 1024 > maxSize) {
          //   return message(`文件大小不能超过${maxSize}MB！`, { type: "warning" });
          // }
          onUploadChange(files);
        };
        return (
          <el-upload accept={accept.join(",")} multiple auto-upload={false} show-file-list={false} on-change={onChange}>
            <el-button type="primary">选择文件</el-button>
          </el-upload>
        );
      }
    }
  ];

  return configArr;
};
