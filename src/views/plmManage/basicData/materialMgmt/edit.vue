<template>
  <div style="height: calc(100vh - 120px); overflow: auto">
    <EditForm
      :loading="loading"
      :formRules="formRules"
      :formInline="formData"
      :formConfigs="formConfigs(opts, isView, submit, formData, setLoading, manufacturingShopNameOpts, isDisabledMaterialCode)"
      ref="formRef"
    />
  </div>
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { formConfigs, formRules } from "./components/config";
import { useConfig } from "./hooks";
import { onMounted, ref } from "vue";
import { getdeptInfoList } from "@/api/workbench/teamManage";
import { useRoute } from "vue-router";
import { fetchDisableFormItemFlag } from "@/api/plmManage";

defineOptions({ name: "MaterialEdit" });
const props = defineProps(["isView", "historyData"]);
const setLoading = (val) => (loading.value = val);
const manufacturingShopNameOpts = ref([]);
const { loading, formData, formRef, opts, submit } = useConfig(props);
const isDisabledMaterialCode = ref(false);
const route = useRoute();

onMounted(() => {
  // 获取生产车间部门
  getdeptInfoList({}).then((res) => {
    if (res.data) {
      manufacturingShopNameOpts.value = res.data.filter((item) => item.parentId === 4).map((item) => ({ label: item.deptName, value: item.k3DeptId }));
    }
  });

  // TODO: 此处获取是否禁用编码字段的标志位
  fetchDisableFormItemFlag({ id: route.query.id }).then((res) => {
    if (res.data) {
      isDisabledMaterialCode.value = true;
    }
  });
});
</script>

<style scoped lang="scss">
:deep(.el-form-item) {
  margin-bottom: 0 !important;
}
</style>
<style lang="scss">
.upload-box {
  position: absolute;
  z-index: 3;
  margin-top: 16px;
}

.materialProp-box {
  position: absolute;
  z-index: 3;
  margin-top: 4px;
}

.el-upload.el-upload--picture-card,
.el-upload-list--picture-card .el-upload-list__item {
  width: 123px;
  height: 123px;
}

.has-upload-length .el-upload {
  display: none;
}
</style>
