<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "HumanResourcesSafeCertificate" });

const {
  columns,
  columns2,
  dataList,
  dataList2,
  handleTagSearch,
  searchOptions,
  maxHeight,
  buttonList,
  buttonList2,
  getSummaries,
  rowDbClick,
  rowClick,
  rowClick2,
  rowDbClick2,
  onSearch2,
  onSearch,
  onSizeChange,
  onCurrentChange,
  pagination,
  onSizeChange2,
  onCurrentChange2,
  pagination2
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div style="display: flex">
      <div style="width: 63%">
        <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch" @change-column="setUserMenuColumns">
          <template #title>
            <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="项目名称" searchField="projectName" />
          </template>
          <template #buttons>
            <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
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
              :size="size"
              :data="dataList"
              :columns="dynamicColumns"
              @row-dblclick="rowDbClick"
              @row-click="rowClick"
              highlight-current-row
              :show-overflow-tooltip="true"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
              @page-size-change="onSizeChange"
              @page-current-change="onCurrentChange"
              :pagination="pagination"
              :paginationSmall="size === 'small'"
            />
          </template>
        </PureTableBar>
      </div>
      <div style="width: 37%">
        <PureTableBar :columns="columns2" class="flex-1" @refresh="onSearch2" @change-column="setUserMenuColumns">
          <template #title />
          <template #buttons>
            <ButtonList moreActionText="业务操作" :buttonList="buttonList2" :auto-layout="false" />
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
              :size="size"
              :data="dataList2"
              :columns="dynamicColumns"
              @row-dblclick="rowDbClick2"
              @row-click="rowClick2"
              highlight-current-row
              :show-overflow-tooltip="true"
              @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
            />
          </template>
        </PureTableBar>
      </div>
    </div>
  </div>
</template>
