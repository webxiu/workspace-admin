<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "FileManageQhGroupIndex" });

const { loading, columns, dataList, maxHeight, qhGroupRef, buttonList, rowClick, rowDbClick, onRefresh } = useConfig();

const tableRowClassName = ({ row, column, rowIndex, columnIndex }) => {
  //把每一行的索引放进row,和index
  row.index = rowIndex;
  column.index = columnIndex;
};
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #buttons>
          <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="qhGroupRef"
            border
            :cell-class-name="tableRowClassName"
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="itemId"
            class="user-manage"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            @row-dblclick="rowDbClick"
            @row-click="rowClick"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :default-expand-all="true"
            :show-overflow-tooltip="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
