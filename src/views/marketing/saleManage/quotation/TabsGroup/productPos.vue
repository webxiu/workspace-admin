<template>
  <div>
    <el-button type="primary" size="small" @click="onAdd2" :disabled="['add', 'view', 'edit'].includes(type) || !valid.assembleDetails">新增</el-button>
    <el-button type="danger" size="small" @click="onDelete2" :disabled="['add', 'view', 'edit'].includes(type) || !valid.assembleDetails">删除</el-button>
    <!-- <el-button type="success" size="small" @click="onSave2">导入</el-button> -->
  </div>
  <div>
    <pure-table
      border
      row-key="id"
      class="product-table"
      id="productPosTable"
      :adaptive="true"
      :max-height="maxHeight"
      :height="maxHeight"
      align-whole="center"
      size="small"
      :data="dataList2"
      :columns="columns2"
      highlight-current-row
      :show-overflow-tooltip="true"
      @row-click="rowClick2"
      @row-dblclick="rowDbclick2"
    />
  </div>
</template>

<script setup lang="ts">
import { useTabGroup } from "./hook";

const props = defineProps(["setFormData", "formData", "summaryListRef", "type", "valid"]);
const { dataList2, columns2, rowClick2, maxHeight, rowDbclick2, onAdd2, clearDataList2, onDelete2, onSave2 } = useTabGroup({ type: "PRODSHEET", props });
defineExpose({ clearDataList2, dataList2 });
</script>
