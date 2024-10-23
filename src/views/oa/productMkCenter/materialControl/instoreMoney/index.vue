<script setup lang="ts">
import dayjs from "dayjs";
import * as echarts from "echarts";
import { onMounted, reactive, ref } from "vue";
import { getMenuColumns } from "@/utils/table";
import ChartTable from "./chartTable/index.vue";
import { formConfigs, getOption } from "./config";
import EditForm from "@/components/EditForm/inline.vue";
import { getMaterialStockAmountData } from "@/api/oaManage/productMkCenter";

defineOptions({ name: "OaProductMkCenterMaterialControlInstoreMoneyIndex" });

const dataList = ref([]);
const tableRef = ref();
const activeName = ref("chart");
const totalSelectBtns = new Array(12).fill(0).map((_, i) => `${i + 1}月`);

const formData = reactive({
  type: 1,
  month: 1,
  year: dayjs(new Date()).format("YYYY")
});

let myChart: any = reactive({});
let myChart1: any = reactive({});
const loading = ref(false);

const handleClick = ({ paneName }) => {
  activeName.value = paneName;
};

function onChange() {
  getChartData(myChart, myChart1);
}

const clickBtnGroupTotal = (item, key) => {
  formData.month = key + 1;
  getChartData(myChart, myChart1);
};

const updateMonth = (increment) => {
  formData.month = Math.max(1, Math.min(12, formData.month + increment));
  getChartData(myChart, myChart1);
};

const clickPreMonth = () => {
  updateMonth(-1);
};
const clickNextMonth = () => {
  updateMonth(1);
};

const getChartData = async (myChart, myChart1?) => {
  loading.value = true;
  const { columnArrs } = await getMenuColumns();
  const [menuCols] = columnArrs;
  getMaterialStockAmountData({ type: formData.type, year: formData.year })
    .then((res: any) => {
      tableRef.value?.setDataList({ list: res.data, menuCols }, "月");
      const data = res.data.length ? res.data : [];
      dataList.value = data;
      const { option1, option2 } = getOption(data, formData);
      myChart1.setOption(option1, true);
      myChart.setOption(option2, true);
    })
    .finally(() => (loading.value = false));
};

onMounted(() => {
  myChart = echarts.init(document.getElementById("deliveryRate"));
  myChart1 = echarts.init(document.getElementById("deliveryRate1"));
  getChartData(myChart, myChart1);

  window.onresize = function () {
    // 自适应大小
    myChart.resize();
    myChart1.resize();
  };
});
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 main main-content">
    <EditForm class="flex-1" :formConfigs="formConfigs({ onChange })" :formInline="formData" />
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="图表" name="chart">
        <div id="deliveryRate1" style="height: 300px" />
        <div style="margin: 10px 0; text-align: center">
          <el-button-group>
            <el-button
              :key="idx"
              class="mb-4"
              v-for="(item, idx) in totalSelectBtns"
              :color="formData.month === idx + 1 ? '#009688' : ''"
              @click="() => clickBtnGroupTotal(item, idx)"
            >
              {{ item }}
            </el-button>
            <el-button @click="clickPreMonth" class="mb-4" :disabled="formData.month === 1">上月</el-button>
            <el-button @click="clickNextMonth" class="mb-4" :disabled="formData.month === 12">下月</el-button>
          </el-button-group>
        </div>
        <div id="deliveryRate" style="height: 340px; margin-top: 10px" />
      </el-tab-pane>
      <el-tab-pane label="表格" name="table">
        <ChartTable ref="tableRef" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style lang="scss" scoped>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  font-size: 32px;
  font-weight: 600;
  color: #6b778c;
}
</style>
