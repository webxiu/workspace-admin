/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-11 09:56:51
 */

import type { EChartsOption, SeriesOption } from "echarts";

import { getLineOption } from "@/utils/echarts";
import regExp from "@/utils/regExp";

interface ProdSaleOptionType {
  data: Array<any>;
  xAxis: string[];
}

// 获取图表配置
export const getOption = (opeions: ProdSaleOptionType) => {
  const { data, xAxis } = opeions;
  const series1: SeriesOption[] = [];
  const series2: SeriesOption[] = [];
  const series3: SeriesOption[] = [];

  function getSeries(series1, item) {
    const sData = [];
    Object.keys(item || {}).forEach((key) => {
      if (regExp.number2.test(key)) sData.push({ name: key, value: item[key] });
    });
    series1.push({ name: item.FITEM.split("(")[0], type: "line", data: sData });
  }
  data.forEach((item, i) => {
    if ([0, 1, 2].includes(i)) getSeries(series1, item); // 产值,销售,库存
    if ([3, 4, 5].includes(i)) getSeries(series2, item); // 入库数量,销售数量,库存数量
    if ([6, 7, 8].includes(i)) getSeries(series3, item); // 产值增长率,销售增长率,库存增长率
  });

  const option1: EChartsOption = getLineOption({ title: { text: "产销存总额 (单位：万元)" }, xAxis: { data: xAxis }, series: series1 });
  const option2: EChartsOption = getLineOption({ title: { text: "产销存数量 (单位：万PCS)" }, xAxis: { data: xAxis }, series: series2 });
  const option3: EChartsOption = getLineOption({ title: { text: "产销存增长率 (单位：百分比)" }, xAxis: { data: xAxis }, series: series3 });
  return { option1, option2, option3 };
};
