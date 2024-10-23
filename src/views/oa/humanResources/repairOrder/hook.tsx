import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { exportAttendanceRecord, fetchAttendanceRecord, fetchMachine } from "@/api/oaManage/humanResources";
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
import { message } from "@/utils/message";

export const useMachine = () => {
  const dataList = ref([]);
  const columns = ref<TableColumnList[]>([]);
  const loading = ref(false);
  const machineOptions = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const nowDate = dayjs().format("YYYY-MM-DD");

  const queryParams = reactive({ date: `${nowDate} ~ ${nowDate}` });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "规格型号", value: "model" },
    { label: "完成日期", value: "date", type: "daterange", format: "YYYY-MM-DD" }
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
    return columnData;
  };

  const onSearch = () => {
    // if (formData.date) {
    //   const [startDate, endDate] = formData.date.split("~").map((item) => item.trim());
    //   formData.startDate = startDate;
    //   formData.endDate = endDate;
    // }
    // fetchAttendanceRecord(formData).then((res: any) => {
    //   if (res.data) {
    //     dataList.value = res.data.records || [];
    //     pagination.total = res.data.total;
    //   }
    // });
    console.log(formData, "fd...");

    dataList.value = [];
    pagination.total = 0;
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (val) => {
    formData.deviceName = val.deviceName;
    formData.model = val.model;
    formData.date = val.date;

    if (!val.date) {
      formData.startDate = undefined;
      formData.endDate = undefined;
    }
    onSearch();
  };

  const onExport = () => {
    // exportAttendanceRecord({ ...formData, limit: 1000000 }).then((res: any) => {
    //   if (res.data) {
    //     const fileName = getFileNameOnUrlPath(res.data);
    //     downloadFile(res.data, fileName);
    //   }
    // });
    message("接口未接入", { type: "warning" });
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
