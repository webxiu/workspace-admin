<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "FinanceDeptRateTableIndex" });

const {
  columnDefs,
  isAgTable,
  loading,
  columns,
  dataList,
  maxHeight,
  chartRef,
  pagination,
  searchOptions,
  queryParams,
  buttonList,
  onRefresh,
  onTagSearch,
  onCurrentChange,
  handleSizeChange,
  handleCurrentChange,
  onSwitchTable
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <AgGridTable
      v-if="isAgTable"
      rowKey="id"
      :loading="loading"
      :rowData="dataList"
      :columnDefs="columnDefs"
      :height="maxHeight + 12"
      :paginations="pagination"
      @switch="onSwitchTable"
      @refresh="onRefresh"
      @sizeChange="onCurrentChange"
      @currentChange="handleCurrentChange"
      :headButtons="{ buttonList, autoLayout: false }"
      :blendedSearch="{ onTagSearch, queryParams, searchOptions, placeholder: '请选择日期' }"
    />
    <PureTableBar v-else :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch :queryParams="queryParams" @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请选择日期" />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          :pagination="pagination"
          @current-change="onCurrentChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
    <div ref="chartRef" style="height: 420px" class="border-line mt-10" />
  </div>
</template>
