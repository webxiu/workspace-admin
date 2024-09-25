/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-05-17 14:25:45
 */

import * as echarts from "echarts";

import { downloadDataToExcel, formatMoneyComma, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { markRaw, onMounted, reactive, ref, watch } from "vue";

import { Download } from "@element-plus/icons-vue";
import type { ECharts } from "echarts";
import { dayjs } from "element-plus";
import { debounce } from "@/utils/common";
import { getOption } from "./config";
import { prodAndSaleList } from "@/api/supplyChain";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<any[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 62 + 51);
  const activeName = ref("chart");
  const chartRef1 = ref<HTMLElement>();
  const chartRef2 = ref<HTMLElement>();
  const chartRef3 = ref<HTMLElement>();
  const chartInstance1 = ref<ECharts>();
  const chartInstance3 = ref<ECharts>();
  const chartInstance2 = ref<ECharts>();

  const formData = reactive({
    iYear: dayjs(new Date()).format("YYYY")
  });

  onMounted(() => {
    initChart();
    window.onresize = debounce(() => {
      chartInstance1.value?.resize();
      chartInstance3.value?.resize();
      chartInstance2.value?.resize();
    }, 300);
  });

  watch(formData, (val) => {
    getTableList();
  });

  const initChart = () => {
    chartRef1.value && (chartInstance1.value = markRaw(echarts.init(chartRef1.value)));
    chartRef3.value && (chartInstance3.value = markRaw(echarts.init(chartRef3.value)));
    chartRef2.value && (chartInstance2.value = markRaw(echarts.init(chartRef2.value)));
    getTableList();
  };

  const getColumnConfig = async () => {
    const cellRenderer: any = ({ row, column }) => {
      const value = row[column["property"]];
      return <span>{value === null ? value : formatMoneyComma(value, 1)}</span>;
    };
    let columnData: TableColumnList[] = [
      { label: "项目", prop: "FITEM", width: 140 },
      { label: "1月", prop: "1", align: "right", minWidth: 80, cellRenderer },
      { label: "2月", prop: "2", align: "right", minWidth: 80, cellRenderer },
      { label: "3月", prop: "3", align: "right", minWidth: 80, cellRenderer },
      { label: "4月", prop: "4", align: "right", minWidth: 80, cellRenderer },
      { label: "5月", prop: "5", align: "right", minWidth: 80, cellRenderer },
      { label: "6月", prop: "6", align: "right", minWidth: 80, cellRenderer },
      { label: "7月", prop: "7", align: "right", minWidth: 80, cellRenderer },
      { label: "8月", prop: "8", align: "right", minWidth: 80, cellRenderer },
      { label: "9月", prop: "9", align: "right", minWidth: 80, cellRenderer },
      { label: "10月", prop: "10", align: "right", minWidth: 80, cellRenderer },
      { label: "11月", prop: "11", align: "right", minWidth: 80, cellRenderer },
      { label: "12月", prop: "12", align: "right", minWidth: 80, cellRenderer },
      { label: "合计", prop: "total", align: "right", minWidth: 80, cellRenderer }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const getTableList = () => {
    loading.value = true;
    prodAndSaleList(formData)
      .then((res) => {
        loading.value = false;
        const data = res.data ?? [];
        dataList.value = data;
        const xAxis: string[] = [];
        if (data?.length) {
          const { FITEMSQE, FITEM, ...reset } = data[0];
          Object.keys(reset)?.forEach((key) => {
            if (key !== "total") xAxis.push(key + "月");
          });
        }
        getColumnConfig();
        const { option1, option2, option3 } = getOption({ data: data, xAxis });
        chartInstance1.value?.setOption(option1, true);
        chartInstance3.value?.setOption(option3, true);
        chartInstance2.value?.setOption(option2, true);
      })
      .catch((err) => (loading.value = false));
  };

  // 导出
  const onExport = () => {
    /** 前端导出 */
    downloadDataToExcel([
      {
        dataList: dataList.value,
        columns: columns.value,
        sheetName: "产销存"
      }
    ]);
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", icon: Download, isDropDown: false }]);

  return {
    chartRef1,
    chartRef2,
    chartRef3,
    formData,
    activeName,
    columns,
    dataList,
    loading,
    maxHeight,
    buttonList
  };
};
