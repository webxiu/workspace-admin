<script setup lang="ts">
import { getDayCostSingleChartData, getSingleCostChartData, getWorkDateData } from "@/api/oaManage/productMkCenter";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { onMounted, reactive, ref } from "vue";
import ChartTable from "./chartTable/index.vue";
import { ECHARTSTHEME } from "@/views/oa/utils/common";
import ButtonList from "@/components/ButtonList/index.vue";
import { ElMessage } from "element-plus";
import { getMenuColumns, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";

defineOptions({ name: "OaProductMkCenterProductDeptDayLookIndex" });

// const selectDate = ref(dayjs(new Date()).format("YYYY-MM"));
const selectDate = ref(dayjs(new Date()).format("YYYY-MM"));
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 109);

// 当月天数
const currentMonthDay = dayjs(new Date()).startOf("month").daysInMonth();

const dataList = ref([]);
const validWorkDays: any = ref([]);
const xAxisValue: any = ref([]);
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

const handleClick = ({ paneName }) => {
  activeName.value = paneName;
};

const calcChartTitle = (selectDay, num) => {
  const dateStr = dayjs(selectDay).format("YYYY年MM月");
  if (num === 2) return dateStr + "成品产出与投入工时(单位：PCS/H)";
  if (num === 1) return dateStr + "单机成本(单位：元/PCS)";
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
    data: ["成品产出", "投入工时"]
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
      name: "成品产出",
      type: "line",
      smooth: true,
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.redLine
    },
    {
      name: "投入工时",
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
  const instoreRate = res.data.filter((el) => el.ItemName === type).sort((a, b) => a.FDAY - b.FDAY);

  const fillList = instoreRate.filter((item) => item.FDAY !== 0).map((item) => ({ value: item.ItemValue.toFixed(2), key: item.FDAY }));
  const tempMonth = validWorkDays.value.map((item) => +dayjs(new Date(item.workDate)).format("YYYY-MM-D").split("-")[2]);
  const fillKeys = fillList.map((el) => el.key);
  //补集
  const complement = tempMonth.filter((v) => !fillKeys.includes(v)).concat(fillKeys.filter((v) => !tempMonth.includes(v)));
  // 遍历补集，往fillList中新增并且补零
  complement.forEach((item) => fillList.push({ value: 0, key: item }));

  return fillList.sort((a, b) => a.key - b.key).map((item) => +item.value);
};

const getChartData = async (myChart, myChart1?) => {
  loading.value = true;
  const { buttonArrs } = await getMenuColumns();
  updateButtonList(buttonList, buttonArrs[0]);
  getDayCostSingleChartData({
    date: selectDate.value + "-01"
  })
    .then((res: any) => {
      if (res.data) {
        dataList.value = res.data.filter((item) => item.FYEAR === +selectDate.value.split("-")[0]);
        tableRef.value?.setDataList(dataList.value, "日", xAxisValue.value);

        option.series[0].data = findChartItem(dataList.value, "成品产出");
        option.series[1].data = findChartItem(dataList.value, "投入工时");
        option1.series[0].data = findChartItem(dataList.value, "单机成本", 1);
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
  getWorkDays();
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

const getWorkDays = () => {
  const month = selectDate.value.split("-").join("");
  getWorkDateData({ month, category: "2", IsWork: "1" }).then((res: any) => {
    if (res.data) {
      validWorkDays.value = res.data;
      const xAxisTemp = res.data.map((item) => dayjs(new Date(item.workDate)).format("YYYY-MM-D").split("-")[2] + "日");
      xAxisValue.value = xAxisTemp;
      option1.xAxis[0].data = xAxisTemp;
      option.xAxis[0].data = xAxisTemp;
    }
  });
};

onMounted(() => {
  getWorkDays();
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
          placeholder="选择年份"
          format="YYYY-MM"
          value-format="YYYY-MM"
        />
      </div>
      <div style="margin-left: 16px">
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </div>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="图表" name="chart">
        <div :style="{ height: maxHeight + 'px' }">
          <div id="deliveryRate1" style="height: 280px" />
          <div id="deliveryRate" style="height: 280px; margin-top: 20px" />
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
