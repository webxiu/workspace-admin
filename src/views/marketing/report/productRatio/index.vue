<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-13 13:35:02 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-13 13:35:02 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { Col, Row } from "@/layout/Layout";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "MarketingReportProductRatioIndex" });

const { chartRef1, formData, columns, dataList, loading, maxHeight, buttonList, queryParams, searchOptions, onRefresh, onTagSearch } = useConfig();
</script>

<template>
  <Row>
    <Col>
      <PureTableBar :columns="columns" class="flex-1" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" :queryParams="queryParams" :immediate="false" placeholder="请选择日期" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="testF"
            class="product-ratio"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </Col>
    <Col>
      <div class="border-line ui-h-100">
        <div ref="chartRef1" v-loading="loading" :style="{ height: '600px' }" />
      </div>
    </Col>
  </Row>
</template>
