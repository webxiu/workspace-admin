/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-04-29 17:41:45
 */

import "echarts-liquidfill";
import { type EChartsOption, type SeriesOption } from "echarts";
import { h } from "vue";
import top1 from "@/assets/dataScreen/top1.png";
import top2 from "@/assets/dataScreen/top2.png";
import top3 from "@/assets/dataScreen/top3.png";
import top4 from "@/assets/dataScreen/top4.png";

export interface DataType {
  name: string;
  value: number | string;
}

export interface ParamType {
  tipName?: string;
}

export interface OptionsType<T> {
  data: T[];
  type?: "bar" | "line" | "pie";
  xAxis?: string[];
  /** 图表标题 */
  text?: string;
  /** 额外参数 */
  param?: ParamType;
}

// 暂无数据时绘制提示文本
const noDataText = [
  {
    type: "text",
    top: "50%",
    left: "40%",
    cursor: "default",
    style: { text: "暂无数据", font: "16px Microsoft YaHei", fill: "#969799" }
  }
];

export const emptyMsg = h("div", { style: { opacity: 0.5, fontSize: "12px", position: "absolute" } }, "暂无数据");

/** 柱状图和线图 */
export function optionLine(opeions: OptionsType<DataType>) {
  const { data, xAxis, type, text } = opeions;
  const option: EChartsOption = {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    title: { text, top: 5, left: "center", textStyle: { fontSize: 15 } },
    legend: [{ top: "35px" }],
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(117,74,125,0.3)",
      textStyle: { color: "#fff" },
      borderColor: "#525ba5",
      borderRadius: 8,
      formatter: (data) => {
        const item = data[0];
        return `审批人: ${item.name}</br>审批量: ${item.value}单`;
      }
    },
    grid: { top: 50, left: "3%", right: "3%", bottom: "3%", containLabel: true },
    xAxis: { type: "category", boundaryGap: true, data: xAxis, axisLabel: { interval: 0 } },
    yAxis: { type: "value" },
    graphic: { elements: data.length ? [] : noDataText },
    series: [
      {
        type: type,
        smooth: true,
        data: data,
        itemStyle: { borderRadius: 4 },
        label: { show: true, color: "#bf0", fontSize: 16, position: "top" }
      }
    ] as SeriesOption
  };
  return option;
}
/** 饼图 */
export function optionPie(opeions: OptionsType<DataType>) {
  const { data, type, text } = opeions;
  const option = {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    title: { text, top: 5, left: "center", textStyle: { fontSize: 15 } },
    tooltip: { trigger: "item", backgroundColor: "rgba(0,0,0,0.6)", borderColor: "transparent", textStyle: { color: "#fff" } },
    legend: { top: "50", orient: "vertical", left: "left" },
    color: ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae", "#749f83", "#ca8622", "#bda29a"],
    grid: { top: "60%", left: "20%", bottom: "50%" },
    graphic: { elements: data.length ? [] : noDataText },
    series: [{ name: "", type: "pie", radius: "50%", data: data, label: {} }]
  } as EChartsOption;
  return option;
}

export interface ProcessItemType {
  value: number;
  name: string;
  percentage: string;
  maxValue: number;
}

/** 排名横向柱状图 */
export function optionRank(opeions: OptionsType<ProcessItemType>) {
  const { data: mData, type, text } = opeions;
  const colors = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
  const option = {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    title: { text, top: 5, left: "center", textStyle: { fontSize: 15 } },
    grid: { top: "6%", left: "4%", right: "2%", bottom: "1%", containLabel: true },
    xAxis: {
      type: "value",
      axisLine: { show: false, lineStyle: { color: "#fff" } },
      nameGap: 1,
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false, fontSize: 16 },
      triggerEvent: false
    },
    yAxis: [
      {
        show: true,
        data: mData.map((data) => data.name),
        inverse: true,
        axisLine: { show: false },
        splitLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: "#fff",
          formatter: (data) => {
            const name = data.length > 6 ? data.slice(0, 6) + "..." : data;
            const idx = mData.map((m) => m.name).indexOf(data) + 1;
            return ["{" + (idx > 3 ? "lg" : "lg" + idx) + "|NO." + idx + "}", "{title|" + name + "}"].join(" ");
          },
          rich: {
            lg1: { width: 60, backgroundColor: { image: top1 }, color: "#fff", align: "center", height: 20, fontSize: 13 },
            lg2: { width: 60, backgroundColor: { image: top2 }, color: "#fff", align: "center", height: 20, fontSize: 13 },
            lg3: { width: 60, backgroundColor: { image: top3 }, color: "#fff", align: "center", height: 20, fontSize: 13 },
            lg: { width: 60, backgroundColor: { image: top4 }, color: "#fff", align: "center", height: 20, fontSize: 13 },
            title: { width: 60, fontSize: 13, align: "center", padding: [0, 10, 0, 15] }
          }
        },
        triggerEvent: false
      },
      {
        show: true,
        inverse: true,
        data: mData,
        axisLabel: {
          fontSize: 14,
          color: "#fff",
          margin: 20,
          align: "right",
          padding: [0, -80, 0, 0],
          formatter: (data, index) => {
            const item = mData[index] as any;
            return `{year|${item.totalApprovalTime}}/{month|${item.approvalCount}}`;
          },
          rich: {
            year: { color: "#fff", fontSize: 14 },
            month: { color: "#0f0", fontSize: 14 }
          }
        },
        axisLine: { show: false },
        splitLine: { show: false },
        axisTick: { show: false },
        triggerEvent: false
      }
    ],
    graphic: { elements: mData.length ? [] : noDataText },
    series: [
      {
        name: "条",
        type: type,
        yAxisIndex: 0,
        data: mData,
        barWidth: 16,
        itemStyle: { borderRadius: 30, color: (data) => colors[data.dataIndex % colors.length] },
        label: {
          // 进度条数字跳转
          show: true,
          position: [10, 0],
          lineHeight: 18,
          color: "#fff",
          formatter: (data) => data.data.percentage
        }
      },
      {
        name: "框",
        type: type,
        yAxisIndex: 1,
        data: mData.map((data) => (data.maxValue ? data.maxValue : 5)),
        barWidth: 18,
        itemStyle: { color: "none", borderColor: "#00c1de", borderWidth: 1, borderRadius: 15 },
        silent: true
      }
    ]
  } as EChartsOption;
  return option;
}
/** 曲线区域填充 */
export function optionLineArea(opeions: OptionsType<DataType>) {
  const { data: mData, text, param = {} } = opeions;
  const xAxis = mData.map((m) => m.name);
  const option = {
    title: { text, top: 5, left: "center", textStyle: { fontSize: 15 } },
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    grid: { top: "20%", left: "10%", right: "5%", bottom: "15%" },
    tooltip: {
      trigger: "axis",
      confine: true,
      transitionDuration: 0,
      backgroundColor: "rgba(83,93,105,0.5)",
      borderColor: "#535b69",
      borderRadius: 8,
      borderWidth: 2,
      padding: [4, 6],
      axisPointer: { type: "line", lineStyle: { type: "dashed", color: "#ffff00", snap: true } },
      formatter: (data) => {
        const item = data[0];
        return `<div class="line-chart-bg" style="color: #fff;">
            <span>${param.tipName}: ${item.name}</span></br>
            <span>审批效率: ${item.value}</span>
        </div>`;
      }
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLine: { show: true, symbol: ["none", "arrow"], symbolOffset: [0, 30], lineStyle: { color: "#233653", shadowOffsetX: 20, shadowColor: "#233653" } },
        axisLabel: { color: "#7ec7ff", padding: 0, fontSize: 14 },
        splitLine: { show: false, lineStyle: { color: "#192a44" } },
        axisTick: { show: false },
        data: xAxis
      }
    ],
    yAxis: [
      {
        name: `审批效率(${param.tipName})`,
        nameTextStyle: { color: "#7ec7ff", fontSize: 14, padding: [0, 0, 0, 0] },
        minInterval: 1,
        splitLine: { show: false, lineStyle: { color: "#192a44" } },
        axisLine: { show: true, lineStyle: { color: "#233653" } },
        axisLabel: { show: true, color: "#7ec7ff", padding: 0 },
        axisTick: { show: false }
      }
    ],
    graphic: { elements: mData.length ? [] : noDataText },
    series: [
      {
        name: `审批效率(${param.tipName})`,
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: { width: 2 },
        itemStyle: { color: "#1cc840", borderWidth: 4 },
        emphasis: {
          itemStyle: {
            color: "#00ff00",
            borderColor: "rgb(187, 255, 0)",
            borderWidth: 4,
            shadowBlur: 10,
            shadowColor: "#666",
            scale: true
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
              { offset: 0, color: "rgba(137, 189, 27, 0.5)" },
              { offset: 0.5, color: "rgba(137, 189, 27, 0.3)" },
              { offset: 1, color: "rgba(137, 189, 27, 0)" }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 10
        },
        data: mData
      }
    ]
  } as EChartsOption;
  return option;
}

/** 波浪水球 */
export function optionWave(opeions: OptionsType<DataType>) {
  const { data: mData, type, text } = opeions;
  const circlePercent = 60; // 环的百分比
  const option = {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    title: [
      {
        text: (0.5 * 100).toFixed(0) + "%",
        left: "49%",
        top: "35%",
        textAlign: "center",
        textStyle: {
          fontSize: "16",
          fontWeight: "normal",
          color: "#ffffff",
          align: "center",
          textBorderColor: "rgba(0, 0, 0, 0)",
          textShadowColor: "#000",
          textShadowBlur: 0,
          textShadowOffsetX: 0,
          textShadowOffsetY: 1
        }
      },
      {
        text: "预约量",
        left: "49%",
        top: "25%",
        textAlign: "center",
        textStyle: {
          fontSize: "15",
          fontWeight: "normal",
          color: "#ffffff",
          align: "center",
          textBorderColor: "rgba(0, 0, 0, 0)",
          textShadowColor: "#000",
          textShadowBlur: 0,
          textShadowOffsetX: 0,
          textShadowOffsetY: 1
        }
      }
    ],
    grid: { top: "0", left: "0px", right: "0px", bottom: "0", containLabel: true },
    polar: { radius: ["75%", "85%"], center: ["50%", "50%"] },
    angleAxis: {
      max: 120,
      clockwise: false,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false },
      startAngle: 180
    },
    radiusAxis: { type: "category", show: true, axisLabel: { show: false }, axisLine: { show: false }, axisTick: { show: false } },
    graphic: { elements: mData.length ? [] : noDataText },
    series: [
      {
        type: "liquidFill",
        radius: "70%",
        z: 2,
        center: ["50%", "50%"],
        data: mData,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#35FAB6" },
              { offset: 1, color: "rgba(40, 209, 247,0.3)" }
            ],
            global: false
          }
        },
        outline: {
          borderDistance: 0,
          itemStyle: { borderWidth: 2, borderColor: "#31d8d5", shadowBlur: 20, shadowColor: "#50c1a7" }
        },
        label: { show: false },
        backgroundStyle: {
          borderWidth: 1,
          color: {
            type: "radial",
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: "#0D2648" },
              { offset: 0.8, color: "#0D2648" },
              { offset: 1, color: "#228E7D" }
            ],
            global: false
          }
        }
      },
      {
        type: "pie",
        radius: ["80%", "80%"],
        center: ["50%", "50%"],
        z: 1,
        label: { show: false },
        silent: true,
        itemStyle: {
          borderWidth: 2,
          borderType: [8, 10],
          borderDashOffset: 15,
          borderColor: "#31d8d5",
          color: "#11144e",
          borderCap: "round"
        },
        data: [100]
      },
      { type: "bar", data: [circlePercent], z: 10, coordinateSystem: "polar", roundCap: true, color: "#31d8d5" }
    ]
  } as EChartsOption;
  return option;
}

/** 柱状图(带连线) */
export function optionLineBar(opeions: OptionsType<DataType>) {
  const { data: mData, type, text, xAxis } = opeions;
  const option = {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    title: { text, top: 5, left: "center", textStyle: { fontSize: 15 } },
    grid: { top: "20%", right: "2%", bottom: "10%", left: "8%" },
    xAxis: {
      axisTick: { show: false },
      splitLine: { show: false },
      splitArea: { show: false },
      data: xAxis,
      axisLabel: { interval: 0, fontSize: 14, fontWeight: 100, color: "#9faeb5" },
      axisLine: { lineStyle: { color: "#4d4d4d" } }
    },
    yAxis: {
      name: "审批效率",
      axisTick: { show: false },
      splitLine: { show: false },
      splitArea: { show: false },
      axisLabel: { color: "#9faeb5", fontSize: 16 },
      axisLine: { lineStyle: { color: "#4d4d4d" } }
    },
    tooltip: {
      trigger: "axis",
      transitionDuration: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      textStyle: { color: "#fff" },
      borderColor: "#525ba5",
      borderRadius: 8,
      borderWidth: 2,
      padding: [5, 10],
      formatter: function (params) {
        const item = params[0].data;
        return `<div>
            <span style="">审批人: ${item.name}</span></br>
            <span style="">平均效率: ${item.value}</span></br>
            <span style="">审批数量: ${item.approvalCount}</span></br>
            <span style="">审批耗时: ${item.totalApprovalTime || ""}</span></br>
            <span style="">排名: ${item.rank || ""}</span>
        </div>`;
      },
      axisPointer: { type: "line", lineStyle: { type: "dashed", color: "#ffff00" } }
    },
    graphic: { elements: mData.length ? [] : noDataText },
    series: [
      {
        name: "柱状图",
        type: "bar",
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "#00d386" },
              { offset: 1, color: "#0076fc" }
            ],
            globalCoord: false // 缺省为 false
          },
          borderRadius: 15
        },
        label: { show: true, position: "top", color: "#ffc72b", fontSize: 12 },
        data: mData,
        barWidth: 16
      },
      { name: "折线", type: "line", data: mData }
    ]
  };
  return option;
}
