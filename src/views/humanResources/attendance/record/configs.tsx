import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import HxModalInput from "@/components/HxModalInput/index.vue";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  staffCode: [{ required: true, message: "工号为必填项", trigger: "submit" }],
  staffName: [{ required: true, message: "姓名为必填项", trigger: "submit" }],
  deptId: [{ required: true, message: "部门为必填项", trigger: "submit" }],
  pin: [{ required: true, message: "考勤机工号为必填项", trigger: "submit" }],
  attMachineName: [{ required: true, message: "考勤机名称为必填项", trigger: "submit" }],
  attTime: [{ required: true, message: "打卡时间为必填项", trigger: "submit" }]
});

export const formConfigs = ({ formData, treeSelectData }): FormConfigItemType[] => {
  return [
    {
      label: "工号",
      prop: "staffCode",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <HxModalInput
            title="选择工号"
            placeholder="请选择工号"
            valueKey={row.prop}
            v-model={formModel[row.prop]}
            readonly={true}
            showButton={true}
            showModel="user"
            onSelect={(row) => {
              formData.deptId = row.deptId + "";
              formData.staffCode = row.userCode;
              formData.staffName = row.userName;
            }}
          />
        );
      }
    },
    {
      label: "考勤机工号",
      prop: "pin",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "姓名",
      prop: "staffName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "部门",
      prop: "deptId",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            data={treeSelectData.value}
            filterable
            check-strictly
            default-expanded-keys={[0]}
            node-key="value"
            render-after-expand={false}
            class="ui-w-100"
          />
        );
      }
    },
    {
      label: "考勤机",
      prop: "attMachineName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },

    {
      label: "打卡时间",
      prop: "attTime",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-date-picker class="ui-w-100" disabled v-model={formModel[row.prop]} type="date" placeholder="请选择" format="YYYY-MM-DD HH:mm:ss" />;
      }
    }
  ];
};
