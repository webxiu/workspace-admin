<script setup lang="ts">
import { useApiList } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SystemAuthorityApiListIndex" });

const {
  columnDefs,
  isAgTable,
  columns,
  dataList,
  loading,
  maxHeight,
  searchOptions,
  pagination,
  buttonList,
  onRefresh,
  onTagSearch,
  onCurrentChange,
  handleSizeChange,
  handleCurrentChange,
  onSwitchTable
} = useApiList();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <AgGridTable
      v-if="isAgTable"
      rowKey="id"
      :rowData="dataList"
      :loading="loading"
      :columnDefs="columnDefs"
      :height="maxHeight + 12"
      :paginations="pagination"
      @refresh="onRefresh"
      @switch="onSwitchTable"
      @cellClicked="onCurrentChange"
      @sizeChange="onCurrentChange"
      @currentChange="handleCurrentChange"
      :headButtons="{ buttonList, autoLayout: false }"
      :blendedSearch="{ onTagSearch, searchOptions, searchField: 'mappingUrl', placeholder: '请输入接口地址' }"
    />
    <PureTableBar v-else :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="请输入接口地址" searchField="mappingUrl" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" />
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
          @current-change="onCurrentChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
  </div>
</template>
