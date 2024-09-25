<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SupplyChainMangeInStoreListIndex" });

const {
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  queryParams,
  searchOptions,
  buttonList,
  onRefresh,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  handleCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch :queryParams="queryParams" @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="物料编码" searchField="fnumber" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          class="bill-manage"
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
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #fGiveaway="{ row }">
            {{ row.fGiveaway == "0" ? "否" : "是" }}
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
