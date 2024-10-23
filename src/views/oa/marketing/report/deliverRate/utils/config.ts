/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 16:30:08
 */

import type { EChartsOption } from "echarts";
import { dayjs } from "element-plus";
import { getLineOption } from "@/utils/echarts";

// 暂无数据时绘制提示文本
const noDataText = [{ type: "text", top: "50%", left: "40%", cursor: "default", style: { text: "暂无数据", font: "16px Microsoft YaHei", fill: "#969799" } }];

// 获取图表配置
export const getOption = (options: { data: Array<any>; xAxis: string[]; date: string }) => {
  const { data, xAxis, date } = options;
  const year = dayjs(date).year();
  const month = dayjs(date).month() + 1;
  const outboundRatios: string[] = [];
  const planNums: string[] = [];
  const outboundNums: string[] = [];

  const outboundObj = data.find((item) => item.Item === "出库达成率");
  const planNumObj = data.find((item) => item.Item === "计划笔数");
  const outboundNumObj = data.find((item) => item.Item === "出库达成笔数");

  Object.keys(outboundObj || {}).forEach((key) => {
    if (!isNaN(parseInt(key))) outboundRatios.push((outboundObj[key] || "").replace("%", ""));
  });
  Object.keys(planNumObj || {}).forEach((key) => {
    if (!isNaN(parseInt(key))) planNums.push(planNumObj[key]);
  });

  Object.keys(outboundNumObj || {}).forEach((key) => {
    if (!isNaN(parseInt(key))) outboundNums.push(outboundNumObj[key]);
  });

  const option1: EChartsOption = getLineOption({
    title: { text: `${year}年${month}月出库达成率(单位:%)` },
    xAxis: { data: xAxis },
    series: [{ name: "出库达成率", data: outboundRatios }]
  });
  const option2: EChartsOption = getLineOption({
    title: { text: `${year}年${month}月出库笔数(单位:笔)` },
    xAxis: { data: xAxis },
    series: [
      { name: "计划笔数", data: planNums },
      { name: "达成笔数", data: outboundNums }
    ]
  });
  return { option1, option2 };
};
