<template>
  <div class="month-report">
    <div class="search-input">
      <el-date-picker v-model="searchDate" type="month" placeholder="请选择年月" value-format="YYYY-MM" format="YYYY-MM" />
    </div>
    <div class="top-title">
      <div class="total">
        <div class="num">55</div>
        <div class="txt">离职人数</div>
      </div>
      <div class="total">
        <div class="num">41</div>
        <div class="txt">新进人数</div>
      </div>
      <div class="total">
        <div class="num">1,241</div>
        <div class="txt">原有人数</div>
      </div>
      <div class="total leave-rate">
        <div class="num">4.5%</div>
        <div class="txt">离职率</div>
      </div>
    </div>
    <div class="table-chart">
      <pure-table
        border
        row-key="id"
        class="month-report-table"
        :adaptive="true"
        align-whole="center"
        size="small"
        :data="dataList"
        :columns="columns"
        highlight-current-row
        :show-overflow-tooltip="true"
      />
    </div>
    <div class="bar-chart">
      <div class="bar">
        <div ref="chartBarRef1" style="height: 320px" />
      </div>
      <div class="bar"><div ref="chartBarRef2" style="height: 320px" /></div>
      <div class="bar"><div ref="chartBarRef3" style="height: 320px" /></div>
    </div>
    <div class="line-chart"><div ref="chartBarRef4" style="height: 420px" /></div>
    <div class="line-chart"><div ref="chartBarRef5" style="height: 420px" /></div>
  </div>
</template>

<script setup lang="ts">
import { getMenuColumns, setColumn } from "@/utils/table";
import { ECharts } from "echarts";
import * as echarts from "echarts";
import { markRaw, onMounted, reactive, ref } from "vue";
import { debounce } from "@/utils/common";
import dayjs from "dayjs";

const dataList = ref([]);
const columns = ref([]);
const chartBarRef1 = ref<HTMLElement>();
const chartBarRef2 = ref<HTMLElement>();
const chartBarRef3 = ref<HTMLElement>();
const chartBarRef4 = ref<HTMLElement>();
const chartBarRef5 = ref<HTMLElement>();
const chartInstance1 = ref<ECharts>();
const chartInstance2 = ref<ECharts>();
const chartInstance3 = ref<ECharts>();
const chartInstance4 = ref<ECharts>();
const chartInstance5 = ref<ECharts>();

const initDay = dayjs().format("YYYY-MM");
const searchDate = ref(initDay);

//随机生成颜色
const handleColors = () => {
  let color = "";
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  color = `rgb(${r},${g},${b})`;
  return color; //所有方法的拼接都可以用ES6新特性`其他字符串{$变量名}`替换
};

const option1 = reactive({
  title: { show: true, text: "离职人数", x: "center", y: "top" },
  tooltip: {
    trigger: "item",
    borderColor: "transparent",
    textStyle: { color: "#fff" },
    backgroundColor: "rgba(0,0,0,0.6)",
    // formatter: "{b}: {c} ({d}%)",
    formatter: (params) => {
      const { marker, name, value } = params;
      return `${marker}${name}: ${value}人`;
    }
  },
  series: [
    {
      type: "pie",
      label: { show: true, formatter: (param) => `${param.name} (${param.value}人)` }, // 显示文本
      data: [
        {
          value: 7,
          name: "部门1"
        },
        {
          value: 5,
          name: "部门2"
        },
        {
          value: 9,
          name: "部门3"
        },
        {
          value: 3,
          name: "部门4"
        },
        {
          value: 3,
          name: "部门5"
        },
        {
          value: 6,
          name: "部门6"
        },
        {
          value: 5,
          name: "部门7"
        },
        {
          value: 5,
          name: "部门8"
        },
        {
          value: 4,
          name: "部门9"
        },
        {
          value: 8,
          name: "部门10"
        }
      ]
    }
  ]
});

const option2 = reactive({
  title: { show: true, text: "新进人数", x: "center", y: "top" },
  tooltip: {
    trigger: "item",
    borderColor: "transparent",
    textStyle: { color: "#fff" },
    backgroundColor: "rgba(0,0,0,0.6)",
    // formatter: "{b}: {c} ({d}%)",
    formatter: (params) => {
      const { marker, name, value } = params;
      return `${marker}${name}: ${value}人`;
    }
  },
  series: [
    {
      type: "pie",
      label: { show: true, formatter: (param) => `${param.name} (${param.value}人)` }, // 显示文本
      data: [
        {
          value: 8,
          name: "部门1"
        },
        {
          value: 10,
          name: "部门2"
        },
        {
          value: 3,
          name: "部门3"
        },
        {
          value: 1,
          name: "部门4"
        },
        {
          value: 5,
          name: "部门5"
        },
        {
          value: 2,
          name: "部门6"
        },
        {
          value: 2,
          name: "部门7"
        },
        {
          value: 3,
          name: "部门8"
        },
        {
          value: 1,
          name: "部门9"
        },
        {
          value: 6,
          name: "部门10"
        }
      ]
    }
  ]
});

const option3 = reactive({
  title: { show: true, text: "原有人数", x: "center", y: "top" },
  tooltip: {
    trigger: "item",
    borderColor: "transparent",
    textStyle: { color: "#fff" },
    backgroundColor: "rgba(0,0,0,0.6)",
    // formatter: "{b}: {c} ({d}%)",
    formatter: (params) => {
      const { marker, name, value } = params;
      return `${marker}${name}: ${value}人`;
    }
  },
  series: [
    {
      type: "pie",
      label: { show: true, formatter: (param) => `${param.name} (${param.value}人)` }, // 显示文本
      data: [
        {
          value: 163,
          name: "部门1",

          labelLine: { show: true }
        },
        {
          value: 85,
          name: "部门2"
        },
        {
          value: 122,
          name: "部门3"
        },
        {
          value: 143,
          name: "部门4"
        },
        {
          value: 144,
          name: "部门5"
        },
        {
          value: 110,
          name: "部门6"
        },
        {
          value: 90,
          name: "部门7"
        },
        {
          value: 137,
          name: "部门8"
        },
        {
          value: 149,
          name: "部门9"
        },
        {
          value: 98,
          name: "部门10"
        }
      ]
    }
  ]
});

const option4 = reactive({
  title: { show: true, text: "部门入离职情况", x: "center", y: "top" },
  xAxis: {
    data: ["部门1", "部门2", "部门3", "部门4", "部门5", "部门6", "部门7", "部门8", "部门9", "部门10"]
  },
  yAxis: {},
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderColor: "transparent",
    textStyle: { color: "#fff" }
  },
  // label: { show: true },
  legend: { show: true, right: 45, data: ["新进人数", "原有人数", "离职人数"] },
  label: { show: true, formatter: (param) => `${param.value}人` }, // 显示文本
  series: [
    {
      name: "新进人数",
      data: [8, 10, 3, 1, 5, 2, 2, 3, 1, 6],
      type: "line",
      smooth: true
    },
    {
      name: "原有人数",
      data: [163, 85, 122, 143, 144, 110, 90, 137, 149, 98],
      type: "bar"
    },
    {
      name: "离职人数",
      data: [7, 5, 9, 3, 3, 6, 5, 5, 4, 8],
      type: "line",
      smooth: true
    }
  ],
  grid: {
    // 让图表占满容器
    top: "40px",
    left: "40px",
    right: "40px",
    bottom: "40px"
  }
});

const option5 = reactive({
  title: { show: true, text: "部门离职率", x: "center", y: "top" },
  xAxis: {
    data: ["部门1", "部门2", "部门3", "部门4", "部门5", "部门6", "部门7", "部门8", "部门9", "部门10"]
  },
  yAxis: {
    axisLabel: {
      formatter: (value) => {
        return value * 100 + "%";
      }
    }
  },
  tooltip: {
    trigger: "axis",
    backgroundColor: "rgba(0,0,0,0.6)",
    borderColor: "transparent",
    textStyle: { color: "#fff" },
    formatter: (params) => {
      const { marker, name, value } = params[0];
      return `${marker}${name}: ${(value * 100).toFixed(2)}%`;
    }
  },
  label: { show: true, formatter: (param) => `${(param.value * 100).toFixed(2)}%` }, // 显示文本
  legend: { show: true, right: 45 },
  series: [
    {
      data: [0.043, 0.056, 0.078, 0.021, 0.021, 0.057, 0.057, 0.037, 0.027, 0.083],
      type: "bar"
    }
  ],
  grid: {
    // 让图表占满容器
    top: "40px",
    left: "40px",
    right: "40px",
    bottom: "40px"
  }
});

const getConfig = async () => {
  let columnData: TableColumnList[] = [
    { label: "项目", prop: "item" },
    { label: "部门1", prop: "dept1", align: "right" },
    { label: "部门2", prop: "dept2", align: "right" },
    { label: "部门3", prop: "dept3", align: "right" },
    { label: "部门4", prop: "dept4", align: "right" },
    { label: "部门5", prop: "dept5", align: "right" },
    { label: "部门6", prop: "dept6", align: "right" },
    { label: "部门7", prop: "dept7", align: "right" },
    { label: "部门8", prop: "dept8", align: "right" },
    { label: "部门9", prop: "dept9", align: "right" },
    { label: "部门10", prop: "dept10", align: "right" },
    { label: "小计", prop: "total", align: "right" }
  ];

  const { columnArrs } = await getMenuColumns();
  const [menuCols] = columnArrs;
  if (menuCols?.length) columnData = menuCols;
  columns.value = setColumn({ columnData, operationColumn: false });
};

const onSearch = () => {
  dataList.value = [
    { item: "离职人数", dept1: 7, dept2: 5, dept3: 9, dept4: 3, dept5: 3, dept6: 6, dept7: 5, dept8: 5, dept9: 4, dept10: 8, total: 55 },
    { item: "新进人数", dept1: 8, dept2: 10, dept3: 3, dept4: 1, dept5: 5, dept6: 2, dept7: 2, dept8: 3, dept9: 1, dept10: 6, total: 41 },
    { item: "原有人数", dept1: 163, dept2: 85, dept3: 122, dept4: 143, dept5: 144, dept6: 110, dept7: 90, dept8: 137, dept9: 149, dept10: 98, total: 1241 },
    { item: "现有合计", dept1: 164, dept2: 90, dept3: 116, dept4: 141, dept5: 146, dept6: 106, dept7: 87, dept8: 135, dept9: 146, dept10: 96, total: 1227 },
    {
      item: "离职率",
      dept1: "4.3%",
      dept2: "5.6%",
      dept3: "7.8%",
      dept4: "2.1%",
      dept5: "2.1%",
      dept6: "5.7%",
      dept7: "5.7%",
      dept8: "3.7%",
      dept9: "2.7%",
      dept10: "8.3%",
      total: "4.5%"
    }
    // {
    //   item: "离职率目标",
    //   dept1: "4.0%",
    //   dept2: "4.0%",
    //   dept3: "4.0%",
    //   dept4: "4.0%",
    //   dept5: "4.0%",
    //   dept6: "4.0%",
    //   dept7: "4.0%",
    //   dept8: "4.0%",
    //   dept9: "4.0%",
    //   dept10: "4.0%",
    //   total: "4.0%"
    // }
  ];
};

const initChart = () => {
  if (chartBarRef1.value) chartInstance1.value = markRaw(echarts.init(chartBarRef1.value));
  if (chartBarRef2.value) chartInstance2.value = markRaw(echarts.init(chartBarRef2.value));
  if (chartBarRef3.value) chartInstance3.value = markRaw(echarts.init(chartBarRef3.value));
  if (chartBarRef4.value) chartInstance4.value = markRaw(echarts.init(chartBarRef4.value));
  if (chartBarRef5.value) chartInstance5.value = markRaw(echarts.init(chartBarRef5.value));
  chartInstance1.value?.setOption(option1);
  chartInstance2.value?.setOption(option2);
  chartInstance3.value?.setOption(option3);
  chartInstance4.value?.setOption(option4);
  chartInstance5.value?.setOption(option5);

  window.onresize = debounce(() => {
    chartInstance1.value?.resize();
    chartInstance2.value?.resize();
    chartInstance3.value?.resize();
    chartInstance4.value?.resize();
    chartInstance5.value?.resize();
  }, 300);
};

onMounted(() => {
  getConfig();
  onSearch();
  initChart();
});
</script>

<style scoped lang="scss">
.month-report {
  .top-title {
    width: 90%;
    margin: 0 auto 8px;
    display: flex;
    justify-content: space-around;

    .total {
      text-align: center;
      font-size: 18px;

      .num {
        font-weight: bolder;
      }
    }

    .leave-rate {
      color: red;
    }
  }

  .bar-chart {
    width: 100%;
    display: flex;
    justify-content: space-between;
    margin: 20px 0 8px;

    .bar {
      // background-color: red;
      width: 33.3%;
    }
  }

  .line-chart {
    width: 100%;
    // background-color: red;
    // &:first-child {
    //   margin-bottom: 80px;
    // }
  }
}
</style>
