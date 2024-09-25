import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { setColumn, getMenuColumns, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";

import { exportInStoreList, fetchInStoreList } from "@/api/supplyChain";
import { PAGE_CONFIG } from "@/config/constant";
import dayjs from "dayjs";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);
  const firstDayOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
  const nowDay = dayjs().format("YYYY-MM-DD");

  let formData: any = reactive({
    startTime: "",
    endTime: "",
    fpoorDerNo: "",
    fnumber: "",
    supCode: "",
    date: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions: SearchOptionType[] = [
    { label: "采购单号", value: "fpoorDerNo" },
    { label: "供应商编号", value: "supCode" },
    { label: "入库日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ];
  const queryParams = reactive({ date: `${firstDayOfMonth} ~ ${nowDay}` });

  onMounted(() => {
    getColumnConfig();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "入库日期", prop: "fDate" },
      { label: "入库单号", prop: "fBillNo", minWidth: 200 },
      { label: "采购单号", prop: "fPoorDerNo", minWidth: 200 },
      { label: "物料编号", prop: "fNumber", minWidth: 200 },
      { label: "物料名称", prop: "fName", minWidth: 120 },
      { label: "规格型号", prop: "fSpecification", minWidth: 250 },
      { label: "采购员", prop: "userName" },
      { label: "供应商编号", prop: "supCode" },
      { label: "单位", prop: "unit" },
      { label: "是否赠品", prop: "fGiveaway", slot: "fGiveaway" },
      { label: "单价", prop: "fPrice" },
      { label: "含税单价", prop: "fTaxPrice" },
      { label: "应收数量", prop: "fMustQty" },
      { label: "实收数量", prop: "fRealQty" },
      { label: "税率", prop: "fTaxRate" },
      { label: "税额", prop: "fTaxAmount" },
      { label: "金额", prop: "fAmount" },
      { label: "价税合计", prop: "fAllAmount" },
      { label: "入库制单时间", prop: "fCreateDate", minWidth: 220 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onSearch = () => {
    loading.value = true;
    const { date = "" } = formData;
    const [startTime, endTime] = date.split("~").map((item) => item.trim());
    formData.startTime = startTime;
    formData.endTime = endTime;
    console.log(formData, "req");
    fetchInStoreList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const handleTagSearch = (values = {}) => {
    const { page, limit } = formData;
    Object.keys(values)?.forEach((key) => {
      formData[key] = values[key];
    });
    formData = { ...values };

    formData.page = page;
    formData.limit = limit;
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

  // 导出单据
  const onExport = () => {
    loading.value = true;
    const excelHeader = columns.value.map((item, index) => {
      return { field: item.prop, title: item.label, width: 160, key: `0-${index}}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
    });

    const headConfig = {
      page: 1,
      limit: 100000,
      excel: {
        excelName: "入库清单",
        excelHeader: JSON.stringify(excelHeader)
      },
      startTime: formData.startTime || "",
      endTime: formData.endTime || "",
      supCode: formData.supCode || "",
      fpoorDerNo: formData.fpoorDerNo || "",
      fnumber: formData.fnumber || ""
    };

    exportInStoreList(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    pagination,
    queryParams,
    searchOptions,
    buttonList,
    onRefresh,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
