import { Download } from "@element-plus/icons-vue";
import { fetchOweMaterialList, exportOweMaterialList } from "@/api/oaManage/productMkCenter";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { useEleHeight } from "@/hooks";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { PAGE_CONFIG } from "@/config/constant";
import { type PaginationProps } from "@pureadmin/table";

export const useConfig = () => {
  const tableRef = ref();
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({
    materialNumber: "",
    materialName: "",
    goodNumber: "",
    goodName: "",
    billNo: "",
    day: 1,
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "子物料名称", value: "materialName" },
    { label: "产品编码", value: "goodNumber" },
    { label: "产品名称", value: "goodName" },
    { label: "生产订单", value: "billNo" }
  ]);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "生产订单", prop: "FBILLNO", align: "center" },
      { label: "订单数量", prop: "FQTY", align: "center" },
      { label: "产品名称", prop: "FNAME", align: "center" },
      { label: "子物料编码", prop: "FCHILDNUMBER", align: "center" },
      { label: "子物料名称", prop: "FCHILDNAME", align: "center" },
      { label: "子物料规格", prop: "FCHILDSPECIFICATION", align: "center" },
      { label: "分子", prop: "FNUMERATOR", align: "center" },
      { label: "分母", prop: "FDENOMINATOR", align: "center" },
      { label: "应发数量", prop: "FMUSTQTY", align: "center" },
      { label: "已领数量", prop: "FPICKEDQTY", align: "center" },
      { label: "即时库存", prop: "FSTOCKQTY", align: "center" },
      { label: "欠料数量", prop: "FOWEQTY", align: "center" },
      { label: "待检数", prop: "FINSPECTQTY", align: "center" },
      { label: "当日占用", prop: "FTODAYOCCUPYQTY", align: "center" },
      { label: "剩余入库数量", prop: "FREMAINSTOCKINQTY", align: "center" },
      { label: "剩余收料数量", prop: "FREMAINRECEIVEQTY", align: "center" },
      { label: "总应发数量", prop: "FTOTALMUSTQTY", align: "center" },
      { label: "申请数量(未转订单)", prop: "FAPPROVEQTY", align: "center" },
      { label: "委外数量(未转订单)", prop: "FSUBREQQTY", align: "center" },
      { label: "产品编号", prop: "FNUMBER", align: "center" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onRefresh = () => getTableList();

  // 搜索
  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const getTableList = () => {
    fetchOweMaterialList(formData).then((res: any) => {
      if (res.data) {
        const data = res.data;
        dataList.value = data.data || [];
        pagination.total = data.totalCount;
      }
    });
  };

  const onExport = () => {
    exportOweMaterialList(formData).then((res: any) => {
      if (res.data) {
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName);
      }
    });
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true }]);

  const initBtns = [];
  const daysArr = ["一", "二", "三", "四", "五", "六", "七"];

  for (let i = 0; i < 7; i++) {
    initBtns.push({ title: daysArr[i], key: i + 1 });
  }

  const dayBtnList = ref(initBtns);

  const clickDayBtn = (itemBtn) => {
    formData.day = itemBtn.key;
    getTableList();
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

  return {
    tableRef,
    dayBtnList,
    formData,
    columns,
    dataList,
    pagination,
    onSizeChange,
    onCurrentChange,
    maxHeight,
    clickDayBtn,
    searchOptions,
    buttonList,
    onRefresh,
    onTagSearch
  };
};
