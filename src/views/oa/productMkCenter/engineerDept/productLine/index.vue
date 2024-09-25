<!-- /*
 * @Author: Hailen 
 * @Date: 2024-06-17 17:25:24 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2024-06-17 17:25:24 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";

defineOptions({ name: "OaProductMkCenterEngineerDeptProductLineIndex" });

const { loading, columns, dataList, maxHeight, buttonList, onRefresh, onDbClick, onRowClick, onDistribute } = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" @refresh="onRefresh">
        <template #title>
          <div class="no-wrap block-quote-tip ui-w-100 mr-50">按生产线分发指导书</div>
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :auto-layout="false" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
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
            @row-dblclick="onDbClick"
          >
            <template #operation="{ row }">
              <el-button size="small" type="primary" @click.stop="onDistribute(row)">分发</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
