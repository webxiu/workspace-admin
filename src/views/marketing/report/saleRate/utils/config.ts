/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 16:32:04
 */

import type { EChartsOption } from "echarts";
import { getLineOption } from "@/utils/echarts";

interface EchartOptionType {
  xAxis: string[];
  year: string;
  saleRate: number[];
  realSale: string[];
  planSale: string[];
}

// 获取图表配置
export const getOption = (opeions: EchartOptionType) => {
  const { xAxis, year, saleRate, realSale, planSale } = opeions;
  const option1: EChartsOption = getLineOption({
    title: { text: `${year}年销售达成率(单位:%)` },
    xAxis: { data: xAxis },
    series: [{ name: "销售达成率", data: saleRate }]
  });
  const option2: EChartsOption = getLineOption({
    title: { text: `${year}年月销售额(单位:万元)` },
    xAxis: { data: xAxis },
    series: [
      { name: "实际销售额", data: realSale },
      { name: "计划销售额", data: planSale }
    ]
  });
  return { option1, option2 };
};
