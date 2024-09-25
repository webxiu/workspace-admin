import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive } from "vue";

// 撤销原因验证
export const revokeFormRules = reactive<FormRules>({
  deleteReason: [{ required: true, message: "撤销原因不能为空", trigger: "blur" }]
});

// 撤销原因表单
export const revokeFormConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "撤销原因",
      prop: "deleteReason",
      colProp: { span: 24 },
      render: ({ formModel, row }) => {
        return (
          <el-input
            v-model={formModel[row.prop]}
            rows={4}
            autofocus
            resize="none"
            type="textarea"
            autosize={{ minRows: 4, maxRows: 4 }}
            placeholder="请输入撤销原因"
            clearable
          />
        );
      }
    }
  ];
};
