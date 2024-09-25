import { deleteMachine, fetchMachine, registerMachine, updateMachine } from "@/api/oaManage/humanResources";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { utils, write } from "xlsx";

import EditForm from "@/components/EditForm/index.vue";
import { ElMessage } from "element-plus";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { saveAs } from "file-saver";
import { showMessageBox } from "@/utils/message";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const dataList: any = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const currentRow = ref();
  const selectedRows = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);

  const formData: any = reactive({});

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "描述", value: "description" },
    { label: "名称", value: "attMachineName" }
  ]);

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

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (val) => {
    formData.sn = val.sn;
    formData.description = val.description;
    formData.attMachineName = val.attMachineName;
    onSearch();
  };

  const onExport = () => {
    const timeStep = Date.now();
    const workbook = utils.table_to_book(document.querySelector("#machineTableId"), {
      raw: true //有的是日期、小数等格式，直接乱码#。所以这里直接保留原始字符串
    });
    workbook.Sheets.Sheet1["!cols"][0] = { hidden: true };
    const wbout = write(workbook, {
      bookType: "xlsx",
      bookSST: true,
      type: "array"
    });
    saveAs(
      new Blob([wbout], {
        type: "application/octet-stream"
      }),
      `考勤机管理${timeStep}.xlsx`
    );
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    console.log(type, data);
    const apiType = { add: registerMachine, edit: updateMachine };
    apiType[type](data).then((res) => {
      if (res.data) {
        ElMessage({ message: `${title}成功`, type: "success" });
        callback();
      }
    });
  };

  const rowDbclick = (row) => {};
  const rowClick = (row) => {
    currentRow.value = row;
  };

  const handleSelectionChange = (rows) => {
    selectedRows.value = rows;
  };

  return {
    columns,
    handleTagSearch,
    rowClick,
    rowDbclick,
    handleSelectionChange,
    selectedRows,
    dataList
  };
};
