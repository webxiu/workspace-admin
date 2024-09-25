<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch class="action-search" :queryParams="queryParams" @tagSearch="handleTagSearch" :searchOptions="searchOptions" />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          id="overdueOrderId"
          border
          :height="maxHeight / 2 - 20"
          :max-height="maxHeight / 2 - 20"
          row-key="id"
          :adaptive="true"
          align-whole="left"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
          :show-overflow-tooltip="true"
          :paginationSmall="size === 'small'"
          @row-click="rowClick"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
    <div style="padding-top: 0.5rem">
      <div class="chart-container" style="width: 100%">
        <div style="height: 400px" ref="chartRef" class="chart" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaProductMkCenterPurchaseOverdueOrdersIndex" });

const { columns, dataList, buttonList, maxHeight, chartRef, searchOptions, onFresh, handleTagSearch, rowClick, queryParams } = useConfig();
</script>
