<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-07 16:01:43 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-07 16:01:43 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { onHeaderDragend } from "@/utils/table";
import ButtonList from "@/components/ButtonList/index.vue";

defineOptions({ name: "OaMarketingReportSaleRateIndex" });

const { chartRef1, chartRef2, formData, activeName, buttonList, columns, dataList, loading, maxHeight, onExport } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="inline-flex flex-wrap">
      <el-form class="flex-1" :inline="true">
        <el-form-item label="年份" class="mt-4 mb-4">
          <el-date-picker v-model="formData.year" type="year" placeholder="选择日期" format="YYYY" value-format="YYYY" :clearable="false" />
        </el-form-item>
      </el-form>
      <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
    </div>

    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="图表" name="chart">
        <div :style="{ minHeight: maxHeight + 8 + 'px' }">
          <div ref="chartRef1" v-loading="loading" style="height: 280px" />
          <div ref="chartRef2" v-loading="loading" style="height: 280px" class="mt-10" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="表格" name="table">
        <PureTableBar :columns="columns" class="flex-1" :showIcon="false">
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="id"
              class="sale-rate"
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
