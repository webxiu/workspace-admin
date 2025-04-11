<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

const {
  loading,
  columns,
  dataList,
  maxHeight,
  searchOptions,
  pagination,
  buttonList,
  columnDefs,
  isAgTable,
  onRefresh,
  onTagSearch,
  onSizeChange,
  onCurrentChange,
  onSwitchTable
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <AgGridTable
      v-if="isAgTable"
      :rowData="dataList"
      :columnDefs="columnDefs"
      :height="maxHeight + 12"
      :paginations="pagination"
      @refresh="onRefresh"
      @switch="onSwitchTable"
      @sizeChange="onSizeChange"
      @currentChange="onCurrentChange"
      :headButtons="{ buttonList, autoLayout: false }"
      :blendedSearch="{ onTagSearch, searchOptions, searchField: 'userName', placeholder: '请输入员工姓名' }"
    />
    <div v-else class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入员工姓名" searchField="userName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="log-manage"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ag-grid-table {
  height: 100%;
  width: 100%;
}

$just-map: (
  left: flex-start,
  right: flex-end,
  center: center
);
@each $key, $value in $just-map {
  :deep(.ag-header-cell.#{$key} .ag-header-cell-label) {
    display: flex;
    align-items: center;
    justify-content: $value;
  }
}
</style>
