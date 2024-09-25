/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2023-09-13 14:07:59
 */

import { ECHARTSTHEME } from "@/views/oa/utils/common";
import type { EChartsOption } from "echarts";

export interface AddOrderType {
  data: { name: string; value: number }[];
}

// 暂无数据时绘制提示文本
const noDataText = [{ type: "text", top: "50%", left: "40%", cursor: "default", style: { text: "暂无数据", font: "16px Microsoft YaHei", fill: "#969799" } }];

// 获取图表配置
export const getOption = (opeions: AddOrderType) => {
  const { data } = opeions;
  const option: EChartsOption = {
    tooltip: {
      formatter: (param) => {
        return `<div>${param.seriesName}</div>${param.marker}${param.name}: ${param.percent}%`;
      },
      ...ECHARTSTHEME.tooltip,
      trigger: "item"
    },
    legend: { top: "5%", left: "center" },
    color: ECHARTSTHEME.barColors,
    grid: { top: "50%", bottom: "50%" },
    graphic: { elements: data?.length > 0 ? [] : noDataText },
    series: [
      data.length > 0
        ? {
            name: "客户占比",
            type: "pie",
            radius: "50%",
            data: data,
            label: {
              formatter: (param) => `${param.name} (${param.percent}%)`
            }
          }
        : { itemStyle: { opacity: 0 } }
    ]
  };
  return option;
};
