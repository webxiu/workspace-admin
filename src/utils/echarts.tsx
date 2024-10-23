/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 17:24:45
 */

import type { EChartsOption, SeriesOption, ToolboxComponentOption } from "echarts";

import { ECHARTSTHEME } from "@/views/oa/utils/common";

// 暂无数据
const noDataText = [
  {
    type: "text",
    top: "50%",
    left: "40%",
    cursor: "default",
    style: { text: "暂无数据", font: "16px Microsoft YaHei", fill: "#969799" }
  }
];

/** 折线图参数类型 */
export interface LineOptionType {
  title: string;
  xAxis: string[];
  series: SeriesOption[];
}

/** 1.折线图配置 */
export function getLineOption(option: EChartsOption) {
  const { title, xAxis = [], series = [], legend, tooltip, grid, toolbox, yAxis, ...reset } = option;
  const serieList = series as SeriesOption[];
  // 判断是否有数据
  const hasData = serieList.some(({ data }) => (data as any)?.length);
  // 获取series
  const _series = serieList.map((item: any) => {
    return {
      type: "line",
      ...item,
      smooth: true,
      label: { show: true },
      itemStyle: {
        // color: "#0071d5"  配置线颜色
        borderRadius: [4, 4, 0, 0]
      },
      data: item.data
    };
  });

  // 返回配置
  return {
    ...reset,
    title: { textStyle: { fontSize: 16 }, ...title },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true, ...grid },
    xAxis: { type: "category", boundaryGap: _series[0].type === "line" ? false : true, ...xAxis },
    yAxis: { type: "value", axisLine: { show: true }, ...yAxis },
    graphic: { elements: hasData ? [] : noDataText },
    legend: legend ? legend : [{ top: "8%" }],
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,0.6)",
      borderColor: "transparent",
      textStyle: { color: "#fff" },
      ...tooltip
    },
    toolbox: {
      ...toolbox,
      feature: {
        magicType: {
          type: ["line", "bar"],
          title: { bar: "切换为柱状图", line: "切换为折线图" }
        },
        saveAsImage: { title: "保存为图片" },
        dataView: { show: true, title: "数据视图", lang: ["数据视图", "关闭", "刷新"] }
      }
    } as ToolboxComponentOption,
    series: _series.reverse() // 线的颜色反转
  } as EChartsOption;
}

/** 饼图参数类型 */
export interface PieOptionType {
  title?: string;
  data: Record<string, number | string>[];
}

/** 2.饼图配置 */
export function getPidOption(option: EChartsOption) {
  const { title, series = [], legend, tooltip, grid, ...reset } = option;
  const seriesItem = series ? series[0] : {};
  const hasData = (series as SeriesOption[]).some(({ data }) => (data as any)?.length);

  return {
    ...reset,
    title: { textStyle: { fontSize: 16 }, top: "2%", ...title },
    tooltip: {
      trigger: "item",
      borderColor: "transparent",
      textStyle: { color: "#fff" },
      backgroundColor: "rgba(0,0,0,0.6)",
      // formatter: "{b}: {c} ({d}%)",
      formatter: (params) => {
        const { seriesName, marker, name, value, percent } = params;
        return `${seriesName}<br/>${marker}${name}: ${value} (${percent}%)`;
      },
      ...tooltip
    },
    legend: { top: "5%", left: "center", ...legend },
    graphic: { elements: hasData ? [] : noDataText },
    grid: { top: "5%", left: "center", containLabel: true, ...grid },
    series: [
      {
        name: "",
        ...seriesItem,
        type: seriesItem.data.length ? "pie" : undefined, // 无数据时不显示饼图
        radius: "50%",
        avoidLabelOverlap: false,
        label: { show: true, formatter: (param) => `${param.name} (${param.percent}%)` }, // 显示文本
        labelLine: { show: true }
      }
    ]
  } as EChartsOption;
}

/** 3.环形圆角饼图 */
export function getCirclePidOption(option: EChartsOption) {
  const { title, series = [], legend, tooltip, grid, ...reset } = option;
  const seriesItem = series ? series[0] : {};
  const hasData = (series as SeriesOption[]).some(({ data }) => (data as any)?.length);

  return {
    ...reset,
    title: { textStyle: { fontSize: 16 }, ...title },
    tooltip: {
      trigger: "item",
      borderColor: "transparent",
      textStyle: { color: "#fff" },
      backgroundColor: "rgba(0,0,0,0.4)",
      // formatter: "{b}: {c} ({d}%)",
      formatter: (params) => `${params.marker}${params.name}: ${params.value} (${params.percent}%)`,
      ...tooltip
    },
    legend: { orient: "vertical", top: "5%", right: "0%", ...legend },
    graphic: { elements: hasData ? [] : noDataText },
    grid: { top: "5%", bottom: "3%", containLabel: true, ...grid },
    series: [
      {
        ...seriesItem,
        name: "",
        type: "pie",
        radius: hasData ? ["40%", "70%"] : [], // 设置环形半径
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2
        },
        // 显示图表名称
        emphasis: { label: { show: true, fontSize: 22 } },
        // label: { show: false, position: "center" },// 中间缩放展示名称
        labelLine: { show: true }
      }
    ]
  } as EChartsOption;
}
