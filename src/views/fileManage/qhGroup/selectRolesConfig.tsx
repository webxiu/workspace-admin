import { onMounted, ref } from "vue";

import { fetchRolesList } from "@/api/fileManage";

export type HandleType = "add" | "edit";

const columnsDragDom = ref([]);

export const getConfig = () => {
  const columnsDrag: any[] = [
    { label: "选择" },
    { label: "序号", prop: "index" },
    { label: "角色ID", prop: "id" },
    { label: "角色编号", prop: "roleCode" },
    { label: "角色名称", prop: "roleName" },
    { label: "角色描述", prop: "remark" }
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
      label: "角色ID",
      width: 75,

      prop: (index) => columnsDragDom.value[index].prop as string
    },
    { label: "角色编号", prop: (index) => columnsDragDom.value[index].prop as string, width: 88 },
    { label: "角色名称", prop: (index) => columnsDragDom.value[index].prop as string, width: 140 },
    { label: "角色描述", prop: (index) => columnsDragDom.value[index].prop as string }
  ];

  columnsDragDom.value = columnsDrag;

  return columns;
};

export function useRolesTable() {
  const columns = ref<TableColumnList[]>([]);
  const dataList: any = ref([]);

  const loading = ref(false);
  onMounted(() => {
    onSearch({ deptId: "0", userCode: "", userName: "" });
  });

  const onSearch = (v?) => {
    loading.value = true;
    columns.value = getConfig();
    fetchRolesList({ page: 1, limit: 10000 })
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
    if (typeof setA === "function") setA({ ...row });
  };

  return {
    columns,
    dataList,
    loading,
    rowClick
  };
}
