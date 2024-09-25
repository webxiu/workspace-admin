import { reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import MaterialModal from "../MaterialModal.vue";

// 编辑SQL单据校验
export const formRules = reactive<FormRules>({
  productModel: [{ required: true, message: "请选择产品型号", trigger: "blur" }],
  manualName: [{ required: true, message: "请输入指导书名称", trigger: "blur" }]
  // fileCode: [{ required: true, message: "请输入文件编号", trigger: "blur" }],
  // userName: [{ required: true, message: "请输入制作人", trigger: "blur" }],
  // userCode: [{ required: true, message: "请输入审批人", trigger: "blur" }],
  // deptId: [{ required: true, message: "请输入版本", trigger: "blur" }]
});

// 编辑SQL单据表单
export const formConfigs = ({ formData }): FormConfigItemType[] => {
  const countryList = ref([
    { optionName: "中国(模拟)", optionValue: "中国" },
    { optionName: "日本(模拟)", optionValue: "日本" },
    { optionName: "巴西(模拟)", optionValue: "巴西" }
  ]);
  return [
    {
      label: "产品型号",
      prop: "productModel",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        const onCheckMaterial = (val) => {
          formModel[row.prop] = val.number;
          formData.materialId = val.id;
        };
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请选择产品型号" readonly>
            {{ append: () => <MaterialModal onCheckMaterial={onCheckMaterial} /> }}
          </el-input>
        );
      }
    },
    {
      label: "指导书名称",
      prop: "manualName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入指导书名称" clearable />;
      }
    },
    {
      label: "文件编号",
      prop: "fileCode_test",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />;
      }
    },
    {
      label: "版本",
      prop: "version_test",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />;
      }
    },
    {
      label: "国家",
      prop: "country_test",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" class="ui-w-100">
            {countryList.value.map((item) => (
              <el-option key={item.optionValue} label={item.optionName} value={item.optionValue} />
            ))}
          </el-select>
        );
      }
    }
    // {
    //   label: "制作人",
    //   prop: "userName",
    //   colProp: { span: 12 },
    //   render: ({ formModel, row }) => {
    //     return <el-input v-model={formModel[row.prop]} placeholder="请输入制作人" clearable />;
    //   }
    // },
    // {
    //   label: "审批人",
    //   prop: "userCode",
    //   colProp: { span: 12 },
    //   render: ({ formModel, row }) => {
    //     return <el-input v-model={formModel[row.prop]} placeholder="请输入审批人" clearable />;
    //   }
    // },
  ];
};
