/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2023-09-27 08:23:05
 */

import { ECHARTSTHEME } from "@/views/oa/utils/common";
import type { EChartsOption } from "echarts";
import dayjs from "dayjs";

export interface ChartOptionType {
  curYear: string;
  data: Array<any>;
}

// 暂无数据时绘制提示文本
const noDataText = [{ type: "text", top: "50%", left: "40%", cursor: "default", style: { text: "暂无数据", font: "16px Microsoft YaHei", fill: "#969799" } }];

// 获取图表配置
export const getOption = (opeions: ChartOptionType) => {
  const { curYear, data } = opeions;
  const xAxis: string[] = [];
  const curMont = dayjs().startOf("month").format("M");
  const series = data.map((item, index) => {
    const { year, FShortName, ...resetMonth } = item;
    const monthKeys = Object.keys(resetMonth);
    const itemData = monthKeys.map((key, idx) => {
      if (index === 0) xAxis.push(`${idx + 1}月`);
      if (!item[key] && year === Number(curYear) && idx + 1 >= Number(curMont)) {
        return null;
      }
      return item[key] ? item[key].toFixed(2) : 0;
    });

    return {
      name: year,
      label: { show: true },
      type: "line",
      smooth: true,
      data: itemData
    };
  });

  const option: EChartsOption = {
    title: { text: `${curYear}客户趋势(单位:万元)`, top: 10, left: 10 },
    legend: [{ top: 10 }],
    xAxis: { type: "category", boundaryGap: false, data: xAxis },
    yAxis: { type: "value", axisLine: { show: true } },
    color: [ECHARTSTHEME.redLine.lineStyle.color, ECHARTSTHEME.blackLine.lineStyle.color, ECHARTSTHEME.grayGreenLine.lineStyle.color],
    tooltip: { trigger: "axis", ...ECHARTSTHEME.tooltip },
    graphic: { elements: data.length > 0 ? [] : noDataText },
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
    series: series as any
  };
  return option;
};
