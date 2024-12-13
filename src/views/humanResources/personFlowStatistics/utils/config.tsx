/*
 * @Author: Hailen
 * @Date: 2024-08-17 17:27:31
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 15:48:15
 */

import type { EChartsOption, SeriesOption } from "echarts";

import { getLineOption } from "@/utils/echarts";

// 获取图表配置
export const getOption = (opeions: { data: Array<any>; xAxis: string[] }) => {
  const { data, xAxis } = opeions;
  const series: SeriesOption[] = [];
  data.forEach((item) => {
    const keyList = Object.keys(item || {});
    const dataArr = keyList.filter((key) => !["changeType"].includes(key)).map((key) => item[key] || null);
    series.push({ name: item.changeType, data: dataArr, type: "line", smooth: true });
  });
  const option1: EChartsOption = getLineOption({
    title: { text: "人员流动统计（单位：人）" },
    xAxis: { data: xAxis },
    series: series,
    grid: { top: "25%" }
  });
  return option1;
};
