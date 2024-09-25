import { FormRules, UploadProps } from "element-plus";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import SelectPosition from "../SelectPosition/index.vue";
import { message } from "@/utils/message";
import { reactive } from "vue";
import regExp from "@/utils/regExp";

// const GridSpan = 24;
// const layout = { span: GridSpan, xs: 24, sm: 12, md: 12, lg: 12, xl: 12 };
const layout = { span: 24 };
const accept = [".gif", ".jfif", ".pjpeg", ".jpeg", ".pjp", ".jpg", ".png", ".xls", ".xlsx", ".dot", ".doc", ".docx", ".pdf"];
const baseApi = import.meta.env.VITE_BASE_API;

// 岗位编辑验证
export const formRules = reactive<FormRules>({
  roleName: [{ required: true, message: "请输入岗位名称", trigger: "blur" }],
  staffingPeopleCount: [
    { required: true, message: "请输入编制人数", trigger: "blur" },
    { message: "编制人数格式不正确", trigger: "blur", pattern: regExp.number }
  ]
});
// 模板编辑验证
export const formRules3 = reactive<FormRules>({
  templateFile: [{ required: true, message: "请选模板文件", trigger: "blur" }],
  outPath: [{ required: true, message: "请选择输出路径", trigger: "blur" }]
});

// 岗位编辑表单
export const formConfigs = ({ onSelectPosition }): FormConfigItemType[] => {
  return [
    {
      label: "岗位名称",
      prop: "roleName",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入岗位名称" clearable />
    },
    {
      label: "编制人数",
      prop: "staffingPeopleCount",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入编制人数" clearable />
    },

    {
      label: "上级岗位",
      prop: "parentName",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请选择上级岗位" readonly>
            {{ append: () => <SelectPosition onSelect={onSelectPosition} /> }}
          </el-input>
        );
      }
    },
    {
      label: "说明",
      prop: "remark",
      colProp: layout,
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入说明" clearable />
    }
  ];
};
// 模板编辑表单
export const formConfigs3 = ({ onSelectTemplate, onSelectPath }): FormConfigItemType[] => {
  return [
    {
      label: "模板文件",
      prop: "templateFile",
      colProp: layout,
      render: ({ formModel, row }) => {
        const handleAvatarSuccess = (response) => {
          formModel["resourceName"] = response.data;
        };
        const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
          formModel[row.prop] = rawFile.name;
          const ext = rawFile.type.split("/")[1];
          if (!accept.includes(`.${ext}`)) {
            message("文件格式不正确!", { type: "error" });
            return false;
          }
          return true;
        };
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请选模板文件" readonly>
            {{
              append: () => (
                <el-upload
                  class="ml-4"
                  accept={accept.join(",")}
                  action={`${baseApi}/oa/mk/customercomplaint/uploadcomplaint`}
                  show-file-list={false}
                  on-success={handleAvatarSuccess}
                  before-upload={beforeAvatarUpload}
                >
                  <el-button type="primary">选择</el-button>
                </el-upload>
              )
            }}
          </el-input>
        );
      }
    },
    {
      label: "输出路径",
      prop: "outPath",
      colProp: layout,
      render: ({ formModel, row }) => {
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请选择输出路径" readonly>
            {{ append: () => <SelectPosition onSelect={onSelectPath} /> }}
          </el-input>
        );
      }
    }
  ];
};
