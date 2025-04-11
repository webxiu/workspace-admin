<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-15 14:40:52 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-15 14:40:52 
 */ -->
<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend } from "@/utils/table";

defineOptions({ name: "MarketingReportSaleSummaryIndex" });

const {
  columnDefs,
  columnDefs2,
  isAgTable,
  columns,
  columns2,
  dataList,
  dataList2,
  loading,
  buttonList,
  loading2,
  maxHeight,
  searchOptions,
  onSearch,
  onTagSearch,
  onSwitchTable
} = useConfig();
</script>
<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <AgGridTable
      v-if="isAgTable"
      ref="tableRef"
      :loading="loading"
      :rowData="dataList"
      :columnDefs="columnDefs"
      :height="maxHeight * 0.5"
      @refresh="onSearch"
      @switch="onSwitchTable"
      :headButtons="{ buttonList, autoLayout: false }"
      :blendedSearch="{ onTagSearch, searchOptions, placeholder: '请选择销售员' }"
    />
    <AgGridTable v-if="isAgTable" :loading="loading" :rowData="dataList2" :columnDefs="columnDefs2" :height="maxHeight * 0.5" :showIcon="false" />
    <PureTableBar v-if="!isAgTable" :columns="columns" @refresh="onSearch" :show-icon="false">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请选择销售员" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight / 2"
          :max-height="maxHeight / 2"
          row-key="id"
          class="sale-summary-number"
          :adaptive="true"
          align-whole="center"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
    <PureTableBar v-if="!isAgTable" :columns="columns2" :showIcon="false">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight / 2"
          :max-height="maxHeight / 2"
          row-key="id"
          class="sale-summary-achievement"
          :adaptive="true"
          align-whole="center"
          :loading="loading2"
          :size="size"
          :data="dataList2"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
        />
      </template>
    </PureTableBar>
  </div>
</template>
