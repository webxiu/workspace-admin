<script setup lang="ts">
import * as echarts from "echarts";
import { markRaw, onMounted, ref } from "vue";
import SaleFreeTable from "./tables/sale.vue";
import { ECHARTSTHEME } from "@/views/oa/utils/common";

const dataList = ref([]);
const myChart = ref();
const myChart1 = ref();
const myChart2 = ref();
const saleDataTableRef = ref();
const mgmtTableRef = ref();
const devTableRef = ref();

const months = [];
for (let i = 0; i < 12; i++) {
  months.push(`${i + 1}月`);
}
const option = {
  title: {
    text: `销售数量(单位：万Pcs)`
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

const option1 = {
  title: {
    text: `销售金额(单位：万元)`
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

const option2 = {
  title: {
    text: `生产数量(单位：万Pcs)`
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
  const filterInitArr = list.filter((item) => item.ItemName === "销售出库数量");
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
    validArr.map((item) => option.series[idx].data.push(+(el[item] / 10000).toFixed(2)));
  });
  myChart.value.setOption(option);
  myChart.value.resize();
};

// 管理费用
const setChart2 = async (list, resCols) => {
  const filterInitArr = list.filter((item) => item.ItemName === "销售金额");

  mgmtTableRef.value?.setDataList(filterInitArr, "", resCols);
  option1.legend.data = filterInitArr.map((item) => item.FYear);
  option1.series[0].name = option1.legend.data[0];
  option1.series[1].name = option1.legend.data[1];
  option1.series[0].data = [];
  option1.series[1].data = [];

  filterInitArr.map((el, idx) => {
    const validArr = Object.keys(el)
      .filter((item) => item.startsWith("m") && item.length <= 3)
      .sort((a, b) => a.split("m")[1] - b.split("m")[1]);
    validArr.map((item) => option1.series[idx].data.push(+(el[item] / 10000).toFixed(2)));
  });
  myChart1.value.setOption(option1);
  myChart1.value.resize();
};

// 研发费用
const setChart3 = async (list, resCols) => {
  const filterInitArr = list.filter((item) => item.ItemName === "生产数量");

  devTableRef.value?.setDataList(filterInitArr, "", resCols);
  option2.legend.data = filterInitArr.map((item) => item.FYear);
  option2.series[0].name = option2.legend.data[0];
  option2.series[1].name = option2.legend.data[1];
  option2.series[0].data = [];
  option2.series[1].data = [];

  filterInitArr.map((el, idx) => {
    const validArr = Object.keys(el)
      .filter((item) => item.startsWith("m") && item.length <= 3)
      .sort((a, b) => a.split("m")[1] - b.split("m")[1]);
    validArr.map((item) => option2.series[idx].data.push(+(el[item] / 10000).toFixed(2)));
  });
  myChart2.value.setOption(option2);
  myChart2.value.resize();
};

const setDataList = ({ list, resCols }) => {
  dataList.value = list;

  setChart1(list, resCols);
  setChart2(list, resCols);
  setChart3(list, resCols);
};

const getChartData = () => {
  myChart.value.setOption(option);
  myChart1.value.setOption(option1);
  myChart2.value.setOption(option2);
  myChart.value.resize();
  myChart1.value.resize();
  myChart2.value.resize();
};

const fresh = () => {
  myChart.value = markRaw(echarts.init(document.getElementById("saleNum")));
  myChart1.value = markRaw(echarts.init(document.getElementById("saleMoney")));
  myChart2.value = markRaw(echarts.init(document.getElementById("productNum")));
  getChartData();

  window.onresize = function () {
    // 自适应大小
    myChart.value.resize();
    myChart1.value.resize();
    myChart2.value.resize();
  };
};

onMounted(() => {
  const myCharts1 = document.getElementById("saleNum");
  myCharts1.style.width = window.innerWidth - 50 + "px";

  const myCharts2 = document.getElementById("saleMoney");
  myCharts2.style.width = window.innerWidth - 50 + "px";

  const myCharts3 = document.getElementById("productNum");
  myCharts3.style.width = window.innerWidth - 50 + "px";
  fresh();
});

defineExpose({ dataList, setDataList });
</script>

<template>
  <div class="duration">
    <div class="sale">
      <div id="saleNum" style="width: 100%; height: 421px; margin: auto" />
      <div class="sd-table"><SaleFreeTable ref="saleDataTableRef" :unitPcs="true" /></div>
    </div>

    <div class="mgmtFree mt-20">
      <div id="saleMoney" style="width: 100%; height: 421px; margin: auto" />
      <div class="sd-table"><SaleFreeTable ref="mgmtTableRef" /></div>
    </div>

    <div class="devFree mt-20">
      <div id="productNum" style="width: 100%; height: 421px; margin: auto" />
      <div class="sd-table"><SaleFreeTable ref="devTableRef" :unitPcs="true" /></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.duration {
  height: calc(100vh - 220px);
  overflow: auto;
}
</style>
