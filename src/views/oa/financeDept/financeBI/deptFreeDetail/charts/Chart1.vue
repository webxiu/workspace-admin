<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, reactive, ref, markRaw } from "vue";
import regExp from "@/utils/regExp";
import { chartOption } from "../utils";

const myChart = ref();
const option = reactive({ ...chartOption });

const setChartData = (list, obj) => {
  option.series = [];
  myChart.value.clear();
  const xAxis = [...new Array(12)].map((_, i) => `${i + 1}月`);
  list.forEach((item) => {
    const sData = [];
    Object.keys(item).forEach((key) => {
      const matches = key.match(regExp.mMonth); // 匹配M1-M12月份字段
      if (matches) sData.push({ name: item.FFULLNAME, value: item[key] });
    });
    option.series.push({ name: item.FACCOUNTNAME, data: sData, type: "line", smooth: true, label: { show: true } });
  });
  option.title.text = `${obj.fYear}年【${obj.deptName}】费用折线图`;
  option.legend.data = list.map((item) => item.FACCOUNTNAME);
  option.xAxis[0].data = xAxis;
  myChart.value.setOption(option);
};

onMounted(() => {
  const myCharts1 = document.getElementById("oneTableChartId");
  myChart.value = markRaw(echarts.init(myCharts1));
  window.addEventListener("resize", () => myChart.value.resize());
});

defineExpose({ setChartData });
</script>

<template>
  <div class="mt-20">
    <div id="oneTableChartId" style="width: 100%; height: 500px" />
  </div>
</template>
