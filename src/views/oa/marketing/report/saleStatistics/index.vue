<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend } from "@/utils/table";

defineOptions({ name: "OaMarketingReportSaleStatisticsIndex" });

const {
  columns,
  dataList,
  loading,
  maxHeight,
  buttonList,
  pagination,
  searchOptions,
  queryParams,
  onRefresh,
  onTagSearch,
  onSummaryMethod,
  onSizeChange,
  onCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" :show-icon="false" @refresh="onRefresh">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" :queryParams="queryParams" :immediate="false" placeholder="请选择" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          show-summary
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          class="sale-statistics"
          :adaptive="true"
          align-whole="center"
          :loading="loading"
          :size="size"
          :data="dataList"
          :pagination="pagination"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          :summary-method="onSummaryMethod"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
  </div>
</template>
