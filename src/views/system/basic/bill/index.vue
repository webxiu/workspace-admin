<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SystemBasicBillIndex" });

const {
  columnDefs,
  isAgTable,
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  searchOptions,
  buttonList,
  onRefresh,
  onEdit,
  onDelete,
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
      :rowData="dataList"
      :loading="loading"
      :columnDefs="columnDefs"
      :height="maxHeight + 15"
      :paginations="pagination"
      @refresh="onRefresh"
      @switch="onSwitchTable"
      @cellClicked="onCurrentChange"
      @cellDoubleClicked="onEdit"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :headButtons="{ buttonList, autoLayout: false }"
      :blendedSearch="{ onTagSearch, searchOptions, searchField: 'billId', placeholder: '请输入单据编号' }"
    />
    <PureTableBar v-else :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入单据编号" searchField="billId" />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="dataList.length ? maxHeight : undefined"
          :max-height="maxHeight"
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="center"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          :pagination="pagination"
          @current-change="onCurrentChange"
          @row-dblclick="onEdit"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
  </div>
</template>
