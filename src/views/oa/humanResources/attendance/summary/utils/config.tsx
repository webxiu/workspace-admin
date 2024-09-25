import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import ImportUpload from "../../../performanceManage/utils/importUpload.vue";
import { reactive } from "vue";

// 修改考勤验证
export const formRules = reactive<FormRules>({
  annualLeaveTerms: [{ required: true, message: "请输入年假", trigger: "blur" }],
  beLateTime: [{ required: true, message: "请输入迟到时间", trigger: "blur" }],
  earlyTime: [{ required: true, message: "请输入早退时间", trigger: "blur" }],
  absenteeismTime: [{ required: true, message: "请输入旷工时间", trigger: "blur" }],
  peacetimeOverTime: [{ required: true, message: "平时加班时间" }],
  restOverTime: [{ required: true, message: "休息加班时间" }],
  overTimeSum: [{ required: true, message: "加班汇总" }],
  specialOverTime: [{ required: true, message: "特殊加班" }]
});

// 导入考勤
export const importFormRules = reactive<FormRules>({
  yearAndMonth: [{ required: true, message: "年月必填", trigger: "blur" }],
  category: [{ required: true, message: "类别必填", trigger: "blur" }],
  file: [{ required: true, message: "请上传文件", trigger: "blur" }]
});

// 查看异常状态表单验证
export const formRules2 = reactive<FormRules>({
  annualLeaveTerms: [{ required: false, message: "请输入年假", trigger: "blur" }],
  beLateTime: [{ required: false, message: "请输入迟到时间", trigger: "blur" }],
  earlyTime: [{ required: false, message: "请输入早退时间", trigger: "blur" }],
  absenteeismTime: [{ required: false, message: "请输入旷工时间", trigger: "blur" }],
  peacetimeOverTime: [{ required: false, message: "平时加班时间" }],
  restOverTime: [{ required: false, message: "休息加班时间" }],
  overTimeSum: [{ required: false, message: "加班汇总" }],
  specialOverTime: [{ required: false, message: "特殊加班" }]
});

const layout = { span: 12 };

// 导入考勤
export const importFormConfigs = (formData): FormConfigItemType[] => {
  return [
    {
      label: "年月",
      prop: "yearAndMonth",
      render: ({ formModel, row }) => (
        <el-date-picker style={{ width: "100%" }} valueFormat="YYYY-MM" v-model={formModel[row.prop]} type="month" placeholder="选择年月" />
      )
    },
    {
      label: "类别",
      prop: "category",
      render: ({ formModel, row }) => (
        <el-select v-model={formModel[row.prop]} placeholder="选择类别" style={{ width: "100%" }}>
          <el-option label="职员" value="clerk" />
          <el-option label="员工" value="staff" />
        </el-select>
      )
    },
    {
      label: "文件",
      prop: "file",
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => {
        const onRemove = () => {
          formData.file = null;
        };
        return (
          <div style={{ width: "100%" }}>
            <ImportUpload onRemove={onRemove} v-model={formModel[row.prop]} accept=".xls,.xlsx" />
          </div>
        );
      }
    }
  ];
};

// 修改考勤
export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "工号",
      prop: "userCode",
      colProp: layout,
      render: ({ formModel, row }) => <el-input disabled v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "姓名",
      prop: "staffName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input disabled v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "部门",
      prop: "deptName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input disabled v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "组别",
      prop: "productionGroup",
      colProp: layout,
      render: ({ formModel, row }) => <el-input disabled v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "应出勤(H)",
      prop: "beOnDuty",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "实际出勤(H)",
      prop: "actualAttendance",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "应出勤(天)",
      prop: "beAttendanceDay",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "实际出勤(天)",
      prop: "actualAttendanceDay",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "年假(H)",
      prop: "annualLeaveTerms",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "迟到时间(M)",
      prop: "beLateTime",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "早退时间(M)",
      prop: "earlyTime",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "旷工时间(H)",
      prop: "absenteeismTime",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "平时加班时间(H)",
      prop: "peacetimeOverTime",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "休息加班时间(H)",
      prop: "restOverTime",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "加班汇总(H)",
      prop: "overTimeSum",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "特殊加班(H)",
      prop: "specialOverTime",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "备注",
      prop: "description",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    }
  ];
};
// 查看异常状态
export const formConfigs2 = (): FormConfigItemType[] => {
  return [
    {
      label: "应出勤(H)",
      prop: "beOnDuty",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "实际出勤(H)",
      prop: "actualAttendance",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "应出勤(天)",
      prop: "beAttendanceDay",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "实际出勤(天)",
      prop: "actualAttendanceDay",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "年假(H)",
      prop: "annualLeaveTerms",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "迟到时间(M)",
      prop: "beLateTime",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "早退时间(M)",
      prop: "earlyTime",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "旷工时间(H)",
      prop: "absenteeismTime",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "请假时间(H)",
      prop: "leaveTime",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "平时加班时间(H)",
      prop: "peacetimeOverTime",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "休息加班时间(H)",
      prop: "restOverTime",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "加班汇总(H)",
      prop: "overTimeSum",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "备注",
      prop: "description",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    },
    {
      label: "反馈内容",
      prop: "content",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} disabled />
    }
  ];
};
