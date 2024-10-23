/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 16:24:14
 */

import * as echarts from "echarts";

import { CustomerRatioItemType, customerRatioList } from "@/api/oaManage/marketing";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { downloadDataToExcel, formatMoneyComma, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { fmtMoney, getOption } from "./config";
import { markRaw, onMounted, reactive, ref } from "vue";

import type { ECharts } from "echarts";
import { dayjs } from "element-plus";
import { debounce } from "@/utils/common";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const chartRef1 = ref<HTMLElement>();
  const chartInstance1 = ref<ECharts>();
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<CustomerRatioItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 58);
  const sTime = dayjs(new Date()).startOf("month").format("YYYY-MM-DD");
  const eTime = dayjs(new Date()).format("YYYY-MM-DD");

  const formData = reactive({ start: sTime, end: eTime });
  const searchOptions = reactive<SearchOptionType[]>([
    {
      label: "日期范围",
      value: "date",
      type: "daterange",
      format: "YYYY-MM-DD"
    }
  ]);
  const queryParams = reactive<QueryParamsType>({ date: `${sTime} ~ ${eTime}` });

  onMounted(() => {
    getColumnConfig();
    getTableList();
    if (chartRef1.value) {
      chartInstance1.value = markRaw(echarts.init(chartRef1.value));
    }
    window.onresize = debounce(() => {
      chartInstance1.value?.resize();
    }, 300);
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "客户名", prop: "FShortName", sortable: true },
      {
        label: "销售额(万元)",
        prop: "sale",
        align: "right",
        sortable: true,
        cellRenderer: ({ row, column }) => <span>{formatMoneyComma(row[column["property"]])}</span>
      },
      { label: "占比", prop: "ratio", align: "right", sortable: true }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false, dragSelector: ".customer-ratio" });
  };

  function onTagSearch({ date = "" }) {
    const [startTime, endTime] = date.split("~").map((m) => m.trim());
    formData.start = startTime;
    formData.end = endTime;
    getTableList();
  }

  function onRefresh() {
    getTableList();
  }

  const getTableList = () => {
    loading.value = true;
    customerRatioList(formData)
      .then((res) => {
        loading.value = false;
        const data = res.data;
        // 修改数据格式
        data.table.forEach((item) => {
          if (item.sale) item.sale = fmtMoney(item.sale);
          if (item.ratio) item.ratio = item.ratio + "%";
        });
        dataList.value = data.table;
        const option1 = getOption({ nameField: "FShortName", title: "客户占比", data });
        chartInstance1.value?.setOption(option1, true);
      })
      .catch((err) => (loading.value = false));
  };

  // 导出
  const onExport = () => {
    downloadDataToExcel({
      dataList: dataList.value,
      columns: columns.value,
      sheetName: "客户占比"
    });
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "default", text: "导出", isDropDown: true }]);

  return {
    chartRef1,
    columns,
    dataList,
    loading,
    maxHeight,
    buttonList,
    searchOptions,
    queryParams,
    onRefresh,
    onTagSearch
  };
};
