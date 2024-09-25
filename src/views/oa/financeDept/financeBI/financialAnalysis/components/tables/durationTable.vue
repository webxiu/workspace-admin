<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { cloneDeep } from "@pureadmin/utils";
import { ref } from "vue";

const dataList = ref([]);

const columns = ref<any[]>([
  { label: "序号", type: "index" },
  { label: "年份(单位：元)", prop: "FYear" },
  { label: "数据类型", prop: "ItemName" }
]);

const setDataList = (list, type?) => {
  columns.value = [
    { label: "序号", type: "index" },
    { label: "年份(单位：元)", prop: "FYear", width: 120 },
    { label: "数据类型", prop: "ItemName" }
  ];
  const restDateProps: { label: string; prop: string; width?: number; formatter?: any }[] = [];
  dataList.value = list;
  const calcColumns = Object.keys(cloneDeep(list[0])).filter((item) => item.startsWith("m") && item.length <= 3);
  calcColumns.forEach((item) => {
    restDateProps.push({
      label: `${item.split("m")[1]}月`,
      prop: `${item}`,
      width: 100,
      formatter: (row, column, cellValue, index) => {
        //
        return type === "rate" && cellValue ? cellValue + "%" : cellValue;
      }
    });
  });
  restDateProps.push({
    label: "平均",
    prop: "AVERAGE",
    width: 100,
    formatter: (row, column, cellValue, index) => {
      //
      return type === "rate" && cellValue ? cellValue + "%" : cellValue;
    }
  });
  console.log(restDateProps, "restDateProps===data");
  const sortCols = restDateProps.sort((a, b) => {
    return a.label.split("月")[0] - b.label.split("月")[0];
  });
  columns.value = [...columns.value, ...cloneDeep(sortCols)];
};

defineExpose({ setDataList });
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content" style="width: 80vw; margin: auto">
    <PureTableBar :columns="columns" class="flex-1" :show-icon="false">
      <template v-slot="{ dynamicColumns }">
        <pure-table
          border
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
