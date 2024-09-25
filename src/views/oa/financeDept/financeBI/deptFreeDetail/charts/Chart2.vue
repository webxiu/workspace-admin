<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, reactive, ref, watch, markRaw } from "vue";
import Tab2 from "../tables/Tab2.vue";
import regExp from "@/utils/regExp";
import { cloneDeep } from "@pureadmin/utils";
import { chartOption } from "../utils";

const props = defineProps<{ active: string }>();
const tableRef = ref();
const myChart = ref();
const option = reactive({ ...chartOption });

const setChartData = (list, column, obj) => {
  option.series = [];
  const cData = cloneDeep(list);
  myChart.value.clear();
  const tableDataObj2 = tableRef.value?.setDataList(cData, column);
  const nList = cloneDeep(list).filter((item) => item.FACCOUNTNUMBER === "合计");
  nList.forEach((item) => {
    const sData = [];
    Object.keys(item).forEach((key) => {
      if (key.match(regExp.mMonth)) sData.push({ name: item.FFULLNAME, value: item[key] });
    });
    option.series.push({ name: item.FACCOUNTNAME, data: sData, type: "line", smooth: true, label: { show: true } });
  });
  const xAxis = [...new Array(12)].map((_, i) => `${i + 1}月`);
  option.title.text = `${obj.fYear}年【${obj.deptName}】平均成本折线图 (单位:%)`;
  option.legend.data = nList.map((item) => item.FACCOUNTNAME);
  option.xAxis[0].data = xAxis;
  myChart.value.setOption(option);
  return tableDataObj2;
};

function onResize() {
  myChart.value.resize();
}

onMounted(() => {
  const myCharts1 = document.getElementById("threeTableChartId");
  myChart.value = markRaw(echarts.init(myCharts1));
  window.addEventListener("resize", onResize);
});

watch(props, (val) => {
  if (val.active === "2") {
    const timer = setTimeout(() => {
      onResize();
      clearTimeout(timer);
    });
  }
});

defineExpose({ setChartData });
</script>

<template>
  <Tab2 ref="tableRef" />
  <div id="threeTableChartId" style="width: 100%; min-width: 100%; height: 500px; margin-top: 20px" />
</template>
