/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:23:53
 */

import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import {
  exportSaleAchievementSummary,
  exportSaleNumberSummary,
  saleAchievementSummaryList,
  saleNumberSummaryList,
  saleNumberSummaryOptionList
} from "@/api/oaManage/marketing";
import { formatMoneyComma, getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";

import dayjs from "dayjs";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const dataList = ref<Array<any>>([]);
  const dataList2 = ref<Array<any>>([]);
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 76);

  const formData = reactive({ page: 1, limit: 10000, salePeopleId: "", saleStockYear: "" });
  const searchOptions = reactive<SearchOptionType[]>([{ label: "销售员", value: "salePeopleId", children: [] }]);

  onMounted(() => {
    getOptions();
    getColumnConfig();
    onSearch();
  });

  const getOptions = () => {
    saleNumberSummaryOptionList()
      .then(({ data }) => {
        if (!data) return;
        const result1 = data.salePeopleLists.map((item) => ({ label: item.optionKey, value: item.optionValue }));
        searchOptions[0].children = result1;
      })
      .catch(console.log);
  };

  const getColumnConfig = async () => {
    const cellRenderer: any = ({ row, column }) => <span>{formatMoneyComma(row[column["property"]])}</span>;
    const comColumn: TableColumnList[] = [
      { label: "一月", prop: "01", align: "right", sortable: true, cellRenderer },
      { label: "二月", prop: "02", align: "right", sortable: true, cellRenderer },
      { label: "三月", prop: "03", align: "right", sortable: true, cellRenderer },
      { label: "四月", prop: "04", align: "right", sortable: true, cellRenderer },
      { label: "五月", prop: "05", align: "right", sortable: true, cellRenderer },
      { label: "六月", prop: "06", align: "right", sortable: true, cellRenderer },
      { label: "七月", prop: "07", align: "right", sortable: true, cellRenderer },
      { label: "八月", prop: "08", align: "right", sortable: true, cellRenderer },
      { label: "九月", prop: "09", align: "right", sortable: true, cellRenderer },
      { label: "十月", prop: "10", align: "right", sortable: true, cellRenderer },
      { label: "十一月", prop: "11", align: "right", sortable: true, cellRenderer },
      { label: "十二月", prop: "12", align: "right", sortable: true, cellRenderer }
    ];
    let columnData: TableColumnList[] = [
      { label: "年份", prop: "year", align: "right", sortable: true },
      { label: "业务员", prop: "opeName" },
      ...comColumn,
      { label: "汇总", prop: "allSum", align: "right", sortable: true, cellRenderer }
    ];
    let columnData2: TableColumnList[] = [
      { label: "年份", prop: "year", align: "right", sortable: true },
      { label: "业务员", prop: "opeName" },
      ...comColumn,
      { label: "汇总", prop: "oneYearSum", align: "right", sortable: true, cellRenderer }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData: columnData, operationColumn: false });
    columns2.value = setColumn({ columnData: columnData2, operationColumn: false });
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };
  const onSearch = () => {
    getNumberList();
    getAchievementList();
  };

  const getNumberList = () => {
    loading.value = true;
    saleNumberSummaryList(formData)
      .then((res) => {
        loading.value = false;
        dataList.value = res.data;
      })
      .catch((err) => (loading.value = false));
  };

  const getAchievementList = () => {
    loading2.value = true;
    saleAchievementSummaryList(formData)
      .then((res) => {
        loading2.value = false;
        dataList2.value = res.data;
      })
      .catch((err) => (loading2.value = false));
  };

  // 导出
  const onExport = () => {
    const headConfig = getExportConfig("销售数量", columns.value, { ...formData, saleStockYear: dayjs().format("YYYY") });
    exportSaleNumberSummary(headConfig)
      .then((res) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };
  // 导出
  const onExport2 = () => {
    const headConfig = getExportConfig("销售业绩", columns2.value, { ...formData, saleStockYear: dayjs().format("YYYY") });
    exportSaleAchievementSummary(headConfig)
      .then((res) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onExport, type: "default", text: "导出销售数量", isDropDown: true },
    { clickHandler: onExport2, type: "default", text: "导出销售业绩", isDropDown: true }
  ]);

  return {
    columns,
    columns2,
    dataList,
    dataList2,
    loading,
    buttonList,
    loading2,
    maxHeight,
    searchOptions,
    onTagSearch
  };
};
