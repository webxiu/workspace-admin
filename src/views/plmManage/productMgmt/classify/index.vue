<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";

import { ref } from "vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageProjectMgmtClassifyIndex" });

const {
  columns,
  dataList,
  rowDbClick,
  rowClick,
  loading,
  maxHeight,
  beforeOnEdit,
  buttonList,
  beforeOnDelete,
  searchOptions,
  onSearch,
  onFresh,
  onAdd,
  onEdit,
  handleTagSearch,
  onExport,
  onDelete
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="产品分类编码" searchField="categoryNo" />
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
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
          @row-dblclick="rowDbClick"
          @row-click="rowClick"
          :show-overflow-tooltip="true"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
  </div>
</template>
