<!-- /*
 * @Author: Hailen
 * @Date: 2024-08-01 15:18:40
 * @Last Modified by:   Hailen
 * @Last Modified time: 2024-08-01 15:18:40
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaProductMkCenterMaterialControlProductScheduleIndex" });

const { tableRef, loading, columns, dataList, maxHeight, searchOptions, buttonList, onRefresh, onTagSearch, handleSelectionChange, onRowClick } = useConfig();
</script>

<template>
  <div class="flex-col flex-1 ui-h-100 ui-ov-h main main-content">
    <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入生产订单" searchField="prdOrderBillNo" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          ref="tableRef"
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          :adaptive="true"
          align-whole="center"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          @row-click="onRowClick"
          @selection-change="handleSelectionChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
  </div>
</template>
