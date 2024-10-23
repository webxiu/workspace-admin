<script setup lang="ts">
import dayjs from "dayjs";
import * as echarts from "echarts";
import { markRaw, onMounted, reactive, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { useEleHeight } from "@/hooks";
import { getLineOption } from "@/utils/echarts";
import ChartTable from "./chartTable/index.vue";
import ButtonList from "@/components/ButtonList/index.vue";
import { getMenuColumns, updateButtonList } from "@/utils/table";
import { getDeliveryRateData } from "@/api/oaManage/productMkCenter";
import ButtonGroup, { ButtonOptionType } from "@/components/ButtonGroup.vue";
import { debounce } from "@/utils/common";
import { ECharts } from "echarts";

defineOptions({ name: "OaProductMkCenterPurchasePurchaseBIDeliveryRateIndex" });

const myChart = ref();
const myChart1 = ref();
const tableRef = ref();
const dataList = ref([]);
const loading = ref(false);
const activeName = ref("chart");
const chartRef1 = ref<HTMLElement>();
const chartRef2 = ref<HTMLElement>();
const chartInstance1 = ref<ECharts>();
const chartInstance2 = ref<ECharts>();
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 109);
const formData = reactive({
  type: "月",
  date: dayjs(new Date()).format("YYYY-MM")
});
const buttonsConfig = ref<ButtonOptionType[]>([
  { label: "日", value: "日" },
  { label: "周", value: "周" },
  { label: "月", value: "月" }
]);

watch(formData, (val) => {
  getChartData();
});

onMounted(() => {
  if (chartRef1.value) chartInstance1.value = markRaw(echarts.init(chartRef1.value));
  if (chartRef2.value) chartInstance2.value = markRaw(echarts.init(chartRef2.value));
  getChartData();
  window.onresize = debounce(() => {
    chartInstance1.value.resize();
    chartInstance2.value.resize();
  });
});

const exportHandle = () => {
  console.log("export");
  ElMessage({ message: "功能未开发", type: "warning" });
};

const buttonList = ref<ButtonItemType[]>([{ clickHandler: exportHandle, type: "primary", text: "导出", isDropDown: false }]);

const handleClick = ({ paneName }) => {
  activeName.value = paneName;
};

const getChartData = async () => {
  loading.value = true;
  const { columnArrs, buttonArrs } = await getMenuColumns();
  const [menuCols] = columnArrs;
  updateButtonList(buttonList, buttonArrs[0]);
  getDeliveryRateData({ type: formData.type, date: formData.date + "-01" })
    .then((res: any) => {
      const data = res.data?.length ? res.data : [];
      dataList.value = data;
      const series1 = [];
      const series2 = [];
      let xAxis = [];
      if (data.length) {
        data.forEach((item) => {
          const { 项目, FID, Item, YearAndMonth, ...reset } = item;
          const _data = Object.values(reset);
          if (_data.length) {
            if (["入库达成率", "收料达成率"].includes(Item)) {
              series1.push({ name: Item, data: _data.map((item: string) => (item ? Number(item.replace("%", "")) : 0)) });
            } else {
              series2.push({ name: Item, data: _data });
            }
          }
        });
        // X坐标
        xAxis = Object.keys(data[0])
          .filter((item) => /^\d*$/.test(item))
          .map((item) => item + formData.type);
      }
      const dateTitle = dayjs(formData.date).format("YYYY年MM月");

      const _option: echarts.EChartsOption = getLineOption({
        title: { text: `${dateTitle}采购达成率(单位: %)` },
        xAxis: { data: xAxis },
        series: series1
      });
      const _option2: echarts.EChartsOption = getLineOption({
        title: { text: `${dateTitle}采购笔数(单位: Pcs)` },
        xAxis: { data: xAxis },
        series: series2
      });
      chartInstance1.value.setOption(_option, true);
      chartInstance2.value.setOption(_option2, true);
      tableRef.value?.setDataList({ list: data, menuCols }, formData.type);
    })
    .finally(() => (loading.value = false));
};
</script>

<template>
  <Row>
    <Col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="flex-col">
      <div class="inline-flex flex-wrap">
        <el-form class="flex-1" :inline="true">
          <el-form-item label="年月" class="mt-4 mb-4">
            <el-date-picker v-model="formData.date" type="month" placeholder="选择日期" format="YYYY-MM" value-format="YYYY-MM" :clearable="false" />
          </el-form-item>
          <el-form-item label="汇总周期" class="mt-4 mb-4">
            <template #label="{ label }">
              <span class="fw-700">{{ label }}</span>
            </template>
            <ButtonGroup v-model="formData.type" :buttonsConfig="buttonsConfig" />
          </el-form-item>
        </el-form>
        <ButtonList :buttonList="buttonList" :auto-layout="false" moreActionText="业务操作" />
      </div>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane label="图表" name="chart">
          <div :style="{ minHeight: maxHeight + 'px' }">
            <div ref="chartRef1" style="height: 280px" />
            <div ref="chartRef2" style="height: 280px; margin-top: 20px" />
          </div>
        </el-tab-pane>
        <el-tab-pane label="表格" name="table">
          <ChartTable ref="tableRef" />
        </el-tab-pane>
      </el-tabs>
    </Col>
  </Row>
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
