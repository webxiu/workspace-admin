import { onMounted, reactive, ref } from "vue";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { fetchDormitoryAllBuliding } from "@/api/oaManage/humanResources";
import { setColumn } from "@/utils/table";

export function useUserTable(props) {
  const columns = ref<TableColumnList[]>([]);
  const dataList: any = ref([]);
  const modalTableRef = ref();
  const currentMultipRow: any = ref({});

  const searchOptions = reactive<SearchOptionType[]>([{ label: "房间号", value: "userCode" }]);

  const loading = ref(false);
  onMounted(() => {
    getConfig();
    onSearch();
  });

  const getConfig = () => {
    // 我发起
    const columnData: TableColumnList[] = [
      {
        label: "宿舍楼层",
        prop: "floorNo"
      },
      { label: "宿舍房间", prop: "dormitoryCode" }
    ];

    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const onSearch = () => {
    loading.value = true;
    fetchDormitoryAllBuliding({ buildingCode: props.curBuildingsId?.value })
      .then((res: any) => {
        console.log(res.data, "zooms");
        if (res.data) {
          const muchArr = res.data.map((item) => item.value);
          dataList.value = muchArr.flat(Infinity);
        }
      })
      .finally(() => (loading.value = false));
  };

  const handleTagSearch = (values = {}) => {
    onSearch();
  };

  // 点击行
  const rowClick = (row, column, event, setA) => {
    // modalTableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  const selectMultipeChange = (data, setA) => {
    currentMultipRow.value = data;
    setA(data);
  };

  return {
    columns,
    dataList,
    selectMultipeChange,
    handleTagSearch,
    searchOptions,
    modalTableRef,
    loading,
    onSearch,
    rowClick
  };
}
