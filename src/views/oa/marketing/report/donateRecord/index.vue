<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-13 13:35:02 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-13 13:35:02 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaMarketingReportDonateRecordIndex" });

const { columns, pagination, searchOptions, dataList, queryParams, loading, maxHeight, buttonList, onSizeChange, onCurrentChange, onSearch, handleTagSearch } =
  useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex-col flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :queryParams="queryParams" :searchOptions="searchOptions" placeholder="请选择" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="FCUSTID"
            class="donate-record"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :pagination="pagination"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
