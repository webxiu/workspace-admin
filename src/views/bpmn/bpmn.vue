<script setup lang="ts">
import BpmnFlow from "@/components/BpmnFlow/index.vue";
import { useBpmnStore } from "@/components/BpmnFlow/hooks";

export type FlowType = "xml" | "svg" | "bpmn";

/** 数据类型 */
export interface XmlDataType {
  /** xml数据 */
  data: string;
  /** 流程名称 */
  name: string;
  /** 类型: `svg` */
  type: FlowType;
}

defineProps<{ xml?: string; loading?: boolean }>();
const { store } = useBpmnStore<{ saveProcess: (type: FlowType) => XmlDataType }>();
defineExpose({ bpmnStore: store });
</script>

<template>
  <div class="bpmn-container" v-loading="loading">
    <BpmnFlow :xml="xml" />
  </div>
</template>

<style lang="scss" scoped>
.bpmn-container {
  height: 100%;
}
</style>
<style lang="scss">
.bpmn-flow {
  .el-dialog__body {
    padding: 16px 0 10px 16px;
    max-height: 80vh;
    box-sizing: border-box;
    overflow-y: auto;
  }
  .el-dialog__footer {
    padding: 16px;
    box-sizing: border-box;
    border-top: 1px solid #e8e8e8;
  }
  .el-dialog__close {
    font-weight: 600;
  }
}
</style>
