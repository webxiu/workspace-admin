import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import dayjs from "dayjs";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { QueryParamsType, SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { downloadRateTableList, exportRateTableList, getRateTableList } from "@/api/oaManage/financeDept";
import { ElMessage, ElMessageBox } from "element-plus";
import { PAGE_CONFIG } from "@/config/constant";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);

  let formData: any = reactive({
    startDate: "",
    endDate: "",
    date: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });
  const nowDay = dayjs().format("YYYY-MM-DD");

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions: SearchOptionType[] = [{ label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }];
  const queryParams = reactive<QueryParamsType>({ date: `${nowDay} ~ ${nowDay}` });

  onMounted(() => {
    getColumnConfig();
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
    return columnData;
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onSearch = () => {
    loading.value = true;
    const { date, ...reset } = formData;
    const [startDate, endDate] = date.split("~").map((item) => item.trim());
    getRateTableList({ ...reset, startDate, endDate })
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

  // 下载
  const onDownload = () => {
    const { date } = formData;
    const [startDate, endDate] = date.split("~").map((item) => item.trim());

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

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    searchOptions,
    queryParams,
    buttonList,
    onRefresh,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
