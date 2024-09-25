<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { ref } from "vue";
import dayjs from "dayjs";
import ButtonList from "@/components/ButtonList/index.vue";

defineOptions({ name: "OaProductMkCenterMaterialControlProductDetailIndex" });

const {
  columns,
  dataList,
  loading,
  buttonList,
  maxHeight,
  pagination,
  searchOptions,
  onSearch,
  onExport,
  handleTagSearch,
  onCurrentChange,
  handleSizeChange,
  handleCurrentChange
} = useConfig();

const firstDayOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
const nowDay = dayjs().format("YYYY-MM-DD");
const initDateRange = `${firstDayOfMonth} ~ ${nowDay}`;
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch">
      <template #title>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="生产订单号" searchField="billNo" />
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
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
          @current-change="onCurrentChange"
          @page-size-change="handleSizeChange"
          @page-current-change="handleCurrentChange"
        >
          <template #fGiveaway="{ row }">
            {{ row.fGiveaway == "0" ? "否" : "是" }}
          </template>
          <template #FTOTALNOPICKEDQTY="{ row }">
            <span>{{ Math.ceil(+row.FTOTALNOPICKEDQTY) }}</span>
          </template>
        </pure-table>
      </template>
    </PureTableBar>
  </div>
</template>
