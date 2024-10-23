<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-07 16:01:43 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-07 16:01:43 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { formConfigs } from "./utils/config";
import { onHeaderDragend } from "@/utils/table";
import ButtonList from "@/components/ButtonList/index.vue";
import EditForm from "@/components/EditForm/inline.vue";

defineOptions({ name: "OaMarketingReportOutboundIndex" });

const { chartRef1, chartRef2, formData, buttonList, activeName, columns, dataList, loading, maxHeight } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex just-between">
      <EditForm class="flex-1" :formConfigs="formConfigs()" :formInline="formData">
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </EditForm>
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
              class="outbound"
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
