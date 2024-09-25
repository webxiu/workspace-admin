<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useMarginAnalysis } from "./hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaFinanceDeptFinanceBIMarginAnalysisIndex" });

const { columns, dataList, loading, getSummaries, maxHeight, buttonList, searchOptions, onFresh, onTagSearch, queryParams } = useMarginAnalysis();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch
          :queryParams="queryParams"
          class="action-search"
          @tagSearch="onTagSearch"
          :searchOptions="searchOptions"
          placeholder="产品编码"
          searchField="number"
        />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          id="marginAnalysisId"
          border
          :summary-method="getSummaries"
          show-summary
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
          :show-overflow-tooltip="true"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
  </div>
</template>
