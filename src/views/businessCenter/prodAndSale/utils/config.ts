/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2023-11-24 13:57:34
 */

import { ECHARTSTHEME } from "@/views/oa/utils/common";
import type { EChartsOption } from "echarts";
import { formatMoneyComma } from "@/utils/table";
import regExp from "@/utils/regExp";
import sale from "@/views/oa/financeDept/financeBI/financialAnalysis/components/tables/sale.vue";

export interface AddOrderType {
  data: Array<any>;
  xAxis: string[];
}

type DataLableType = { name?: string; value: number; position: string };

// 暂无数据时绘制提示文本
const noDataText = [{ type: "text", top: "50%", left: "45%", cursor: "default", style: { text: "暂无数据", font: "16px Microsoft YaHei", fill: "#969799" } }];

const getPosition = (value, list = []) => {
  const min = Math.min.apply(null, list);
  return value === min ? "bottom" : "top";
};

const labelFormatter = (params) => {
  const { data, value } = params;
  const val = formatMoneyComma(value as number, 1);
  return data.position === "bottom" ? `{bottom|${val}}` : val;
};

// 获取图表配置
export const getOption = (opeions: AddOrderType) => {
  const { data, xAxis } = opeions;
  const productValue: DataLableType[] = []; // 产值
  const salesRevenue: DataLableType[] = []; // 销售
  const amountMoney: DataLableType[] = []; //  库存
  const productValueNum: DataLableType[] = []; // 入库数量
  const salesRevenueNum: DataLableType[] = []; // 销售数量
  const amountMoneyNum: DataLableType[] = []; //  库存数量
  const productRate: DataLableType[] = []; // 产值增长率
  const saleRate: DataLableType[] = []; // 销售增长率
  const stockRate: DataLableType[] = []; // 库存增长率
  const keyList = Object.keys(data[0] || {});
  keyList.forEach((item, i) => {
    if (regExp.number2.test(data[0][i])) {
      const value1 = data[0][i];
      const value2 = data[1][i];
      const value3 = data[2][i];
      const value4 = data[3][i];
      const value5 = data[4][i];
      const value6 = data[5][i];
      const value7 = data[6][i];
      const value8 = data[7][i];
      const value9 = data[8][i];
      const group1 = [value1, value2, value3];
      const group2 = [value4, value5, value6];
      const group3 = [value7, value8, value9];
      if (value1) productValue.push({ value: value1, position: getPosition(value1, group1) });
      if (value2) salesRevenue.push({ value: value2, position: getPosition(value2, group1) });
      if (value3) amountMoney.push({ value: value3, position: getPosition(value3, group1) });
      if (value4) productValueNum.push({ value: value4, position: getPosition(value4, group2) });
      if (value5) salesRevenueNum.push({ value: value5, position: getPosition(value5, group2) });
      if (value6) amountMoneyNum.push({ value: value6, position: getPosition(value6, group2) });
      if (value7) productRate.push({ value: value7, position: getPosition(value7, group3) });
      if (value8) saleRate.push({ value: value8, position: getPosition(value8, group3) });
      if (value9) stockRate.push({ value: value9, position: getPosition(value9, group3) });
    }
  });

  const elements1 = [...productValue, ...salesRevenue, ...amountMoney].filter((f) => f.value !== null).length > 0 ? [] : noDataText;
  const elements2 = [...productValueNum, ...salesRevenueNum, ...amountMoneyNum].filter((f) => f.value !== null).length > 0 ? [] : noDataText;
  const elements3 = [...productRate, ...saleRate, ...stockRate].filter((f) => f.value !== null).length > 0 ? [] : noDataText;

  const option1: EChartsOption = {
    title: { text: "产销存趋势图（单位：万元）" },
    legend: [{}],
    xAxis: { type: "category", boundaryGap: false, data: xAxis },
    yAxis: { type: "value", axisLine: { show: true } },
    tooltip: ECHARTSTHEME.tooltip,
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
    graphic: { elements: elements1 },
    series: [
      {
        name: "产值",
        label: {
          show: true,
          formatter: labelFormatter,
          rich: { bottom: { padding: [0, 0, -50, 0] } }
        },
        type: "line",
        smooth: true,
        data: productValue,
        ...ECHARTSTHEME.greenLine
      },
      {
        name: "销售",
        label: {
          show: true,
          formatter: labelFormatter,
          rich: { bottom: { padding: [0, 0, -50, 0] } }
        },
        type: "line",
        smooth: true,
        data: salesRevenue,
        ...ECHARTSTHEME.blueLine
      },
      {
        name: "库存",
        label: {
          show: true,
          formatter: labelFormatter,
          rich: { bottom: { padding: [0, 0, -50, 0] } }
        },
        type: "line",
        smooth: true,
        data: amountMoney,
        ...ECHARTSTHEME.redLine
      }
    ]
  };
  const option2: EChartsOption = {
    title: { text: "产销存趋势图（单位：万PCS）" },
    legend: [{}],
    xAxis: { type: "category", boundaryGap: false, data: xAxis },
    yAxis: { type: "value", axisLine: { show: true } },
    tooltip: ECHARTSTHEME.tooltip,
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
    graphic: { elements: elements2 },
    series: [
      {
        name: "入库数量",
        label: {
          show: true,
          formatter: labelFormatter,
          rich: { bottom: { padding: [0, 0, -50, 0] } }
        },
        type: "line",
        smooth: true,
        data: productValueNum,
        ...ECHARTSTHEME.greenLine
      },
      {
        name: "销售数量",
        label: {
          show: true,
          formatter: labelFormatter,
          rich: { bottom: { padding: [0, 0, -50, 0] } }
        },
        type: "line",
        smooth: true,
        data: salesRevenueNum,
        ...ECHARTSTHEME.blueLine
      },
      {
        name: "库存数量",
        label: {
          show: true,
          formatter: labelFormatter,
          rich: { bottom: { padding: [0, 0, -50, 0] } }
        },
        type: "line",
        smooth: true,
        data: amountMoneyNum,
        ...ECHARTSTHEME.redLine
      }
    ]
  };
  const option3: EChartsOption = {
    title: { text: "产销存金额同比增长率（单位：%）" },
    legend: [{}],
    xAxis: { type: "category", boundaryGap: false, data: xAxis },
    yAxis: { type: "value", axisLine: { show: true } },
    tooltip: ECHARTSTHEME.tooltip,
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
    graphic: { elements: elements3 },
    series: [
      {
        name: "产值增长率",
        label: {
          show: true,
          formatter: labelFormatter,
          rich: { bottom: { padding: [0, 0, -50, 0] } }
        },
        type: "line",
        smooth: true,
        data: productRate,
        ...ECHARTSTHEME.greenLine
      },
      {
        name: "销售增长率",
        label: {
          show: true,
          formatter: labelFormatter,
          rich: { bottom: { padding: [0, 0, -50, 0] } }
        },
        type: "line",
        smooth: true,
        data: saleRate,
        ...ECHARTSTHEME.blueLine
      },
      {
        name: "库存增长率",
        label: {
          show: true,
          formatter: labelFormatter,
          rich: { bottom: { padding: [0, 0, -50, 0] } }
        },
        type: "line",
        smooth: true,
        data: stockRate,
        ...ECHARTSTHEME.redLine
      }
    ]
  };
  return { option1, option2, option3 };
};
