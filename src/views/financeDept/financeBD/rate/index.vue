<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <!-- :queryParams="queryParams" -->
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="汇率" searchField="exchangeRate" />
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

<script setup lang="ts">
import { useMachine } from "./hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "FinanceDeptFinanceBDRateIndex" });

const {
  columns,
  onFresh,
  rowClick,
  handleTagSearch,
  searchOptions,
  buttonList,
  maxHeight,
  dataList,
  rowDbClick,
  queryParams,
  pagination,
  onSizeChange,
  onCurrentChange
} = useMachine();
</script>

<style lang="scss">
.rate-modal-fin {
  // .el-form-item--small {
  //   margin-bottom: 8px !important;
  // }
}
</style>
