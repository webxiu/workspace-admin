<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-15 14:40:52 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-15 14:40:52 
 */ -->
<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { onHeaderDragend } from "@/utils/table";

defineOptions({ name: "OaMarketingReportSaleSummaryIndex" });

const { columns, columns2, dataList, dataList2, loading, buttonList, loading2, maxHeight, searchOptions, onTagSearch } = useConfig();
</script>
<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" :show-icon="false">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请选择销售员" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight / 2"
          :max-height="maxHeight / 2"
          row-key="id"
          class="sale-summary-number"
          :adaptive="true"
          align-whole="center"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
    <PureTableBar :columns="columns2" :showIcon="false">
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight / 2"
          :max-height="maxHeight / 2"
          row-key="menuId"
          class="sale-summary-achievement"
          :adaptive="true"
          align-whole="center"
          :loading="loading2"
          :size="size"
          :data="dataList2"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
        />
      </template>
    </PureTableBar>
  </div>
</template>
