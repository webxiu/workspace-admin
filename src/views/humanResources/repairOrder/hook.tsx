import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { exportAttendanceRecord, fetchAttendanceRecord, fetchMachine } from "@/api/oaManage/humanResources";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";
import { utils, write } from "xlsx";

import type { ColDef } from "ag-grid-community";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import { getDeptOptions } from "@/utils/requestApi";
import { message } from "@/utils/message";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const machineOptions = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData = reactive({
    model: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const nowDate = dayjs().format("YYYY-MM-DD");
  const queryParams = reactive({ date: `${nowDate} ~ ${nowDate}` });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "规格型号", value: "model" },
    { label: "完成日期", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" }
  ]);

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "设备名称", prop: "deviceName" },
      { label: "规格型号", prop: "model" },
      { label: "异常描述", prop: "errDes" },
      { label: "要求完成日期", prop: "finishDate" },
      { label: "维修所需物品", prop: "needThings" },
      { label: "请购金额预算", prop: "money" },
      { label: "附件", prop: "attr" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    columnDefs.value = getAgGridColumns({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    // fetchAttendanceRecord(formData).then((res: any) => {
    //   if (res.data) {
    //     dataList.value = res.data.records || [];
    //     pagination.total = res.data.total;
    //   }
    // });
    dataList.value = [];
    pagination.total = 0;
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  const onExport = () => {
    // exportAttendanceRecord({ ...formData, limit: 1000000 }).then((res: any) => {
    //   if (res.data) {
    //     const fileName = getFileNameOnUrlPath(res.data);
    //     downloadFile(res.data, fileName);
    //   }
    // });
    message.warning("接口未接入");
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
  }

  const buttonList = ref([{ clickHandler: onExport, type: "info", text: "导出", isDropDown: true }]);

  return {
    isAgTable,
    columnDefs,
    loading,
    columns,
    dataList,
    maxHeight,
    pagination,
    buttonList,
    searchOptions,
    onRefresh,
    onTagSearch,
    onSizeChange,
    onCurrentChange,
    onSwitchTable
  };
};
