<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useTestReportConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import Modal from "@/views/supplyChainMange/orders/modal.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageLaboratoryTestTemplateIndex" });

const {
  loading,
  columns,
  dataList,
  maxHeight,
  pagination,
  searchOptions,
  buttonList,
  onFresh,
  onTagSearch,
  onRowClick,
  onDblclick,
  handleSizeChange,
  handleCurrentChange
} = useTestReportConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="模板名称" searchField="templateName" />
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
          @row-click="onRowClick"
          @row-dblclick="onDblclick"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
  </div>
</template>
