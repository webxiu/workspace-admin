import { reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import MaterialModal from "../MaterialModal.vue";
import ProductModeModal from "../ProductModeModal.vue";
import { getEnumDictList } from "@/utils/table";

// 编辑SQL单据校验
export const formRules = reactive<FormRules>({
  productCode: [{ required: true, message: "请选择产品型号", trigger: "blur" }],
  materialNumber: [{ required: true, message: "请选择物料编码", trigger: "blur" }],
  manualName: [{ required: true, message: "请输入指导书名称", trigger: "blur" }],
  fileNumber: [{ required: true, message: "请输入文件编号", trigger: "blur" }],
  ver: [{ required: true, message: "请输入指导书版本", trigger: "blur" }],
  country: [{ required: true, message: "请选择国家", trigger: "blur" }],
  peuserId: [{ required: true, message: "请选择PE工程师", trigger: "blur" }]
});

// 编辑SQL单据表单
export const formConfigs = ({ formData, peRoleList }): FormConfigItemType[] => {
  const countryList = ref([]);
  getEnumDictList(["CountryCode"])
    .then(({ CountryCode }) => (countryList.value = CountryCode))
    .catch(console.log);
  return [
    {
      label: "产品型号",
      prop: "productCode",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        const onSelect = (val) => {
          formModel[row.prop] = val.productCode;
        };
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请选择产品型号" readonly>
            {{ append: () => <ProductModeModal onSelect={onSelect} /> }}
          </el-input>
        );
      }
    },
    {
      label: "物料编码",
      prop: "materialNumber",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        const onSelect = (val) => {
          formModel[row.prop] = val.number;
          formData.materialId = val.id;
        };
        return (
          <el-input v-model={formModel[row.prop]} placeholder="请选择物料编码" readonly>
            {{ append: () => <MaterialModal productCode={formModel.productCode} onSelect={onSelect} /> }}
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
      prop: "fileNumber",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />;
      }
    },
    {
      label: "版本",
      prop: "ver",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" clearable />;
      }
    },
    {
      label: "国家",
      prop: "country",
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
    },
    {
      label: "PE工程师",
      prop: "peuserId",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" class="ui-w-100">
            {peRoleList.value.map((item) => (
              <el-option key={item.id} label={item.userName} value={item.id} />
            ))}
          </el-select>
        );
      }
    }
  ];
};
