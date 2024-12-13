<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <pure-table
        border
        row-key="id"
        class="machine-table"
        id="machineTableId"
        :adaptive="true"
        align-whole="center"
        size="small"
        :data="dataList"
        :columns="columns"
        highlight-current-row
        :show-overflow-tooltip="true"
        @row-click="rowClick"
        @row-dblclick="rowDbclick"
        @selection-change="handleSelectionChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMachine } from "./hook";

const { columns, rowClick, rowDbclick, selectedRows, handleSelectionChange, dataList } = useMachine();

defineExpose({ selectedRows });
</script>
