<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :query-params="queryParams" :searchOptions="searchOptions" placeholder="姓名" searchField="userName" />
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
  loading,
  onSizeChange,
  onCurrentChange,
  pagination,
  dataList,
  onSelect,
  onSelectAll,
  tableRef,
  columns,
  maxHeight,
  buttonList,
  searchOptions,
  loadingStatus,
  onFresh,
  queryParams,
  rowClick,
  rowDbclick,
  handleTagSearch
} = useMachine();
</script>
