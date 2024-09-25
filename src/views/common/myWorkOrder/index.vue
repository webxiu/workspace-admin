<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";

import { ref } from "vue";

defineOptions({ name: "MyWorkOrder" });

const {
  columns,
  dataList,
  loading,
  maxHeight,
  pagination,
  searchOptions,
  beforeEdit,
  beforeDel,
  beforeSubmit,
  beforeBack,
  rowClick,
  onSearch,
  viewNodeDetail,
  onAdd,
  onView,
  onEdit,
  handleTagSearch,
  onExport,
  onSizeChange,
  taskType,
  queryParams,
  sysTypeOpts,
  billStateOpts,
  taskStateOpts,
  onCurrentChange
} = useConfig();

const buttonList = ref<ButtonItemType[]>([
  { clickHandler: onAdd, type: "primary", text: "新增" },
  { clickHandler: beforeEdit, type: "warning", text: "修改" },
  { clickHandler: beforeDel, type: "danger", text: "删除" },
  { clickHandler: beforeSubmit, type: "danger", text: "提交", isDropDown: true },
  { clickHandler: beforeBack, type: "danger", text: "回退", isDropDown: true },
  { clickHandler: onExport, type: "info", text: "导出", isDropDown: true },
  { clickHandler: viewNodeDetail, type: "info", text: "审批详情", isDropDown: true }
]);
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch">
      <template #title>
        <BlendedSearch
          :queryParams="queryParams"
          class="action-search"
          @tagSearch="handleTagSearch"
          :searchOptions="searchOptions"
          placeholder="工单编号"
          searchField="billNo"
        />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          id="visitorId"
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
          @row-click="rowClick"
          @row-dblclick="onEdit"
          highlight-current-row
          :show-overflow-tooltip="true"
          :pagination="pagination"
          :paginationSmall="size === 'small'"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
        >
          <template #taskTypeCode="{ row }">
            <span>{{ taskType.find((item) => item.optionValue == row.taskTypeCode)?.optionName || "" }}</span>
          </template>
          <template #systemName="{ row }">
            <span>{{ sysTypeOpts.find((item) => item.optionValue == row.systemName)?.optionName || "" }}</span>
          </template>
          <template #billState="{ row }">
            <span>{{ billStateOpts.find((item) => item.optionValue == row.billState)?.optionName || "" }}</span>
          </template>
          <template #taskStatus="{ row }">
            <span>{{ taskStateOpts.find((item) => item.optionValue == row.taskStatus)?.optionName || "" }}</span>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
