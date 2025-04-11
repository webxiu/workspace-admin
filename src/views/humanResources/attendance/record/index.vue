<script setup lang="ts">
import { useMachine } from "./hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "HumanResourcesAttendanceRecordIndex" });

const {
  columnDefs,
  isAgTable,
  loading,
  columns,
  dataList,
  maxHeight,
  buttonList,
  pagination,
  queryParams,
  searchOptions,
  rowClick,
  rowDbClick,
  onReFresh,
  onTagSearch,
  onSizeChange,
  onCurrentChange,
  onSwitchTable
} = useMachine();
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
        :height="maxHeight + 48"
        :paginations="pagination"
        @refresh="onReFresh"
        @switch="onSwitchTable"
        @cellClicked="rowClick"
        @cellDoubleClicked="rowDbClick"
        @sizeChange="onSizeChange"
        @currentChange="onCurrentChange"
        :headButtons="{ buttonList, autoLayout: false }"
        :blendedSearch="{ onTagSearch, queryParams, searchOptions, searchField: 'staffName', placeholder: '请输入姓名' }"
      />
      <PureTableBar v-else :columns="columns" @refresh="onReFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :queryParams="queryParams" :searchOptions="searchOptions" placeholder="请输入姓名" searchField="staffName" />
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
            id="machineTableId"
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
