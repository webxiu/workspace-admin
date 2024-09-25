/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2023-09-27 08:23:37
 */

import { ECHARTSTHEME } from "@/views/oa/utils/common";
import type { EChartsOption } from "echarts";
import regExp from "@/utils/regExp";

export interface AddOrderType {
  data: Array<any>;
  xAxis: string[];
}

// 暂无数据时绘制提示文本
const noDataText = [{ type: "text", top: "50%", left: "40%", cursor: "default", style: { text: "暂无数据", font: "16px Microsoft YaHei", fill: "#969799" } }];

// 获取图表配置
export const getOption = (opeions: AddOrderType) => {
  const { data, xAxis } = opeions;
  const accessory: number[] = [];
  const machine: number[] = [];
  const keyList = Object.keys(data[0] || {});
  keyList.forEach((item, i) => {
    if (regExp.number2.test(data[0][i])) {
      const value1 = !data[0][i] ? 0 : data[0][i];
      const value2 = !data[1][i] ? 0 : data[1][i];
      accessory.push(value1); //配件
      machine.push(value2); // 整机
    }
  });

  const option: EChartsOption = {
    title: { text: "新增销售订单数量（单位：Pcs）" },
    legend: [{}],
    xAxis: { type: "category", boundaryGap: false, data: xAxis },
    yAxis: { type: "value", axisLine: { show: true } },
    tooltip: { trigger: "axis", ...ECHARTSTHEME.tooltip },
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
    graphic: { elements: keyList?.length > 0 ? [] : noDataText },
    series: [
      {
        name: "配件",
        label: { show: true, formatter: (data) => `${data.value}` },
        type: "line",
        smooth: true,
        data: accessory,
        ...ECHARTSTHEME.redLine
      },
      {
        name: "整机",
        label: { show: true },
        type: "line",
        smooth: true,
        data: machine,
        ...ECHARTSTHEME.blackLine
      }
    ]
  };
  return option;
};
