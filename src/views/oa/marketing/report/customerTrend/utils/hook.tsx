/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-09-12 17:22:23
 */

import * as echarts from "echarts";

import { CustomerTrendItemType, customerTrendChartList, customerTrendList, exportCustomerTrend } from "@/api/oaManage/marketing";
import { computed, markRaw, onMounted, reactive, ref } from "vue";
import { debounce, downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { formatMoneyComma, getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";

import type { ECharts } from "echarts";
import { ElTable } from "element-plus";
import { dayjs } from "element-plus";
import { getOption } from "./config";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

type TableRefType = InstanceType<typeof ElTable>;

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const dataList = ref<CustomerTrendItemType[]>([]);
  const tempDataList = ref<CustomerTrendItemType[]>([]);
  const dataList2 = ref<Array<any>>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 48);
  const chartRef1 = ref<HTMLElement>();
  const table1Ref = ref<{ getTableRef: () => TableRefType }>();
  const chartInstance1 = ref<ECharts>();
  const rowData = ref<CustomerTrendItemType>();
  const chartHeight = 400;

  const formData = reactive<{ FNUMBER: ""; date: [dayjs.Dayjs, dayjs.Dayjs] }>({
    FNUMBER: "",
    date: [dayjs(new Date()).subtract(2, "year"), dayjs(new Date())]
  });

  const yearDate = computed(() => {
    const startyear = dayjs(formData.date[0]).format("YYYY");
    const endyear = dayjs(formData.date[1]).format("YYYY");
    return { startyear, endyear };
  });

  onMounted(() => {
    getColumnConfig();
    getTableList();
    if (chartRef1.value) chartInstance1.value = markRaw(echarts.init(chartRef1.value));
    window.onresize = debounce(() => {
      chartInstance1.value?.resize();
    }, 300);
  });

  const onSearch = () => {
    dataList.value = tempDataList.value;
    if (formData.FNUMBER) {
      // 客户编码搜索
      dataList.value = tempDataList.value.filter((item) => {
        item.FNUMBER.search(formData.FNUMBER) > -1;
        const reg = new RegExp(formData.FNUMBER, "i");
        return item.FNUMBER.match(reg);
      });
    }
    onRowClick(dataList.value[0]);
  };
  const onOpenChange = (isOpen: boolean) => {
    if (isOpen) return;
    getTableList();
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "客户编码", prop: "FNUMBER", sortable: true },
      { label: "名称", prop: "FShortName", sortable: true },
      {
        label: "金额(万/元)",
        prop: "sale",
        align: "right",
        sortable: true,
        cellRenderer: ({ row, column }) => <span>{formatMoneyComma(row[column["property"]])}</span>
      }
    ];
    const months: TableColumnList[] = new Array(12).fill(0).map((_, i) => ({
      label: `${i + 1}月`,
      prop: `${i + 1}`,
      align: "right",
      sortable: true,
      cellRenderer: ({ row, column }) => <span>{formatMoneyComma(row[column["property"]])}</span>
    }));
    const columnData2: TableColumnList[] = [{ label: "年份", prop: "year", align: "right" }, ...months];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData: columnData, operationColumn: false, dragSelector: ".customer-trend" });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: false, dragSelector: ".customer-trend-list" });
  };

  const getTableList = () => {
    loading.value = true;
    customerTrendList({ ...yearDate.value })
      .then((res) => {
        loading.value = false;
        dataList.value = res.data;
        tempDataList.value = res.data;
        onRowClick(res.data[0]);
      })
      .catch((err) => (loading.value = false));
  };

  const onRowClick = (row: CustomerTrendItemType) => {
    if (!row) return;
    rowData.value = row;
    table1Ref.value?.getTableRef().setCurrentRow(row);
    loading2.value = true;
    customerTrendChartList({ ...yearDate.value, customerId: row.FCUSTID })
      .then((res) => {
        loading2.value = false;
        const data = res.data;
        dataList2.value = data;
        const option1 = getOption({ data: data, curYear: yearDate.value.endyear });
        chartInstance1.value?.setOption(option1, true);
      })
      .catch((err) => (loading2.value = false));
  };

  // 导出(仅导出第二张表)
  const onExport = () => {
    const headConfig = getExportConfig("客户趋势", columns2.value, {
      startyear: Number(yearDate.value.startyear),
      endyear: Number(yearDate.value.endyear),
      customerId: rowData.value.FCUSTID || 0,
      arr: dataList2.value
    });
    exportCustomerTrend(headConfig)
      .then((res) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "default", text: "导出", isDropDown: true }]);

  return {
    chartRef1,
    table1Ref,
    formData,
    columns,
    columns2,
    dataList,
    dataList2,
    loading,
    loading2,
    maxHeight,
    chartHeight,
    buttonList,
    onSearch,
    onOpenChange,
    onRowClick
  };
};
