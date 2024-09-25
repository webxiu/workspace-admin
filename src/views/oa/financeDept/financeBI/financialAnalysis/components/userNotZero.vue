<script setup lang="ts">
import * as echarts from "echarts";
import { defineExpose, markRaw, onMounted, ref } from "vue";
import SaleFreeTable from "./tables/sale.vue";
import { ECHARTSTHEME } from "@/views/oa/utils/common";

const dataList = ref([]);
const myChart = ref();
const saleDataTableRef = ref();

const months = [];
for (let i = 0; i < 12; i++) {
  months.push(`${i + 1}月`);
}
const option = {
  title: {
    text: `产品平均工资(不含017)`
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985"
      }
    },
    ...ECHARTSTHEME.tooltip
  },
  legend: {
    data: []
  },
  toolbox: {
    feature: {
      saveAsImage: { title: "下载图表" }
    }
  },
  grid: {
    left: "3%",
    right: "4%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: months
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: [
    {
      name: "",
      type: "bar",
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.redLine
    },
    {
      name: "",
      type: "bar",
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.blackLine
    }
  ]
};

// 销售费用
const setChart1 = async (list, resCols) => {
  const filterInitArr = list.filter((item) => item.ItemName === "产品平均工资不含017");
  saleDataTableRef.value?.setDataList(filterInitArr, "", resCols);
  option.legend.data = filterInitArr.map((item) => item.FYear);
  option.series[0].name = option.legend.data[0];
  option.series[1].name = option.legend.data[1];
  option.series[0].data = [];
  option.series[1].data = [];

  filterInitArr.map((el, idx) => {
    const validArr = Object.keys(el)
      .filter((item) => item.startsWith("m") && item.length <= 3)
      .sort((a, b) => a.split("m")[1] - b.split("m")[1]);
    validArr.map((item) => option.series[idx].data.push(el[item]));
  });
  myChart.value.setOption(option);
  myChart.value.resize();
};

const setDataList = ({ list, resCols }) => {
  dataList.value = list;

  setChart1(list, resCols);
};

const getChartData = () => {
  myChart.value.setOption(option);

  myChart.value.resize();
};

const fresh = () => {
  myChart.value = markRaw(echarts.init(document.getElementById("userNotZeroId")));

  getChartData();

  window.onresize = function () {
    // 自适应大小
    myChart.value.resize();
  };
};

onMounted(() => {
  const myCharts1 = document.getElementById("userNotZeroId");
  myCharts1.style.width = window.innerWidth - 50 + "px";
  fresh();
});

defineExpose({ dataList, setDataList });
</script>

<template>
  <div class="duration">
    <div class="sale">
      <div id="userNotZeroId" style="width: 100%; height: 421px; margin: auto" />
      <div class="sd-table"><SaleFreeTable ref="saleDataTableRef" /></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.duration {
  height: calc(100vh - 220px);
  overflow: auto;
}
</style>
