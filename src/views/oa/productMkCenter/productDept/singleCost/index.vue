<script setup lang="ts">
import { getSingleCostChartData } from "@/api/oaManage/productMkCenter";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { onMounted, reactive, ref } from "vue";
import ChartTable from "./chartTable/index.vue";
import { ECHARTSTHEME } from "@/views/oa/utils/common";
import { getMenuColumns, updateButtonList } from "@/utils/table";
import ButtonList from "@/components/ButtonList/index.vue";
import { ElMessage } from "element-plus";
import { useEleHeight } from "@/hooks";

defineOptions({ name: "OaProductMkCenterProductDeptSingleCostIndex" });

const selectDate = ref(dayjs(new Date()).format("YYYY"));
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 109);
const dataList = ref([]);
const activeName = ref("chart");
const tableRef = ref();
let myChart: any = reactive({});
let myChart1: any = reactive({});

const exportHandle = () => {
  console.log("export");
  ElMessage({ message: "功能未开发", type: "warning" });
};

const buttonList = ref<ButtonItemType[]>([{ clickHandler: exportHandle, type: "primary", text: "导出", isDropDown: false }]);

const loading = ref(false);

const costMinusRate = [];
for (let i = 1; i < 13; i++) {
  costMinusRate.push(`${i}月`);
}

const handleClick = ({ paneName }) => {
  activeName.value = paneName;
};

const calcChartTitle = (selectDay, num) => {
  const dateStr = dayjs(selectDay).format("YYYY年");
  if (num === 2) return dateStr + "月工资与月入库数(单位：万元，Pcs)";
  if (num === 1) return dateStr + "单机成本(单位：%)";
};

const option = reactive({
  title: {
    text: `${calcChartTitle(selectDate.value, 2)}`
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
    data: ["月工资", "月入库数"]
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
      boundaryGap: false,
      data: costMinusRate
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: [
    {
      name: "月工资",
      type: "line",
      smooth: true,
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.redLine
    },
    {
      name: "月入库数",
      type: "line",
      smooth: true,
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.blackLine
    }
  ]
});

const option1 = reactive({
  title: {
    text: `${calcChartTitle(selectDate.value, 1)}`
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
    data: ["单机成本"]
  },
  toolbox: {
    feature: {
      saveAsImage: {
        title: "下载图表"
      }
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
      boundaryGap: false,
      data: costMinusRate
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: [
    {
      name: "单机成本",
      type: "line",
      smooth: true,
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.redLine
    }
  ]
});

const findChartItem = (data, type, num = 2) => {
  const res = { data };
  const instoreRate = res.data.filter((el) => el.ItemName === type);
  if (num === 2) {
    const fillList = instoreRate.map((item) => (item.ItemValue / 10000).toFixed(2));
    const fullArr = new Array(12).fill(fillList.length).map((item, idx) => {
      item = +fillList[idx];
      if (isNaN(item)) item = 0.0;
      return item.toFixed(2);
    });
    return fullArr;
  }

  if (num === 1) {
    const fillList = instoreRate.map((item) => item.ItemValue.toFixed(2));
    const fullArr = new Array(12).fill(fillList.length).map((item, idx) => {
      item = +fillList[idx];
      if (isNaN(item)) item = 0.0;
      return +item.toFixed(2);
    });
    return fullArr;
  }
};

const getChartData = async (myChart, myChart1?) => {
  loading.value = true;

  const { columnArrs, buttonArrs } = await getMenuColumns();

  updateButtonList(buttonList, buttonArrs[0]);
  const [menuCols] = columnArrs;

  getSingleCostChartData({
    year: +selectDate.value.split("-")[0]
  })
    .then((res: any) => {
      if (res.data) {
        dataList.value = res.data.filter((item) => item.FYEAR === +selectDate.value.split("-")[0]);
        tableRef.value?.setDataList({ list: dataList.value, menuCols }, "月");

        option.series[0].data = findChartItem(dataList.value, "月工资");
        option.series[1].data = findChartItem(dataList.value, "月入库数");
        option1.series[0].data = findChartItem(dataList.value, "月单机成本", 1);
        myChart.setOption(option);
        myChart1 && myChart1.setOption(option1);
        myChart.resize();
        myChart1 && myChart1.resize();
      }
    })
    .finally(() => (loading.value = false));
};

const changeSelectDate = (v) => {
  option.title.text = calcChartTitle(v, 2);
  option1.title.text = calcChartTitle(v, 1);
  getChartData(myChart, myChart1);
};

const fresh = () => {
  myChart = echarts.init(document.getElementById("deliveryRate"));
  myChart1 = echarts.init(document.getElementById("deliveryRate1"));
  getChartData(myChart, myChart1);

  window.onresize = function () {
    // 自适应大小
    myChart.resize();
    myChart1.resize();
  };
};

onMounted(() => {
  fresh();
});
</script>

<template>
  <div class="chart-outer" v-loading="loading">
    <div style="display: flex">
      <div style="margin: 0 15px 15px 0">
        <el-date-picker
          :clearable="false"
          @change="changeSelectDate"
          v-model="selectDate"
          type="year"
          placeholder="选择年份"
          format="YYYY"
          value-format="YYYY"
        />
      </div>
      <div style="margin-left: 16px">
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </div>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="图表" name="chart">
        <div :style="{ height: maxHeight + 'px' }">
          <div id="deliveryRate" style="height: 280px" />
          <div id="deliveryRate1" style="height: 280px; margin-top: 20px" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="表格" name="table">
        <ChartTable ref="tableRef" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.chart-outer {
  height: calc(100vh - 105px);
  overflow: auto;
}

.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
</style>
