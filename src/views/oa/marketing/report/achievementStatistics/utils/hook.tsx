/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-10 16:06:53
 */

import {
  AchievementStatisticsItemType,
  AchievementStatisticsPeopleItemType,
  achievementStatisticsList,
  achievementStatisticsOptionList,
  achievementStatisticsPeopleList,
  exportAchievementStatistics
} from "@/api/oaManage/marketing";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { Ref, onMounted, reactive, ref, watch } from "vue";
import { SummaryMethodProps, formatMoneyComma, getExportConfig, getMenuColumns, getSummaries, setColumn, updateButtonList } from "@/utils/table";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";

import { TableGroupItemType } from "@/api/systemManage";
import { dayjs } from "element-plus";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";
import { useRoute } from "vue-router";

export const useConfig = () => {
  const route = useRoute();
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const dataList = ref<AchievementStatisticsItemType[]>([]);
  const dataList2 = ref<AchievementStatisticsPeopleItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 58);
  const sTime = dayjs().startOf("month").format("YYYY-MM-DD");
  const eTime = dayjs().format("YYYY-MM-DD");
  const groupArrsList = ref<TableGroupItemType[]>([]);

  const formData = reactive({
    startDate: sTime,
    endDate: eTime,
    page: 1,
    limit: 10000,
    fnumber: "",
    salePeopleId: "",
    customerNameId: "",
    saleStockYear: "",
    customcerGroupId: ""
  });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" },
    { label: "销售员", value: "salePeopleId", children: [] },
    { label: "产品编号", value: "fnumber" },
    { label: "客户名称", value: "customerNameId", children: [] },
    { label: "客户组别", value: "customcerGroupId", children: [] },
    { label: "销售出库时间", value: "saleStockYear", type: "year", format: "YYYY" }
  ]);
  const queryParams = reactive<QueryParamsType>({ date: `${sTime} ~ ${eTime}` });

  onMounted(() => {
    getColumnConfig();
    getOptions();
  });

  watch(
    route,
    (value) => {
      const { startDate, endDate, fnumber } = value.query;
      formData.fnumber = fnumber as string;
      if (fnumber) {
        queryParams.fnumber = fnumber as string;
      }
      if (startDate && endDate) {
        const startTime = dayjs(startDate as string).format("YYYY-MM-DD");
        const endTime = dayjs(endDate as string).format("YYYY-MM-DD");
        queryParams.date = `${startTime} ~ ${endTime}`;
      }
    },
    { immediate: true }
  );

  const getOptions = () => {
    achievementStatisticsOptionList()
      .then(({ data }) => {
        searchOptions[1].children = data?.salePeopleLists.map((item) => ({ label: item.optionKey, value: item.optionValue }));
        searchOptions[3].children = data?.customerNameLists.map((item) => ({ label: item.optionKey, value: item.optionValue }));
        searchOptions[4].children = data?.customerGroupLists.map((item) => ({ label: item.optionKey, value: item.optionValue }));
      })
      .catch(console.log);
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "日期", prop: "FDATE", sortable: true },
      { label: "客户名称", prop: "customerName", minWidth: 200 },
      { label: "订单号", prop: "FBILLNO" },
      { label: "型号", prop: "F_DEG_MODEL" },
      { label: "颜色", prop: "FColor" },
      { label: "数量", prop: "qty", align: "right", sortable: true },
      {
        label: "单价",
        prop: "FPRICE",
        align: "right",
        sortable: true,
        cellRenderer: ({ row, column }) => <span>{formatMoneyComma(row[column["property"]])}</span>
      },
      {
        label: "销售金额",
        prop: "saleMoney",
        align: "right",
        sortable: true,
        cellRenderer: ({ row, column }) => <span>{formatMoneyComma(row[column["property"]])}</span>
      },
      { label: "业务员", prop: "opeName" }
    ];
    let columnData2: TableColumnList[] = [
      { label: "业务员", prop: "opeName" },
      {
        label: "销售业绩总和",
        prop: "allSaleMoney",
        minWidth: 140,
        align: "right",
        sortable: true,
        cellRenderer: ({ row, column }) => <span>{formatMoneyComma(row[column["property"]])}</span>
      }
    ];

    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData: columnData, operationColumn: false, radioColumn: { width: 50 } });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: false, radioColumn: { width: 50 } });
  };

  const onTagSearch = ({ date = "", ...values }) => {
    const [startDate, endDate] = date.split("~").map((m) => m.trim());
    formData.startDate = startDate;
    formData.endDate = endDate;
    formData.salePeopleId = values.salePeopleId;
    formData.fnumber = values.fnumber;
    formData.customerNameId = values.customerNameId;
    formData.customcerGroupId = values.customcerGroupId;
    formData.saleStockYear = values.saleStockYear;
    onSearch();
  };

  const onRefresh = () => getTableList();
  const onRefresh2 = () => getPeopleList();

  const onSearch = () => {
    getTableList();
    getPeopleList();
  };

  const getTableList = () => {
    loading.value = true;
    achievementStatisticsList(formData)
      .then((res) => {
        loading.value = false;
        dataList.value = res.data;
      })
      .catch((err) => (loading.value = false));
  };

  const getPeopleList = () => {
    loading2.value = true;
    achievementStatisticsPeopleList(formData)
      .then((res) => {
        loading2.value = false;
        dataList2.value = res.data;
      })
      .catch((err) => (loading2.value = false));
  };

  // 导出
  const onExport = () => {
    const headConfig = getExportConfig("业绩统计", columns.value, { ...formData, saleStockYear: dayjs().format("YYYY") });
    exportAchievementStatistics(headConfig)
      .then((res) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  /** 自定的统计 */
  const onSummaryMethod1 = (params: SummaryMethodProps<AchievementStatisticsItemType>) => {
    return getSummaries({ params: params, moneyCommaProps: ["FPRICE", "saleMoney"] });
  };
  /** 自定的统计 */
  const onSummaryMethod2 = (params: SummaryMethodProps<AchievementStatisticsPeopleItemType>) => {
    return getSummaries({ params: params });
  };
  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "default", text: "导出", isDropDown: true }]);

  return {
    columns,
    columns2,
    dataList,
    dataList2,
    loading,
    loading2,
    maxHeight,
    buttonList,
    searchOptions,
    queryParams,
    groupArrsList,
    onRefresh,
    onRefresh2,
    onTagSearch,
    onSummaryMethod1,
    onSummaryMethod2
  };
};
