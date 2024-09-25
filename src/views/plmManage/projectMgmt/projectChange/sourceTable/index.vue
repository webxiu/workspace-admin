<template>
  <div class="source-list">
    <div class="left-table">
      <pure-table
        border
        row-key="id"
        :height="maxHeight"
        :max-height="maxHeight"
        :adaptive="true"
        align-whole="left"
        size="small"
        :data="dataList"
        empty-text="暂无角色信息"
        :columns="columns"
        highlight-current-row
        :show-overflow-tooltip="true"
      />
    </div>
    <div class="devide" />
    <div class="right-table">
      <pure-table
        border
        row-key="id"
        :height="maxHeight"
        empty-text="暂无角色信息"
        :max-height="maxHeight"
        :adaptive="true"
        align-whole="left"
        size="small"
        :data="dataList2"
        :columns="columns2"
        highlight-current-row
        :show-overflow-tooltip="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSourceTable } from "./hook";
const { maxHeight, dataList, columns, dataList2, columns2 } = useSourceTable();
defineExpose({ dataList, dataList2 });
</script>

<style scoped lang="scss">
.source-list {
  display: flex;
  justify-content: space-between;

  .devide {
    flex: 2%;
  }

  .left-table,
  .right-table {
    flex: 49%;
  }
}
</style>
