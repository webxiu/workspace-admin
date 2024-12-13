<script setup lang="ts">
import { getProductPlanRateData, getQAInstoreRateData } from "@/api/oaManage/productMkCenter";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { onMounted, reactive, ref } from "vue";
import ChartTable from "./chartTable/index.vue";
import { ECHARTSTHEME } from "@/config/constant";
import { getMenuColumns, updateButtonList } from "@/utils/table";
import { ElMessage } from "element-plus";
import { useEleHeight } from "@/hooks";

defineOptions({ name: "ProductMkCenterMaterialControlPlanRateIndex" });

const btnMap = {
  0: "日",
  1: "周",
  2: "月"
};

const titleDay = dayjs(new Date()).format("YYYY年MM月");
const currentSelectBtnIndex = ref(3);
const currentColor = ref("#009688");
const selectDate = ref(dayjs(new Date()).format("YYYY-MM"));
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 109);

const dataList = ref([]);
const activeName = ref("chart");
const loading = ref(false);
const tableRef = ref();
let myChart: any = reactive({});
let myChart1: any = reactive({});
let myChart2: any = reactive({});

const exportHandle = () => {
  console.log("export");
  ElMessage({ message: "功能未开发", type: "warning" });
};

const buttonList = ref<ButtonItemType[]>([{ clickHandler: exportHandle, type: "primary", text: "导出", isDropDown: false }]);

const handleClick = ({ paneName }) => {
  activeName.value = paneName;
};

const calcChartTitle = (selectDay, num) => {
  const dateStr = dayjs(selectDay).format("YYYY年MM月");
  if (num === 2) return dateStr + "达成率(百分比：%)";
  if (num === 1) return dateStr + "计划产量(单位：PCS)";
  if (num === 3) return dateStr + "实际入库(单位：PCS)";
};

const clickBtnGroup = (key) => {
  currentSelectBtnIndex.value = key + 1;
  getChartData(myChart, myChart1);
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
    data: ["前加工", "组装"]
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
      data: []
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: [
    {
      name: "前加工",
      type: "line",
      smooth: true,
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.redLine
    },
    {
      name: "组装",
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
    data: ["前加工", "组装"]
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
      data: []
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: [
    {
      name: "前加工",
      type: "line",
      smooth: true,
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.redLine
    },
    {
      name: "组装",
      type: "line",
      smooth: true,
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.blackLine
    }
  ]
});

const option2 = reactive({
  title: {
    text: `${calcChartTitle(selectDate.value, 3)}`
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
    data: ["前加工", "组装"]
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
      data: []
    }
  ],
  yAxis: [
    {
      type: "value"
    }
  ],
  series: [
    {
      name: "前加工",
      type: "line",
      smooth: true,
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.redLine
    },
    {
      name: "组装",
      type: "line",
      smooth: true,
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.blackLine
    }
  ]
});

const findChartItem = (res, type, num = 2, chartType) => {
  const instoreRate = res.data.find((el) => el.FNAME === type && el.type === chartType);

  if (!instoreRate) return;

  const instoreValueArr = res.data[0]
    ? Object.values(instoreRate)
        .map((item) => {
          if (item === null) item = 0;
          if (num === 3) return item;
          (item as number) *= 100;
          return Math.floor(item as number);
        })
        .filter((item) => typeof item === "number")
    : [];

  if (num === 1) {
    const instoreValueNewArr = res.data[0]
      ? Object.values(instoreRate)
          .map((item) => {
            if (item === null) item = 0;
            return item;
          })
          .filter((item) => typeof item === "number")
      : [];

    return instoreValueNewArr;
  }
  return instoreValueArr;
};

const getChartData = async (myChart, myChart1?, myChart2?) => {
  loading.value = true;

  const { columnArrs, buttonArrs } = await getMenuColumns();
  const [menuCols] = columnArrs;

  updateButtonList(buttonList, buttonArrs[0]);

  getProductPlanRateData({
    date: selectDate.value + "-01",
    type: btnMap[currentSelectBtnIndex.value - 1],
    fyear: +selectDate.value.split("-")[0],
    fmonth: +selectDate.value.split("-")[1]
  })
    .then((res: any) => {
      tableRef.value?.setDataList({ list: res.data, menuCols }, btnMap[currentSelectBtnIndex.value - 1]);
      if (res.data) {
        dataList.value = res.data;
        option.xAxis[0].data = res.data[0]
          ? Object.keys(res.data[0])
              .filter((item) => /^\d*$/.test(item))
              .map((item) => item + btnMap[currentSelectBtnIndex.value - 1])
          : [];

        option1.xAxis[0].data = res.data[0]
          ? Object.keys(res.data[0])
              .filter((item) => /^\d*$/.test(item))
              .map((item) => item + btnMap[currentSelectBtnIndex.value - 1])
          : [];

        option2.xAxis[0].data = res.data[0]
          ? Object.keys(res.data[0])
              .filter((item) => /^\d*$/.test(item))
              .map((item) => item + btnMap[currentSelectBtnIndex.value - 1])
          : [];

        option.series[0].data = findChartItem(res, "前加工", 2, "达成率");
        option.series[1].data = findChartItem(res, "组装", 2, "达成率");
        option1.series[0].data = findChartItem(res, "前加工", 1, "计划产量");
        option1.series[1].data = findChartItem(res, "组装", 1, "计划产量");
        option2.series[0].data = findChartItem(res, "前加工", 3, "实际入库");
        option2.series[1].data = findChartItem(res, "组装", 3, "实际入库");
        myChart.setOption(option);
        myChart2 && myChart2.setOption(option2);
        myChart1 && myChart1.setOption(option1);
        myChart.resize();
        myChart1 && myChart1.resize();
        myChart2 && myChart2.resize();
      }
    })
    .finally(() => (loading.value = false));
};

const changeSelectDate = (v) => {
  option.title.text = calcChartTitle(v, 2);
  option1.title.text = calcChartTitle(v, 1);
  option2.title.text = calcChartTitle(v, 3);
  getChartData(myChart, myChart1, myChart2);
};

const fresh = () => {
  myChart = echarts.init(document.getElementById("deliveryRate"));
  myChart1 = echarts.init(document.getElementById("deliveryRate1"));
  myChart2 = echarts.init(document.getElementById("deliveryRate2"));
  getChartData(myChart, myChart1, myChart2);

  window.onresize = function () {
    // 自适应大小
    myChart.resize();
    myChart1.resize();
    myChart2.resize();
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
          type="month"
          placeholder="选择日期"
          format="YYYY-MM"
          value-format="YYYY-MM"
        />
      </div>
      <div style="display: flex">
        <div>
          <el-button-group>
            <el-button
              v-for="(item, idx) in Object.values(btnMap)"
              @click="() => clickBtnGroup(idx)"
              :key="idx"
              :color="currentSelectBtnIndex === idx + 1 ? currentColor : ''"
              >{{ item }}</el-button
            >
          </el-button-group>
        </div>
        <div style="margin-left: 16px">
          <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
        </div>
      </div>
    </div>
    <div :style="{ height: maxHeight + 'px' }">
      <div id="deliveryRate" style="height: 222px" />
      <div id="deliveryRate1" style="height: 222px; margin-top: 10px" />
      <div id="deliveryRate2" style="height: 222px; margin-top: 10px" />
      <div><ChartTable ref="tableRef" /></div>
    </div>
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
