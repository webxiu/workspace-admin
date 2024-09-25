<template>
  <EditForm v-loading="loading" :formInline="formData" :formConfigs="lookFormConfigs()" :formProps="{ labelWidth: '180px' }" class="preview-disabled-form" />
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { lookFormConfigs } from "./utils/config";
import { onMounted, ref } from "vue";
import { dbMaintenanceList } from "@/api/systemManage";
import { message } from "@/utils/message";

/** 信息中心的查看单据id */
const props = defineProps<{ id: string }>();
const loading = ref(false);
const formData = ref({});
onMounted(() => getDetail());

const getDetail = () => {
  if (!props.id) return message("查询id不存在", { type: "error" });
  loading.value = true;
  dbMaintenanceList({ page: 1, limit: 100000, id: props.id })
    .then(({ data }) => {
      loading.value = false;
      // 使用单据billNo获取列表数据第一条为详情
      formData.value = data.records[0];
    })
    .catch(() => (loading.value = false));
};
</script>
