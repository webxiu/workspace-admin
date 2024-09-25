import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { exportAttendanceRecord, fetchAttendanceLog, fetchAttendanceRecord } from "@/api/oaManage/humanResources";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";
import { utils, write } from "xlsx";

import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { cloneDeep } from "@pureadmin/utils";
import dayjs from "dayjs";
import { getDeptOptions } from "@/utils/requestApi";
import { saveAs } from "file-saver";
import { useEleHeight } from "@/hooks";

export const useMachine = () => {
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);

  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const theFirstDayOfMonth = dayjs().startOf("month").format("YYYY-MM-DD");
  const nowDate = dayjs().add(1, "day").format("YYYY-MM-DD");

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
    { label: "创建时间", value: "date", type: "daterange", format: "YYYY-MM-DD" }
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
    return columnData;
  };

  const onSearch = () => {
    if (formData.date) {
      const [startDate, endDate] = formData.date.split("~").map((item) => item.trim());
      formData.startDate = startDate;
      formData.endDate = endDate;
    }
    fetchAttendanceLog(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data.records || [];
      }
    });
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (val) => {
    formData.createUserName = val.createUserName;
    formData.executeStatus = val.executeStatus;
    formData.date = val.date;
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
      `考勤机操作日志${timeStep}.xlsx`
    );
  };

  const buttonList = ref([{ clickHandler: onExport, type: "info", text: "导出", isDropDown: true }]);

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  return { columns, onFresh, queryParams, handleTagSearch, searchOptions, buttonList, maxHeight, loading, dataList, pagination, onSizeChange, onCurrentChange };
};
