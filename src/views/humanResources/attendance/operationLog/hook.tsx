import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { exportAttendanceRecord, fetchAttendanceLog, fetchAttendanceRecord } from "@/api/oaManage/humanResources";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";
import { utils, write } from "xlsx";

import type { ColDef } from "ag-grid-community";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import dayjs from "dayjs";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const loading = ref(false);
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const nowDate = dayjs().add(1, "day").format("YYYY-MM-DD");
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });
  const theFirstDayOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
  const queryParams = reactive({ date: `${theFirstDayOfMonth} ~ ${nowDate}` });

  const searchOptions = reactive<SearchOptionType[]>([
    {
      label: "执行状态",
      value: "executeStatus",
      children: [
        { label: "待执行", value: "待执行" },
        { label: "执行中", value: "执行中" },
        { label: "已执行", value: "已执行" },
        { label: "执行失败", value: "执行失败" }
      ]
    },
    { label: "考勤机名称", value: "attMachineName" },
    { label: "创建时间", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startDate", endKey: "endDate" }
  ]);

  onMounted(() => {
    getColumnConfig();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "考勤机名称", prop: "attMachineName" },
      { label: "下发指令", prop: "command" },
      { label: "执行状态", prop: "executeStatus" },
      { label: "创建人姓名", prop: "createUserName" },
      { label: "创建时间", prop: "createDate" }
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
    fetchAttendanceLog(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data.records || [];
        pagination.total = res.data.total;
      }
    });
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
      `考勤机操作日志${timeStep}.xlsx`
    );
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
    columnDefs,
    isAgTable,
    loading,
    dataList,
    columns,
    maxHeight,
    buttonList,
    searchOptions,
    queryParams,
    pagination,
    onRefresh,
    onTagSearch,
    onSizeChange,
    onCurrentChange,
    onSwitchTable
  };
};
