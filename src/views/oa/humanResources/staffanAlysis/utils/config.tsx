/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-06-17 17:27:51
 */

import { ECHARTSTHEME } from "@/views/oa/utils/common";
import type { EChartsOption } from "echarts";
import { StaffAnalysisType } from "@/api/oaManage/humanResources";

export interface AddOrderType {
  data: Array<any>;
  xAxis: string[];
}

// 暂无数据时绘制提示文本
const noDataText = [{ type: "text", top: "50%", left: "40%", cursor: "default", style: { text: "暂无数据", font: "16px Microsoft YaHei", fill: "#969799" } }];

// 获取暂无数据文本
const graphicFn = (arr: any[]) => {
  return { elements: arr?.length > 0 ? [] : noDataText };
};

/** 折线图与柱状图配置参数类型 */
export interface LineBarConfigType {
  // 图表名称
  name: string;
  // x轴坐标
  xAxis: string[];
  // 数据
  data: any;
  // 类型
  type?: "line" | "bar" | any;
  // 是否填充区域
  showArea?: boolean;
}

/**
 * 折线图与柱状图配置(默认显示线图)
 * @param option 配置项
 */
const getLineBarConfig = (option: LineBarConfigType): EChartsOption => {
  const { name, xAxis, data, type = "line", showArea = false } = option;
  const areaStyle = showArea ? { areaStyle: {} } : {};
  return {
    xAxis: { type: "category", boundaryGap: true, data: xAxis },
    legend: [{}],
    yAxis: { type: "value" },
    tooltip: { trigger: "axis", ...ECHARTSTHEME.tooltip },
    graphic: graphicFn(data),
    grid: { left: "0%", right: "0%", bottom: "3%", containLabel: true },
    toolbox: {
      feature: {
        magicType: { type: ["line", "bar"], title: { bar: "切换为柱状图", line: "切换为折线图" } },
        saveAsImage: { title: "保存为图片" },
        dataView: { show: true, title: "数据视图", lang: ["数据视图", "关闭", "刷新"] }
      }
    },
    series: [{ name: name, type: type, label: { show: true }, smooth: true, barWidth: "40%", data: data, ...areaStyle, ...ECHARTSTHEME.redLine }]
  };
};

// 获取图表配置
export const getOption = (data: StaffAnalysisType) => {
  /** 性别-数据 */
  const sexData = data.sex.map((item) => ({ name: item.sex, value: item.rowCount }));
  /** 婚姻-数据状态 */
  const marryData = data.marital.map((item) => ({ name: item.marital, value: item.rowCount }));
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

  /** 性别图表配置 */
  const option1: EChartsOption = {
    tooltip: { ...ECHARTSTHEME.tooltip, trigger: "item" },
    legend: { top: "5%", left: "center" },
    graphic: graphicFn(sexData),
    color: ECHARTSTHEME.barColors,
    series: [{ name: "性别", type: "pie", radius: "50%", data: sexData }]
  };

  /** 婚姻状态图表配置 */
  const option2: EChartsOption = {
    tooltip: { ...ECHARTSTHEME.tooltip, trigger: "item" },
    legend: { top: "5%", left: "center" },
    graphic: graphicFn(marryData),
    color: ECHARTSTHEME.barColors,
    series: [{ name: "婚姻状态", type: "pie", radius: "50%", data: marryData }]
  };

  /** 学历图表配置 */
  const option3: EChartsOption = getLineBarConfig({
    type: "bar",
    name: "学历",
    xAxis: educationData.xAxis,
    data: educationData.data
  });

  /** 年龄图表配置 */
  const option4: EChartsOption = getLineBarConfig({
    type: "line",
    name: "年龄",
    xAxis: ageData.xAxis,
    data: ageData.data,
    showArea: true
  });

  /** 民族图表配置 */
  const option5: EChartsOption = getLineBarConfig({
    type: "bar",
    name: "民族",
    xAxis: nationData.xAxis,
    data: nationData.data
  });

  /** 工龄图表配置 */
  const option6: EChartsOption = getLineBarConfig({
    type: "line",
    name: "工龄",
    xAxis: workAgeData.xAxis.reverse(),
    data: workAgeData.data.reverse()
  });

  /** 户口图表配置 */
  const option7: EChartsOption = getLineBarConfig({
    type: "bar",
    name: "户口",
    xAxis: provinceData.xAxis,
    data: provinceData.data
  });
  return { option1, option2, option3, option4, option5, option6, option7 };
};
