<!-- /*
 * @Author: Hailen
 * @Date: 2023-07-05 11:45:27
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-07-05 11:45:27
 */ -->

<script setup lang="ts">
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "PlmManageBasicDataBomOverIndex" });

const tableRef = ref<HTMLDivElement>();
const searchOptions: SearchOptionType[] = [
  {
    label: "包含禁用BOM",
    value: "containDisplayBOM",
    children: [
      { label: "包含", value: true },
      { label: "不包含", value: false }
    ]
  }
];

const { loading, columns, dataList, onFresh, maxHeight, buttonList, handleTagSearch, cellDblclick, onExport } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h" ref="tableRef">
      <PureTableBar :columns="columns" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch :searchOptions="searchOptions" @tagSearch="handleTagSearch" placeholder="物料编码" searchField="number" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="childId"
            class="role-setting"
            :adaptive="true"
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            @cell-dblclick="cellDblclick"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :default-expand-all="false"
            :show-overflow-tooltip="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
