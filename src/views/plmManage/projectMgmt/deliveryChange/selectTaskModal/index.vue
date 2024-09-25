<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";

const props = defineProps(["taskOpts"]);

const {
  columns,
  dataList,
  maxHeight,
  pagination,
  searchOptions,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  leftRowDbClick,
  currentLeftRow,
  leftRowClick,
  handleCurrentChange
} = useConfig();

defineExpose({ currentLeftRow, dataList });
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" :show-icon="false">
      <!-- <template #title> <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="任务名称" searchField="taskName" /> </template> -->
      <template #title />
      <template #buttons />
      <template v-slot="{ size, dynamicColumns }">
        <div>
          <div>
            <pure-table
              border
              row-key="id"
              :height="maxHeight"
              :max-height="maxHeight"
              class="bill-manage"
              :adaptive="true"
              align-whole="left"
              :size="size"
              :data="taskOpts"
              :columns="dynamicColumns"
              :row-style="() => ({ cursor: 'pointer' })"
              highlight-current-row
              :show-overflow-tooltip="true"
              @row-dblclick="leftRowDbClick"
              @row-click="leftRowClick"
              @current-change="onCurrentChange"
            />
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>
