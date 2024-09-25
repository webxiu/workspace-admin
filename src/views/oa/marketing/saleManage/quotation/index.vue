<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="单据编号" searchField="billNo" />
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
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
          highlight-current-row
          :show-overflow-tooltip="true"
          @row-click="rowClick"
          @row-dblclick="rowDbclick"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { useMachine } from "./hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";
import { PureTableBar } from "@/components/RePureTableBar";
import ButtonList from "@/components/ButtonList/index.vue";

defineOptions({ name: "OaMarketingSaleManageQuotationIndex" });

const {
  columns,
  onFresh,
  handleTagSearch,
  pagination,
  onSizeChange,
  onCurrentChange,
  rowClick,
  rowDbclick,
  searchOptions,
  buttonList,
  maxHeight,
  loading,
  dataList
} = useMachine();
</script>

<style lang="scss">
.saleMgmtModal {
  .el-form-item--small.el-form-item {
    margin-bottom: 2px !important;
  }

  .dialog-form {
    padding: 0 !important;
  }

  .el-dialog__body {
    padding-top: 8px !important;
  }
}
</style>
