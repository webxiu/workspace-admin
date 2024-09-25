import { fetchSelectableTypeList, fetchSelectedTypeList } from "@/api/plmManage";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import { handleTree } from "@/utils/tree";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const dataList = ref([]);
  const dataList2 = ref([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 123);

  const searchVal = ref({ number: "init" });
  const route = useRoute();
  const router = useRouter();

  onMounted(() => {
    if (route.query.number) {
      searchVal.value.number = route.query.number as string;
    }
  });

  const getTableList = (v?) => {
    loading.value = true;
    fetchSelectableTypeList(v)
      .then((res: any) => {
        loading.value = false;
        const result = handleTree(res.data, "tableId", "tablePid", "children");
        dataList.value = result;
      })
      .catch((err) => (loading.value = false));
  };

  const getTableList2 = (v?) => {
    loading2.value = true;
    fetchSelectedTypeList(v)
      .then((res: any) => {
        loading2.value = false;
        const result = handleTree(res.data, "tableId", "tablePid", "children");
        dataList2.value = result;
      })
      .catch((err) => (loading.value = false));
  };

  // 双击单元格
  const cellDblclick = (row, column) => {
    if (column.property === "number" && row.children) {
      router.push(`/plm/bd/bomInfoAdd?id=${row.bomId}&type=view`);
    }
  };

  const onAdd = () => {
    console.log("add");
    loading.value = true;
  };

  return {
    loading,
    loading2,
    columns,
    columns2,
    dataList,
    dataList2,
    maxHeight,
    cellDblclick,
    getTableList,
    onAdd,
    getTableList2
  };
};
