/*
 * @Author: Hailen
 * @Date: 2023-06-23 09:57:10
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 10:56:40
 */

import ButtonGroup, { ButtonOptionType } from "@/components/ButtonGroup.vue";
import type { EChartsOption, SeriesOption } from "echarts";
import { getCirclePidOption, getLineOption } from "@/utils/echarts";

import { FormConfigItemType } from "@/components/EditForm/index.vue";

const buttonsConfig: ButtonOptionType[] = [
  { label: "材料", value: 1 },
  { label: "成品", value: 2 },
  { label: "半成品", value: 3 }
];

export const formConfigs = ({ onChange }): FormConfigItemType[] => {
  return [
    {
      label: "年份",
      prop: "year",
      style: { marginBottom: "8px", marginRight: 0 },
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => (
        <el-date-picker
          v-model={formModel[row.prop]}
          type="year"
          format="YYYY"
          value-format="YYYY"
          placeholder="选择年份"
          onChange={onChange}
          clearable={false}
        />
      )
    },
    {
      label: "",
      prop: "type",
      style: { marginBottom: "8px" },
      labelWidth: 0,
      slots: { label: ({ label }) => <span class="fw-700">{label}</span> },
      render: ({ formModel, row }) => (
        <ButtonGroup v-model={formModel[row.prop]} buttonsConfig={buttonsConfig} onChange={onChange} color={"#009688"} style="width: 200px" />
      )
    }
  ];
};

// 获取图表配置
export const getOption = (data: Array<any>, formData) => {
  const xAxis: string[] = new Array(12).fill(0).map((_, i) => `${i + 1}月`);

  const totalList = data.filter((m) => ["合计"].includes(m.ITEM));
  const monthList = data
    .map((m) => {
      const value = m[formData.month] ? Number((m[formData.month] / 10000).toFixed(2)) : null;
      return { value: value, name: m.ITEM };
    })
    .filter((m) => !["合计"].includes(m.name))
    .slice(0, 8);

  // 材料库存金额(合计)
  const seriesTotal: SeriesOption[] = totalList.map((item) => {
    const { FYEAR, Item, CURMONTH, ...reset } = item;
    const data = Object.keys(reset).map((key) => {
      return reset[key] ? Number((reset[key] / 10000).toFixed(2)) : null;
    });
    return { name: "材料库存金额", data: data };
  });

  // 图表1
  const option1: EChartsOption = getLineOption({
    title: { text: `${formData.year}年材料库存金额（单位：万元）` },
    xAxis: { data: xAxis },
    series: seriesTotal
  });
  // 图表2
  const option2: EChartsOption = getCirclePidOption({
    title: { text: `${formData.month}月材料库存金额（单位：万元）` },
    series: [{ data: monthList }]
  });
  return { option1, option2 };
};
