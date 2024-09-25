/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2023-09-27 08:23:17
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
  const outMoney: number[] = []; // 销售出库金额
  const outNum: number[] = []; // 销售出库数量

  const outMoneyObj = data.find((item) => item.Item === "销售出库金额");
  Object.keys(outMoneyObj || {}).forEach((item, i) => {
    if (regExp.number2.test(outMoneyObj[i])) {
      const value1 = !outMoneyObj[i] ? 0 : outMoneyObj[i];
      outMoney.push(Number((value1 / 10000).toFixed(2)));
    }
  });

  const outNumObj = data.find((item) => item.Item === "销售出库数量");
  Object.keys(outNumObj || {}).forEach((item, i) => {
    if (regExp.number2.test(outNumObj[i])) {
      const value2 = !outNumObj[i] ? 0 : outNumObj[i];
      outNum.push(value2);
    }
  });

  // 图表1
  const option1: EChartsOption = {
    title: { text: "销售出库金额（单位：万元）" },
    legend: [{}],
    tooltip: ECHARTSTHEME.tooltip,
    xAxis: { type: "category", boundaryGap: false, data: xAxis },
    yAxis: { type: "value", axisLine: { show: true } },
    graphic: { elements: outMoney.length > 0 ? [] : noDataText },
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
    series: [
      {
        name: "销售出库金额",
        label: { show: true },
        ...ECHARTSTHEME.redLine,
        type: "line",
        smooth: true,
        data: outMoney
      }
    ]
  };

  // 图表2
  const option2: EChartsOption = {
    xAxis: { type: "category", boundaryGap: false, data: xAxis },
    title: { text: "销售出库数量（单位：Pcs）" },
    legend: [{}],
    yAxis: { type: "value", axisLine: { show: true } },
    tooltip: ECHARTSTHEME.tooltip,
    graphic: { elements: outNum.length > 0 ? [] : noDataText },
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
    series: [
      {
        name: "销售出库数量",
        label: { show: true },
        ...ECHARTSTHEME.redLine,
        type: "line",
        smooth: true,
        data: outNum
      }
    ]
  };
  return { option1, option2 };
};
