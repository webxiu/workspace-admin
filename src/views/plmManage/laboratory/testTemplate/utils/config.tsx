import AssesmentTabs from "../component/AssesmentTabs/index.vue";
import { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import ModelProjectList from "../modelProjectList.vue";
import { reactive } from "vue";

export const formRules = reactive<FormRules>({
  templateName: [{ required: true, message: "模板名称为必填项", trigger: "blur" }]
  // productTypeId: [{ required: true, message: "产品种类为必填项", trigger: "blur" }]
});

export const formConfigs = ({ type, classifyOptions, detailInfo, onChange }): FormConfigItemType[] => {
  return [
    {
      label: "模板编号",
      colProp: { span: 12 },
      prop: "templateCode",
      hide: type === "add",
      render: ({ formModel, row }) => <el-input disabled v-model={formModel[row.prop]} placeholder="请输入模板编号" />
    },
    {
      label: "模板名称",
      colProp: { span: 12 },
      prop: "templateName",
      render: ({ formModel, row }) => <el-input v-model={formModel[row.prop]} placeholder="请输入模板名称" />
    },
    // {
    //   label: "产品种类",
    //   colProp: { span: 12 },
    //   prop: "productTypeId",
    //   render: ({ formModel, row }) => (
    //     <el-select filterable style={{ width: "100%" }} v-model={formModel[row.prop]} placeholder="请选择产品种类">
    //       {classifyOptions.value.map((item) => (
    //         <el-option key={item.id} label={item.categoryName} value={item.id} />
    //       ))}
    //     </el-select>
    //   )
    // },
    {
      label: "",
      colProp: { span: 24 },
      prop: "modelProjectList",
      render: ({ formModel, row }) => <AssesmentTabs detailInfo={detailInfo} onChange={onChange} />
    },
    {
      label: "创建人",
      colProp: { span: 12 },
      prop: "createUserName",
      hide: type === "add",
      render: ({ formModel, row }) => <el-input disabled v-model={formModel[row.prop]} placeholder="请输入创建人" />
    },
    {
      label: "创建时间",
      colProp: { span: 12 },
      prop: "createDate",
      hide: type === "add",
      render: ({ formModel, row }) => <el-input disabled v-model={formModel[row.prop]} placeholder="请选择创建时间" />
    },
    {
      label: "修改人",
      colProp: { span: 12 },
      prop: "modifyUserName",
      hide: type === "add",
      render: ({ formModel, row }) => <el-input disabled v-model={formModel[row.prop]} placeholder="请输入修改人" />
    },
    {
      label: "修改时间",
      colProp: { span: 12 },
      prop: "modifyDate",
      hide: type === "add",
      render: ({ formModel, row }) => <el-input disabled v-model={formModel[row.prop]} placeholder="请选择修改时间" />
    }
  ];
};
