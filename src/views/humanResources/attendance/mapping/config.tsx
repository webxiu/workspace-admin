import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  staffCode: [{ required: true, message: "工号为必填项", trigger: "submit" }],
  staffName: [{ required: true, message: "姓名为必填项", trigger: "submit" }],
  deptId: [{ required: true, message: "部门为必填项", trigger: "submit" }],
  attMachineName: [{ required: true, message: "考勤机为必填项", trigger: "submit" }]
});

export const formConfigs = ({ formData, handleAddUserNames, treeSelectData }): FormConfigItemType[] => {
  return [
    {
      label: "工号",
      prop: "staffCode",
      labelWidth: 100,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input readonly v-model={formModel[row.prop]} onClick={() => handleAddUserNames && handleAddUserNames(formData)} />;
      }
    },
    {
      label: "姓名",
      prop: "staffName",
      labelWidth: 100,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} disabled />;
      }
    },
    {
      label: "部门",
      prop: "deptId",
      labelWidth: 100,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            disabled
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
      labelWidth: 100,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "考勤机工号",
      prop: "pin",
      labelWidth: 100,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    },
    {
      label: "考勤机姓名",
      prop: "name",
      labelWidth: 100,
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input disabled v-model={formModel[row.prop]} />;
      }
    }
  ];
};
