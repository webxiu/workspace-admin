<template>
  <div class="pm-bom">
    <div class="bom-form">
      <EditForm ref="formRef" :form-inline="formData" :formRules="formRules" :form-configs="formConfigs" :form-props="{ size: 'small' }" />
    </div>
    <div class="pm-bom-table">
      <PMBomTable ref="addTableRef" @loadData="onLoadFormData" />
    </div>
  </div>
</template>

<script setup lang="tsx">
import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { FormRules } from "element-plus";
import { reactive, ref } from "vue";
import PMBomTable from "./pmBomTable.vue";

const formConfigs: FormConfigItemType[] = [
  {
    label: "项目编号",
    colProp: { span: 5 },
    prop: "projectNo",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder=" " />;
    }
  },
  {
    label: "产品名称",
    colProp: { span: 5 },
    labelWidth: 80,
    prop: "productName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder=" " />;
    }
  },
  {
    label: "任务名称",
    colProp: { span: 5 },
    labelWidth: 80,
    prop: "taskName",
    render: ({ formModel, row }) => {
      return <el-input v-model={formModel[row.prop]} placeholder=" " />;
    }
  }
];

const tableList = ref([]);
const formRef = ref();
const formData = reactive({});
const formRules = reactive<FormRules>({
  projectNo: [{ required: true, message: "项目编号为必填项", trigger: "submit" }],
  productName: [{ required: true, message: "产品名称为必填项", trigger: "submit" }],
  taskName: [{ required: true, message: "任务名称为必填项", trigger: "submit" }]
});

const onLoadFormData = (data) => {
  tableList.value = data;
};

defineExpose({ formRef, tableList, formData });
</script>

<style lang="scss">
.bom-form {
  .dialog-form {
    padding: 0;
  }
}
</style>
