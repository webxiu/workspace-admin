<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :queryParams="queryParams" :searchOptions="searchOptions" placeholder="姓名" searchField="staffName" />
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
            id="workAgeTableId"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            @row-dblclick="onDbClick"
            @row-click="rowClick"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
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

defineOptions({ name: "HumanResourcesWorkAgeMoneyIndex" });

const {
  columns,
  onFresh,
  handleTagSearch,
  onDbClick,
  rowClick,
  searchOptions,
  buttonList,
  maxHeight,
  loading,
  dataList,
  queryParams,
  pagination,
  onSizeChange,
  onCurrentChange
} = useMachine();
</script>

<style lang="scss">
.workage-modal {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
