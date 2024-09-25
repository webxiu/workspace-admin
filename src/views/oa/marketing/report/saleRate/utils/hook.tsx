/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-05-17 14:11:02
 */

import * as echarts from "echarts";

import { debounce, downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { exportSaleRated, saleRatedList } from "@/api/oaManage/marketing";
import { formatMoneyComma, getExportConfig, getFormatType, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { markRaw, onMounted, reactive, ref, watch } from "vue";

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

  const formData = reactive({
    arr: [],
    year: dayjs(new Date()).format("YYYY")
  });

  onMounted(() => {
    getColumnConfig();
    getTableList();
    chartRef1.value && (chartInstance1.value = markRaw(echarts.init(chartRef1.value)));
    chartRef2.value && (chartInstance2.value = markRaw(echarts.init(chartRef2.value)));
    window.onresize = debounce(() => {
      chartInstance1.value?.resize();
      chartInstance2.value?.resize();
    }, 300);
  });

  watch(formData, (val) => {
    getTableList();
  });

  const getColumnConfig = async () => {
    const cellRenderer: any = ({ row, column, index }) => {
      return <span>{index < 2 ? formatMoneyComma(row[column["property"]]) : row[column["property"]]}</span>;
    };
    let columnData: TableColumnList[] = [
      { label: "年份", prop: "FYEAR" },
      { label: "项目", prop: "ItemName" },
      { label: "1月", prop: "m1", align: "right", sortable: true, cellRenderer },
      { label: "2月", prop: "m2", align: "right", sortable: true, cellRenderer },
      { label: "3月", prop: "m3", align: "right", sortable: true, cellRenderer },
      { label: "4月", prop: "m4", align: "right", sortable: true, cellRenderer },
      { label: "5月", prop: "m5", align: "right", sortable: true, cellRenderer },
      { label: "6月", prop: "m6", align: "right", sortable: true, cellRenderer },
      { label: "7月", prop: "m7", align: "right", sortable: true, cellRenderer },
      { label: "8月", prop: "m8", align: "right", sortable: true, cellRenderer },
      { label: "9月", prop: "m9", align: "right", sortable: true, cellRenderer },
      { label: "10月", prop: "m10", align: "right", sortable: true, cellRenderer },
      { label: "11月", prop: "m11", align: "right", sortable: true, cellRenderer },
      { label: "12月", prop: "m12", align: "right", sortable: true, cellRenderer }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    const res = data?.map((item, i) => {
      const cellRenderer = (data) => {
        const prop = data.column["property"];
        const flag = item.formatType && data.index < 2; // 只对前两行做格式化处理
        data.row[prop] = flag ? getFormatType(item, data.row[prop]) : data.row[prop];
        return data.row[prop];
      };
      return { ...item, cellRenderer };
    });
    if (data?.length) columnData = res;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const getTableList = () => {
    loading.value = true;
    saleRatedList(formData)
      .then((res) => {
        loading.value = false;
        const data = res.data;
        dataList.value = [
          { FYEAR: formData.year, ItemName: "月实际销售额" },
          { FYEAR: formData.year, ItemName: "月计划销售额" },
          { FYEAR: formData.year, ItemName: "销售达成率" }
        ];
        const list = data.filter((item) => item.ItemName === "月实际销售额" && item.FYEAR === Number(formData.year));
        const list2 = data.filter((item) => item.ItemName === "月计划销售额" && item.FYEAR === Number(formData.year));
        const list3 = data.filter((item) => item.ItemName === "销售达成率" && item.FYEAR === Number(formData.year));
        const xAxis: string[] = [];
        const saleRate: number[] = []; // 销售达成率
        const realSale: string[] = []; // 实际销售额
        const planSale: string[] = []; // 计划销售额

        for (let i = 0; i < 12; i++) {
          xAxis.push(i + 1 + "月");
          for (let j = 0; j < list.length; j++) {
            if (list[j].FMonthName == i + 1 + "月") {
              dataList.value[0]["m" + (i + 1)] = list[j].ItemValue;
              realSale.push((list[j].ItemValue / 10000).toFixed(2));
            }
          }
          for (let j = 0; j < list2.length; j++) {
            if (list2[j].FMonthName == i + 1 + "月") {
              dataList.value[1]["m" + (i + 1)] = list2[j].ItemValue;
              planSale.push((list2[j].ItemValue / 10000).toFixed(2));
            }
          }
          for (let j = 0; j < list3.length; j++) {
            if (list3[j].FMonthName == i + 1 + "月") {
              dataList.value[2]["m" + (i + 1)] = list3[j].ItemValue;
              saleRate.push(list3[j].ItemValue);
            }
          }
        }

        const { option1, option2 } = getOption({ xAxis, year: formData.year, saleRate, realSale, planSale });
        chartInstance1.value?.setOption(option1, true);
        chartInstance2.value?.setOption(option2, true);
      })
      .catch((err) => (loading.value = false));
  };

  // 导出
  const onExport = () => {
    const headConfig = getExportConfig("销售达成率", columns.value, { ...formData, arr: dataList.value });
    exportSaleRated(headConfig)
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
    onExport
  };
};
