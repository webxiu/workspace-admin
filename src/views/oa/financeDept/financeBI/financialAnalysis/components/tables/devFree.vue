<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { fixed2AndAddcomma } from "@/utils/common";
import { formatMoneyComma } from "@/utils/table";
import { cloneDeep } from "@pureadmin/utils";
import { ref } from "vue";

const dataList = ref([]);
const props = defineProps(["unitPcs"]);

const columns = ref<any[]>([
  { label: "序号", type: "index" },
  { label: `年份(单位：${props.unitPcs ? "Pcs" : "元"})`, prop: "FYear" },
  { label: "数据类型", prop: "ItemName" }
]);

const setDataList = (list, type?) => {
  columns.value = [
    { label: "序号", type: "index" },
    { label: `年份(单位：${props.unitPcs ? "Pcs" : "元"})`, prop: "FYear", width: 130 },
    { label: "数据类型", prop: "ItemName" }
  ];
  const restDateProps: { label: string; prop: string; width?: number; formatter?: any }[] = [];
  dataList.value = list;
  const calcColumns = Object.keys(cloneDeep(list[0])).filter((item) => item.startsWith("m") && item.length <= 3);
  calcColumns.forEach((item) => {
    restDateProps.push({
      label: `${item.split("m")[1]}月`,
      prop: `${item}`,
      minWidth: 100,
      align: "right",
      formatter: (row, column, cellValue, index) => {
        //
        return type === "rate" && cellValue ? cellValue + "%" : formatMoneyComma(cellValue, ["销售出库数量", "生产数量"].includes(row.ItemName) ? 0 : 2);
      }
    });
  });
  restDateProps.push({
    label: "平均",
    prop: "AVERAGE",
    minWidth: 100,
    align: "right",
    formatter: (row, column, cellValue, index) => {
      //
      return type === "rate" && cellValue ? cellValue + "%" : formatMoneyComma(cellValue, ["销售出库数量", "生产数量"].includes(row.ItemName) ? 0 : 2);
    }
  });
  const sortCols = restDateProps.sort((a, b) => {
    return a.label.split("月")[0] - b.label.split("月")[0];
  });
  columns.value = [...columns.value, ...cloneDeep(sortCols)];
};

defineExpose({ setDataList });
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content" style="width: 100%; margin: auto">
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
