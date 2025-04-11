import { reactive, ref } from "vue";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import HxModalInput from "@/components/HxModalInput/index.vue";
import MaterialMgmt from "@/views/plmManage/basicData/materialMgmt/index.vue";
import { PageUrl } from "@/config/constant";
import { getEnumDictList } from "@/utils/table";
import { message } from "@/utils/message";

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
export const formConfigs = ({ type, formData, peRoleList }): FormConfigItemType[] => {
  const countryList = ref([]);
  getEnumDictList(["CountryCode"])
    .then(({ CountryCode }) => (countryList.value = CountryCode))
    .catch(console.log);
  const isView = type === "view";
  return [
    {
      label: "产品型号",
      prop: "productCode",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <HxModalInput
            title="选择产品"
            placeholder="请选择产品型号"
            valueKey={row.prop}
            v-model={formModel[row.prop]}
            readonly={true}
            disabled={isView}
            showButton={true}
            showModel="product"
          />
        );
      }
    },
    {
      label: "物料编码",
      prop: "materialNumber",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        const onSelect = (val) => (formData.materialId = val.id);
        const interceptFn = () => {
          if (formModel.productCode) return false;
          message.error("请选择产品型号");
          return true;
        };
        return (
          <HxModalInput
            title="选择物料"
            width="85%"
            placeholder="请选择物料编码"
            valueKey="number"
            v-model={formModel[row.prop]}
            pageKey={PageUrl.materialMgmt}
            readonly={true}
            disabled={isView}
            showButton={true}
            component={MaterialMgmt}
            onSelect={onSelect}
            interceptFn={interceptFn}
            componentProp={{ isModal: true }}
          />
        );
      }
    },
    {
      label: "指导书名称",
      prop: "manualName",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入指导书名称" disabled={isView} clearable />;
      }
    },
    {
      label: "文件编号",
      prop: "fileNumber",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled={isView} clearable />;
      }
    },
    {
      label: "国家",
      prop: "country",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return (
          <el-select v-model={formModel[row.prop]} placeholder="请选择" disabled={isView} class="ui-w-100">
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
          <el-select v-model={formModel[row.prop]} placeholder="请选择" disabled={isView} class="ui-w-100">
            {peRoleList.value.map((item) => (
              <el-option key={item.userId} label={item.userName} value={item.userId} />
            ))}
          </el-select>
        );
      }
    },
    {
      label: "版本",
      prop: "ver",
      colProp: { span: 12 },
      render: ({ formModel, row }) => {
        return <el-input v-model={formModel[row.prop]} placeholder="请输入" disabled={isView} clearable />;
      }
    }
  ];
};
