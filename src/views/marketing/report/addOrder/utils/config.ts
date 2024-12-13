/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 15:48:58
 */

import type { EChartsOption } from "echarts";
import { getLineOption } from "@/utils/echarts";
import regExp from "@/utils/regExp";

// 获取图表配置
export const getOption = (opeions: { data: Array<any>; xAxis: string[] }) => {
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
  const option1: EChartsOption = getLineOption({
    title: { text: "新增销售订单数量（单位：Pcs）" },
    xAxis: { data: xAxis },
    series: [
      { name: "配件", data: accessory },
      { name: "整机", data: machine }
    ]
  });
  return option1;
};
