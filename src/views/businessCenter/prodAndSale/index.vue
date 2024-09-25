<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-07 16:01:43 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-07 16:01:43 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";

defineOptions({ name: "BusinessCenterProdAndSaleIndex" });

const { chartRef1, chartRef2, chartRef3, formData, activeName, columns, dataList, loading, maxHeight, buttonList } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex just-between">
      <el-form-item label="年份">
        <el-date-picker v-model="formData.iYear" type="year" placeholder="选择日期" format="YYYY" value-format="YYYY" :clearable="false" />
      </el-form-item>
      <ButtonList :buttonList="buttonList" :autoLayout="false" />
    </div>

    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="图表" name="chart">
        <div v-loading="loading">
          <div ref="chartRef1" style="height: 420px" />
          <div ref="chartRef3" style="height: 420px; margin-top: 20px" />
          <div ref="chartRef2" style="height: 420px; margin-top: 20px" />
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
            />
          </template>
        </PureTableBar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
