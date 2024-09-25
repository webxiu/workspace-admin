<script setup lang="ts">
import { getProductPlanRateChartData } from "@/api/oaManage/productMkCenter";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { onMounted, reactive, ref } from "vue";
import ChartTable from "./chartTable/index.vue";
import { ECHARTSTHEME } from "@/views/oa/utils/common";
import ButtonList from "@/components/ButtonList/index.vue";
import { ElMessage } from "element-plus";
import { getMenuColumns, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";

defineOptions({ name: "OaProductMkCenterProductDeptPlanRateIndex" });

const btnMap = {
  0: "日",
  1: "周",
  2: "月"
};

const currentSelectBtnIndex = ref(3);
const currentColor = ref("#009688");
const selectDate = ref(dayjs(new Date()).format("YYYY-MM"));
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

const handleClick = ({ paneName }) => {
  activeName.value = paneName;
};

const calcChartTitle = (selectDay, num) => {
  const dateStr = dayjs(selectDay).format("YYYY年MM月");
  if (num === 2) return dateStr + "排产和入库数量(单位：Pcs)";
  if (num === 1) return dateStr + "生产计划达成率(百分比：%)";
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
    data: ["排产数量", "入库数量"]
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
      name: "排产数量",
      type: "line",
      smooth: true,
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.redLine
    },
    {
      name: "入库数量",
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
    data: ["生产计划达成率"]
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
      name: "生产计划达成率",
      type: "line",
      smooth: true,
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.redLine
    }
  ]
});

const findChartItem = (res, type, num = 2) => {
  const instoreRate = res.data.find((el) => el.Item === type);

  const instoreValueArr = res.data[0]
    ? Object.values(instoreRate).map((item) => {
        if (item === null) item = 0;
        return +item;
      })
    : [];
  if (num === 1) {
    const instoreValueNewArr = res.data[0]
      ? Object.values(instoreRate)
          .map((item: any) => {
            if (item === null) item = "0.00%";
            if (item.includes("%")) item = +item.split("%")[0];
            return item;
          })
          .map((item) => +item)
          .map((item) => +item.toFixed(2))
          .slice(0, btnMap[currentSelectBtnIndex.value - 1] === "日" ? undefined : 12)
      : [];

    return instoreValueNewArr;
  }
  return instoreValueArr;
};

const getChartData = async (myChart, myChart1?) => {
  loading.value = true;
  const { buttonArrs } = await getMenuColumns();
  updateButtonList(buttonList, buttonArrs[0]);
  getProductPlanRateChartData({
    type: btnMap[currentSelectBtnIndex.value - 1],
    date: selectDate.value + "-01"
  })
    .then((res: any) => {
      tableRef.value?.setDataList(res.data, btnMap[currentSelectBtnIndex.value - 1]);
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

        option.series[0].data = findChartItem(res, "排产数量");
        option.series[1].data = findChartItem(res, "入库数量");
        option1.series[0].data = findChartItem(res, "生产计划达成率", 1);
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
