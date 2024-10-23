/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2023-12-09 14:42:20
 */

import { exportBomBackTableData, fetchBomBackTableData } from "@/api/plmManage";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { DeptInfoItemType } from "@/api/systemManage";
import { handleTree } from "@/utils/tree";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<DeptInfoItemType[]>([]);
  const loading = ref<boolean>(false);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const router = useRouter();

  const searchVal = ref({ number: "init", containDisplayBOM: false });
  const route = useRoute();

  onMounted(() => {
    getColumnConfig(buttonList);

    if (route.query.number) {
      searchVal.value.number = route.query.number as string;
    }
    getTableList(searchVal.value);
  });

  const getColumnConfig = async (buttonList) => {
    let columnData: TableColumnList[] = [
      { label: "物料编号", prop: "number", width: 200 },
      { label: "物料名称", prop: "name", width: 220 },
      { label: "物料规格", prop: "specification", width: 220 },
      { label: "基本单位", prop: "baseUnitName", width: 90 },
      { label: "子项单位", prop: "itemUnitName", width: 90 },
      { label: "分子", prop: "numerator", width: 60 },
      { label: "分母", prop: "denominator", width: 60 },
      { label: "固定损耗", prop: "fixscrapqty", width: 90 },
      { label: "变动损耗率", prop: "scraprate", width: 100 },
      { label: "物料禁用状态", prop: "forbidStatus" },
      { label: "BOM禁用状态", prop: "forbidStatusBom" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) {
      columnData = menuCols;
    }

    updateButtonList(buttonList, buttonArrs[0]);

    columns.value = setColumn({
      columnData,
      isCustomExpend: true,
      operationColumn: false
    });

    return columnData;
  };

  const getTableList = (v) => {
    loading.value = true;
    fetchBomBackTableData({ ...v, currPage: 1, pageSize: 10000 })
      .then((res: any) => {
        loading.value = false;
        const result = handleTree(res.data.records, "childId", "parentId", "children");
        dataList.value = result;
      })
      .catch((err) => (loading.value = false));
  };

  const onExport = async () => {
    loading.value = true;
    const calcHeader = columns.value
      .map((item, index) => {
        return { field: item.prop, title: item.label, width: 160, key: `0-${index}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
      })
      .filter((item) => item.field && item.field !== "index");

    const headConfig = {
      excel: {
        excelName: "制造BOM反查",
        excelHeader: JSON.stringify(calcHeader)
      },
      number: searchVal.value.number,
      page: 1,
      limit: 100000
    };

    exportBomBackTableData(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const handleTagSearch = (v) => {
    console.log(v, "v");
    searchVal.value = v;

    if (JSON.stringify(v) === "{}") {
      getTableList({ number: "init" });
    } else {
      getTableList(searchVal.value);
    }
  };

  const onSearch = () => {
    handleTagSearch(searchVal.value);
  };

  const onFresh = () => {
    getColumnConfig(buttonList);
    onSearch();
  };

  // 双击单元格
  const cellDblclick = (row, column) => {
    if (column.property === "number" && row.bomId) {
      router.push(`/plmManage/basicData/bomMgmt/edit?id=${row.bomId}&type=edit&isNewTag=yes&menuId=${route.query.menuId}`);
    }
  };

  const clickHandler = ({ text }) => {
    if (text === "导出") {
      onExport();
    }
  };

  const buttonList = ref<ButtonItemType[]>([{ clickHandler, type: "primary", text: "导出", isDropDown: true }]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    buttonList,
    onSearch,
    onFresh,
    cellDblclick,
    onExport,
    handleTagSearch
  };
};
