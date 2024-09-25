/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-09-14 18:02:28
 */

import type { EChartsOption, SeriesOption, ToolboxComponentOption } from "echarts";

/** 折线图参数类型 */
export interface LineOptionType {
  title: string;
  xAxis: string[];
  series: SeriesOption[];
}

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

/** 折线图配置 */
export function getLineOption(option: LineOptionType, config: Partial<EChartsOption> = {}) {
  const { title, xAxis = [], series = [] } = option;
  const { legend, tooltip, grid, toolbox, yAxis, ...reset } = config;
  // 判断是否有数据
  const hasData = series.some(({ data }) => (data as any)?.length);
  // 获取series
  const _series = series.map(({ name, data, ...reset }) => ({
    type: "line",
    smooth: true,
    label: { show: true },
    ...reset,
    name: name,
    data: data
  }));
  // 返回配置
  return {
    ...reset,
    title: { text: title, textStyle: { fontSize: 16 }, ...config?.title },
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true, ...grid },
    xAxis: { type: "category", boundaryGap: false, data: xAxis },
    yAxis: { type: "value", axisLine: { show: true }, ...yAxis },
    graphic: { elements: hasData ? [] : noDataText },
    legend: legend ? legend : [{ top: "8%" }],
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,0.4)",
      borderColor: "transparent",
      textStyle: { color: "#fff" },
      ...tooltip
    },
    toolbox: {
      feature: {
        magicType: {
          type: ["line", "bar"],
          title: { bar: "切换为柱状图", line: "切换为折线图" }
        },
        saveAsImage: { title: "保存为图片" },
        dataView: { show: true, title: "数据视图", lang: ["数据视图", "关闭", "刷新"] }
      },
      ...toolbox
    } as ToolboxComponentOption,
    series: _series.reverse() // 线的颜色反转
  } as EChartsOption;
}
