import { Ref, reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { Loading } from "@element-plus/icons-vue";

// 校验配置
export const formRules = reactive<FormRules>({
  staffName: [{ required: true, message: "请输入姓名", trigger: ["blur"] }],
  transferDate: [{ required: true, message: "请选择异动时间", trigger: ["blur"] }],
  transferType: [{ required: true, message: "请选择异动类型", trigger: ["blur"] }],
  transferAfterDeptId: [{ required: true, message: "请选择异动后部门", trigger: ["blur"] }],
  transferAfterRoleId: [{ required: true, message: "请选择异动后职位", trigger: ["blur"] }],
  transferReason: [{ required: true, message: "请输入调整原因", trigger: ["blur"] }],
  effectiveDate: [{ required: true, message: "请选择生效日期", trigger: ["blur"] }],
  other: [{ required: true, message: "请输入其他内容", trigger: ["blur"] }]
});

// 异动类型(修改标题长度表格需同步修改)
export const adjustTypeList = [
  { label: "升职", value: "升职" },
  { label: "降职", value: "降职" },
  { label: "调动", value: "调动" },
  { label: "其他", value: "其他" }
];

// 薪资是否调整
export const adjustSalaryType = [
  { label: "是", value: true },
  { label: "否", value: false }
];

const LoadingIcon = () => (
  <el-icon class="is-loading">
    <Loading />
  </el-icon>
);

export const formConfigs = ({ type, mLoading, userList, roleList, deptTreeList, onUserChange, onDeptChange }): Ref<FormConfigItemType[]> => {
  const configArr = ref<FormConfigItemType[]>([
    {
      label: "姓名",
      prop: "staffName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            disabled={type === "edit"}
            v-model={formModel[row.prop]}
            data={userList.value}
            filterable
            check-strictly
            default-expanded-keys={[0]}
            node-key="id"
            render-after-expand={false}
            props={{ label: "staffName", value: "staffId" }}
            onChange={onUserChange}
            class="ui-w-100"
          />
        );
      }
    },
    {
      label: "部门",
      prop: "deptName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请选择" disabled />
    },
    {
      label: "异动前部门",
      prop: "deptName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请选择" disabled />
    },
    {
      label: "异动前职位",
      prop: "roleName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请选择" disabled />
    },
    {
      label: "入职时间",
      prop: "startDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请选择" disabled />
    },
    {
      label: "异动类型",
      prop: "transferType",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        if (formModel[row.prop] === "其他") onTransferChange("其他");
        return (
          <el-radio-group v-model={formModel[row.prop]} onChange={onTransferChange}>
            {adjustTypeList.map((item) => (
              <el-radio key={item.value} label={item.label}>
                {item.label}
              </el-radio>
            ))}
          </el-radio-group>
        );
      }
    },
    {
      label: "其他",
      prop: "other",
      colProp: { span: 12 },
      hide: true,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "异动后部门",
      prop: "transferAfterDeptId",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-tree-select
            v-model={formModel[row.prop]}
            data={deptTreeList.value}
            clearable
            filterable
            check-strictly={true}
            check-on-click-node
            render-after-expand={false}
            placeholder="请选择"
            class="ui-w-100"
            onChange={onDeptChange}
            props={{ label: "name", value: "value" }}
          />
        );
      }
    },
    {
      label: "异动后职位",
      prop: "transferAfterRoleId",
      colProp: { span: 12 },
      render: ({ formModel, row }) =>
        mLoading.value ? (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {{ prefix: () => <LoadingIcon /> }}
          </el-select>
        ) : (
          <el-select v-model={formModel[row.prop]} class="ui-w-100" placeholder="请选择">
            {roleList.value?.map((item) => (
              <el-option key={item.id} label={item.roleName} value={item.id} />
            ))}
          </el-select>
        )
    },
    {
      label: "异动时间",
      prop: "transferDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          clearable
          style="width: 100%;"
        />
      )
    },
    {
      label: "调整原因",
      prop: "transferReason",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />
    },
    {
      label: "薪资是否调整",
      prop: "adjustSalaryFlag",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-radio-group v-model={formModel[row.prop]}>
          {adjustSalaryType.map((item) => (
            <el-radio key={item.value} label={item.value}>
              {item.label}
            </el-radio>
          ))}
        </el-radio-group>
      )
    },
    {
      label: "调整后薪资",
      prop: "adjustAfterSalary",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input-number v-model={formModel[row.prop]} min={0} controls={false} placeholder="请输入" class="ui-w-100" />
    },
    {
      label: "生效日期",
      prop: "effectiveDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          clearable
          style="width: 100%;"
        />
      )
    }
  ]);

  function onTransferChange(value) {
    configArr.value.forEach((item) => {
      if (item.prop === "other") {
        item.hide = value !== "其他";
      }
    });
  }

  return configArr;
};
