<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SupplyChainMangeSupplierIndex" });

const {
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  searchOptions,
  supplierTable,
  buttonList,
  onRefresh,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  handleCurrentChange,
  handleSelectionChange,
  rowClick
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="供应商编码" searchField="fnumber" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          id="supplierTableId"
          ref="supplierTable"
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="fnumber"
          class="supplier-table"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          :pagination="pagination"
          @current-change="onCurrentChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @selection-change="handleSelectionChange"
          @row-click="rowClick"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #userCode="{ row }">
            <span>{{ row.userCode === "yes" ? "已创建" : "未创建" }}</span>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
