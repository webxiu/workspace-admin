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

defineOptions({ name: "OaMarketingReportAddOrderIndex" });

const { chartRef, formData, maxHeight, buttonList, columns, dataList, loading, onChange } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" :showIcon="false">
      <template #title>
        <el-form class="flex" inline>
          <el-form-item label="年份" style="margin-bottom: 0">
            <el-date-picker
              :clearable="false"
              v-model="formData.year"
              type="year"
              placeholder="选择年份"
              format="YYYY"
              value-format="YYYY"
              @change="onChange"
            />
          </el-form-item>
        </el-form>
      </template>
      <template #buttons>
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          :height="maxHeight - 340"
          :max-height="maxHeight - 340"
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
    <div ref="chartRef" v-loading="loading" style="height: 320px; margin-top: 20px" />
  </div>
</template>
