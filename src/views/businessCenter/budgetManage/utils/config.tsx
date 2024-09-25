import { reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";

const layout = { span: 24 };

// 导入校验
export const formRules = reactive<FormRules>({
  budgetDate: [{ required: true, message: "请选择年月", trigger: "blur" }],
  file: [{ required: true, message: "请选择文件", trigger: "blur" }]
});

// 导入配置
export const formConfigs = ({ onUploadChange }): FormConfigItemType[] => {
  return [
    {
      label: "年月",
      prop: "budgetDate",
      render: ({ formModel, row }) => <el-date-picker valueFormat="YYYY-MM" v-model={formModel[row.prop]} type="month" placeholder="选择年月" />
    },
    {
      label: "文件",
      prop: "file",
      colProp: layout,
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => {
        const onChange = (res) => {
          const rawFile = res.raw;
          formModel[row.prop] = rawFile.name;
          onUploadChange(rawFile);
        };
        return (
          <div style="width: 100%; max-width: 100%">
            <el-upload accept={[".xlsx, .xls"].join(",")} limit={1} multiple={false} auto-upload={false} show-file-list={true} on-change={onChange}>
              <el-button type="primary">选择文件</el-button>
            </el-upload>
          </div>
        );
      }
    }
  ];
};
