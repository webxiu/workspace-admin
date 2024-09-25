<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";

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

defineExpose({ currentLeftRow });
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" :show-icon="false">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="项目编号" searchField="projectCode" />
      </template>
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
              :data="dataList"
              :columns="dynamicColumns"
              :row-style="() => ({ cursor: 'pointer' })"
              :paginationSmall="size === 'small'"
              highlight-current-row
              :show-overflow-tooltip="true"
              :pagination="pagination"
              @row-dblclick="leftRowDbClick"
              @row-click="leftRowClick"
              @current-change="onCurrentChange"
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
            />
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>
