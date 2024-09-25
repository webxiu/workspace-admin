<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-05 08:52:07 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-05 08:52:07 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { BillState, AuditState } from "./utils/config";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaMarketingRelationComplaintIndex" });

const {
  loading,
  columns,
  dataList,
  maxHeight,
  loadingStatus,
  buttonList,
  searchOptions,
  pagination,
  onTagSearch,
  onRefresh,
  onRowClick,
  onReceiveBill,
  onReplyBill,
  onSizeChange,
  onCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入标题" searchField="title" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="customer-complaint"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :pagination="pagination"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="onRowClick"
            @page-size-change="onSizeChange"
            @page-current-change="onCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
