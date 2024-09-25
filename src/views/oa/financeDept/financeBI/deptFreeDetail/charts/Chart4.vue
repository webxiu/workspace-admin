<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, reactive, ref, watch, markRaw } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import regExp from "@/utils/regExp";
import { chartOption } from "../utils";

const props = defineProps<{ active: string }>();
const myChart = ref();
const option = reactive({ ...chartOption });
// 修改配置
option.legend = { data: [], top: 20, right: 15, type: "scroll", orient: "vertical" };
option.grid.right = 180;

const setChartData = (list, obj) => {
  option.series = [];
  myChart.value.clear();
  const nList = cloneDeep(list).filter((f) => f.FACCOUNTNUMBER !== "合计");
  nList.forEach((item) => {
    const sData = [];
    Object.keys(item).forEach((key) => {
      if (key.match(regExp.mMonth)) sData.push({ name: item.FFULLNAME, value: item[key] });
    });
    option.series.push({ name: item.FFULLNAME, data: sData, type: "line", smooth: true, label: { show: true } });
  });
  const xAxis = [...new Array(12)].map((_, i) => `${i + 1}月`);
  option.title.text = `${obj.fYear}年【${obj.deptName}】占费用比折线图 (单位:%)`;
  option.legend.data = nList.map((item) => item.FFULLNAME);
  option.xAxis[0].data = xAxis;
  myChart.value.setOption(option);
};

function onResize() {
  myChart.value.resize();
}

onMounted(() => {
  const myCharts1 = document.getElementById("sevenTableChartId");
  myChart.value = markRaw(echarts.init(myCharts1));
  window.addEventListener("resize", onResize);
});

watch(props, (val) => {
  if (val.active === "4") {
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
    <div id="sevenTableChartId" style="width: 100%; height: 500px" />
  </div>
</template>
