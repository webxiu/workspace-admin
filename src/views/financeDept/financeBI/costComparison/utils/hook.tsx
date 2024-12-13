import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { DeptInfoItemType } from "@/api/systemManage";
import { exportBomFrontTableData } from "@/api/plmManage";
import { setColumn } from "@/utils/table";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<DeptInfoItemType[]>([]);
  const loading = ref<boolean>(false);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const searchVal = ref({ number: "init" });
  const route = useRoute();
  const router = useRouter();

  onMounted(() => {
    if (route.query.number) {
      searchVal.value.number = route.query.number as string;
    }
    getTableList(searchVal.value);
  });

  const getColumnConfig = () => {
    const columnData: TableColumnList[] = [
      { label: "年期", prop: "YearAndM", width: 200 },
      { label: "产品编码", prop: "PFNUMBER", width: 200 },
      { label: "产品名称", prop: "PFNAME", width: 200 },
      { label: "产品规格", prop: "PFSPECIFICATION", width: 200 },
      { label: "基本单位", prop: "BasicUnit", width: 100 },
      { label: "子物料父级ID", prop: "PFMATERIALID", width: 200 },
      { label: "子物料ID", prop: "FMATERIALID", width: 100 },
      { label: "子物料编码", prop: "FNUMBER", width: 200 },
      { label: "子物料名称", prop: "FNAME", width: 200 },
      { label: "费用名称", prop: "FExpItem", width: 200 },
      { label: "数量", prop: "Qty", width: 100 },
      { label: "单耗", prop: "UnitQty", width: 100 },
      { label: "单位成本", prop: "UnitCost", width: 100 },
      { label: "金额", prop: "Amount", width: 100 }
    ];

    columns.value = setColumn({
      columnData,
      isCustomExpend: true,
      operationColumn: false
    });
    return columnData;
  };
  // =================================================== 员工列表(left) =================================================== */

  const getTableList = (v) => {
    loading.value = true;
    getColumnConfig();
  };

  const onExport = () => {
    loading.value = true;
    const excelHeader = getColumnConfig()
      .map((item, index) => {
        return { field: item.prop, title: item.label, width: 160, key: `0-${index}`, hide: false, colspan: 1, rowspan: 1, type: "normal", colGroup: false };
      })
      .filter((item) => item.field && item.field !== "index");
    // console.log(formData, "formdata");

    const headConfig = {
      excel: {
        excelName: "制造BOM正查",
        excelHeader: JSON.stringify(excelHeader)
      },
      number: searchVal.value.number,
      page: 1,
      limit: 100000
    };

    exportBomFrontTableData(headConfig)
      .then((res: any) => {
        window.open("/api" + res.data, "_blank");
      })
      .catch((err) => {
        console.log("err", err);
      })
      .finally(() => (loading.value = false));
  };

  const handleTagSearch = (v) => {
    searchVal.value = v;

    if (JSON.stringify(v) === "{}") {
      getTableList({ number: "init" });
    } else {
      getTableList(v);
    }
  };

  const onSearch = () => {
    handleTagSearch(searchVal.value);
  };

  // 双击单元格
  const cellDblclick = (row, column) => {
    if (column.property === "number" && row.children) {
      router.push(`/plm/bd/bomInfoAdd?id=${row.bomId}&type=view`);
    }
  };

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    cellDblclick,
    onSearch,
    onExport,
    handleTagSearch
  };
};
