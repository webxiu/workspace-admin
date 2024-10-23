<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-13 13:35:02 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-13 13:35:02 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { Col, Row } from "@/layout/Layout";
import { formConfigs } from "./utils/config";
import EditForm from "@/components/EditForm/inline.vue";
import { PureTableBar } from "@/components/RePureTableBar";
import ButtonList from "@/components/ButtonList/index.vue";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaMarketingReportCustomerTrendIndex" });

const {
  chartRef1,
  table1Ref,
  formData,
  columns,
  columns2,
  dataList,
  dataList2,
  loading,
  loading2,
  maxHeight,
  chartHeight,
  buttonList,
  onSearch,
  onOpenChange,
  onRowClick
} = useConfig();
</script>

<template>
  <Row>
    <Col>
      <PureTableBar :columns="columns" class="flex-1" @refresh="onSearch" @change-column="setUserMenuColumns">
        <template #title>
          <div class="inline-flex flex-wrap">
            <EditForm ref="formRef" class="flex-1" :formConfigs="formConfigs({ onOpenChange, onEnter: onSearch })" :formInline="formData" />
          </div>
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="table1Ref"
            :height="maxHeight - 8"
            :max-height="maxHeight - 8"
            row-key="FCUSTID"
            class="customer-trend"
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            :paginationSmall="size === 'small'"
            highlight-current-row
            :show-overflow-tooltip="true"
            @row-click="onRowClick"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          />
        </template>
      </PureTableBar>
    </Col>
    <Col>
      <div v-loading="loading2">
        <div ref="chartRef1" :style="{ minHeight: '430px', height: chartHeight + 40 + 'px' }" class="border-line m-2 p-4" />
        <PureTableBar :columns="columns2" class="flex-1" :showIcon="false">
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              :height="maxHeight - chartHeight - 16"
              :max-height="maxHeight - chartHeight - 16"
              row-key="id"
              class="customer-trend-list"
              :adaptive="true"
              align-whole="center"
              :loading="false"
              :size="size"
              :data="dataList2"
              :columns="dynamicColumns"
              :paginationSmall="size === 'small'"
              highlight-current-row
              :show-overflow-tooltip="true"
            />
          </template>
        </PureTableBar>
      </div>
    </Col>
  </Row>
</template>
