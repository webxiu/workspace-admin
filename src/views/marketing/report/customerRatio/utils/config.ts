/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 16:28:35
 */

import type { EChartsOption } from "echarts";
import { getPidOption } from "@/utils/echarts";

/** 金额元转万元 */
export const fmtMoney = (num) => Number(num) / 10000;

/**
 * 获取图表数据
 * @param data 数据
 * @param name 名称字段
 */
export const getSeriesData = (nameField: string, data) => {
  const chartData = [];
  const total = data.table[0]?.total || 0;
  const otherObj = data.echarts?.reduce(
    (prev, cur) => {
      chartData.push({ name: cur[nameField], value: cur.ratio, sale: fmtMoney(cur.sale) });
      prev.sale = prev.sale - Number(cur.sale);
      prev.ratio = prev.ratio - Number(cur.ratio);
      return prev;
    },
    { ratio: 100, sale: total }
  );
  if (data.echarts.length <= data.num && data.echarts.length !== 0) {
    if (otherObj.ratio > 0) {
      chartData.push({ name: "其他", value: otherObj.ratio.toFixed(2), sale: fmtMoney(otherObj.sale) });
    }
  }
  return chartData;
};

interface EchartOptionType<T> {
  /** 名称字段 */
  nameField: string;
  /** 图表表头 */
  title: string;
  /** 数据 */
  data: T;
}

/**
 * 获取图表配置
 * @param opeions
 * @returns
 */
export const getOption = <T extends object>(opeions: EchartOptionType<T>) => {
  const { nameField, title, data } = opeions;
  const seriesData = getSeriesData(nameField, data);
  const option2: EChartsOption = getPidOption({
    title: { text: title },
    tooltip: {
      formatter: (param) => {
        return `${param.marker}${param.name}: ${param.percent}%
        <div style="margin-left: 14px">销售额: ${param.data.sale.toFixed(2)}万元</div>`;
      }
    },
    series: [{ name: "客户占比", data: seriesData }]
  });

  return option2;
};
