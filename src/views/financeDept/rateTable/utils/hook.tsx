import { markRaw, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import dayjs from "dayjs";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { downloadRateTableList, exportRateTableList, getRateTableList } from "@/api/oaManage/financeDept";
import { ElMessage, ElMessageBox } from "element-plus";
import { PAGE_CONFIG } from "@/config/constant";
import type { ECharts } from "echarts";
import * as echarts from "echarts";
import { debounce } from "@/utils/common";
import { getOption } from "./config";
import type { ColDef } from "ag-grid-community";
import { getAgGridColumns } from "@/components/AgGridTable/config";

export const useConfig = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const chartRef = ref<HTMLElement>();
  const chartInstance = ref<ECharts>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 475);

  const formData = reactive({
    startDate: "",
    endDate: "",
    date: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });
  const nowDay = dayjs().format("YYYY-MM-DD");

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const queryParams = reactive<QueryParamsType>({ date: `${nowDay} ~ ${nowDay}` });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" }
  ]);

  onMounted(() => {
    getColumnConfig();
    if (chartRef.value) chartInstance.value = markRaw(echarts.init(chartRef.value));
    window.onresize = debounce(() => chartInstance.value?.resize(), 300);
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "发布时间", prop: "quotationDate" },
      { label: "美元USD", prop: "currency1" },
      { label: "欧元EUR", prop: "currency2" },
      { label: "日元JPY", prop: "currency3" },
      { label: "港元HKD", prop: "currency4" },
      { label: "英镑GBP", prop: "currency5" },
      { label: "澳元AUD", prop: "currency6" },
      { label: "加元CAD", prop: "currency7" },
      { label: "登记时间", prop: "createDate" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    columnDefs.value = getAgGridColumns({ columnData, operationColumn: false });
    return columnData;
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onSearch = () => {
    loading.value = true;
    getRateTableList(formData)
      .then((res: any) => {
        if (res.data) {
          const data = res.data;
          loading.value = false;
          dataList.value = data.records || [];
          pagination.total = data.total;
          initChart();
        }
      })
      .catch((err) => (loading.value = false));
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const onCurrentChange = (row) => {
    if (!row) return;
    rowData.value = row;
  };

  // 下载
  const onDownload = () => {
    const { startDate, endDate } = formData;
    if (startDate !== endDate) {
      ElMessage({ message: "开始日期和结束日期必须相同", type: "warning" });
      return;
    }
    console.log(formData, "formData==");
    ElMessageBox.confirm(`确认要下载日期为【${startDate}】的汇率数据吗?`, "温馨提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loading.value = true;
        downloadRateTableList({ downDate: startDate })
          .then((res) => {
            if (res.data) {
              ElMessage({ message: `下载成功`, type: "success" });
              onSearch();
            }
          })
          .finally(() => (loading.value = false));
      })
      .catch(() => {});
  };

  // 导出单据
  const onExport = async () => {
    if (!dataList.value.length) return;
    loading.value = true;
    const configList = await getColumnConfig();
    configList.unshift({ label: "发布时间", prop: "quotationDate" });
    const excelHeader = configList.map((item, index) => {
      return { field: item.prop, title: item.label, width: 160, key: `0-${index}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
    });
    const headConfig = {
      page: 1,
      limit: 100000,
      excel: {
        excelName: "汇率表",
        excelHeader: JSON.stringify(excelHeader)
      },
      startDate: formData.startDate || "",
      endDate: formData.endDate || ""
    };

    exportRateTableList(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onDownload, type: "primary", text: "下载", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  const initChart = () => {
    const moneyArr = ["currency1", "currency2", "currency3", "currency4", "currency5", "currency6", "currency7"];
    const curList = dataList.value.slice(0, 30);
    const dataYList = [];
    moneyArr.forEach((_, index) => {
      dataYList.push(curList.map((el) => el[moneyArr[index]]));
    });
    const xAxis = curList.map((item) => item.quotationDate.split(" ")[0]);
    const option = getOption({ data: dataYList, xAxis });
    chartInstance.value?.setOption(option, true);
  };

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    rowData.value = undefined;
  }

  return {
    columnDefs,
    isAgTable,
    loading,
    columns,
    dataList,
    maxHeight,
    chartRef,
    pagination,
    searchOptions,
    queryParams,
    buttonList,
    onRefresh,
    onTagSearch,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange,
    onSwitchTable
  };
};
