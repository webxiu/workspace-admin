<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaHumanResourcesMealCard" });

const {
  tableRef,
  columns,
  columns2,
  dataList,
  dataList2,
  loading,
  loading2,
  maxHeight,
  pagination,
  searchOptions,
  queryParams,
  buttonList,
  groupArrsList,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  rowStyle,
  onSearch,
  onSearch2,
  onSelect,
  onSelectAll,
  onRowClick,
  handleCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex flex-1 main main-content">
    <PureTableBar :columns="columns" @refresh="onSearch" @change-column="setUserMenuColumns" style="width: 70%; margin-right: 10px">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" :queryParams="queryParams" placeholder="请输入姓名" searchField="userName" />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
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
          :row-style="rowStyle"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          :pagination="pagination"
          @row-click="onRowClick"
          @select="onSelect"
          @select-all="onSelectAll"
          @current-change="onCurrentChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
    <div style="width: 30%">
      <PureTableBar :columns="columns2" @refresh="onSearch2" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[1]?.groupName" :border="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            :adaptive="true"
            align-whole="left"
            :loading="loading2"
            :size="size"
            :data="dataList2"
            :columns="dynamicColumns"
            highlight-current-row
            :show-overflow-tooltip="true"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
