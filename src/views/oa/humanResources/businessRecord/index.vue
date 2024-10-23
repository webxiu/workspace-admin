<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaHumanResourcesBusinessRecord" });

const {
  loading,
  columns,
  dataList,
  maxHeight,
  pagination,
  billStateInfo,
  searchOptions,
  carStrMap,
  buttonList,
  rowClick,
  findOptinNameByOptionValue,
  onSearch,
  onEdit,
  onSizeChange,
  onTagSearch,
  onCurrentChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="单据编号" searchField="billNo" />
      </template>
      <template #buttons>
        <ButtonList moreActionText="业务操作" :buttonList="buttonList" :auto-layout="false" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          id="outerRecordsId"
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
          @row-click="rowClick"
          @row-dblclick="onEdit"
          highlight-current-row
          :show-overflow-tooltip="true"
          :pagination="pagination"
          :paginationSmall="size === 'small'"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #billState="{ row }">
            <span>{{ billStateInfo[row.billState] }}</span>
          </template>

          <template #needVehicle="{ row }">
            <span>{{ findOptinNameByOptionValue(row.applyVehicleUsage) }}</span>
          </template>

          <template #userNames="{ row }">
            <span>{{ String(row.userNames) }}</span>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
