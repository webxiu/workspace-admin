/*
 * @Author: Hailen
 * @Date: 2024-08-17 17:27:31
 * @Last Modified by:   Hailen
 * @Last Modified time: 2024-08-17 17:27:31
 */

import type { EChartsOption, SeriesOption } from "echarts";

import { ECHARTSTHEME } from "@/views/oa/utils/common";

export interface AddOrderType {
  data: Array<any>;
  xAxis: string[];
}

// 暂无数据时绘制提示文本
const noDataText = [{ type: "text", top: "50%", left: "40%", cursor: "default", style: { text: "暂无数据", font: "16px Microsoft YaHei", fill: "#969799" } }];

// 获取图表配置
export const getOption = (opeions: AddOrderType) => {
  const { data, xAxis } = opeions;
  const series: SeriesOption[] = [];
  data.forEach((item) => {
    const keyList = Object.keys(item || {});
    const dataArr = keyList.filter((key) => !["changeType"].includes(key)).map((key) => item[key] || null);
    series.push({ name: item.changeType, data: dataArr, type: "line", smooth: true });
  });

  const option: EChartsOption = {
    title: { text: "人员流动统计（单位：人）" },
    legend: [{}],
    xAxis: { type: "category", boundaryGap: false, data: xAxis },
    yAxis: { type: "value", axisLine: { show: true } },
    tooltip: ECHARTSTHEME.tooltip,
    grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
    toolbox: {
      feature: {
        magicType: {
          type: ["line", "bar"],
          title: { bar: "切换为柱状图", line: "切换为折线图" }
        },
        saveAsImage: { title: "保存为图片" },
        dataView: { show: true, title: "数据视图", lang: ["数据视图", "关闭", "刷新"] }
      }
    },
    graphic: { elements: series?.length > 0 ? [] : noDataText },
    series: series
  };
  return option;
};
