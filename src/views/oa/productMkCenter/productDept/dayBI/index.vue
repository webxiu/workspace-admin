<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";

defineOptions({ name: "OaProductMkCenterProductDeptDayBIIndex" });

const {
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  queryParams,
  searchOptions,
  onSearch,
  onExport,
  buttonList,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  handleCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch">
      <template #title>
        <BlendedSearch :queryParams="queryParams" @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="生产工单号" searchField="mobillno" />
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
        >
          <template #fGiveaway="{ row }">
            {{ row.fGiveaway == "0" ? "否" : "是" }}
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
