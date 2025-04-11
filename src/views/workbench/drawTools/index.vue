<!--
 * @Author: Hailen 
 * @Date: 2024-01-10 10:32:13 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-01-10 10:32:13 
-->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "WorkbenchDrawToolsIndex" });

const { tableRef, columns, dataList, loading, maxHeight, buttonList, pagination, searchOptions, onRefresh, onRowClick, rowDbclick, onTagSearch } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入流程名称" searchField="processName" />
      </template>
      <template #buttons>
        <ButtonList moreActionText="更多选项" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
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
          :pagination="pagination"
          highlight-current-row
          :show-overflow-tooltip="true"
          @row-click="onRowClick"
          @row-dblclick="rowDbclick"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
  </div>
</template>
