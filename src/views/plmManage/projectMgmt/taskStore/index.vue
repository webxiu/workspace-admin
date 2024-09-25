<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SupplyChainMangeInStoreListIndex" });

const {
  columns,
  columns2,
  dataList,
  dataList2,
  loading,
  maxHeight,
  pagination,
  searchOptions,
  buttonList,
  buttonList2,
  onFresh,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  rowClick,
  rowDbClick,
  rowClickRight,
  handleCurrentChange
} = useConfig();
</script>

<template>
  <div style="display: flex">
    <div class="ui-h-100" style="width: 75%">
      <PureTableBar :columns="columns" class="flex-1" @refresh="onFresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="任务名称" searchField="taskName" />
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
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            :pagination="pagination"
            @row-click="rowClick"
            @row-dblclick="rowDbClick"
            @current-change="onCurrentChange"
            @page-size-change="handleSizeChange"
            @page-current-change="handleCurrentChange"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
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
    <div style="width: 25%; padding-top: 47px">
      <div style="margin-bottom: 10px">
        <ButtonList :buttonList="buttonList2" :auto-layout="false" moreActionText="业务操作" />
      </div>
      <pure-table
        border
        :height="maxHeight - 34"
        row-key="id"
        class="bill-manage"
        :adaptive="true"
        align-whole="left"
        size="small"
        :data="dataList2"
        :columns="columns2"
        @row-click="rowClickRight"
        highlight-current-row
        :show-overflow-tooltip="true"
      />
    </div>
  </div>
</template>
