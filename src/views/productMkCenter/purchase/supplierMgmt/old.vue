<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

// defineOptions({ name: "ProductMkCenterPurchaseSupplierMgmtIndex" });
const emits = defineEmits(["select"]);

const {
  columns,
  dataList,
  rowDbClick,
  rowClick,
  maxHeight,
  buttonList,
  handleSizeChange,
  handleCurrentChange,
  onCurrentChange,
  searchOptions,
  onFresh,
  pagination,
  handleTagSearch
} = useConfig(emits, null);
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns" show-icon>
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="供应商名称" searchField="supplierName" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          id="productStoreTableId"
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          :adaptive="true"
          align-whole="left"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          :pagination="pagination"
          :show-overflow-tooltip="true"
          highlight-current-row
          @current-change="onCurrentChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @row-dblclick="rowDbClick"
          @row-click="rowClick"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss">
.supplier-modal-mkt {
  .el-form-item--small {
    margin-bottom: 8px !important;
  }
}
</style>
