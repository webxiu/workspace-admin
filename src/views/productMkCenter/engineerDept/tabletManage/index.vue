<!-- /*
 * @Author: Hailen 
 * @Date: 2024-06-17 17:25:24 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-06-17 17:25:24 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "ProductMkCenterEngineerDeptTabletManageIndex" });

const {
  columnDefs,
  isAgTable,
  loading,
  columns,
  dataList,
  maxHeight,
  searchOptions,
  buttonList,
  pagination,
  onRefresh,
  onTagSearch,
  onDbClick,
  onRowClick,
  handleSizeChange,
  handleCurrentChange,
  onSwitchTable
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <AgGridTable
        v-if="isAgTable"
        ref="tableRef"
        rowKey="id"
        :loading="loading"
        :rowData="dataList"
        :columnDefs="columnDefs"
        :height="maxHeight + 12"
        :paginations="pagination"
        @switch="onSwitchTable"
        @refresh="onRefresh"
        @cellClicked="onRowClick"
        @cellDoubleClicked="onDbClick"
        @sizeChange="handleSizeChange"
        @currentChange="handleCurrentChange"
        :headButtons="{ buttonList, autoLayout: false }"
        :blendedSearch="{ onTagSearch, searchOptions, placeholder: '请输入平板名称', searchField: 'tabletsName' }"
      />
      <PureTableBar v-else :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入平板名称" searchField="tabletsName" />
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
            @row-click="onRowClick"
            @row-dblclick="onDbClick"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
