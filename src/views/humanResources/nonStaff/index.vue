<script setup lang="ts">
import { useConfig } from "./hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "HumanResourcesNonStaffIndex" });

const {
  columnDefs,
  isAgTable,
  tableRef,
  columns,
  loading,
  dataList,
  maxHeight,
  pagination,
  buttonList,
  searchOptions,
  onFresh,
  rowClick,
  rowDbclick,
  onSelect,
  onSelectAll,
  onSizeChange,
  onTagSearch,
  onCurrentChange,
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
        :rowData="dataList"
        :loading="loading"
        :columnDefs="columnDefs"
        :showOption="{ select: true }"
        :height="maxHeight + 12"
        :paginations="pagination"
        @refresh="onFresh"
        @switch="onSwitchTable"
        @cellClicked="rowClick"
        @rowSelected="onSelect"
        @cellDoubleClicked="rowDbclick"
        @sizeChange="onSizeChange"
        @currentChange="onCurrentChange"
        :headButtons="{ buttonList, autoLayout: false }"
        :blendedSearch="{ onTagSearch, searchOptions, searchField: 'staffName', placeholder: '请输入姓名' }"
      />
      <PureTableBar v-else :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="姓名" searchField="staffName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="tableRef"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="mapping-table"
            id="mappingTableId"
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
            @row-click="rowClick"
            @row-dblclick="rowDbclick"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
