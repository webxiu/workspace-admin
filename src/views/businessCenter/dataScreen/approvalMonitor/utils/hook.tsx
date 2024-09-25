/*
 * @Author: Hailen
 * @Date: 2024-04-16 18:09:50
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-04-29 17:47:04
 */

import * as echarts from "echarts";

import { Border, BorderImgType, NumberTitle, ScrollTable, TabChart } from "@/components/DataScreen/component";
import type { ButtonOptionType, NumTitleType } from "@/components/DataScreen/component";
import { OtherApprovalType, approvalData } from "@/api/oaManage/humanResources";
import { computed, h, markRaw, onMounted, reactive, ref, watch } from "vue";
import { optionLine, optionLineArea, optionLineBar, optionRank } from "./config";
import { useRoute, useRouter } from "vue-router";

import type { ECharts } from "echarts";
import { GridItemType } from "@/components/DataScreen/index";
import { message } from "@/utils/message";
import { throttle } from "@/utils/common";

export const useConfig = () => {
  const route = useRoute();
  const isFirstLoad = ref(false);
  const loading = ref(false);
  const active = ref("KingDee");
  const dataList = ref<any[]>([]);
  const tipName = { month: "月份", week: "周数" };
  // 定义主题
  const borderImg: BorderImgType = "borderImg";

  const colors = ["#ffffff", "#00dd00", "#F5D273", "#ff5566", "#ff6600", "#bbff00", "#6864ff"];

  const columns: TableColumnList[] = [
    { label: "序号", prop: "seq", width: 50 },
    { label: "单据编号", prop: "billNo", minWidth: 140 },
    { label: "当前审批人", prop: "currentApprover" },
    { label: "审批耗时(H)", prop: "currentApprovalTime" },
    { label: "业务单据", prop: "deployName", minWidth: 110 }
  ];
  const chartName = reactive({
    t1: "审批量TOP10(单)",
    t2: "审批低效TOP10 (小时/单)",
    t3: "审批高效TOP10 (小时/单)",
    t4: "主营业务审批效率(小时/单)",
    t5_m: "审批效率按月统计(小时/单)",
    t5_w: "审批效率按周统计(小时/单)",
    t6: "实时耗时TOP10(小时)"
  });
  const chartName5 = ref(chartName.t5_m);
  const chartName6 = ref(chartName.t6);

  const tabChartData = reactive({ dataYear: [], dataMonth: [] });
  const buttonsConfig = reactive<ButtonOptionType[]>([
    { label: "月", value: "month" },
    { label: "周", value: "week" }
  ]);

  const totalObj1 = ref<NumTitleType>({ number: 0, color: colors[1], title: "当月累计已完成(单)" });
  const totalObj2 = ref<NumTitleType>({ number: 0, color: colors[2], title: "当月最长耗时(小时)" });
  const totalObj3 = ref<NumTitleType>({ number: 0, color: colors[3], title: "当月累计未完成(单)" });
  const totalObj4 = ref<NumTitleType>({ number: 0, color: colors[4], title: "当月最短耗时(小时)" });
  const totalObj5 = ref<NumTitleType>({ number: 0, color: colors[5], title: "当月平均效率(小时/单)" });
  const totalObj6 = ref<NumTitleType>({ number: 0, color: colors[6], title: "累计平均效率(小时/单)" });

  const chartIns1 = ref<ECharts>();
  const chartIns2 = ref<ECharts>();
  const chartIns3 = ref<ECharts>();
  const chartIns4 = ref<ECharts>();
  const chartIns5 = ref<ECharts>();

  watch(route, () => getData(true), { immediate: true });

  onMounted(() => {
    const dom1 = document.querySelector(".chart_01") as HTMLDivElement;
    const dom2 = document.querySelector(".chart_02") as HTMLDivElement;
    const dom3 = document.querySelector(".chart_03") as HTMLDivElement;
    const dom4 = document.querySelector(".chart_04") as HTMLDivElement;
    const dom5 = document.querySelector(".chart_05") as HTMLDivElement;
    chartIns1.value = markRaw(echarts.init(dom1, "dark", { renderer: "canvas", useDirtyRect: false }));
    chartIns2.value = markRaw(echarts.init(dom2, "dark", { renderer: "canvas", useDirtyRect: false }));
    chartIns3.value = markRaw(echarts.init(dom3, "dark", { renderer: "canvas", useDirtyRect: false }));
    chartIns4.value = markRaw(echarts.init(dom4, "dark", { renderer: "canvas", useDirtyRect: false }));
    chartIns5.value = markRaw(echarts.init(dom5, "dark", { renderer: "canvas", useDirtyRect: false }));
    const chartArr = [chartIns1, chartIns2, chartIns3, chartIns4, chartIns5];
    window.onresize = throttle(() => {
      chartArr.forEach((chart) => {
        chart.value?.resize();
      });
    }, 50);
  });

  const mLoading = computed(() => (isFirstLoad.value ? false : loading.value));

  // 数据转换成{name, value}格式
  const formatData = (arr: Array<any>, nameField = "receiverName", valueField = "approvalCount", max?) => {
    if (!arr?.length) return { data: [], xAxis: [] };
    const result = arr.reduce(
      (pre, cur) => {
        const name = cur[nameField];
        const value = cur[valueField];
        delete cur[nameField];
        delete cur[valueField];
        pre.xAxis.push(name);
        pre.data.push({ name, value, maxValue: max, ...cur });
        return pre;
      },
      { data: [], xAxis: [] }
    );
    return result;
  };

  function getData(isFirst = false) {
    const systemSource = active.value;
    loading.value = true;
    approvalData({ systemSource }).then((res) => {
      const data = res.data;
      loading.value = false;
      if (!data) return message("数据获取失败", { type: "error" });
      // 重置->数字动画
      totalObj1.value.number = 0;
      totalObj2.value.number = 0;
      totalObj3.value.number = 0;
      totalObj4.value.number = 0;
      totalObj5.value.number = 0;
      totalObj6.value.number = 0;

      const max = Math.max(...data.mainBusinessCountApproval.map((m) => +m.allEfficiency));
      const data_11 = formatData(data.countApprovalCount, "receiverName", "approvalCount");
      const data_12 = formatData(data.countApprovalEfficiencyMin, "receiverName", "averageEfficiency");
      const data_13 = formatData(data.countApprovalEfficiencyMax, "receiverName", "averageEfficiency");
      const data_14 = formatData(data.mainBusinessCountApproval, "deployName", "allEfficiency", max);
      const data_15 = formatData(data.avgEfficiencyByYear, "yearMonth", "monthEfficiency");
      const data_16 = formatData(data.avgEfficiencyByWeekend, "yearMonth", "monthEfficiency");
      tabChartData.dataYear = data_15.data;
      tabChartData.dataMonth = data_16.data;

      // 1.审批量TOP10
      const option1 = optionLine({ type: "bar", xAxis: data_11.xAxis, data: data_11.data });
      // 2.审批低效TOP10
      const option2 = optionLineBar({ type: "bar", xAxis: data_12.xAxis, data: data_12.data });
      // 3.审批高效TOP10
      const option3 = optionLineBar({ type: "bar", xAxis: data_13.xAxis, data: data_13.data });
      // 4.主营业务单据审批效率
      const option4 = optionRank({ type: "bar", data: data_14.data });
      // 5.审批效率按年统计(包括按周)
      const option5 = optionLineArea({ type: "bar", data: data_15.data, param: { tipName: tipName.month } });
      // 6.滚动表格
      dataList.value = data.realTimeConsumingCountApproval.map((m, i) => ({ seq: i + 1, ...m }));
      // 8.其他统计
      const otherD = data.otherCountApproval[0] as OtherApprovalType;

      chartName6.value = `实时耗时TOP${dataList.value.length}(小时)`;

      if (otherD) {
        totalObj1.value.number = parseFloat(otherD.alreadFinishedCount);
        totalObj2.value.number = parseFloat(otherD.longestApprovalTimeHour);
        totalObj3.value.number = parseFloat(otherD.unFinishedCount);
        totalObj4.value.number = parseFloat(otherD.shortestApprovalTimeHour);
        totalObj5.value.number = parseFloat(otherD.monthEfficiency);
        totalObj6.value.number = parseFloat(otherD.allEfficiency);
      }
      chartIns1.value.clear();
      chartIns2.value.clear();
      chartIns3.value.clear();
      chartIns4.value.clear();
      chartIns5.value.clear();
      chartIns1.value.setOption(option1);
      chartIns2.value.setOption(option2);
      chartIns3.value.setOption(option3);
      chartIns4.value.setOption(option4);
      chartIns5.value.setOption(option5);
      if (isFirst) isFirstLoad.value = true;
    });
  }

  // 布局
  const gridConfig = reactive<GridItemType[]>([
    {
      gutter: 10,
      direction: "row",
      children: [
        {
          gutter: 10,
          lg: 8,
          md: 8,
          type: "row",
          direction: "row",
          children: [
            {
              span: 8,
              type: "row",
              direction: "row",
              style: { marginBottom: "10px", flex: 0.5 },
              children: [
                { span: 24, comp: h(NumberTitle, { data: totalObj1, borderImg, showTitle: false }) },
                { span: 24, comp: h(NumberTitle, { data: totalObj3, borderImg, showTitle: false, style: { marginLeft: "10px" } }) },
                { span: 24, comp: h(NumberTitle, { data: totalObj5, borderImg, showTitle: false, style: { marginLeft: "10px" } }) }
              ]
            },
            {
              span: 24,
              comp: h(TabChart, {
                style: { marginBottom: "10px" },
                active: "month",
                className: "chart_05",
                title: chartName5,
                loading: mLoading,
                borderImg: borderImg,
                buttonsConfig: buttonsConfig,
                onChange: onChangeChart
              })
            },
            { span: 24, comp: h(Border, { className: "chart_02", borderImg, loading: mLoading, title: chartName.t2 }) }
          ]
        },
        {
          gutter: 10,
          lg: 8,
          md: 8,
          type: "row",
          direction: "row",
          children: [
            {
              span: 24,
              type: "row",
              direction: "row",
              style: { flex: 2 },
              comp: h(Border, { className: "chart_04", style: { marginBottom: "10px" }, borderImg, loading: mLoading, title: chartName.t4 })
            },
            {
              span: 24,
              type: "row",
              direction: "row",
              style: { flex: 1 },
              comp: h(ScrollTable, {
                columns,
                dataList,
                borderImg,
                loading: mLoading,
                title: chartName6,
                style: { flex: 1 }
              })
            }
          ]
        },
        {
          gutter: 10,
          lg: 8,
          md: 8,
          type: "row",
          direction: "row",
          children: [
            {
              span: 8,
              type: "row",
              direction: "row",
              style: { marginBottom: "10px", flex: 0.5 },
              children: [
                { span: 24, comp: h(NumberTitle, { data: totalObj2, borderImg, showTitle: false }) },
                { span: 24, comp: h(NumberTitle, { data: totalObj4, borderImg, showTitle: false, style: { marginLeft: "10px" } }) },
                { span: 24, comp: h(NumberTitle, { data: totalObj6, borderImg, showTitle: false, style: { marginLeft: "10px" } }) }
              ]
            },
            { span: 24, comp: h(Border, { className: "chart_01", borderImg, loading: mLoading, title: chartName.t1, style: { marginBottom: "10px" } }) },
            { span: 24, comp: h(Border, { className: "chart_03", borderImg, loading: mLoading, title: chartName.t3 }) }
          ]
        }
      ]
    }
  ]);

  function onChangeSystem(v) {
    active.value = v;
    getData();
  }

  function onChangeChart(type) {
    const isMonth = type === "month";
    const nData = isMonth ? tabChartData.dataYear : tabChartData.dataMonth;
    chartName5.value = isMonth ? chartName.t5_m : chartName.t5_w;
    const option5 = optionLineArea({ data: nData, param: { tipName: tipName[type] } });
    chartIns5.value.setOption(option5);
  }

  const onRefresh = () => getData();

  return { loading, gridConfig, active, onRefresh, onChangeSystem };
};
