<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaHumanResourcesVisitorReception" });

const {
  loading,
  columns,
  dataList,
  maxHeight,
  pagination,
  buttonList,
  searchOptions,
  optionInfoList,
  rowClick,
  onSearch,
  onView,
  onTagSearch,
  onSizeChange,
  onCurrentChange
} = useConfig();

const getStateName = (state: number | string) => {
  return optionInfoList.value.find((item) => item.optionValue == state)?.optionName || "";
};
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch" @change-column="setUserMenuColumns">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="姓名" searchField="createUserName" />
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
          @row-dblclick="onView"
          highlight-current-row
          :show-overflow-tooltip="true"
          :pagination="pagination"
          :paginationSmall="size === 'small'"
          @page-size-change="onSizeChange"
          @page-current-change="onCurrentChange"
          @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
        >
          <template #billState="{ row }">
            <span>{{ getStateName(row.billState) }}</span>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
