<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";

defineOptions({ name: "SupplyChainMangeInStoreListIndex" });
const props: any = defineProps(["selectRowsCallBack", "dataListRight"]);

const {
  columns,
  dataList,
  loading,
  pagination,
  tableRef,
  onSearch,
  handleTagSearch,
  modalSelectedRows,
  onCurrentChange,
  handleSelectionChange,
  handleSizeChange,
  rowClick,
  handleCurrentChange,
  onSelect,
  onSelectAll
} = useConfig(props);

defineExpose({ modalSelectedRows });
</script>

<template>
  <div style="display: flex">
    <div class="ui-h-100" style="width: 100%">
      <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" placeholder="任务名称" searchField="taskName" />
        </template>
        <template #buttons />
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="tableRef"
            border
            :height="400"
            row-key="id"
            class="bill-manage"
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
            @row-click="rowClick"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @select="onSelect"
            @select-all="onSelectAll"
          >
            <!-- @selection-change="handleSelectionChange" -->
            <template #fGiveaway="{ row }">
              {{ row.fGiveaway == "0" ? "否" : "是" }}
            </template>
            <template #relatedPost="{ row }">
              {{ String(row.taskModelResponsibleRolesList?.map((item) => item.roleName).filter((item) => item) ?? "") }}
            </template>
            <template #relevantPost1="{ row }">
              {{ String(row.taskModelDeliverablesList?.map((item) => item.name).filter((item) => item) ?? "") }}
            </template>

            <template #relevantPost="{ row }">
              {{ String(row.taskRelateRoleList?.map((item) => item.roleName).filter((item) => item) ?? "") }}
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
