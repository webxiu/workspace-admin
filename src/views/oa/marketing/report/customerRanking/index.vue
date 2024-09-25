<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-13 13:35:02 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-13 13:35:02 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { Col, Row } from "@/layout/Layout";
import { PureTableBar } from "@/components/RePureTableBar";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaMarketingReportCustomerRankingIndex" });

const {
  columns,
  columns2,
  buttonList,
  columns3,
  dataList,
  dataList2,
  dataList3,
  loading,
  loading2,
  loading3,
  maxHeight,
  singleTableRef,
  groupArrsList,
  searchOptions,
  queryParams,
  onTagSearch,
  onRefresh,
  onRefresh2,
  onRefresh3,
  rowClick,
  onSummaryMethod
} = useConfig();
</script>

<template>
  <Row>
    <Col>
      <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch
            @tagSearch="onTagSearch"
            :searchOptions="searchOptions"
            :queryParams="queryParams"
            :immediate="false"
            placeholder="请输入姓名"
            searchField="userName"
          />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            ref="singleTableRef"
            border
            :height="maxHeight + 8"
            :max-height="maxHeight + 8"
            row-key="FCUSTID"
            class="achievement-statistics"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            show-summary
            @row-click="rowClick"
            :summary-method="onSummaryMethod"
            :show-overflow-tooltip="true"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </Col>
    <Col>
      <PureTableBar :columns="columns2" @refresh="onRefresh2" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[1]?.groupName" :border="false" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight / 2"
            :max-height="maxHeight / 2"
            row-key="FCUSTID"
            class="achievement-statistics"
            :adaptive="true"
            align-whole="center"
            :loading="loading2"
            :size="size"
            :data="dataList2"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          />
        </template>
      </PureTableBar>

      <PureTableBar :columns="columns3" class="flex-1" @refresh="onRefresh3" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[2]?.groupName" :border="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight / 2 - 32"
            :max-height="maxHeight / 2 - 32"
            row-key="FCUSTID"
            class="achievement-statistics"
            :adaptive="true"
            align-whole="center"
            :loading="loading3"
            :size="size"
            :data="dataList3"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns3)"
          />
        </template>
      </PureTableBar>
    </Col>
  </Row>
</template>
