<script setup lang="ts">
import { getProductInstoreTotalChartData, getProductPlanRateChartData, getThroughRateChartData } from "@/api/oaManage/productMkCenter";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { onMounted, reactive, ref } from "vue";
import ChartTable from "./chartTable/index.vue";
import { ECHARTSTHEME } from "@/views/oa/utils/common";
import { getMenuColumns, updateButtonList } from "@/utils/table";
import ButtonList from "@/components/ButtonList/index.vue";
import { ElMessage } from "element-plus";
import { useEleHeight } from "@/hooks";

defineOptions({ name: "OaProductMkCenterProductDeptThroughRateIndex" });

const btnMap = {
  0: "日",
  1: "周",
  2: "月",
  3: "季"
};

const currentSelectBtnIndex = ref(3);
const selectDate = ref(dayjs(new Date()).format("YYYY"));
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 109);

const dataList = ref([]);
const activeName = ref("chart");
const tableRef = ref();
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
  const dateStr = dayjs(selectDay).format("YYYY年");
  if (num === 1) return dateStr + "产品直通率(单位：%)";
};

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
    data: ["产品直通率"]
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
      name: "产品直通率",
      type: "line",
      smooth: true,
      label: { show: true },
      data: [],
      ...ECHARTSTHEME.redLine
    }
  ]
});

const findChartItem = (res, type, num = 2) => {
  const instoreRate = res.data.find((el) => el.type === type);

  if (num === 1) {
    const instoreValueNewArr = res.data[0]
      ? Object.values(instoreRate)
          .map((item) => +item * 100)
          .map((item) => +item.toFixed(2))
          .slice(0, btnMap[currentSelectBtnIndex.value - 1] === "日" ? undefined : 12)
      : [];

    return instoreValueNewArr;
  }
};

const getChartData = async (myChart1) => {
  loading.value = true;

  const { columnArrs, buttonArrs } = await getMenuColumns();
  updateButtonList(buttonList, buttonArrs[0]);

  const [menuCols] = columnArrs;
  getThroughRateChartData({
    year: selectDate.value
  })
    .then((res: any) => {
      tableRef.value?.setDataList({ list: res.data, menuCols }, btnMap[currentSelectBtnIndex.value - 1]);
      if (res.data) {
        dataList.value = res.data;
        option1.xAxis[0].data = res.data[0]
          ? Object.keys(res.data[0])
              .filter((item) => /^\d*$/.test(item))
              .map((item) => item + btnMap[currentSelectBtnIndex.value - 1])
          : [];

        option1.series[0].data = findChartItem(res, "产品直通率", 1);
        myChart1 && myChart1.setOption(option1);
        myChart1 && myChart1.resize();
      }
    })
    .finally(() => (loading.value = false));
};

const changeSelectDate = (v) => {
  option1.title.text = calcChartTitle(v, 1);
  getChartData(myChart1);
};

const fresh = () => {
  myChart1 = echarts.init(document.getElementById("deliveryRate1"));
  getChartData(myChart1);

  window.onresize = function () {
    // 自适应大小
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
          placeholder="选择日期"
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
