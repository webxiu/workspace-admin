import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { exportInStoreList, fetchInStoreList } from "@/api/supplyChain";
import { exportProductDetailList, fetchProductDetailList } from "@/api/oaManage/productMkCenter";

import { PAGE_CONFIG } from "@/config/constant";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 45);

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    billNo: "",
    parentmaterial: "",
    material: "",
    planTime: "",
    stockNum: "0",
    type: 0
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions: SearchOptionType[] = [
    { label: "父物料编号", value: "parentmaterial" },
    { label: "子物料编号", value: "material" },
    {
      label: "是否欠料",
      value: "stockNum",
      children: [
        { label: "已欠料", value: "-1" },
        { label: "未欠料", value: "1" }
      ]
    },
    { label: "计划时间", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ];

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "生产线", prop: "PRODLINENAME", width: 60 },
      { label: "生产订单号", prop: "FBILLNO", width: 120 },
      { label: "父物料编号", prop: "FPNUMBER", width: 120 },
      { label: "父物料名称", prop: "FPNAME", minWidth: 200 },
      { label: "父物料规格", prop: "FPSPECIFICATION", minWidth: 320 },
      { label: "子物料编号", prop: "FNUMBER", width: 120 },
      { label: "子物料名称", prop: "FNAME", minWidth: 160 },
      { label: "子物料规格", prop: "FSPECIFICATION", minWidth: 320 },
      { label: "请购数量", prop: "FREQQTY", width: 90 },
      { label: "剩余收料数量", prop: "FREMAINRECEIVEQTY", width: 120 },
      { label: "收料数量", prop: "FRECEIVEQTY", width: 90 },
      { label: "待检数量", prop: "FWAITQUALIFIEDQTY", width: 90 },
      { label: "不合格数量", prop: "FUNQUALIFIEDQTY", width: 90 },
      { label: "待入库数量", prop: "FUNINSTOCKQTY", width: 90 },
      { label: "已领数量", prop: "FPICKEDQTY", width: 90 },
      { label: "未领数量", prop: "FNOPICKEDQTY", width: 90 },
      { label: "退料数量", prop: "TuiQTY", width: 90 },
      { label: "未耗数量", prop: "FWIPQTY", width: 90 },
      { label: "其它占用", prop: "FMUSTQTY", width: 90 },
      {
        label: "总未领数量",
        prop: "FTOTALNOPICKEDQTY",
        width: 90,
        cellRenderer({ row }) {
          return <span>{Math.floor(row.FTOTALNOPICKEDQTY) + ""}</span>;
        }
      },
      { label: "现库存", prop: "FSTOCKQTY" },
      { label: "单位", prop: "FUNAME", width: 60 }
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
    const [startTime, endTime] = date.split("~").map((item) => item.trim());
    formData.startTime = startTime;
    formData.endTime = endTime;
    console.log(formData, "req");
    fetchProductDetailList(formData)
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.data;
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const handleTagSearch = (values: any) => {
    const { page, limit } = formData;

    formData.billNo = values.billNo || "";
    formData.limit = limit;
    formData.page = page;
    formData.parentmaterial = values.parentmaterial;
    formData.material = values.material;
    formData.stockNum = values.stockNum || "0";
    formData.type = 0;
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
        excelName: "三天齐套率",
        excelHeader: JSON.stringify(excelHeader)
      },
      type: 0,
      startTime: ""
    };

    exportProductDetailList(headConfig)
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
    searchOptions,
    onSearch,
    onExport,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
