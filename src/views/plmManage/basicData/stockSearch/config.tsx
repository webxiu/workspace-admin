import { onMounted, reactive, ref } from "vue";
import { TeamMemberItemType } from "@/api/workbench/teamManage";

import { type PaginationProps } from "@pureadmin/table";
import { useEleHeight } from "@/hooks";
import { exportStockList, fetchStockList, fetchSearchSelectStockList, getMaterialGroupTreeData } from "@/api/plmManage";
import { getMenuColumns, setColumn, updateButtonList, getExportConfig } from "@/utils/table";
import { PAGE_CONFIG } from "@/config/constant";
import { message } from "@/utils/message";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import type { ColDef } from "ag-grid-community";
import { getAgGridColumns } from "@/components/AgGridTable/config";

export function useTable() {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const curNodeName = ref("0");
  const curNodeLabel = ref();
  const loading = ref<boolean>(false);
  const dataList = ref<TeamMemberItemType[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const categoryTreeData = ref([]);
  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    stockNoLineName: "",
    stock: "",
    stockName: "",
    groupIdList: []
  });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "物料名称", value: "name" },
    { label: "仓库", value: "stockNoLineName", children: [] }
  ]);

  onMounted(async () => {
    getOptions();
    getColumnConfig();
  });

  const getOptions = () => {
    getMaterialGroupTreeData({}).then((res: any) => {
      if (res.data) categoryTreeData.value = res.data;
    });
    fetchSearchSelectStockList({}).then((res: any) => {
      if (res.data) {
        searchOptions[1].children = res.data.map((item) => ({ label: item.fname, value: item.fnumber + "-" + item.fname }));
      }
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "物料编码", fixed: true, prop: "fmaterialnumber", minWidth: 200 },
      { label: "物料名称", prop: "fmaterialname", minWidth: 240, fixed: true },
      { label: "规格型号", prop: "fspecification", minWidth: 260 },
      { label: "仓库名称", prop: "fstockname", minWidth: 120 },
      { label: "批号", prop: "flotnumber", minWidth: 120 },
      { label: "库存主单位", prop: "funitname", minWidth: 120 },
      { label: "库存量", prop: "fbaseqty", minWidth: 120 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    columnDefs.value = getAgGridColumns({ columnData, operationColumn: false });
  };

  const handleNodeClick = (treeItem) => {
    curNodeName.value = treeItem.id;
    curNodeLabel.value = treeItem.groupCode;
    const finalArr = [];
    const loopFindId = (item) => {
      finalArr.push(item.id);
      if (item.children && Array.isArray(item.children) && item.children.length) {
        item.children.forEach((el) => {
          loopFindId(el);
        });
      }
    };
    loopFindId(treeItem);
    formData.groupIdList = treeItem.id !== "0" ? finalArr : [];
    onSearch();
  };

  const onSearch = () => {
    const { stockNoLineName = "" } = formData;
    if (stockNoLineName) {
      const [fnumber, fname] = stockNoLineName.split("-").map((item) => item.trim());
      formData.stock = fnumber;
      formData.stockName = fname;
    }

    loading.value = true;
    fetchStockList(formData)
      .then((res: any) => {
        const { total, records } = res.data;
        loading.value = false;
        pagination.total = total;
        dataList.value = records || [];
      })
      .catch((err) => (loading.value = false));
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, { ...values, page: 1 });
    onSearch();
  };

  // 导出
  const onExport = () => {
    loading.value = true;
    const headConfig = getExportConfig("库存查询", columns.value, formData);
    exportStockList(headConfig)
      .then((res: any) => {
        if (!res.data) return message.error("导出失败");
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      })
      .catch(console.log)
      .finally(() => (loading.value = false));
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

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
  }

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }]);

  return {
    isAgTable,
    columnDefs,
    loading,
    dataList,
    columns,
    pagination,
    maxHeight,
    curNodeName,
    buttonList,
    searchOptions,
    categoryTreeData,
    onFresh,
    onTagSearch,
    handleNodeClick,
    handleSizeChange,
    handleCurrentChange,
    onSwitchTable
  };
}
