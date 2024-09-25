<!-- /*
 * @Author: Hailen 
 * @Date: 2023-09-07 16:01:43 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-09-07 16:01:43 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useConfig } from "./utils/hook";
import ButtonGroup from "@/components/ButtonGroup.vue";
import HailenCalendar from "./component/HailenCalendar/index.vue";
import { onHeaderDragend } from "@/utils/table";

defineOptions({ name: "OaHumanResourcesHolidaySettingIndex" });

const {
  activeName,
  currentDate,
  formData,
  calendarRef,
  loading,
  columns,
  dataList,
  buttonList,
  calendarList,
  loadingStatus,
  maxHeight,
  buttonsConfig,
  onCalendarChange
} = useConfig();
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <div class="flex just-between">
      <div class="flex align-center">
        <div class="flex-1 mr-4">
          <ButtonGroup v-model="formData.category" :buttonsConfig="buttonsConfig" />
        </div>
        <div class="holiday-illustrate">
          <span>默认礼拜一到礼拜六为正常工作日，可点击日期单元格然后保存调整。</span>
          <span class="jia">假</span>为法定假日 <span class="ban">班</span>为正常工作日 <span class="xiu">休</span>为正常休息日
        </div>
      </div>
      <ButtonList :buttonList="buttonList" :loadingStatus="loadingStatus" :autoLayout="false" />
    </div>
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="休息日设定" name="chart">
        <HailenCalendar
          ref="calendarRef"
          :value="currentDate"
          :loading="loading"
          :dataList="dataList"
          :calendarList="calendarList"
          @change="onCalendarChange"
        />
      </el-tab-pane>
      <el-tab-pane label="查询设定" name="table">
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<style lang="scss" scoped>
.holiday-illustrate {
  margin-right: 10px;
  font-size: 14px;

  span {
    padding: 4px;
    margin-right: 4px;
    font-weight: 700;
    border-radius: 4px;
  }

  span.jia {
    color: #fff;
    background-color: #dc3545;
  }

  span.ban {
    color: #fff;
    background-color: #28a745;
  }

  span.xiu {
    color: #fff;
    background-color: #ffc107;
  }
}
</style>
