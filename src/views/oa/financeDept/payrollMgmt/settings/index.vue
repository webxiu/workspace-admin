<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaFinanceDeptPayrollMgmtSettings" });

const {
  moneyRef,
  loading,
  columns,
  dataList,
  maxHeight,
  searchOptions,
  queryParams,
  pagination,
  buttonList,
  onRefresh,
  handleSizeChange,
  handleCurrentChange,
  onChangeFileInput,
  handleTagSearch,
  rowDbClick,
  rowClick
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch
          @tagSearch="handleTagSearch"
          :searchOptions="searchOptions"
          :queryParams="queryParams"
          placeholder="请输入姓名"
          searchField="staffName"
        />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
        <input style="display: none" type="file" accept=".xls,.xlsx" id="imporMoneyInputSettings" @change="onChangeFileInput" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="moneyRef"
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="staffCode"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          @row-dblclick="rowDbClick"
          @row-click="rowClick"
          highlight-current-row
          :show-overflow-tooltip="true"
          :paginationSmall="size === 'small'"
          :pagination="pagination"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        />
      </template>
    </PureTableBar>
  </div>
</template>
