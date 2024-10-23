/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 10:28:53
 */

import { ECHARTSTHEME } from "@/views/oa/utils/common";
import type { EChartsOption } from "echarts";
import { FormConfigItemType } from "@/components/EditForm/index.vue";
import RangePickerYear from "@/components/RangePickerYear";
import dayjs from "dayjs";
import { getLineOption } from "@/utils/echarts";

export const formConfigs = ({ onOpenChange, onEnter }): FormConfigItemType[] => {
  return [
    {
      label: "年份范围",
      prop: "date",
      style: { marginBottom: "8px", marginRight: "15px" },
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => (
        <RangePickerYear picker="year" v-model:value={formModel[row.prop]} onOpenChange={onOpenChange} allowClear={false} style="width:190px" />
      )
    },
    {
      label: "搜索",
      prop: "FNUMBER",
      style: { marginBottom: "8px", marginRight: "15px" },
      render: ({ formModel, row }) => (
        <el-input
          v-model={formModel[row.prop]}
          onKeyup={({ key }: KeyboardEvent) => key === "Enter" && onEnter()}
          placeholder="输入客户编码或名称"
          clearable
          style="width: 160px"
        />
      )
    }
  ];
};

export interface ChartOptionType {
  curYear: string;
  data: Array<any>;
}

// 获取图表配置
export const getOption = (opeions: ChartOptionType) => {
  const { curYear, data } = opeions;
  const xAxis: string[] = [];
  const curMont = dayjs().startOf("month").format("M");
  const series = data.map((item, index) => {
    const { year, FShortName, ...resetMonth } = item;
    const monthKeys = Object.keys(resetMonth);
    const itemData = monthKeys.map((key, idx) => {
      if (index === 0) xAxis.push(`${idx + 1}月`);
      if (!item[key] && year === Number(curYear) && idx + 1 >= Number(curMont)) {
        return null;
      }
      return item[key] ? item[key].toFixed(2) : 0;
    });
    return { name: year, data: itemData };
  });

  const option: EChartsOption = getLineOption({
    title: { text: `${curYear}客户趋势(单位:万元)` },
    xAxis: { data: xAxis },
    series: series
  });
  return option;
};
