<script setup lang="ts">
import { getMaterialStockAmountData } from "@/api/oaManage/productMkCenter";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { onMounted, reactive, ref } from "vue";
import ChartTable from "./chartTable/index.vue";
import { ECHARTSTHEME } from "@/views/oa/utils/common";
import { getMenuColumns } from "@/utils/table";
import { useEleHeight } from "@/hooks";

defineOptions({ name: "OaProductMkCenterMaterialControlInstoreMoneyIndex" });

const btnMap = {
  0: "材料",
  1: "半成品",
  2: "成品"
};

const sendTypeMap = {
  材料: 1,
  半成品: 3,
  成品: 2
};

const totalSelectBtns = [];
for (let i = 1; i < 13; i++) totalSelectBtns.push(`${i}月`);

const currentSelectBtnIndex = ref(1);
const currentTotalSelectBtnIndex = ref(1);
const currentColor = ref("#009688");
const selectDate = ref(dayjs(new Date()).format("YYYY"));
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 109);

const dataList = ref([]);
const activeName = ref("chart");
const tableRef = ref();
let myChart: any = reactive({});
let myChart1: any = reactive({});
const loading = ref(false);

const handleClick = ({ paneName }) => {
  activeName.value = paneName;
};

const calcChartTitle = (selectDay, num) => {
  const dateStr = dayjs(selectDay).format("YYYY年");
  if (num === 2) return dateStr + "产品合格数与产品总数(单位：Pcs)";
  if (num === 1) return dateStr + "材料库存金额(单位：万元)";
};

const clickBtnGroup = (key) => {
  currentSelectBtnIndex.value = key + 1;
  getChartData(myChart, myChart1);
};

const clickBtnGroupTotal = (item, key) => {
  currentTotalSelectBtnIndex.value = key + 1;
  getChartData(myChart, myChart1);
};

const clickPreMonth = () => {
  currentTotalSelectBtnIndex.value -= 1;
  if (currentTotalSelectBtnIndex.value <= 1) {
    currentTotalSelectBtnIndex.value = 1;
  }
  getChartData(myChart, myChart1);
};

const clickNextMonth = () => {
  currentTotalSelectBtnIndex.value += 1;
  if (currentTotalSelectBtnIndex.value >= 12) {
    currentTotalSelectBtnIndex.value = 12;
  }
  getChartData(myChart, myChart1);
};

const option = reactive({
  tooltip: {
    ...ECHARTSTHEME.tooltip,
    trigger: "item"
  },
  legend: {
    orient: "vertical",
    left: "left"
  },
  toolbox: {
    feature: {
      saveAsImage: {
        title: "下载图表"
      }
    }
  },
  color: ECHARTSTHEME.barColors,
  series: [
    {
      name: "",
      type: "pie",
      radius: [80, 160],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2
      },
      label: {
        show: false,
        position: "center"
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: "bold"
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
});

const option1 = reactive({
  title: {
    text: `${calcChartTitle(selectDate.value, 1)}`
  },
  color: ECHARTSTHEME.barColors,
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
    data: ["材料库存金额"]
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
      name: "材料库存金额",
      type: "line",
      smooth: true,
      label: { show: true },
      data: []
    }
  ]
});

const findChartItem = (res, type, num = 2) => {
  const instoreRate = res.data.find((el) => el.ITEM === type);
  const instoreValueArr = res.data[0]
    ? Object.values(instoreRate)
        .map((item) => {
          if (item === null) item = 0;
          return item;
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
          .map((item: any) => {
            if (item <= 0) return null;
            return (item / 10000).toFixed(2);
          })
          .slice(0, btnMap[currentSelectBtnIndex.value - 1] === "日" ? undefined : 12)
      : [];

    return instoreValueNewArr;
  }
  return instoreValueArr;
};

const getChartData = async (myChart, myChart1?) => {
  loading.value = true;

  const { columnArrs } = await getMenuColumns();
  const [menuCols] = columnArrs;

  getMaterialStockAmountData({
    type: sendTypeMap[btnMap[currentSelectBtnIndex.value - 1]],
    year: +selectDate.value.split("-")[0]
  })
    .then((res: any) => {
      tableRef.value?.setDataList({ list: res.data, menuCols }, "月");
      if (res.data) {
        dataList.value = res.data;
        console.log(totalSelectBtns[currentTotalSelectBtnIndex.value - 1], "btnMap[currentSelectBtnIndex.value - 1]");
        const resultArr = cloneDeep(res.data)
          .map((item) => {
            return {
              value: item[currentTotalSelectBtnIndex.value],
              name: item.ITEM
            };
          })
          .filter((item) => item.name !== "合计")
          .slice(0, 8);
        option.series[0].data = resultArr;
        option1.xAxis[0].data = res.data[0]
          ? Object.keys(res.data[0])
              .filter((item) => /^\d*$/.test(item))
              .map((item) => item + "月")
          : [];

        option1.series[0].data = findChartItem(res, "合计", 1);
        myChart.setOption(option);
        myChart1 && myChart1.setOption(option1);
        myChart.resize();
        myChart1 && myChart1.resize();
      }
    })
    .finally(() => (loading.value = false));
};

const changeSelectDate = (v) => {
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

const exportHandle = () => {
  console.log("export");
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
          placeholder="选择日期"
          format="YYYY"
          value-format="YYYY"
        />
      </div>
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
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="图表" name="chart">
        <div :style="{ height: maxHeight + 'px' }">
          <div id="deliveryRate1" style="height: 280px" />
          <div style="margin: 10px 0; text-align: center">
            <el-button-group>
              <el-button
                v-for="(item, idx) in totalSelectBtns"
                @click="() => clickBtnGroupTotal(item, idx)"
                :key="idx"
                :color="currentTotalSelectBtnIndex === idx + 1 ? currentColor : ''"
                >{{ item }}</el-button
              >
              <el-button @click="clickPreMonth" :disabled="currentTotalSelectBtnIndex === 1">上月</el-button>
              <el-button @click="clickNextMonth" :disabled="currentTotalSelectBtnIndex === 12">下月</el-button>
            </el-button-group>
          </div>
          <div id="deliveryRate" style="height: 340px; margin-top: 10px" />
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
