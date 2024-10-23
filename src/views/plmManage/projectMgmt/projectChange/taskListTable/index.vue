<template>
  <div class="task-list">
    <div style="margin-bottom: 6px">
      <ButtonList moreActionText="更多操作" :buttonList="buttonList2" :auto-layout="false" />
    </div>
    <pure-table
      border
      row-key="id"
      :height="maxHeight"
      :max-height="maxHeight"
      :adaptive="true"
      align-whole="left"
      default-expand-all
      size="small"
      :data="dataList"
      :tree-props="{ children: 'taskVOList', hasChildren: 'hasChildren' }"
      :columns="columns"
      highlight-current-row
      @row-click="rowClick"
      :show-overflow-tooltip="true"
    />
  </div>
</template>

<script setup lang="ts">
import { useTaskTable } from "./hook";

const props = defineProps(["formTopData", "taskTreeData"]);

const { maxHeight, dataList, columns, buttonList2, setDataList, rowClick } = useTaskTable(props);

defineExpose({ setDataList });
</script>

<style lang="scss">
.project-change-task-modal {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
