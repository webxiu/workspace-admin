<script setup lang="ts">
import * as echarts from "echarts";
import { onMounted, reactive, ref } from "vue";
import ChartTable from "./chartTable/index.vue";
import { ECHARTSTHEME } from "@/views/oa/utils/common";

const activeName = ref("first");
const dataList = ref([]);
const tableRef = ref();
let myChart: any = reactive({});

const option = reactive({
  xAxis: {
    type: "category",
    boundaryGap: true,
    data: []
  },
  title: {
    text: "销售费用(单位：万元)"
  },
  legend: { data: [] },
  yAxis: {
    type: "value"
  },
  series: [
    {
      name: "",
      label: {
        show: true
      },
      type: "bar",
      barWidth: "40%",
      data: [],
      ...ECHARTSTHEME.redLine
    },
    {
      name: "",
      label: {
        show: true
      },
      type: "bar",
      barWidth: "40%",
      data: [],
      ...ECHARTSTHEME.blackLine
    }
  ],
  tooltip: {
    trigger: "axis",
    ...ECHARTSTHEME.tooltip
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  }
});

const handleClick = ({ paneName }) => {
  console.log(paneName, "paneName");
};

const getChartData = async ({ list = [], menusCols }, myCharts = myChart) => {
  if (list.length) {
    tableRef.value.setDataList(list, "", menusCols);
    const titleOneArr = Object.keys(list[0]).filter((item) => /\d/.test(item));
    const lastNumberYear = titleOneArr[titleOneArr.length - 1];
    option.legend.data = [lastNumberYear, "上年平均"];
    option.series[0].name = lastNumberYear;
    option.series[1].name = "上年平均";
    option.xAxis.data = list.map((item) => item.ItemNameDetail).filter((item) => item !== "月度合计");
    const listOne = list.filter((item) => item.ItemNameDetail !== "月度合计").map((item) => +(item[lastNumberYear] / 10000).toFixed(2));
    const listTwo = list.map((item) => +(item["上年平均"] / 10000).toFixed(2)).slice(0, option.xAxis.data.length);
    option.series[0].data = listOne;
    option.series[1].data = listTwo;
    myCharts.setOption(option);
    myCharts.resize();
  }
};

const fresh = () => {
  myChart = echarts.init(document.getElementById("saleChartId"));
  getChartData(myChart, []);

  window.onresize = function () {
    // 自适应大小
    myChart.resize();
  };
};

defineExpose({ getChartData });

onMounted(() => {
  fresh();
});
</script>

<template>
  <div class="sale">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="图表" name="first"><div id="saleChartId" style="width: 90vw; height: 600px" /></el-tab-pane>
      <el-tab-pane label="表格" name="second"><ChartTable ref="tableRef" /></el-tab-pane>
    </el-tabs>
  </div>
</template>
