<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "FinanceDeptPayrollMgmtSettings" });

const {
  columnDefs,
  isAgTable,
  moneyRef,
  loading,
  columns,
  dataList,
  maxHeight,
  searchOptions,
  queryParams,
  pagination,
  buttonList,
  onRefresh,
  handleSizeChange,
  handleCurrentChange,
  onTagSearch,
  rowDbClick,
  rowClick,
  onSwitchTable
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <AgGridTable
      v-if="isAgTable"
      rowKey="staffId"
      :rowData="dataList"
      :loading="loading"
      :columnDefs="columnDefs"
      :height="maxHeight + 15"
      :paginations="pagination"
      :openSideBar="true"
      @refresh="onRefresh"
      @switch="onSwitchTable"
      @cellClicked="rowClick"
      @cellDoubleClicked="rowDbClick"
      @sizeChange="handleSizeChange"
      @currentChange="handleCurrentChange"
      :headButtons="{ buttonList, autoLayout: false }"
      :blendedSearch="{ onTagSearch, queryParams, searchOptions, searchField: 'staffName', placeholder: '请输入姓名' }"
    />
    <PureTableBar v-else :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" :queryParams="queryParams" placeholder="请输入姓名" searchField="staffName" />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="moneyRef"
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="staffCode"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          @row-dblclick="rowDbClick"
          @row-click="rowClick"
          highlight-current-row
          :show-overflow-tooltip="true"
          :paginationSmall="size === 'small'"
          :pagination="pagination"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
  </div>
</template>
