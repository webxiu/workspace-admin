import { onMounted, reactive, ref } from "vue";

import { fetchMachine } from "@/api/oaManage/humanResources";
import { setColumn } from "@/utils/table";

export const useMachine = () => {
  const dataList: any = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const currentRow = ref();
  const selectedRows = ref([]);

  const formData: any = reactive({});

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    const columnData: TableColumnList[] = [
      { label: "名称", prop: "attMachineName" },
      { label: "序列号", prop: "sn" }
    ];

    columns.value = setColumn({ columnData, operationColumn: false, radioColumn: { hide: true }, selectionColumn: { hide: false } });
    return columnData;
  };

  const onSearch = () => {
    fetchMachine(formData).then((res) => {
      if (res.data) {
        dataList.value = res.data;
      }
    });
  };

  const handleTagSearch = (val) => {
    formData.sn = val.sn;
    formData.description = val.description;
    formData.attMachineName = val.attMachineName;
    onSearch();
  };

  const rowDbclick = (row) => {
    // selectedRows.value = [row];
  };
  const rowClick = (row) => {
    currentRow.value = row;
    // selectedRows.value = [row];
  };

  const handleSelectionChange = (rows) => {
    selectedRows.value = rows;
  };

  return {
    columns,
    handleTagSearch,
    rowClick,
    rowDbclick,
    selectedRows,
    handleSelectionChange,
    dataList
  };
};
