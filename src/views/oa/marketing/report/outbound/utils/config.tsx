/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 16:54:26
 */

import ButtonGroup, { ButtonOptionType } from "@/components/ButtonGroup.vue";
import type { EChartsOption, SeriesOption } from "echarts";

import { FormConfigItemType } from "@/components/EditForm/index.vue";
import RangePickerYear from "@/components/RangePickerYear";
import dayjs from "dayjs";
import { getLineOption } from "@/utils/echarts";

const buttonsConfig: ButtonOptionType[] = [
  // { label: "日", value: "日" },
  { label: "周", value: "周" },
  { label: "月", value: "月" },
  { label: "季", value: "季" }
];

export const formConfigs = (): FormConfigItemType[] => {
  return [
    {
      label: "年份范围",
      prop: "years",
      style: { marginBottom: "8px" },
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => (
        <RangePickerYear picker="year" v-model:value={formModel[row.prop]} allowClear={false} style="min-width: 200px">
          {{
            renderExtraFooter: () => (
              <div class="ui-ta-r mr-10 color-ddd">
                Deogra ({dayjs().format("YYYY")}) {atob("QnkgSGFpbGVu")}
              </div>
            )
          }}
        </RangePickerYear>
      )
    },
    {
      label: "汇总周期",
      prop: "type",
      style: { marginBottom: "8px" },
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => <ButtonGroup v-model={formModel[row.prop]} buttonsConfig={buttonsConfig} style="width: 200px" />
    }
  ];
};

// 获取图表配置
export const getOption = (opeions: { data: Array<any>; xAxis: string[] }) => {
  const { data, xAxis } = opeions;
  const outMoneyList = data.filter((item) => item.Item === "销售出库金额");
  const outNumList = data.filter((item) => item.Item === "销售出库数量");

  // 销售出库金额 series
  const seriesMoney: SeriesOption[] = outMoneyList.map((item) => {
    const { Item, YearAndMonth, ...reset } = item;
    const data = Object.keys(reset).map((key) => {
      return reset[key] ? Number((reset[key] / 10000).toFixed(2)) : null;
    });
    return { name: YearAndMonth + "年", data: data };
  });

  // 销售出库数量 series
  const seriesNum: SeriesOption[] = outNumList.map((item) => {
    const { Item, YearAndMonth, ...reset } = item;
    const data = Object.keys(reset).map((key) => {
      return reset[key] ? Number((reset[key] / 10000).toFixed(2)) : null;
    });
    return { name: YearAndMonth + "年", data: data };
  });

  // 图表1
  const option1: EChartsOption = getLineOption({
    title: { text: "销售出库金额（单位：万元）" },
    xAxis: { data: xAxis },
    series: seriesMoney
  });
  // 图表2
  const option2: EChartsOption = getLineOption({
    title: { text: "销售出库数量（单位：万Pcs）" },
    xAxis: { data: xAxis },
    series: seriesNum
  });
  return { option1, option2 };
};
