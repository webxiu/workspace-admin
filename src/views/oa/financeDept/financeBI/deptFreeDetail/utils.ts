import { ECHARTSTHEME } from "@/views/oa/utils/common";
import type { EChartsOption } from "echarts";

/**
 * 给带有M的字段数据加 % 号
 * @param data 列表数据
 */
export function formatPercent(data: Array<Record<string, any>>) {
  const newList = data.map((item) => {
    Object.keys(item).forEach((key) => {
      if (/(M)/.test(key) && typeof item[key] === "number" && item[key]) {
        item[key] = item[key] + "%";
      }
    });
    return item;
  });
  return newList;
}

/** 折线图默认配置项 */
export const chartOption: any = {
  title: { text: "" },
  tooltip: {
    trigger: "axis",
    axisPointer: { type: "cross", label: { backgroundColor: "#6a7985" } },
    // formatter: () => "xx",
    ...ECHARTSTHEME.tooltip
  },
  legend: { data: [] },
  toolbox: { feature: { saveAsImage: { title: "下载图表" } } },
  grid: { left: "3%", right: "4%", bottom: "3%", containLabel: true },
  xAxis: [{ type: "category", boundaryGap: false, data: [] }],
  yAxis: [{ type: "value" }],
  series: []
};
