import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { onMounted, reactive, ref } from "vue";

import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import dayjs from "dayjs";
import { getDeptOptions } from "@/utils/requestApi";
import { useEleHeight } from "@/hooks";
import { message } from "@/utils/message";
import { supplementaryCard } from "@/api/oaManage/humanResources";
import { getdeptInfoList } from "@/api/workbench/teamManage";

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
  const flatDeptList = ref([]);

  const nowDate = dayjs().format("YYYY-MM-DD");
  const firstDay = dayjs().startOf("month").format("YYYY-MM-DD");

  const queryParams = reactive({ date: `${firstDay} ~ ${nowDate}` });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "工号", value: "staffCode" },
    { label: "部门", value: "deptId", children: [] },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ]);

  const fetchOptions = () => {
    getDeptOptions().then((data: any) => {
      searchOptions[1].children = data;
    });

    getdeptInfoList({}).then((res) => {
      if (res.data) {
        flatDeptList.value = res.data;
      }
    });
  };

  onMounted(() => {
    fetchOptions();
    getColumnConfig();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "工号", prop: "staffCode" },
      { label: "姓名", prop: "staffName" },
      { label: "部门", prop: "deptName" },
      { label: "日期", prop: "supplementaryDate" }
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

    supplementaryCard(formData).then((res: any) => {
      if (res.data) {
        const result = res.data.records || [];
        const flatArr = result
          .map((item) => {
            item.detailsVOList.forEach((el) => {
              el.applyDate = item.applyDate;
              el.applyDeptId = item.applyDeptId;
              el.applyDeptName = item.applyDeptName;
              el.createDate = item.createDate;
              el.spNo = item.spNo;
              el.spStatus = item.spStatus;
            });
            return item;
          })
          .map((el) => el.detailsVOList)
          .flat(Infinity);

        dataList.value = flatArr;
        pagination.total = res.data.total;
      }
    });
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (val) => {
    formData.staffName = val.staffName;
    formData.staffCode = val.staffCode;
    formData.deptId = val.deptId;
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
    message("接口未完善", { type: "warning" });
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
