<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" :showIcon="false">
        <template #title />
        <template #buttons />
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            row-key="id"
            class="machine-table"
            id="machineTableId"
            :adaptive="true"
            align-whole="center"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="rowClick"
            @row-dblclick="rowDbclick"
            @selection-change="handleSelectionChange"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMachine } from "./hook";
import { PureTableBar } from "@/components/RePureTableBar";

const { columns, rowClick, rowDbclick, handleSelectionChange, selectedRows, dataList } = useMachine();

defineExpose({ selectedRows });
</script>
