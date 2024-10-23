/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 11:07:49
 */

import { getLineOption, getPidOption } from "@/utils/echarts";

import type { EChartsOption } from "echarts";
import { StaffAnalysisType } from "@/api/oaManage/humanResources";

// 获取图表配置
export const getOption = (data: StaffAnalysisType) => {
  /** 性别-数据 */
  const sexData = data.sex.map((item) => ({ name: item.sex, value: item.rowCount }));
  /** 婚姻-数据状态 */
  const marryData = data.marital.map((item) => ({ name: item.marital || "其他", value: item.rowCount }));
  /** 学历-数据 */
  const educationData = data.education.reduce(
    (cur, prev) => {
      cur.xAxis.push(prev.education);
      cur.data.push(prev.rowCount);
      return cur;
    },
    { xAxis: [], data: [] }
  );
  /** 年龄-数据 */
  const ageData = data.age.reduce(
    (cur, prev) => {
      cur.xAxis.push(prev.age);
      cur.data.push(prev.rowCount);
      return cur;
    },
    { xAxis: [], data: [] }
  );
  /** 民族-数据 */
  const nationData = data.nation.reduce(
    (cur, prev) => {
      if (prev.nation) {
        cur.xAxis.push(prev.nation);
        cur.data.push(prev.rowCount);
      }
      return cur;
    },
    { xAxis: [], data: [] }
  );
  /** 工龄-数据 */
  const workAgeData = data.workingAge.reduce(
    (cur, prev) => {
      cur.xAxis.push(prev.workingAge);
      cur.data.push(prev.rowCount);
      return cur;
    },
    { xAxis: [], data: [] }
  );
  /** 户口-数据 */
  const provinceData = data.province.reduce(
    (cur, prev) => {
      cur.xAxis.push(prev.province);
      cur.data.push(prev.rowCount);
      return cur;
    },
    { xAxis: [], data: [] }
  );

  /** ======================== 图表配置 ======================== */

  /** 性别图表 */
  const option1: EChartsOption = getPidOption({ series: [{ name: "性别", data: sexData }] });

  /** 婚姻状态图表 */
  const option2: EChartsOption = getPidOption({ series: [{ name: "婚姻状态", data: marryData }] });

  /** 学历图表 */
  const option3: EChartsOption = getLineOption({
    xAxis: { data: educationData.xAxis },
    series: [{ name: "学历", type: "bar", data: educationData.data }]
  });

  /** 年龄图表(区域渐变) */
  const option4: EChartsOption = getLineOption({
    xAxis: { data: ageData.xAxis },
    tooltip: {
      trigger: "axis",
      confine: true,
      transitionDuration: 0,
      borderRadius: 8,
      borderWidth: 2,
      padding: [4, 6],
      axisPointer: { type: "line", lineStyle: { type: "dashed", color: "#f0f" } }
    },
    series: [
      {
        name: "年龄",
        type: "line",
        data: ageData.data,
        lineStyle: { width: 2 },
        itemStyle: { color: "#1cc840", borderWidth: 4 },
        emphasis: {
          itemStyle: {
            color: "#00ff00",
            borderColor: "rgb(0, 255, 0)",
            borderWidth: 4,
            shadowBlur: 5,
            shadowColor: "#00f"
          }
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(137, 189, 27, 0.8)" },
              { offset: 0.5, color: "rgba(137, 189, 27, 0.3)" },
              { offset: 1, color: "rgba(137, 189, 27, 0)" }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 10
        }
      }
    ]
  });

  /** 民族图表 */
  const option5: EChartsOption = getLineOption({
    xAxis: { data: nationData.xAxis },
    series: [{ name: "民族", type: "bar", data: nationData.data, itemStyle: { color: "#c6423e" } }]
  });

  /** 工龄图表 */
  const option6: EChartsOption = getLineOption({
    xAxis: { data: workAgeData.xAxis.reverse() },
    series: [{ name: "工龄", type: "line", data: workAgeData.data.reverse() }]
  });

  /** 户口图表 */
  const option7: EChartsOption = getLineOption({
    xAxis: { data: provinceData.xAxis },
    series: [{ name: "户口", type: "bar", data: provinceData.data }]
  });

  return { option1, option2, option3, option4, option5, option6, option7 };
};
