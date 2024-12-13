<template>
  <div><EditForm ref="formRef" :formInline="formInline" :formRules="formRules" :formConfigs="formConfigs" :formProps="{ labelPosition: 'left' }" /></div>
</template>

<script setup lang="ts">
import EditForm from "@/components/EditForm/index.vue";
import { ref } from "vue";
import { formRules } from "./config";

const formRef = ref();
const formConfigs = ref([]);
const props = defineProps(["formInline", "type"]);

defineExpose({ formRef, formConfigs, type: props.type });
</script>
