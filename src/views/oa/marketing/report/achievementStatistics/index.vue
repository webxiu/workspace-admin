<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-13 13:35:02 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-13 13:35:02 
 */ -->

<script setup lang="ts">
import { Col, Row } from "@/layout/Layout";
import { useConfig } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import ButtonList from "@/components/ButtonList/index.vue";
import BlendedSearch from "@/components/BlendedSearch/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaMarketingReportAchievementStatisticsIndex" });

const {
  columns,
  columns2,
  dataList,
  dataList2,
  loading,
  loading2,
  maxHeight,
  buttonList,
  searchOptions,
  queryParams,
  groupArrsList,
  onRefresh,
  onRefresh2,
  onTagSearch,
  onSummaryMethod1,
  onSummaryMethod2
} = useConfig();
</script>

<template>
  <Row>
    <Col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
      <PureTableBar :columns="columns" :showIcon="true" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch
            @tagSearch="onTagSearch"
            :searchOptions="searchOptions"
            :queryParams="queryParams"
            placeholder="请输入产品编号"
            searchField="fnumber"
          />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            show-summary
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="FBILLNO"
            class="achievement-statistics"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            :summary-method="onSummaryMethod1"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </Col>
    <Col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
      <PureTableBar :columns="columns2" :showIcon="true" @refresh="onRefresh2" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[1]?.groupName" :border="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            show-summary
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            class="achievement-statistics-people"
            :adaptive="true"
            align-whole="center"
            :loading="loading2"
            :size="size"
            :data="dataList2"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            :summary-method="onSummaryMethod2"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          />
        </template>
      </PureTableBar>
    </Col>
  </Row>
</template>
