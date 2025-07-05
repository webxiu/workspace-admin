<template>
  <EditForm ref="formRef" :loading="loading" :formRules="_formRules" :formProps="{ labelWidth: '120px' }" :formInline="formData" :formConfigs="_formConfigs" />
</template>

<script setup lang="ts">
import { watch, ref, reactive, computed } from "vue";
import { formRules, formConfigs } from "./utils/config";
import EditForm from "@/components/EditForm/index.vue";
import { roleUserList } from "@/api/systemManage";
import { printEsopStation } from "@/api/oaManage/productMkCenter";

const props = defineProps<{ id?: string; type?: "add" | "edit" | "view" }>();

const formRef = ref();
const loading = ref(false);
const peRoleList = ref([]);
const formData = reactive({
  id: undefined,
  materialId: "",
  productCode: "",
  materialNumber: "",
  manualName: "",
  fileNumber: "",
  country: "",
  ver: "",
  peuserId: "",
  peuserName: "",
  oldVer: "",
  changeContent: ""
});

const _formRules = computed(() => (props.type === "view" ? {} : formRules));
const _formConfigs = computed(() => formConfigs({ formData, peRoleList, type: props.type }));

watch(props, getData, { immediate: true });

function getData(val) {
  roleUserList({ roleId: "244" }).then(({ data }) => {
    peRoleList.value = data || [];
  });

  if (!val.id) return;
  loading.value = true;
  printEsopStation({ id: val.id })
    .then(({ data }) => {
      if (!data) return;
      const { workStationVOS, ...row } = data;
      Object.assign(formData, {
        id: row.id,
        materialId: row.materialId,
        productCode: row.productCode,
        materialNumber: row.materialNumber,
        manualName: row.manualName,
        fileNumber: row.fileNumber,
        country: row.country,
        ver: row.ver ?? "A1",
        peuserId: row.peuserId,
        peuserName: row.peuserName,
        oldVer: row.oldVer,
        changeContent: row.changeContent
      });
    })
    .finally(() => (loading.value = false));
}

function getRef() {
  return new Promise((resolve) => {
    formRef.value.getRef().validate((valid) => {
      if (!valid) return;
      resolve({ formData });
    });
  });
}
defineExpose({ getRef });
</script>
