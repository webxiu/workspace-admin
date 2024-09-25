<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import ButtonList from "@/components/ButtonList/index.vue";

import { useConfig } from "./utils/hook";

const {
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  queryParams,
  searchOptions,
  buttonList,
  onSearch,
  onExport,
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
        <BlendedSearch :queryParams="queryParams" @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="变更型号" searchField="fNumber" />
      </template>
      <template #buttons>
        <ButtonList moreActionText="更多操作" :buttonList="buttonList" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="dataList.length ? maxHeight : undefined"
          :max-height="maxHeight"
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="center"
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
        />
      </template>
    </PureTableBar>
  </div>
</template>
