<!-- /*
 * @Author: Hailen
 * @Date: 2023-09-07 16:01:43
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-09-07 16:01:43
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import ButtonGroup from "@/components/ButtonGroup.vue";
import { onHeaderDragend } from "@/utils/table";

defineOptions({ name: "MarketingReportDeliverRateIndex" });

const { chartRef1, chartRef2, formData, buttonList, buttonsConfig, activeName, columns, dataList, loading, maxHeight, onExport } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="inline-flex flex-wrap">
      <el-form class="flex-1" :inline="true">
        <el-form-item label="年月" class="mt-4 mb-4">
          <el-date-picker v-model="formData.date" type="month" placeholder="选择日期" format="YYYY-MM" value-format="YYYY-MM-DD" :clearable="false" />
        </el-form-item>
        <el-form-item label="汇总周期" class="mt-4 mb-4">
          <ButtonGroup v-model="formData.type" :buttonsConfig="buttonsConfig" />
        </el-form-item>
      </el-form>
      <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
    </div>

    <div :style="{ minHeight: maxHeight + 8 + 'px' }">
      <div ref="chartRef1" v-loading="loading" style="height: 280px" />
      <div ref="chartRef2" class="mt-4" v-loading="loading" style="height: 280px" />
      <div>
        <PureTableBar :columns="columns" class="flex-1" :showIcon="false">
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
              :height="maxHeight"
              :max-height="maxHeight"
              row-key="id"
              class="addOrder"
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
      </div>
    </div>
  </div>
</template>
