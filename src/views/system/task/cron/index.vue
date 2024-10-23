<template>
  <div>
    <Vue3CronPlusPicker @hide="closeDialog" @fill="fillValue" :expression="expression" />
  </div>
</template>

<script setup lang="ts">
import "vue3-cron-plus-picker/style.css";
import { Vue3CronPlusPicker } from "vue3-cron-plus-picker";
import { ref } from "vue";

const cronValue = ref("");
const props = defineProps(["modalIns", "formData"]);

const initExp = props.formData.cronSchedule?.length ? props.formData.cronSchedule : "* * * * * * *";
const expression = ref(initExp);

const closeDialog = (v) => {
  (props.modalIns as any).options.value.visible = false;
};

const fillValue = (val) => {
  cronValue.value = val;
  (props.formData as any).cronSchedule = cronValue.value;
};
</script>

<style lang="scss" scoped>
:deep(.el-select.el-select--small) {
  width: 300px !important;
}

:deep(.el-input-number .el-input__inner) {
  text-align: center !important;
}
</style>
