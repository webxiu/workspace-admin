import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";
import { utils, write } from "xlsx";

import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
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
  const nowDate = dayjs().format("YYYY-MM-DD");

  const queryParams = reactive({ date: `${theFirstDayOfMonth} ~ ${nowDate}` });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "工号", value: "userCode" },
    { label: "部门", value: "deptId", children: [] },
    { label: "考勤时间", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ]);

  const fetchOptions = () => {
    getDeptOptions().then((data: any) => {
      searchOptions[1].children = data;
    });
  };

  onMounted(() => {
    fetchOptions();
    getColumnConfig();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "工号", prop: "userCode" },
      { label: "姓名", prop: "userName" },
      { label: "部门", prop: "deptName" },
      { label: "出勤（天）", prop: "attendanceDay" },
      { label: "出勤（H）", prop: "attendanceHours" },
      { label: "请假（H）", prop: "leaveHours" },
      { label: "平时加班（H）", prop: "overTimeHours" },
      { label: "公休日加班（H）", prop: "weekOverTimeHours" },
      { label: "迟到（M）", prop: "delayM" }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    console.log(formData, "formData..");
    loading.value = true;
    setTimeout(() => {
      dataList.value = [];
      loading.value = false;
    }, 300);
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (val) => {
    formData.userName = val.userName;
    formData.userCode = val.userCode;
    formData.deptId = val.deptId;
    formData.date = val.date;
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
      `考勤统计${timeStep}.xlsx`
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
