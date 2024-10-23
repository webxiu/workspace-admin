<script setup lang="ts">
import dayjs from "dayjs";
import * as echarts from "echarts";
import { useEleHeight } from "@/hooks";
import { debounce } from "@/utils/common";
import { markRaw, onMounted, ref } from "vue";
import { getMenuColumns } from "@/utils/table";
import { getLineOption } from "@/utils/echarts";
import ChartTable from "./chartTable/index.vue";
import { getCostMinusRateData } from "@/api/oaManage/productMkCenter";

defineOptions({ name: "OaProductMkCenterPurchasePurchaseBIReductionRateIndex" });

const selectDate = ref(dayjs(new Date()).format("YYYY"));
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 109);

const dataList = ref([]);
const tableRef = ref();
const loading = ref(false);
const activeName = ref("chart");
const chartRef1 = ref<HTMLElement>();
const chartRef2 = ref<HTMLElement>();
const chartInstance1 = ref<echarts.ECharts>();
const chartInstance2 = ref<echarts.ECharts>();

onMounted(() => {
  if (chartRef1.value) chartInstance1.value = markRaw(echarts.init(chartRef1.value));
  if (chartRef2.value) chartInstance2.value = markRaw(echarts.init(chartRef2.value));
  getChartData();
  window.onresize = debounce(() => {
    chartInstance1.value?.resize();
    chartInstance2.value?.resize();
  }, 300);
});

const handleClick = ({ paneName }) => {
  activeName.value = paneName;
};

const getChartData = async () => {
  loading.value = true;
  const { columnArrs } = await getMenuColumns();
  const [menuCols] = columnArrs;
  getCostMinusRateData({ year: selectDate.value })
    .then((res: any) => {
      const data = Array.isArray(res.data) ? res.data : [];
      dataList.value = data;
      const series1 = [];
      const series2 = [];
      let xAxis = [];
      if (data.length) {
        xAxis = Object.keys(data[0])
          .filter((item) => /^\d*$/.test(item))
          .map((item) => item + "月");
        data.forEach((item) => {
          const { ITEM, ...reset } = item;
          const _data = Object.values(reset);
          if (_data.length) {
            if (["未税降低率", "含税降低率"].includes(ITEM)) {
              series1.push({ name: ITEM, data: _data });
            } else {
              series2.push({ name: ITEM, type: "bar", data: _data.map((item) => (item ? +(+item / 10000).toFixed(2) : null)) });
            }
          }
        });
      }

      const _option: echarts.EChartsOption = getLineOption({
        title: { text: "成本降低率(单位: %)" },
        xAxis: { data: xAxis },
        series: series1
      });
      const _option2: echarts.EChartsOption = getLineOption({
        title: { text: "采购成本税额(单位: 万元)" },
        xAxis: { data: xAxis },
        series: series2,
        dataZoom: [
          { type: "slider", height: 10 },
          { type: "inside", height: 10 }
        ],
        grid: {
          top: "22%",
          left: "3%",
          right: "4%",
          bottom: "3%"
        }
      });
      chartInstance1.value.setOption(_option, true);
      chartInstance2.value.setOption(_option2, true);
      tableRef.value?.setDataList({ list: data, menuCols }, "月");
    })
    .finally(() => (loading.value = false));
};
</script>

<template>
  <div class="chart-outer" v-loading="loading">
    <div class="inline-flex flex-wrap">
      <el-form class="flex-1" :inline="true">
        <el-form-item label="年份" class="mt-4 mb-4">
          <el-date-picker :clearable="false" @change="getChartData" v-model="selectDate" type="year" placeholder="选择日期" format="YYYY" value-format="YYYY" />
        </el-form-item>
      </el-form>
      <div class="block-quote-tip">说明：1、府中, 同益恒, 敬孚 未计算在内；2、统计数据只包括去年与当年都采购过的物料</div>
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="图表" name="chart">
        <div :style="{ minHeight: maxHeight + 'px' }">
          <div ref="chartRef1" style="height: 300px" />
          <div ref="chartRef2" style="height: 400px; margin-top: 20px" />
        </div>
      </el-tab-pane>
      <el-tab-pane label="数据" name="table">
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
