/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-04-09 16:39:26
 */

import { DonateRecordItemType, donateRecordList, donateRecordOptionList, exportDonateRecord } from "@/api/oaManage/marketing";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { getExportConfig, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";

import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import dayjs from "dayjs";
import { message } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<DonateRecordItemType[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 58 + 48);

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    saleStockYear: "",
    salePeopleId: "",
    customcerGroupId: ""
  });

  const queryParams = reactive<QueryParamsType>({ saleStockYear: dayjs().add(-1, "month").format("YYYY-MM") });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "销售出库时间", value: "saleStockYear", type: "month", format: "YYYY-MM" },
    { label: "销售员", value: "salePeopleId", children: [] },
    { label: "客户组别", value: "customcerGroupId", children: [] }
  ]);

  onMounted(() => {
    getColumnConfig();
    getOptions();
    getTableList();
  });

  const getOptions = () => {
    donateRecordOptionList()
      .then(({ data }) => {
        if (!data) return;
        searchOptions[1].children = data.salePeopleLists?.map((item) => ({ label: item.optionKey, value: item.optionValue }));
        searchOptions[2].children = data.customerGroupLists?.map((item) => ({ label: item.optionKey, value: item.optionValue }));
      })
      .catch(console.log);
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "日期", prop: "fdate", sortable: true },
      { label: "客户名称", prop: "customerName" },
      { label: "产品型号", prop: "model" },
      { label: "颜色", prop: "color" },
      { label: "数量", prop: "qty", align: "right", sortable: true },
      { label: "备注", prop: "note" },
      { label: "业务员", prop: "opeName", sortable: true }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData: columnData, operationColumn: false });
  };

  const handleTagSearch = (values) => {
    formData.saleStockYear = values.saleStockYear;
    formData.salePeopleId = values.salePeopleId;
    formData.customcerGroupId = values.customcerGroupId;
    onSearch();
  };

  const onSearch = () => getTableList();

  const getTableList = () => {
    loading.value = true;
    donateRecordList(formData)
      .then((res: any) => {
        if (res.data) {
          const data = res.data;
          loading.value = false;
          dataList.value = data.records || [];
          pagination.total = data.total;
        }
      })
      .catch((err) => (loading.value = false));
  };

  // 导出
  const onExport = () => {
    const headConfig = getExportConfig("赠送记录", columns.value, formData);
    exportDonateRecord(headConfig)
      .then((res) => {
        if (!res.data) return message("导出失败", { type: "error" });
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log);
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "default", text: "导出", isDropDown: true }]);

  return {
    columns,
    pagination,
    searchOptions,
    dataList,
    loading,
    queryParams,
    maxHeight,
    buttonList,
    onSizeChange,
    onCurrentChange,
    onSearch,
    handleTagSearch
  };
};
