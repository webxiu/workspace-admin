/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2023-09-13 15:35:49
 */

import { ECHARTSTHEME } from "@/views/oa/utils/common";
import type { EChartsOption } from "echarts";

/** 金额元转万元 */
export const fmtMoney = (num) => Number(num) / 10000;

/**
 * 获取图表数据
 * @param data 数据
 * @param name 名称字段
 */
export const getChartData = (nameField: string, data) => {
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

export interface AddOrderType<T> {
  /** 名称字段 */
  nameField: string;
  /** 图表表头 */
  title: string;
  /** 数据 */
  data: T;
}

// 暂无数据时绘制提示文本
const noDataText = [{ type: "text", top: "50%", left: "45%", cursor: "default", style: { text: "暂无数据", font: "16px Microsoft YaHei", fill: "#969799" } }];

/**
 * 获取图表配置
 * @param opeions
 * @returns
 */
export const getOption = <T extends object>(opeions: AddOrderType<T>) => {
  const { nameField, title, data } = opeions;
  const seriesData = getChartData(nameField, data);
  const option: EChartsOption = {
    title: { text: title, top: "3%", left: "center" },
    tooltip: {
      formatter: (param) => {
        return `${param.marker}${param.name}: ${param.percent}% <div style="margin-left: 14px">销售额: ${param.data.sale.toFixed(2)}万元</div>`;
      },
      ...ECHARTSTHEME.tooltip,
      trigger: "item"
    },
    legend: { top: "10%", left: "center" },
    grid: { top: "50%", bottom: "50%" },
    color: ECHARTSTHEME.barColors,
    graphic: { elements: seriesData?.length > 0 ? [] : noDataText },
    series: [
      seriesData.length > 0
        ? {
            name: title,
            type: "pie",
            radius: "50%",
            data: seriesData,
            label: {
              formatter: (param) => `${param.name} (${param.percent}%)`
            }
          }
        : { itemStyle: { opacity: 0 } }
    ]
  };
  return option;
};