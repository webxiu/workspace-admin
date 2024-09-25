<template>
  <div>
    <el-button type="primary" size="small" @click="onAdd" :disabled="['add', 'view', 'edit'].includes(type) || !valid.bomDetails">新增</el-button>
    <el-button type="danger" size="small" @click="onDelete" :disabled="['add', 'view', 'edit'].includes(type) || !valid.bomDetails">删除</el-button>
    <el-button type="success" size="small" @click="onImport" :disabled="['add', 'view', 'edit'].includes(type) || !valid.bomDetails">导入</el-button>
    <input style="display: none" type="file" accept=".xls,.xlsx" id="importSaleBomPriceInput" @change="onChangeFileInput" />
  </div>
  <div class="wraper-bom-table">
    <pure-table
      border
      row-key="uuid"
      :max-height="maxHeight"
      :height="maxHeight"
      class="bom-tab-table"
      id="tabBOMTable"
      :adaptive="true"
      align-whole="center"
      size="small"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :show-overflow-tooltip="true"
      @row-click="rowClick"
      @row-dblclick="rowDbclick"
    />
  </div>
</template>

<script setup lang="ts">
import { useTabGroup } from "./hook";

const props = defineProps(["setFormData", "formData", "optionValues", "summaryListRef", "type", "valid"]);

const { dataList, columns, rowClick, maxHeight, onAdd, onSave, onDelete, onImport, rowDbclick, onChangeFileInput } = useTabGroup({ type: "BOM", props });

defineExpose({ dataList });
</script>
