import { onMounted, ref } from "vue";

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
    { label: "", align: "center", width: 62, cellRenderer: () => <el-radio label="&nbsp;" size="large" /> },

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

  // 点击行
  const rowClick = (row, column, event, setA) => {
    if (event.target.tagName === "INPUT") {
      return;
    }
    const { userName, userCode, id } = row;
    if (typeof setA === "function") setA({ userName, userCode, id });
  };

  return {
    columns,
    dataList,
    loading,
    onSearch,
    rowClick
  };
}
