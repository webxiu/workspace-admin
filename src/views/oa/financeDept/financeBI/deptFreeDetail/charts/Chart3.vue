<script setup lang="ts">
import * as echarts from "echarts";
import { watch, onMounted, reactive, ref, markRaw } from "vue";
import regExp from "@/utils/regExp";
import { chartOption } from "../utils";

const props = defineProps<{ active: string }>();
const myChart = ref();
const option = reactive({ ...chartOption });

const setChartData = (list, obj) => {
  option.series = [];
  myChart.value.clear();
  list.forEach((item) => {
    const sData = [];
    Object.keys(item).forEach((key) => {
      if (key.match(regExp.mMonth)) sData.push({ name: item.FFULLNAME, value: item[key] });
    });
    option.series.push({ name: item.FACCOUNTNAME, data: sData, type: "line", smooth: true, label: { show: true } });
  });
  const xAxis = [...new Array(12)].map((_, i) => `${i + 1}月`);
  option.title.text = `${obj.fYear}年【${obj.deptName}】费用占收入比折线图 (单位:%)`;
  option.legend.data = list.map((item) => item.FACCOUNTNAME);
  option.xAxis[0].data = xAxis;
  myChart.value.setOption(option);
};

function onResize() {
  myChart.value.resize();
}

onMounted(() => {
  const myCharts1 = document.getElementById("fiveTableChartId");
  myChart.value = markRaw(echarts.init(myCharts1));
  window.addEventListener("resize", onResize);
});

watch(props, (val) => {
  if (val.active === "3") {
    const timer = setTimeout(() => {
      onResize();
      clearTimeout(timer);
    });
  }
});

defineExpose({ setChartData });
</script>

<template>
  <div class="mt-20">
    <div id="fiveTableChartId" style="width: 100%; height: 500px" />
  </div>
</template>
