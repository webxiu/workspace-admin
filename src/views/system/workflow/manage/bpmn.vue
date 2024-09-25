<script setup lang="ts">
import BpmnFlow, { XmlDataType } from "@/components/BpmnFlow/index.vue";
import { FlowManageItemType } from "@/api/systemManage";
import { useBpmnStore } from "@/components/BpmnFlow/hooks";

interface BpmnGetDataType<T = "xml" | "svg" | "bpmn"> {
  saveProcess: (type: T) => { type: T; name: string; data: string };
}
defineProps<{ xml?: string; loading?: boolean; row?: FlowManageItemType }>();
const { store } = useBpmnStore<BpmnGetDataType>();
defineExpose({ bpmnStore: store });
</script>

<template>
  <div class="ui-h-100" v-loading="loading">
    <BpmnFlow :xml="xml" :row="row" />
  </div>
</template>

<style lang="scss">
.full-dialog .el-dialog__body {
  padding: 10px 0 0 5px !important;
}
</style>
