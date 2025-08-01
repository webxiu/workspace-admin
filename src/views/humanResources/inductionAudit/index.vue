<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-19 15:09:28 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-19 15:09:28 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import BasicInfo from "./basicInfo/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "HumanResourcesInductionAuditIndex" });

const {
  columnDefs,
  isAgTable,
  tableRef,
  loading,
  rowData,
  columns,
  dataList,
  maxHeight,
  queryParams,
  searchOptions,
  pagination,
  buttonList,
  onTagSearch,
  onRefresh,
  onSelect,
  onSelectAll,
  onRowClick,
  onSizeChange,
  onCurrentChange,
  onSwitchTable
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <AgGridTable
      v-if="isAgTable"
      ref="tableRef"
      rowKey="id"
      :rowData="dataList"
      :loading="loading"
      :columnDefs="columnDefs"
      :height="maxHeight / 2"
      :paginations="pagination"
      @refresh="onRefresh"
      @switch="onSwitchTable"
      @cellClicked="onRowClick"
      @rowSelected="onSelect"
      @sizeChange="onSizeChange"
      @currentChange="onCurrentChange"
      :headButtons="{ buttonList, autoLayout: false }"
      :blendedSearch="{ onTagSearch, queryParams, searchOptions, placeholder: '请输入姓名', searchField: 'staffName' }"
    />
    <PureTableBar v-else :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" :queryParams="queryParams" placeholder="请输入姓名" searchField="staffName" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
          :height="maxHeight / 2"
          :max-height="maxHeight / 2"
          row-key="id"
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
          @select="onSelect"
          @select-all="onSelectAll"
          @row-click="onRowClick"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
    <BasicInfo v-if="rowData?.id" :maxHeight="maxHeight" :id="rowData?.id" />
  </div>
</template>
