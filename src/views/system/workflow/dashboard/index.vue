<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import { onHeaderDragend, setUserMenuColumns } from "@/utils/table";

defineOptions({ name: "SystemWorkflowDashboardIndex" });

const {
  formData,
  loading1,
  loading2,
  loading3,
  columns,
  dataList1,
  dataList2,
  dataList3,
  maxHeight,
  oaOptions,
  kingdeeOptions,
  wechatOptions,
  activeName,
  onSearch,
  onRefresh,
  onMonthData,
  onChangeAuditPeople
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <el-form :inline="true" :model="formData" class="demo-form-inline">
      <el-form-item label="月份">
        <el-date-picker v-model="formData.month" type="month" placeholder="请选择月份" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
      </el-form-item>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="OA" name="oa">
          <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
            <template #title>
              <div>
                <el-form-item label="审核状态">
                  <el-select v-model="formData.oaStatus" placeholder="请选择状态" clearable>
                    <el-option v-for="item in oaOptions" :label="item.label" :value="item.value" :key="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onChangeAuditPeople">更改审批人 </el-button>
                </el-form-item>
              </div>
            </template>
            <template v-slot="{ size, dynamicColumns }">
              <pure-table
                border
                :height="maxHeight"
                :max-height="maxHeight"
                row-key="id"
                class="db-maintenance"
                :adaptive="true"
                align-whole="center"
                :loading="loading1"
                :size="size"
                :data="dataList1"
                :columns="dynamicColumns"
                :paginationSmall="size === 'small'"
                highlight-current-row
                :show-overflow-tooltip="true"
                @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
              />
            </template>
          </PureTableBar>
        </el-tab-pane>
        <el-tab-pane label="金蝶" name="kingdee">
          <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
            <template #title>
              <el-form-item label="审核状态">
                <el-select v-model="formData.kingdeeStatus" placeholder="请选择状态">
                  <el-option v-for="item in kingdeeOptions" :label="item.label" :value="item.value" :key="item.value" />
                </el-select>
              </el-form-item>
            </template>
            <template v-slot="{ size, dynamicColumns }">
              <pure-table
                border
                :height="maxHeight"
                :max-height="maxHeight"
                row-key="id"
                class="db-maintenance"
                :adaptive="true"
                align-whole="center"
                :loading="loading2"
                :size="size"
                :data="dataList2"
                :columns="dynamicColumns"
                :paginationSmall="size === 'small'"
                highlight-current-row
                :show-overflow-tooltip="true"
                @header-dragend="(newWidth, _, column) => onHeaderDragend(newWidth, column, columns)"
              />
            </template>
          </PureTableBar>
        </el-tab-pane>
        <el-tab-pane label="企业微信" name="wechat">
          <PureTableBar :columns="columns" @refresh="onRefresh" @change-column="setUserMenuColumns">
            <template #title>
              <div>
                <el-form-item label="审核状态">
                  <el-select v-model="formData.wechatStatus" placeholder="请选择状态" clearable>
                    <el-option v-for="item in wechatOptions" :label="item.label" :value="item.value" :key="item.value" />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="onMonthData">抓取当前月份数据 </el-button>
                </el-form-item>
              </div>
            </template>
            <template v-slot="{ size, dynamicColumns }">
              <pure-table
                border
                :height="maxHeight"
                :max-height="maxHeight"
                row-key="id"
                class="db-maintenance"
                :adaptive="true"
                align-whole="center"
                :loading="loading3"
                :size="size"
                :data="dataList3"
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
    </el-form>
  </div>
</template>
