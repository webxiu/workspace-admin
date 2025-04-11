<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <AgGridTable
        v-if="isAgTable"
        ref="tableRef"
        rowKey="id"
        :rowData="dataList"
        :loading="loading"
        :columnDefs="columnDefs"
        :height="maxHeight + 15"
        :paginations="pagination"
        @refresh="onFresh"
        @switch="onSwitchTable"
        @cellClicked="rowClick"
        @cellDoubleClicked="rowDbclick"
        @rowSelected="onSelect"
        @sizeChange="onSizeChange"
        @currentChange="onCurrentChange"
        :headButtons="{ buttonList, loadingStatus, autoLayout: false }"
        :blendedSearch="{ onTagSearch, queryParams, searchOptions, searchField: 'staffName', placeholder: '请输入姓名' }"
      />
      <PureTableBar v-else :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :query-params="queryParams" :searchOptions="searchOptions" placeholder="请输入姓名" searchField="staffName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" :autoLayout="false" more-action-text="更多操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            ref="tableRef"
            :max-height="maxHeight"
            row-key="id"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="rowClick"
            @row-dblclick="rowDbclick"
            @select="onSelect"
            @select-all="onSelectAll"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMachine } from "./hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "HumanResourcesAttendanceArrangeMgmtIndex" });

const {
  columnDefs,
  isAgTable,
  tableRef,
  loading,
  columns,
  dataList,
  maxHeight,
  pagination,
  queryParams,
  buttonList,
  searchOptions,
  loadingStatus,
  onFresh,
  rowClick,
  rowDbclick,
  onSelect,
  onSelectAll,
  onTagSearch,
  onSizeChange,
  onCurrentChange,
  onSwitchTable
} = useMachine();
</script>
