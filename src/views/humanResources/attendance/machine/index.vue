<script setup lang="ts">
import { useMachine } from "./hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "HumanResourcesAttendanceMachineIndex" });

const {
  columnDefs,
  isAgTable,
  tableRef,
  loading,
  dataList,
  columns,
  maxHeight,
  buttonList,
  searchOptions,
  loadingStatus,
  onReFresh,
  rowClick,
  onSelect,
  rowDbclick,
  onTagSearch,
  handleSelectionChange,
  onSwitchTable
} = useMachine();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <AgGridTable
        v-if="isAgTable"
        ref="tableRef"
        :rowData="dataList"
        :loading="loading"
        :columnDefs="columnDefs"
        :height="maxHeight"
        @refresh="onReFresh"
        @switch="onSwitchTable"
        @cellClicked="rowClick"
        @rowSelected="onSelect"
        @cellDoubleClicked="rowDbclick"
        :headButtons="{ buttonList, loadingStatus, autoLayout: false }"
        :blendedSearch="{ onTagSearch, searchOptions, searchField: 'sn', placeholder: '请输入序列号' }"
      />
      <PureTableBar v-else :columns="columns" @refresh="onReFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入序列号" searchField="sn" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" :autoLayout="false" more-action-text="业务操作" />
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
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="rowClick"
            @row-dblclick="rowDbclick"
            @selection-change="handleSelectionChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
