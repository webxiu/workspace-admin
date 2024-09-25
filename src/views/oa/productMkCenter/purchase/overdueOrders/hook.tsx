import * as echarts from "echarts";

import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { exportOverDueOrder, fetchOverDueOrder } from "@/api/oaManage/productMkCenter";
import { onMounted, reactive, ref, toRaw } from "vue";

import { ECHARTSTHEME } from "@/views/oa/utils/common";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { downloadFile } from "@/utils/common";
import { useEleHeight } from "@/hooks";
import { useRoute } from "vue-router";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const chartRef = ref();
  const currentRow = ref();

  const theFirstDayOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
  const nowDate = dayjs().format("YYYY-MM-DD");

  const queryParams = reactive({ date: `${theFirstDayOfMonth} ~ ${nowDate}` });

  let formData: any = reactive({});
  const route = useRoute();

  const searchOptions = reactive<SearchOptionType[]>([{ label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }]);

  const chartOption = reactive({
    xAxis: {
      type: "category",
      data: []
    },
    yAxis: {
      type: "value"
    },
    tooltip: { trigger: "axis" },
    grid: {
      left: 40,
      top: 40,
      right: 20,
      bottom: 20,
      width: "auto",
      height: "auto"
    },
    series: [
      {
        data: [],
        type: "bar",
        barMaxWidth: 60
        // ...ECHARTSTHEME.redLine
      }
    ]
  });

  const mapTree = (org) => {
    const haveChildren = Array.isArray(org.children) && org.children.length > 0;
    return {
      id: org.id,
      label: org.name,
      value: org.id,
      children: haveChildren ? org.children.map((i) => mapTree(i)) : []
    };
  };

  const initCharts = () => {
    if (chartRef.value) {
      const chart = echarts.init(chartRef.value);
      chart.setOption(toRaw(chartOption));
    }
  };

  onMounted(() => {
    getColumnConfig();
    onSearch();
    initCharts();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "物料分类", prop: "FGROUPNAME" },
      { label: "采购员", prop: "FSTAFFNAME" },
      { label: "超期数", prop: "delayCount", align: "right" },
      { label: "未超期数", prop: "nomarlCount", align: "right" },
      { label: "总数", prop: "totalCount", align: "right" },
      { label: "超期率", prop: "delayRate", align: "right" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    const copyData = cloneDeep(formData);
    const [searchStartDate, searchEndDate] = copyData.date ? copyData.date.split(" ~ ") : ["", ""];
    copyData.startDate = searchStartDate;
    copyData.endDate = searchEndDate;
    delete copyData.date;
    delete copyData.search;

    fetchOverDueOrder({ ...copyData }).then((res: any) => {
      if (res.data) {
        dataList.value = res.data;
        console.log(res.data, "dd.");
        chartOption.xAxis.data = res.data.map((item) => item.FGROUPNAME);
        chartOption.series[0].data = res.data.map((item) => item.delayRate);
        initCharts();
      }
    });
  };

  const handleTagSearch = (values = {}) => {
    Object.keys(values)?.forEach((key) => {
      formData[key] = values[key];
    });
    formData = { ...values };
    onSearch();
  };

  // 导出
  const onExport = () => {
    const copyData = cloneDeep(formData);
    const [startDate, endDate] = copyData.date ? copyData.date.split(" ~ ") : ["", ""];
    exportOverDueOrder({ startDate, endDate, menuId: route.query.menuId }).then((res: any) => {
      if (res.data) {
        const fileName = res.data.split("/").at(-1);
        downloadFile(res.data, fileName);
      }
    });
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: false }]);

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  return {
    buttonList,
    columns,
    dataList,
    maxHeight,
    chartRef,
    searchOptions,
    queryParams,
    onFresh,
    onSearch,
    handleTagSearch,
    onExport,
    rowClick
  };
};
