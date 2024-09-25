/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-09-12 13:48:23
 */

import type { EChartsOption } from "echarts";
import { getLineOption } from "@/utils/echarts";

export interface AddOrderType {
  xAxis: string[];
  year: string;
  saleRate: number[];
  realSale: string[];
  planSale: string[];
}

// 获取图表配置
export const getOption = (opeions: AddOrderType) => {
  const { xAxis, year, saleRate, realSale, planSale } = opeions;
  const option1: EChartsOption = getLineOption({
    title: `${year}年销售达成率(单位:%)`,
    xAxis: xAxis,
    series: [{ name: "销售达成率", data: saleRate }]
  });
  const option2: EChartsOption = getLineOption({
    title: `${year}年月销售额(单位:万元)`,
    xAxis: xAxis,
    series: [
      { name: "实际销售额", data: realSale },
      { name: "计划销售额", data: planSale }
    ]
  });
  return { option1, option2 };
};
