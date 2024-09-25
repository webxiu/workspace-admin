import { onMounted, reactive, ref } from "vue";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { fetchDeptUserList } from "@/api/fileManage";
import { setColumn } from "@/utils/table";

const columns = ref<TableColumnList[]>([]);

export function useUserTable() {
  const dataList: any = ref([]);
  const modalTableRef = ref();
  const curSingleRow: any = ref({});
  const currentMultipRow: any = ref({});

  const searchOptions = reactive<SearchOptionType[]>([{ label: "工号", value: "userCode" }]);

  const getConfig = () => {
    const columnData: TableColumnList[] = [
      { label: "用户编号", prop: "userCode" },
      { label: "用户名称", prop: "userName" }
    ];

    columns.value = setColumn({ columnData, operationColumn: false });
  };

  onMounted(() => {
    getConfig();
    onSearch({ deptId: "0", userCode: "", userName: "" });
  });

  const onSearch = (v) => {
    fetchDeptUserList({ ...v }).then((res) => {
      dataList.value = res.data;
    });
  };

  const handleTagSearch = (values = {}) => {
    // const { page, limit } = formData;
    // Object.keys(values)?.forEach((key) => {
    //   formData[key] = values[key];
    // });
    // formData = { ...values };

    // formData.page = page;
    // formData.limit = limit;
    onSearch({ deptId: "0", userCode: "", userName: "", ...values });
  };

  // 点击行
  const rowClick = (row, column, event, setA) => {
    // modalTableRef.value?.getTableRef()?.toggleRowSelection(row);
    curSingleRow.value = row;
    setA(row);
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
    onSearch,
    rowClick
  };
}
