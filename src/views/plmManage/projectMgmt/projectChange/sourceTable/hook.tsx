import { onMounted, ref } from "vue";
import { setColumn, tableEditRender } from "@/utils/table";

export const useSourceTable = () => {
  const maxHeight = ref(300);
  const dataList = ref([]);
  const dataList2 = ref([]);
  const columns = ref([]);
  const columns2 = ref([]);

  const getConfig = () => {
    // 编辑表格
    const editTable1 = tableEditRender();
    const editTable2 = tableEditRender();

    const columnsData: TableColumnList[] = [
      { label: "责任角色", prop: "roleName" },
      {
        label: "成员",
        prop: "resUserOptions",
        cellRenderer: (data) => {
          const options = data.row?.userInfoVOList?.map(({ userName, id }) => ({ optionName: userName, optionValue: id }));
          return editTable1.editCellRender({ type: "select", data, options: options, cellStyle: { color: "#606266", textAlign: "left" } });
        }
      }
    ];
    const columnsData2: TableColumnList[] = [
      { label: "相关角色", prop: "roleName" },
      {
        label: "成员",
        prop: "relateUserOptions",
        cellRenderer: (data) => {
          const options = data.row?.userInfoVOList?.map(({ userName, id }) => ({ optionName: userName, optionValue: id }));
          return editTable2.editCellRender({ type: "select", data, options: options, cellStyle: { color: "#606266", textAlign: "left" } });
        }
      }
    ];

    columns.value = setColumn({ columnData: columnsData, operationColumn: false });
    columns2.value = setColumn({ columnData: columnsData2, operationColumn: false });
  };

  onMounted(() => {
    getConfig();
  });

  return { maxHeight, dataList, columns, dataList2, columns2 };
};
