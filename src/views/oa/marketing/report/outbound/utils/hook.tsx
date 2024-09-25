/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-05-17 14:10:58
 */

import * as echarts from "echarts";

import { debounce, downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { exportOutBound, outBoundList } from "@/api/oaManage/marketing";
import { formatMoneyComma, getExportConfig, getFormatType, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { markRaw, onMounted, reactive, ref, watch } from "vue";

import type { ECharts } from "echarts";
import { dayjs } from "element-plus";
import { getOption } from "./config";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const dataList = ref<any[]>([]);
  const activeName = ref("chart");
  const loading = ref<boolean>(false);
  const chartRef1 = ref<HTMLElement>();
  const chartRef2 = ref<HTMLElement>();
  const chartIns1 = ref<ECharts>();
  const chartIns2 = ref<ECharts>();
  const columns = ref<TableColumnList[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 62 + 51);
  const formData = reactive({
    type: "月",
    years: [dayjs(new Date()).subtract(2, "year").format("YYYY"), dayjs(new Date()).format("YYYY")]
  });

  onMounted(() => {
    getTableList();
    chartRef1.value && (chartIns1.value = markRaw(echarts.init(chartRef1.value)));
    chartRef2.value && (chartIns2.value = markRaw(echarts.init(chartRef2.value)));
    window.onresize = debounce(() => {
      chartIns1.value?.resize();
      chartIns2.value?.resize();
    }, 300);
  });

  watch(formData, (val) => {
    getTableList();
  });

  const getColumnConfig = async (dynamicCol: any[]) => {
    let columnData: TableColumnList[] = [
      {
        label: "年份",
        prop: "YearAndMonth"
      },
      { label: "项目", prop: "Item" },
      ...dynamicCol
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    const colLen = 2; // 默认列数量
    const res = data?.slice(0, dynamicCol.length + colLen).map((item, i) => {
      const label = i >= colLen ? dynamicCol[i - colLen].label : item.label;
      const prop = i >= colLen ? dynamicCol[i - colLen].prop : item.prop;

      const cellRenderer = (data) => {
        const prop = data.column["property"];
        const flag = item.formatType && data.index === 0; // 只对第一行做格式化处理
        data.row[prop] = flag ? getFormatType(item, data.row[prop]) : data.row[prop];
        return data.row[prop];
      };
      return { ...item, label, prop, cellRenderer };
    });
    if (data?.length) columnData = res;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const getTableList = () => {
    loading.value = true;
    outBoundList(formData)
      .then((res) => {
        loading.value = false;
        dataList.value = res.data;
        const xAxis: string[] = [];
        let dynamicCol = [];
        if (res.data?.length) {
          const { YearAndMonth, Item, Type, ...reset } = res.data[0];
          const colKeys = Object.keys(reset);
          dynamicCol = colKeys.map((key) => {
            const title = key + formData.type;
            xAxis.push(title);
            return {
              label: title,
              prop: key,
              align: "right",
              sortable: true,
              cellRenderer: ({ row, column, index }) => {
                return <span>{index === 0 ? formatMoneyComma(row[column["property"]]) : row[column["property"]]}</span>;
              }
            };
          });
        }
        const { option1, option2 } = getOption({ data: res.data, xAxis });
        chartIns1.value?.setOption(option1, true);
        chartIns2.value?.setOption(option2, true);
        getColumnConfig(dynamicCol);
      })
      .catch((err) => (loading.value = false));
  };

  // 导出
  const onExport = () => {
    const headConfig = getExportConfig("销售出库统计", columns.value, formData);
    exportOutBound(headConfig)
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
    formData,
    buttonList,
    activeName,
    columns,
    dataList,
    loading,
    maxHeight
  };
};
