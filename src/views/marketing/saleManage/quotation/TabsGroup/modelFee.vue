<template>
  <div>
    <el-button type="primary" size="small" @click="onAdd3" :disabled="['add', 'view', 'edit'].includes(type) || !valid.moldCostDetails">新增</el-button>
    <el-button type="danger" size="small" @click="onDelete3" :disabled="['add', 'view', 'edit'].includes(type) || !valid.moldCostDetails">删除</el-button>
    <el-button type="success" size="small" @click="onImport3">导入</el-button>
    <input style="display: none" type="file" accept=".xls,.xlsx" id="importSaleModelFeeInput" @change="onChangeModelFileInput" />
  </div>
  <div>
    <pure-table
      border
      row-key="id"
      class="product-table"
      :max-height="maxHeight"
      :height="maxHeight"
      id="productPosTable"
      :adaptive="true"
      align-whole="center"
      size="small"
      :data="dataList3"
      :columns="columns3"
      highlight-current-row
      :show-overflow-tooltip="true"
      @row-click="rowClick3"
      @row-dblclick="rowDbclick3"
    />
  </div>
</template>

<script setup lang="ts">
import { useTabGroup } from "./hook";

const props = defineProps(["setFormData", "formData", "optionValues", "summaryListRef", "type", "valid"]);
const { dataList3, columns3, maxHeight, rowClick3, rowDbclick3, onImport3, onChangeModelFileInput, onAdd3, onDelete3, onSave3 } = useTabGroup({
  type: "MODEL",
  props
});
defineExpose({ dataList3 });
</script>
