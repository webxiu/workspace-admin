/*
 * @Author: lixiuhai
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: lixiuhai
 * @Last Modified time: 2024-04-19 11:58:42
 */

import "echarts-liquidfill";

import * as echarts from "echarts";

import type { EChartsOption, SeriesOption } from "echarts";

import { throttle } from "@/utils/common";
import top1 from "@/assets/dataScreen/top1.png";
import top2 from "@/assets/dataScreen/top2.png";
import top3 from "@/assets/dataScreen/top3.png";
import top4 from "@/assets/dataScreen/top4.png";

export interface DataType {
  name: string;
  value: number | string;
}

export interface OptionsType<T> {
  data: T[];
  type: "bar" | "line" | "pie";
  xAxis?: string[];
  selector: string;
  text: string;
}

// 暂无数据时绘制提示文本
const noDataText = [
  {
    type: "text",
    top: "50%",
    left: "40%",
    cursor: "default",
    style: {
      text: "暂无数据",
      font: "16px Microsoft YaHei",
      fill: "#969799"
    }
  }
];

const chartInsArr = []; // 图表实例

// 饼图和线图
export const optionLine = (opeions: OptionsType<DataType>) => {
  const { selector, data, xAxis, type, text } = opeions;
  const oDom = document.querySelector(selector) as HTMLDivElement;
  const chartIns = echarts.init(oDom, "dark", { renderer: "canvas", useDirtyRect: false });
  chartInsArr.push(chartIns);

  const option: EChartsOption = {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    title: { text: text, top: 5 },
    legend: [{ top: "35px" }],
    tooltip: { trigger: "axis" },
    grid: { top: 50, left: "3%", right: "3%", bottom: "5%", containLabel: true },
    xAxis: { type: "category", boundaryGap: false, data: xAxis },
    yAxis: { type: "value" },
    graphic: { elements: data.length ? [] : noDataText },
    series: [{ type: type, label: { show: true }, smooth: true, data: data }] as SeriesOption
  };
  chartIns.setOption(option);
};
// 饼图
export const optionPie = (opeions: OptionsType<DataType>) => {
  const { selector, data, type, text } = opeions;
  const oDom = document.querySelector(selector) as HTMLDivElement;
  const chartIns = echarts.init(oDom, "dark", { renderer: "canvas", useDirtyRect: false });
  chartInsArr.push(chartIns);

  const option = {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    title: { text: text, top: 5 },
    tooltip: { trigger: "item", backgroundColor: "rgba(0,0,0,0.6)", borderColor: "transparent", textStyle: { color: "#fff" } },
    legend: { top: "5%", left: "center" },
    color: ["#c23531", "#2f4554", "#61a0a8", "#d48265", "#91c7ae", "#749f83", "#ca8622", "#bda29a"],
    grid: { top: "50%", bottom: "50%" },
    graphic: { elements: data.length ? [] : noDataText },
    series: [{ name: "客户占比", type: "pie", radius: "50%", data: data, label: {} }]
  } as EChartsOption;
  chartIns.setOption(option);
};

export interface ProcessItemType {
  value: number;
  name: string;
  percentage: string;
  maxValue: number;
}

// 进度条
export const optionProcess = (opeions: OptionsType<ProcessItemType>) => {
  const { selector, data: mData, type, text } = opeions;
  const oDom = document.querySelector(selector) as HTMLDivElement;
  const chartIns = echarts.init(oDom, "dark", { renderer: "canvas", useDirtyRect: false });
  chartInsArr.push(chartIns);

  const colors = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
  const option = {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    grid: { top: "5%", left: "7%", right: "4%", bottom: "1%", containLabel: true },
    xAxis: {
      type: "value",
      axisLine: { show: false, lineStyle: { color: "white" } },
      nameGap: 1,
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false, fontSize: 16 },
      triggerEvent: false
    },
    yAxis: [
      {
        show: true,
        data: mData.map((A) => A.name),
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
          formatter: (data) => (data >= 10000 ? (data / 10000).toFixed(2) + "w" : data + "")
        },
        axisLine: { show: false },
        splitLine: { show: false },
        axisTick: { show: false },
        triggerEvent: false
      }
    ],
    series: [
      {
        name: "条",
        type: type,
        yAxisIndex: 0,
        data: mData,
        barWidth: 12,
        itemStyle: { borderRadius: 30, color: (data) => colors[data.dataIndex % colors.length] },
        label: { show: true, position: [12, 0], lineHeight: 14, color: "#fff", formatter: (data) => data.data.percentage }
      },
      {
        name: "框",
        type: type,
        yAxisIndex: 1,
        data: mData.map((A) => (A.maxValue ? A.maxValue : 5)),
        barWidth: 18,
        itemStyle: { color: "none", borderColor: "#00c1de", borderWidth: 1, borderRadius: 15 },
        silent: true
      }
    ]
  } as EChartsOption;
  chartIns.setOption(option);
};
// 访问量(区域填充)
export const optionLineArea = (opeions: OptionsType<ProcessItemType>) => {
  const { selector, data: mData, type, text } = opeions;
  const oDom = document.querySelector(selector) as HTMLDivElement;
  const chartIns = echarts.init(oDom, "dark", { renderer: "canvas", useDirtyRect: false });
  chartInsArr.push(chartIns);

  const option = {
    backgroundColor: "rgba(128, 128, 128, 0.1)",
    tooltip: {
      trigger: "axis",
      confine: true,
      formatter: (data) => {
        const item = data[0];
        return `<div class="line-chart-bg">
            <span style="">${item.name} <i >${item.value}</i> 人次访问</span>
        </div>`;
      },
      backgroundColor: "transparent",
      borderColor: "transparent",
      axisPointer: { lineStyle: { type: "dashed" }, snap: true },
      extraCssText: "box-shadow: none;padding:0"
    },
    grid: { top: "15%", left: "5%", right: "5%", bottom: "15%" },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        axisLine: { show: true, symbol: ["none", "arrow"], symbolOffset: [0, 30], lineStyle: { color: "#233653", shadowOffsetX: 20, shadowColor: "#233653" } },
        axisLabel: { color: "#7ec7ff", padding: 0, fontSize: 12 },
        splitLine: { show: false, lineStyle: { color: "#192a44" } },
        axisTick: { show: false },
        data: [
          "04/18",
          "04/19",
          "04/20",
          "04/21",
          "04/22",
          "04/23",
          "04/24",
          "04/25",
          "04/26",
          "04/27",
          "04/28",
          "04/29",
          "04/30",
          "05/01",
          "05/02",
          "05/03",
          "05/04",
          "05/05",
          "05/06",
          "05/07",
          "05/08",
          "05/09",
          "05/10",
          "05/11",
          "05/12",
          "05/13",
          "05/14",
          "05/15",
          "05/16",
          "05/17"
        ]
      }
    ],
    yAxis: [
      {
        name: "(访问量)",
        nameTextStyle: {
          color: "#7ec7ff",
          fontSize: 12,
          padding: [0, 30, -4, 0]
        },
        minInterval: 1,
        splitLine: {
          show: false,
          lineStyle: {
            color: "#192a44"
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: "#233653"
          }
        },
        axisLabel: {
          show: true,
          color: "#7ec7ff",
          padding: 0
        },
        axisTick: {
          show: false
        }
      }
    ],
    series: [
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      },
      {
        name: "",
        type: "line",
        symbol: "circle",
        showSymbol: false,
        smooth: true,
        lineStyle: {
          width: 1,
          color: "#707070",
          borderColor: "#707070"
        },
        itemStyle: {
          color: "#F5B348",
          shadowColor: "rgba(245, 179, 72, 0.3)",
          shadowBlur: 3
        },
        emphasis: {
          scale: true
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: "#846B38"
              },
              {
                offset: 0.5,
                color: "#403E47"
              },
              {
                offset: 1,
                color: "#11144E"
              }
            ],
            global: false
          },
          shadowColor: "rgba(255, 199, 37, 0)",
          shadowBlur: 20
        },
        data: [
          34628, 5162, 145029, 26820, 67064, 65575, 29592, 65302, 61623, 239, 97788, 170794, 167632, 125468, 171695, 43661, 161603, 101833, 96046, 97861, 73739, 60426, 22671, 197401, 43481, 130226,
          177665, 137297, 40977, 121454, 60693
        ]
      }
    ]
  } as EChartsOption;
  chartIns.setOption(option);
};
// 预约量(水波效果)
export const optionWave = (opeions: OptionsType<DataType>) => {
  const { selector, data: mData, type, text } = opeions;
  const oDom = document.querySelector(selector) as HTMLDivElement;
  const chartIns = echarts.init(oDom, "dark", { renderer: "canvas", useDirtyRect: false });
  chartInsArr.push(chartIns);

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
    grid: {
      top: "0",
      left: "0px",
      right: "0px",
      bottom: "0",
      containLabel: true
    },
    polar: {
      radius: ["75%", "85%"],
      center: ["50%", "50%"]
    },
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
          itemStyle: {
            borderWidth: 2,
            borderColor: "#31d8d5",
            shadowBlur: 20,
            shadowColor: "#50c1a7"
          }
        },
        label: {
          show: false
        },
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
  chartIns.setOption(option);
};

window.onresize = throttle(() => {
  chartInsArr.forEach((chart) => chart?.resize());
}, 50);
