import { Ref, reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import HxModalInput from "@/components/HxModalInput/index.vue";

export const formRules = reactive<FormRules>({
  productCode: [{ required: true, message: "请选择产品型号", trigger: "blur" }]
});

export const formConfigs = ({ type }): Ref<FormConfigItemType[]> => {
  const configArr = ref<FormConfigItemType[]>([
    {
      label: "产品型号",
      prop: "productCode",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <HxModalInput
          title="选择产品"
          placeholder="点击选择"
          valueKey={row.prop}
          v-model={formModel[row.prop]}
          readonly={true}
          onSelect={(val) => (formModel["productModelId"] = val.id)}
          showModel="product"
        />
      )
    },
    { label: "", prop: "", colProp: { span: 12 }, render: () => null },
    {
      label: "创建人",
      prop: "createUserName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled clearable />
    },
    {
      label: "创建时间",
      prop: "createDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          readonly={type === "view"}
          clearable
          disabled
          style="width: 100%;"
        />
      )
    },
    {
      label: "修改人",
      prop: "modifyUserName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled clearable />
    },
    {
      label: "修改时间",
      prop: "modifyDate",
      colProp: { span: 12 },
      render: ({ formModel, row }) => (
        <el-date-picker
          type="date"
          v-model={formModel[row.prop]}
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          placeholder="请选择"
          clearable
          disabled
          style="width: 100%;"
        />
      )
    }
  ]);
  return configArr;
};
