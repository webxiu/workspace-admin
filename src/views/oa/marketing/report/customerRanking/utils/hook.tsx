/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:23:44
 */

import {
  CustomerSummaryItemType,
  MaterialRatioSummaryItemType,
  OutboundSummaryItemType,
  customerRankingOptionList,
  customerSummaryList,
  exportCustomerSummary,
  exportMaterialRatioSummary,
  exportOutboundSummary,
  materialRatioSummaryList,
  outboundSummaryList
} from "@/api/oaManage/marketing";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { SummaryMethodProps, downloadDataToExcel, formatMoneyComma, getMenuColumns, getSummaries, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";

import { ElTable } from "element-plus";
import { TableGroupItemType } from "@/api/systemManage";
import { dayjs } from "element-plus";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const columns3 = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const loading3 = ref<boolean>(false);
  const dataList = ref<CustomerSummaryItemType[]>([]);
  const dataList2 = ref<OutboundSummaryItemType[]>([]);
  const dataList3 = ref<MaterialRatioSummaryItemType[]>([]);
  const rowData = ref<CustomerSummaryItemType>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 58);
  const selectOptions = ref({ salePeopleLists: [] });
  const singleTableRef = ref<InstanceType<typeof ElTable>>();
  const curYear = dayjs(new Date()).format("YYYY");
  const groupArrsList = ref<TableGroupItemType[]>([]);

  const formData = reactive({
    saleStockYear: curYear,
    page: 1,
    limit: 10000,
    salePeopleId: ""
  });

  const queryParams = reactive<QueryParamsType>({ saleStockYear: curYear });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "销售出库时间", value: "saleStockYear", type: "year", format: "YYYY" },
    { label: "销售员", value: "salePeopleId", children: [] }
  ]);

  onMounted(() => {
    getColumnConfig();
    getOptions();
    getTableList();
  });

  const getOptions = () => {
    customerRankingOptionList()
      .then(({ data }) => {
        if (data) {
          selectOptions.value = data;
          const list = data.salePeopleLists.map((item) => ({ label: item.optionKey, value: item.optionValue }));
          searchOptions[1].children = list;
        }
      })
      .catch(console.log);
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "年份", prop: "year", align: "right" },
      { label: "客户名称", prop: "customerName", minWidth: 180 },
      { label: "出库数量", prop: "sumShimentQty", align: "right", sortable: true },
      {
        label: "销售额",
        prop: "sumSaleMoney",
        minWidth: 180,
        align: "right",
        sortable: true,
        cellRenderer: ({ row, column }) => <span>{formatMoneyComma(row[column["property"]])}</span>
      }
    ];
    let columnData2: TableColumnList[] = [
      { label: "出库日期", prop: "FDATE", sortable: true },
      { label: "物料编码", prop: "FNUMBER", minWidth: 180 },
      { label: "型号", prop: "F_DEG_MODEL" },
      { label: "颜色", prop: "FColor" },
      { label: "数量", prop: "FQTY", align: "right", sortable: true },
      {
        label: "含税单价",
        prop: "FPRICE",
        align: "right",
        sortable: true,
        cellRenderer: ({ row, column }) => <span>{formatMoneyComma(row[column["property"]])}</span>
      },
      {
        label: "金额",
        prop: "sumMoney",
        align: "right",
        sortable: true,
        cellRenderer: ({ row, column }) => <span>{formatMoneyComma(row[column["property"]])}</span>
      },
      { label: "客户名称", prop: "customerName", minWidth: 200 },
      { label: "订单号", prop: "orderBillNo", minWidth: 160, sortable: true },
      { label: "出库单号", prop: "stockBillNo", minWidth: 200, sortable: true }
    ];
    let columnData3: TableColumnList[] = [
      { label: "物料编码", prop: "FNUMBER", minWidth: 160 },
      { label: "型号", prop: "F_DEG_MODEL" },
      { label: "颜色", prop: "FColor" },
      { label: "出库数量", prop: "FNumberQTY", align: "right", sortable: true },
      { label: "占比(出库数量/总出库数量)", prop: "proortion", minWidth: 210, align: "right", sortable: true }
    ];

    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data1, data2, data3] = columnArrs;
    if (data1?.length) columnData = data1;
    if (data2?.length) columnData2 = data2;
    if (data3?.length) columnData3 = data3;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData: columnData, operationColumn: false, radioColumn: { width: 50 } });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: false });
    columns3.value = setColumn({ columnData: columnData3, operationColumn: false });
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };
  const onRefresh = () => getTableList();
  const onRefresh2 = () => getTableList2(rowData.value);
  const onRefresh3 = () => getTableList3(rowData.value);

  const getTableList = () => {
    loading.value = true;
    customerSummaryList(formData)
      .then((res) => {
        loading.value = false;
        if (res.data.length) {
          dataList.value = res.data;
          (singleTableRef.value as any).getTableRef()?.setCurrentRow(res.data[0]);
          getTableList2(res.data[0]);
          getTableList3(res.data[0]);
        }
      })
      .catch((err) => (loading.value = false));
  };

  const getTableList2 = (row: CustomerSummaryItemType) => {
    if (!row?.customId) return;
    loading2.value = true;
    outboundSummaryList({ customerNameId: row.customId, ...formData })
      .then((res) => {
        loading2.value = false;
        dataList2.value = res.data;
      })
      .catch((err) => (loading2.value = false));
  };
  const getTableList3 = (row: CustomerSummaryItemType) => {
    if (!row?.customId) return;
    loading3.value = true;
    materialRatioSummaryList({ customerNameId: row.customId, ...formData })
      .then((res) => {
        loading3.value = false;
        dataList3.value = res.data;
      })
      .catch((err) => (loading3.value = false));
  };

  // 导出
  const onExport = () => {
    // 此方法需要导出3次
    // const headConfig = getExportConfig("客户汇总数列表", columns.value, formData);
    // exportCustomerSummary(headConfig)
    //   .then((res) => {
    //     if (!res.data) return message("导出失败", { type: "error" });
    //     downloadFile(res.data, "客户汇总数列表");
    //   })
    //   .catch(console.log);
    // const headConfig = getExportConfig("出货记录列表", columns2.value, formData);
    // exportOutboundSummary(headConfig)
    //   .then((res) => {
    //     if (!res.data) return message("导出失败", { type: "error" });
    //     downloadFile(res.data, "出货记录列表");
    //   })
    //   .catch(console.log);
    // const headConfig = getExportConfig("物料占比列表", columns3.value, formData);
    // exportMaterialRatioSummary(headConfig)
    //   .then((res) => {
    //     if (!res.data) return message("导出失败", { type: "error" });
    //     downloadFile(res.data, "物料占比列表");
    //   })
    //   .catch(console.log);

    /** 前端导出 */
    downloadDataToExcel([
      { dataList: dataList.value, columns: columns.value, sheetName: "客户排名表" },
      { dataList: dataList2.value, columns: columns2.value, sheetName: "出货记录表" },
      { dataList: dataList3.value, columns: columns3.value, sheetName: "物料占比表" }
    ]);
  };

  /** 自定的统计 */
  const onSummaryMethod = (params: SummaryMethodProps<CustomerSummaryItemType>) => {
    return getSummaries({
      params: params,
      includeProps: [],
      excludeProps: ["year"],
      moneyCommaProps: ["sumSaleMoney"]
    });
  };

  const rowClick = (row: CustomerSummaryItemType) => {
    rowData.value = row;
    getTableList2(row);
    getTableList3(row);
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "default", text: "导出", isDropDown: true }]);

  return {
    columns,
    columns2,
    columns3,
    dataList,
    dataList2,
    dataList3,
    loading,
    loading2,
    loading3,
    maxHeight,
    searchOptions,
    queryParams,
    singleTableRef,
    groupArrsList,
    buttonList,
    onRefresh,
    onRefresh2,
    onRefresh3,
    rowClick,
    onTagSearch,
    onSummaryMethod
  };
};
