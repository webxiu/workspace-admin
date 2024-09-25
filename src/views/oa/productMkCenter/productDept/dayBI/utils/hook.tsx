import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { exportInStoreList, fetchInStoreList } from "@/api/supplyChain";
import { exportProductDayBI, exportProductDetailList, fetchProductDetailList, getProductDayBI } from "@/api/oaManage/productMkCenter";

import { cloneDeep } from "@pureadmin/utils";
import { PAGE_CONFIG } from "@/config/constant";
import dayjs from "dayjs";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 45);
  const firstDayOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
  const nowDay = dayjs().format("YYYY-MM-DD");
  const initDateRange = `${firstDayOfMonth} ~ ${nowDay}`;

  const formData: any = reactive({
    date: "",
    startDate: "",
    endDate: "",
    // fName: "",
    // fMobillno: "",
    // fNumber: "",
    number: "",
    name: "",
    mobillno: ""
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions: SearchOptionType[] = [
    { label: "生产线", value: "name" },
    { label: "物料编码", value: "number" },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ];

  const queryParams = reactive<QueryParamsType>({ date: initDateRange });

  onMounted(() => {
    getColumnConfig();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "生产日期", prop: "FCREATEDATE", width: 120 },
      { label: "生产线", prop: "FNAME", width: 90 },
      { label: "生产工单号", prop: "FMOBILLNO", width: 120 },
      { label: "物料编码", prop: "FNUMBER", minWidth: 150 },
      { label: "机型", prop: "aircraftType", minWidth: 130 },
      { label: "订单数量", prop: "FQTY", width: 100 },
      { label: "出货地点", prop: "FDATAVALUE", minWidth: 100 },
      { label: "产品类型", prop: "productType", minWidth: 100 },
      { label: "标准人数", prop: "F_DEG_STANDARDPERSONCOUNT", width: 90 },
      { label: "标准产能/H", prop: "F_DEG_CAPACITY_H", width: 100 },
      { label: "人均产能(UPPH)", prop: "percapitaCapacity", width: 130 },
      { label: "实际标准总工时", prop: "Actualstandardtotalhoursworked", width: 150 },
      { label: "标准产能", prop: "F_DEG_CAPACITY", width: 90 },
      { label: "标准单机成本", prop: "standardCostPer", width: 110 },
      { label: "员工人数", prop: "FHUMANQTY", width: 90 },
      { label: "管理人数", prop: "F_DEG_MANAGERCOUNT", width: 90 },
      { label: "上班时长(H)", prop: "F_DEG_WORKTIME", width: 100 },
      { label: "员工总工时(H)", prop: "employeeHours", width: 110 },
      { label: "管理总工时(H)", prop: "workingHours", width: 110 },
      {
        label: "投入数(PCS)",
        prop: "F_DEG_PUTINTOQTY",
        width: 110
      },
      { label: "产出数(H)", prop: "FREALQTY" },
      { label: "累计产能", prop: "FSTOCKINQUAQTY", width: 90 },
      { label: "订单差额", prop: "orderBalance", width: 90 },
      { label: "生产效率(%)", prop: "productionEfficiency", width: 100 },
      { label: "功能不良", prop: "F_DEG_FUNCTIONDEFECTIVE", width: 90 },
      { label: "外观不良", prop: "F_DEG_EXTERIORDETECTIVE", width: 90 },
      { label: "产品良率", prop: "productYield", width: 90 },
      { label: "单机成本(元)", prop: "CostPer", width: 110 },
      { label: "标准与实际单价差异", prop: "priceDifference", width: 150 },
      { label: "异常情况说明", prop: "F_DEG_ABNORMALMEMO", width: 160 },
      { label: "损耗工时(H)", prop: "F_DEG_LOSSTIME", width: 100 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) {
      columnData = menuCols;
    }
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onSearch = () => {
    loading.value = true;
    const { date = "" } = formData;
    const [startDate, endDate] = date.split("~").map((item) => item.trim());
    formData.startDate = startDate;
    formData.endDate = endDate;
    console.log(formData, "req");
    const copyData = cloneDeep(formData);
    delete copyData.date;
    getProductDayBI(copyData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data;
        pagination.total = data.length;
      })
      .catch((err) => (loading.value = false));
  };

  const handleTagSearch = (values: any) => {
    formData.name = values.name || "";
    formData.number = values.number || "";
    formData.mobillno = values.mobillno || "";
    formData.date = values.date || "";
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
      ...formData,
      page: 1,
      limit: 100000,
      excel: {
        excelName: "生产日报",
        excelHeader: JSON.stringify(excelHeader)
      },
      type: 0,
      startTime: ""
    };

    exportProductDayBI(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const buttonList = ref<ButtonItemType[]>([
    {
      clickHandler: onExport,
      type: "default",
      text: "导出",
      isDropDown: true
    }
  ]);

  return {
    loading,
    columns,
    buttonList,
    dataList,
    maxHeight,
    pagination,
    queryParams,
    searchOptions,
    onSearch,
    onExport,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
