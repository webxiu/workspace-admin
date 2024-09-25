/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-05-17 14:10:49
 */

import * as echarts from "echarts";

import { debounce, downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { deliverRateList, exportDeliverRate } from "@/api/oaManage/marketing";
import { downloadDataToExcel, getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { markRaw, onMounted, reactive, ref, watch } from "vue";

import { ButtonOptionType } from "@/components/ButtonGroup.vue";
import type { ECharts } from "echarts";
import { dayjs } from "element-plus";
import { getOption } from "./config";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<any[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 62 + 51);
  const activeName = ref("chart");
  const chartRef1 = ref<HTMLElement>();
  const chartRef2 = ref<HTMLElement>();
  const chartInstance1 = ref<ECharts>();
  const chartInstance2 = ref<ECharts>();

  const buttonsConfig = ref<ButtonOptionType[]>([
    { label: "日", value: "日" },
    { label: "周", value: "周" },
    { label: "月", value: "月" }
  ]);

  const formData = reactive({
    type: "月",
    date: dayjs(new Date()).startOf("month").format("YYYY-MM-DD")
  });

  onMounted(() => {
    getTableList();
    if (chartRef1.value) chartInstance1.value = markRaw(echarts.init(chartRef1.value));
    if (chartRef2.value) chartInstance2.value = markRaw(echarts.init(chartRef2.value));
    window.onresize = debounce(() => {
      chartInstance1.value?.resize();
      chartInstance2.value?.resize();
    }, 300);
  });

  watch(formData, (val) => {
    getTableList();
  });

  const getColumnConfig = async (dynamicCol: any[]) => {
    let columnData: TableColumnList[] = [{ label: "年份", prop: "YearAndMonth" }, { label: "项目", prop: "Item" }, ...dynamicCol];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    const colLen = 2; // 默认列数量
    const res = data?.slice(0, dynamicCol.length + colLen).map((item, i) => {
      const label = i >= colLen ? dynamicCol[i - colLen].label : item.label;
      const prop = i >= colLen ? dynamicCol[i - colLen].prop : item.prop;
      return { ...item, label, prop };
    });
    if (data?.length) columnData = res;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const getTableList = () => {
    loading.value = true;
    deliverRateList(formData)
      .then((res) => {
        const data = res.data;
        loading.value = false;
        dataList.value = res.data;
        const xAxis: string[] = [];
        let dynamicCol = [];
        if (data?.length) {
          const { FID, 项目, YearAndMonth, Item, Type, ...reset } = data[0];
          const colKeys = Object.keys(reset);
          dynamicCol = colKeys.map((key) => {
            const title = key + formData.type;
            xAxis.push(title);
            return { label: title, prop: key, align: "right", sortable: true };
          });
        }
        getColumnConfig(dynamicCol);
        const { option1, option2 } = getOption({ data: res.data, xAxis, date: formData.date });
        chartInstance1.value?.setOption(option1, true);
        chartInstance2.value?.setOption(option2, true);
      })
      .catch((err) => (loading.value = false));
  };

  // 导出
  const onExport = () => {
    const headConfig = getExportConfig("交付及时率", columns.value, formData);
    exportDeliverRate(headConfig)
      .then((res) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName, true);
        } else {
          message("导出失败", { type: "error" });
        }
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: false }]);

  return {
    chartRef1,
    chartRef2,
    activeName,
    formData,
    buttonList,
    loading,
    columns,
    dataList,
    maxHeight,
    buttonsConfig,
    onExport
  };
};
