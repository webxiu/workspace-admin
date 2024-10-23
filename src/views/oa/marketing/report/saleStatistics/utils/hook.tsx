/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:24:12
 */

import { SaleStatisticsItemType, exportSaleStatistics, saleStatisticsList, saleStatisticsOptionList } from "@/api/oaManage/marketing";
import { SummaryMethodProps, getExportConfig, getSummaries, setColumn, getMenuColumns, getFormatType, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref, computed } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";
import { useRoute, useRouter } from "vue-router";
import { PAGE_CONFIG } from "@/config/constant";
import dayjs from "dayjs";

export const useConfig = () => {
  const route = useRoute();
  const router = useRouter();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const dataListTemp = ref<SaleStatisticsItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 112);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const curYear = dayjs().format("YYYY");

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    saleStockYear: curYear,
    salePeopleId: "",
    customcerGroupId: ""
  });

  const queryParams = reactive<QueryParamsType>({ saleStockYear: curYear });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "销售出库时间", value: "saleStockYear", type: "year", format: "YYYY" },
    { label: "销售员", value: "salePeopleId", children: [] },
    { label: "客户组别", value: "customcerGroupId", children: [] }
  ]);

  onMounted(() => {
    getOptions();
    getColumnConfig();
    getTableList();
  });

  const getOptions = () => {
    saleStatisticsOptionList()
      .then(({ data }) => {
        if (!data) return;
        const result1 = data.salePeopleLists.map((item) => ({ label: item.optionKey, value: item.optionValue }));
        const result2 = data.customerGroupLists.map((item) => ({ label: item.optionKey, value: item.optionValue }));
        searchOptions[1].children = result1;
        searchOptions[2].children = result2;
      })
      .catch(console.log);
  };

  const renderCell = (row: SaleStatisticsItemType, column) => {
    const prop = row[column["property"]];
    return prop ? (
      <el-button link type="primary" onClick={() => onPreview(row, column)}>
        {prop}
      </el-button>
    ) : (
      <span>{prop}</span>
    );
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "产品", prop: "modelName" },
      { label: "一月", prop: "01", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "二月", prop: "02", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "三月", prop: "03", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "四月", prop: "04", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "五月", prop: "05", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "六月", prop: "06", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "小计", prop: "firstHalfYearSum", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "上半年销售比例", prop: "firstHalfYearSaleProprtion", align: "right", minWidth: 140, sortable: true },
      { label: "七月", prop: "07", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "八月", prop: "08", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "九月", prop: "09", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "十月", prop: "10", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "十一月", prop: "11", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "十二月", prop: "12", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "合计", prop: "oneYearSum", align: "right", cellRenderer: ({ row, column }) => renderCell(row, column), sortable: true },
      { label: "年销售比例", prop: "oneYearSaleProprtion", sortable: true }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    const res = data?.map((item) => {
      return {
        ...item,
        cellRenderer: (data) => {
          const prop = data.column["property"]; // 不需要显示按钮的字段
          const flag = ["modelName", "firstHalfYearSaleProprtion", "oneYearSaleProprtion"].includes(prop);
          return flag ? data.row[prop] : renderCell(data.row, data.column);
        }
      };
    });
    if (data?.length) columnData = res;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, dataList, formData, operationColumn: false, radioColumn: { width: 50 } });
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const onRefresh = () => getTableList();

  const getTableList = () => {
    loading.value = true;
    saleStatisticsList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataListTemp.value = data || [];
        pagination.total = data.length || 0;
      })
      .catch((err) => (loading.value = false));
  };

  const onPreview = (row: SaleStatisticsItemType, column?) => {
    const fyear = Number(row.sYear);
    const fmonth = Number(column["property"]);
    let startDate = "";
    let endDate = "";
    if (column["property"] === "firstHalfYearSum") {
      //小计
      startDate = fyear + "-01-01";
      endDate = fyear + "-06-30";
    } else if (column["property"] === "oneYearSum") {
      //合计
      startDate = fyear + "-01-01";
      endDate = fyear + "-12-31";
    } else {
      startDate = fyear + "-" + `${fmonth}`.padStart(2, "0") + "-01";
      const nextMonthFirthDay: number = new Date(fyear, fmonth, 1).getTime();
      const oneDay = 1000 * 60 * 60 * 24; // 一天的时间毫秒数
      const endDay = new Date(nextMonthFirthDay - oneDay).getDate();
      endDate = fyear + "-" + `${fmonth}`.padStart(2, "0") + "-" + endDay;
    }

    router.push({
      path: "/oa/marketing/report/achievementStatistics/index",
      query: { menuId: route.query.menuId, fnumber: row.fnumber, startDate: startDate, endDate: endDate, v: Math.random() }
    });
  };
  // 导出
  const onExport = () => {
    const headConfig = getExportConfig("销售统计", columns.value, formData);
    exportSaleStatistics(headConfig)
      .then((res) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  /** 自定的统计 */
  const onSummaryMethod = (params: SummaryMethodProps<SaleStatisticsItemType>) => {
    return getSummaries({
      params: params,
      excludeProps: ["firstHalfYearSaleProprtion", "oneYearSaleProprtion"],
      moneyCommaProps: new Array(12)
        .fill(0)
        .map((_, index) => `${index + 1}`.padStart(2, "0"))
        .concat(["firstHalfYearSum", "oneYearSum"])
    });
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
  }

  function onCurrentChange(val: number) {
    formData.page = val;
  }

  // 前端分页
  const dataList = computed(() => dataListTemp.value.splice((formData.page - 1) * formData.limit, formData.limit));
  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "default", text: "导出", isDropDown: true }]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    buttonList,
    pagination,
    searchOptions,
    queryParams,
    onRefresh,
    onTagSearch,
    onSizeChange,
    onSummaryMethod,
    onCurrentChange
  };
};
