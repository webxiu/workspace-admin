/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 16:06:34
 */

import * as echarts from "echarts";

import { ProductRatioItemType, productRatioList } from "@/api/oaManage/marketing";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { downloadDataToExcel, formatMoneyComma, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { fmtMoney, getOption } from "../../customerRatio/utils/config";
import { markRaw, onMounted, reactive, ref, watch } from "vue";

import type { ECharts } from "echarts";
import { dayjs } from "element-plus";
import { debounce } from "@/utils/common";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<ProductRatioItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 58);
  const chartRef1 = ref<HTMLElement>();
  const chartInstance1 = ref<ECharts>();
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
    if (chartRef1.value) chartInstance1.value = markRaw(echarts.init(chartRef1.value));
    window.onresize = debounce(() => {
      chartInstance1.value?.resize();
    }, 300);
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "产品名称", prop: "testF" },
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
    columns.value = setColumn({ columnData, operationColumn: false });
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
    productRatioList(formData)
      .then((res) => {
        loading.value = false;
        const data = res.data;
        // 修改数据格式
        data.table.forEach((item) => {
          if (item.sale) item.sale = fmtMoney(item.sale);
          if (item.ratio) item.ratio = item.ratio + "%";
        });
        dataList.value = data.table;
        const option1 = getOption({ nameField: "testF", title: "产品类别占比", data });
        chartInstance1.value?.setOption(option1, true);
      })
      .catch((err) => (loading.value = false));
  };

  // 导出
  const onExport = () => {
    downloadDataToExcel({
      dataList: dataList.value,
      columns: columns.value,
      sheetName: "产品类别占比"
    });
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "default", text: "导出", isDropDown: true }]);

  return {
    chartRef1,
    formData,
    columns,
    dataList,
    loading,
    maxHeight,
    buttonList,
    queryParams,
    searchOptions,
    onRefresh,
    onTagSearch
  };
};
