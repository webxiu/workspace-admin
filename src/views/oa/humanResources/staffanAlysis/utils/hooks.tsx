import * as echarts from "echarts";

import { onMounted, ref } from "vue";

import type { ECharts } from "echarts";
import { debounce } from "@/utils/common";
import { getOption } from "./config";
import { markRaw } from "vue";
import { message } from "@/utils/message";
import { staffAnalysis } from "@/api/oaManage/humanResources";

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const chartRef1 = ref<HTMLElement>();
  const chartRef2 = ref<HTMLElement>();
  const chartRef3 = ref<HTMLElement>();
  const chartRef4 = ref<HTMLElement>();
  const chartRef5 = ref<HTMLElement>();
  const chartRef6 = ref<HTMLElement>();
  const chartRef7 = ref<HTMLElement>();
  const chartInstance1 = ref<ECharts>();
  const chartInstance2 = ref<ECharts>();
  const chartInstance3 = ref<ECharts>();
  const chartInstance4 = ref<ECharts>();
  const chartInstance5 = ref<ECharts>();
  const chartInstance6 = ref<ECharts>();
  const chartInstance7 = ref<ECharts>();

  onMounted(() => {
    getDataList();
    if (chartRef1.value) chartInstance1.value = markRaw(echarts.init(chartRef1.value));
    if (chartRef2.value) chartInstance2.value = markRaw(echarts.init(chartRef2.value));
    if (chartRef3.value) chartInstance3.value = markRaw(echarts.init(chartRef3.value));
    if (chartRef4.value) chartInstance4.value = markRaw(echarts.init(chartRef4.value));
    if (chartRef5.value) chartInstance5.value = markRaw(echarts.init(chartRef5.value));
    if (chartRef6.value) chartInstance6.value = markRaw(echarts.init(chartRef6.value));
    if (chartRef7.value) chartInstance7.value = markRaw(echarts.init(chartRef7.value));
    window.onresize = debounce(() => {
      chartInstance1.value?.resize();
      chartInstance2.value?.resize();
      chartInstance3.value?.resize();
      chartInstance4.value?.resize();
      chartInstance5.value?.resize();
      chartInstance6.value?.resize();
      chartInstance7.value?.resize();
    }, 300);
  });

  const getDataList = () => {
    loading.value = true;
    staffAnalysis()
      .then((res) => {
        if (!res.data) return message("数据获取失败", { type: "error" });
        loading.value = false;
        const { option1, option2, option3, option4, option5, option6, option7 } = getOption(res.data);
        chartInstance1.value?.setOption(option1, true);
        chartInstance2.value?.setOption(option2, true);
        chartInstance3.value?.setOption(option3, true);
        chartInstance4.value?.setOption(option4, true);
        chartInstance5.value?.setOption(option5, true);
        chartInstance6.value?.setOption(option6, true);
        chartInstance7.value?.setOption(option7, true);
      })
      .catch(() => (loading.value = false));
  };

  return { loading, chartRef1, chartRef2, chartRef3, chartRef4, chartRef5, chartRef6, chartRef7 };
};
