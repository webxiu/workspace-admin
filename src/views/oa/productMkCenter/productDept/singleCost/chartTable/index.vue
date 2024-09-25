<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { useEleHeight } from "@/hooks";
import { setColumn } from "@/utils/table";
import { cloneDeep } from "@pureadmin/utils";
import { ref } from "vue";

const dataList = ref([]);
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 109);

const columns = ref<any[]>([
  { label: "序号", type: "index" },
  { label: "年份", prop: "FYEAR" },
  { label: "项目", prop: "ItemName" }
]);

const setDataList = ({ list, menuCols = [] }, type) => {
  const chartTableList = [];
  const monthMoneyObj: any = {};
  const monthInstore: any = {};
  const monthSingleCost: any = {};
  list
    .filter((item) => item.ItemName === "月工资")
    .map((item) => {
      monthMoneyObj[item.FMonthName] = item.ItemValue;
      monthMoneyObj.ItemName = "月工资";
      monthMoneyObj.FYEAR = item.FYEAR;
    });
  list
    .filter((item) => item.ItemName === "月入库数")
    .map((item) => {
      monthInstore[item.FMonthName] = item.ItemValue;
      monthInstore.ItemName = "月入库数";
      monthInstore.FYEAR = item.FYEAR;
    });
  list
    .filter((item) => item.ItemName === "月单机成本")
    .map((item) => {
      monthSingleCost[item.FMonthName] = item.ItemValue;
      monthSingleCost.ItemName = "月单机成本";
      monthSingleCost.FYEAR = item.FYEAR;
    });
  chartTableList.push(monthMoneyObj, monthInstore, monthSingleCost);

  dataList.value = chartTableList;
  columns.value = [
    { label: "序号", type: "index" },
    { label: "年份", prop: "FYEAR" },
    { label: "项目", prop: "ItemName" }
  ];
  const restDateProps: any = [];
  let oldCols = [];
  if (list[0]) {
    for (let i = 1; i < 13; i++) {
      restDateProps.push({
        label: `${i}${type}`,
        prop: `${i}`,
        align: "right"
      });
    }
    oldCols = [...columns.value, ...cloneDeep(restDateProps)];
  } else {
    oldCols = [...columns.value];
  }

  if (menuCols?.length) {
    oldCols = menuCols.map((item) => ({ ...item, prop: /\d/.test(item.prop) ? item.prop + "月" : item.prop }));
  }

  columns.value = setColumn({ columnData: oldCols, operationColumn: false });
  console.log(columns.value, chartTableList);
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
