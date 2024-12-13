<!-- /*
 * @Author: Hailen
 * @Date: 2023-09-07 16:01:43
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-09-07 16:01:43
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { formConfigs } from "./utils/config";
import { onHeaderDragend } from "@/utils/table";
import EditForm from "@/components/EditForm/inline.vue";

defineOptions({ name: "MarketingReportOutboundIndex" });

const { chartRef1, chartRef2, formData, buttonList, activeName, columns, dataList, loading, maxHeight } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex just-between">
      <EditForm class="flex-1" :formConfigs="formConfigs()" :formInline="formData">
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </EditForm>
    </div>
    <div :style="{ minHeight: maxHeight + 8 + 'px' }">
      <div ref="chartRef1" v-loading="loading" style="height: 280px" />
      <div ref="chartRef2" v-loading="loading" style="height: 280px" class="mt-10" />
      <div>
        <PureTableBar :columns="columns" class="flex-1" :showIcon="false">
          <template v-slot="{ size, dynamicColumns }">
            <pure-table
              border
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
      </div>
    </div>
  </div>
</template>
