<script setup lang="ts">
import { useConfig } from "./hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "HumanResourcesAttendanceSupplementaryCardMgmt" });

const {
  isAgTable,
  columnDefs,
  columns,
  loading,
  maxHeight,
  dataList,
  pagination,
  buttonList,
  searchOptions,
  onRefresh,
  onTagSearch,
  rowDbClick,
  rowClick,
  onSizeChange,
  onCurrentChange,
  onSwitchTable
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
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
        @cellClicked="rowClick"
        @cellDoubleClicked="rowDbClick"
        @sizeChange="onSizeChange"
        @currentChange="onCurrentChange"
        :headButtons="{ buttonList, autoLayout: false }"
        :blendedSearch="{ onTagSearch, searchOptions, searchField: 'staffName', placeholder: '补卡人' }"
      />
      <PureTableBar v-else:columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="补卡人" searchField="staffName" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="machine-table"
            :adaptive="true"
            align-whole="center"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="rowClick"
            @row-dblclick="rowDbClick"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
