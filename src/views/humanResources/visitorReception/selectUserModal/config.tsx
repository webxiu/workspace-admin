import { onMounted, reactive, ref } from "vue";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { fetchDeptUserList } from "@/api/fileManage";

const columnsDragDom = ref([]);

export const getConfig = () => {
  const columnsDrag: any[] = [
    { label: "选择" },
    { label: "序号", prop: "index" },

    { label: "用户编号", prop: "userCode" },
    { label: "用户名称", prop: "userName" }
  ];

  // 我发起
  const columns: TableColumnList[] = [
    { label: "", type: "selection", headerAlign: "center" },
    {
      label: "序号",
      align: "center",
      type: "index",
      width: 65,
      cellRenderer: ({ $index }) => <span>{$index + 1}</span>
    },
    {
      label: "用户编号",
      prop: (index) => columnsDragDom.value[index].prop as string
    },
    { label: "用户名称", prop: (index) => columnsDragDom.value[index].prop as string }
  ];

  columnsDragDom.value = columnsDrag;

  return columns;
};

export function useUserTable() {
  const columns = ref<TableColumnList[]>([]);
  const dataList: any = ref([]);
  const modalTableRef = ref();
  const currentMultipRow: any = ref({});

  const searchOptions = reactive<SearchOptionType[]>([{ label: "工号", value: "userCode" }]);

  const loading = ref(false);
  onMounted(() => {
    onSearch({ deptId: "0", userCode: "", userName: "" });
  });

  const onSearch = (v) => {
    loading.value = true;
    columns.value = getConfig();
    fetchDeptUserList({ ...v })
      .then((res) => {
        dataList.value = res.data;
      })
      .finally(() => (loading.value = false));
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
