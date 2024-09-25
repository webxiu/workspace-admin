<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { useConfig } from "./utils/hook";
import { PureTableBar } from "@/components/RePureTableBar";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "OaHumanResourcesPersonStatisticsIndex" });

const {
  loading,
  loading2,
  columns,
  columns2,
  dataList,
  dataList2,
  maxHeight,
  buttonList,
  groupArrsList,
  onRefresh,
  onShowDesc,
  onSummaryMethod,
  onSummaryMethod2
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" style="width: 50%" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[0]?.groupName" :border="false" style="margin: 4px 0" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            show-summary
            :adaptive="true"
            align-whole="center"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            :show-overflow-tooltip="true"
            :summary-method="onSummaryMethod"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
          >
            <template #deptTotal="{ row }">
              <el-button type="primary" link @click="onShowDesc('deptId', row)">{{ row.deptTotal }}</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
      <PureTableBar :columns="columns2" style="width: 50%" @refresh="onRefresh" @change-column="setUserMenuColumns">
        <template #title>
          <TitleCate :name="groupArrsList[1]?.groupName" :border="false" />
        </template>
        <template #buttons>
          <ButtonList :buttonList="buttonList" :autoLayout="false" more-action-text="业务操作" />
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="id"
            show-summary
            :adaptive="true"
            align-whole="center"
            :loading="loading2"
            :size="size"
            :data="dataList2"
            :columns="dynamicColumns"
            highlight-current-row
            :show-overflow-tooltip="true"
            :summary-method="onSummaryMethod2"
            @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns2)"
          >
            <template #rankTotal="{ row }">
              <el-button type="primary" link @click="onShowDesc('rank', row)">{{ row.rankTotal }}</el-button>
            </template>
          </pure-table>
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
