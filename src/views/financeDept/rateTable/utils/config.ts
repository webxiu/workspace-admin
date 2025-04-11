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
  const usd: number[] = [];
  const eur: number[] = [];
  const jpy: number[] = [];
  const hkd: number[] = [];
  const gbp: number[] = [];
  const aud: number[] = [];
  const cad: number[] = [];
  const keyList = Object.keys(data[0] || {});
  keyList.forEach((item, i) => {
    if (regExp.number2.test(data[0][i])) {
      const value1 = !data[0][i] ? 0 : data[0][i];
      const value2 = !data[1][i] ? 0 : data[1][i];
      const value3 = !data[2][i] ? 0 : data[2][i];
      const value4 = !data[3][i] ? 0 : data[3][i];
      const value5 = !data[4][i] ? 0 : data[4][i];
      const value6 = !data[5][i] ? 0 : data[5][i];
      const value7 = !data[6][i] ? 0 : data[6][i];
      usd.push(value1); //美元
      eur.push(value2); // 欧元
      jpy.push(value3); // 日元
      hkd.push(value4); // 港元
      gbp.push(value5); // 英镑
      aud.push(value6); // 澳元
      cad.push(value7); // 加元
    }
  });
  const option: EChartsOption = getLineOption({
    xAxis: { data: xAxis,axisTick:{show:false}, axisLine:{show:false} },
    yAxis:{show:false,axisLabel:{show:false}},
    grid:{
      left: 35,
      right: 35,
    },
    series: [
      { name: "美元", data: usd },
      { name: "欧元", data: eur },
      { name: "日元", data: jpy },
      { name: "港元", data: hkd },
      { name: "英镑", data: gbp },
      { name: "澳元", data: aud },
      { name: "加元", data: cad },
    ]
  });
  return option;
};
