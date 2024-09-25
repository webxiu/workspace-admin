<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useEleHeight } from "@/hooks";
import { cloneDeep } from "@pureadmin/utils";
import { ref } from "vue";

const dataList = ref([]);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 109);

const columns = ref<any[]>([
  { label: "序号", type: "index" },
  { label: "项目", prop: "ItemName" },
  { label: "年份", prop: "FYEAR" },
  { label: "月份", prop: "FMonthName" },
  { label: "本月汇总", prop: "totalMonth" }
]);

const setDataList = (list, type, dayKeys) => {
  const chartTableList = [];
  const monthMoneyObj: any = {};
  const monthInstore: any = {};
  const monthSingleCost: any = {};
  list
    .filter((item) => item.ItemName === "成品产出")
    .map((item) => {
      monthMoneyObj[item.FDAY] = item.ItemValue;
      monthMoneyObj.ItemName = "成品产出";
      monthMoneyObj.FMonthName = item.FMonthName;
      item.FDAY === 0 && (monthMoneyObj["totalMonth"] = item.ItemValue);

      monthMoneyObj.FYEAR = item.FYEAR;
    });
  list
    .filter((item) => item.ItemName === "投入工时")
    .map((item) => {
      monthInstore[item.FDAY] = item.ItemValue;
      monthInstore.ItemName = "投入工时";
      monthInstore.FMonthName = item.FMonthName;
      item.FDAY === 0 && (monthInstore["totalMonth"] = item.ItemValue);

      monthInstore.FYEAR = item.FYEAR;
    });
  list
    .filter((item) => item.ItemName === "单机成本")
    .map((item) => {
      monthSingleCost[item.FDAY] = item.ItemValue;
      monthSingleCost.ItemName = "单机成本";
      monthSingleCost.FMonthName = item.FMonthName;
      monthSingleCost.FYEAR = item.FYEAR;
      item.FDAY === 0 && (monthSingleCost["totalMonth"] = item.ItemValue);
    });
  chartTableList.push(monthSingleCost, monthMoneyObj, monthInstore);

  dataList.value = chartTableList;
  columns.value = [
    { label: "序号", type: "index" },
    { label: "项目", prop: "ItemName" },
    { label: "年份", prop: "FYEAR" },
    { label: "月份", prop: "FMonthName" },
    { label: "本月汇总", prop: "totalMonth", align: "right" }
  ];
  const restDateProps: any = [];
  if (list[0]) {
    dayKeys.forEach((item) => {
      restDateProps.push({
        label: `${item}`,
        prop: `${item.split(type)[0]}`,
        align: "right"
      });
    });
    columns.value = [...columns.value, ...cloneDeep(restDateProps)];
  } else {
    columns.value = [...columns.value];
  }
};

defineExpose({ setDataList });
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <PureTableBar :columns="columns" class="flex-1" :show-icon="false">
      <template v-slot="{ dynamicColumns }">
        <pure-table
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          class="bill-manage"
          :adaptive="true"
          align-whole="left"
          size="small"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
          :show-overflow-tooltip="true"
        />
      </template>
    </PureTableBar>
  </div>
</template>
