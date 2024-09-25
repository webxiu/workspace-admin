import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { setColumn } from "@/utils/table";
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
    fPoorDerNo: "",
    fNumber: "",
    supCode: "",
    date: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions: SearchOptionType[] = [
    { label: "采购单号", value: "fPoorDerNo" },
    { label: "供应商编号", value: "supCode" },
    { label: "入库日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ];
  const queryParams = reactive({ date: `${firstDayOfMonth} ~ ${nowDay}` });

  const getColumnConfig = () => {
    const columnData: TableColumnList[] = [
      { label: "ECN编号", prop: "fDate" },
      { label: "状态", prop: "fBillNo" },
      { label: "变更型号", prop: "fPoorDerNo" },
      { label: "变更来源", prop: "fNumber" },
      { label: "变更原因", prop: "fName" },
      { label: "变更类型", prop: "fSpecification" },
      { label: "变更说明", prop: "userName" },
      { label: "变更支持说明", prop: "supCode" },
      { label: "验证报告", prop: "unit" },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate" }
    ];
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onSearch = () => {
    loading.value = true;
    const { date = "" } = formData;
    const [startTime, endTime] = date.split("~").map((item) => item.trim());
    formData.startTime = startTime;
    formData.endTime = endTime;
    fetchInStoreList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        getColumnConfig();
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

  // 表格按钮操作
  const businessAction = ({ text }) => {
    console.log(text, "text");
  };

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
        excelName: "订单回签",
        excelHeader: JSON.stringify(excelHeader)
      },
      startTime: formData.startTime || "",
      endTime: formData.endTime || "",
      supCode: formData.supCode || "",
      fpoorDerNo: formData.fPoorDerNo || "",
      fnumber: formData.fNumber || ""
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

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: businessAction, type: "primary", text: "新增" },
    { clickHandler: businessAction, type: "primary", text: "修改" },
    { clickHandler: businessAction, type: "primary", text: "删除" },
    { clickHandler: businessAction, type: "primary", text: "导出" },
    { clickHandler: businessAction, type: "primary", text: "打印" },
    { clickHandler: businessAction, type: "primary", text: "提交" }
  ]);

  return {
    columns,
    dataList,
    loading,
    maxHeight,
    pagination,
    queryParams,
    searchOptions,
    buttonList,
    onSearch,
    onExport,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
