<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";

import { ref } from "vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageProjectMgmtProductTemplateIndex" });

const {
  columns,
  dataList,
  rowDbClick,
  rowClick,
  loading,
  maxHeight,
  onExport,
  searchOptions,
  onBeforeEdit,
  onBeforeDel,
  onSearch,
  onFresh,
  onAdd,
  buttonList,
  onEdit,
  handleTagSearch,
  onDelete
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="请输入模板名称" searchField="templateName" />
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
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          :show-overflow-tooltip="true"
        />
      </template>
    </PureTableBar>
  </div>
</template>
