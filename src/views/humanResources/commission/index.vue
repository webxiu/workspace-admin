<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "HumanResourcesCommissionIndex" });

const {
  tableRef,
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  buttonList,
  searchOptions,
  queryParams,
  onSearch,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  onSelect,
  onSelectAll,
  rowClick,
  onDbClick,
  handleCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch
          @tagSearch="handleTagSearch"
          :searchOptions="searchOptions"
          :queryParams="queryParams"
          :immediate="false"
          placeholder="单据编号"
          searchField="billNo"
        />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" more-action-text="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <div>
          <div>
            <pure-table
              id="commissionTableId"
              border
              :height="maxHeight"
              :max-height="maxHeight"
              ref="tableRef"
              row-key="id"
              class="bill-manage"
              :adaptive="true"
              align-whole="left"
              :loading="loading"
              :size="size"
              :data="dataList"
              :columns="dynamicColumns"
              :row-style="() => ({ cursor: 'pointer' })"
              :paginationSmall="size === 'small'"
              highlight-current-row
              :show-overflow-tooltip="true"
              :pagination="pagination"
              @current-change="onCurrentChange"
              @row-dblclick="onDbClick"
              @row-click="rowClick"
              @select="onSelect"
              @select-all="onSelectAll"
              @page-size-change="handleSizeChange"
              @page-current-change="handleCurrentChange"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            />
          </div>
        </div>
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss">
.commission-modal {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
