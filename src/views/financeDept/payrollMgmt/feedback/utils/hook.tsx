import { onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { setColumn, getMenuColumns, downloadDataToExcel } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { PAGE_CONFIG } from "@/config/constant";
import { getUserInfo } from "@/utils/storage";
import { dispatchPayslipDataInfo, getMoneySaltDataInfo, getPaySlipHandleList } from "@/api/oaManage/financeDept";
import dayjs from "dayjs";
import { ElMessage, ElMessageBox } from "element-plus";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const rowData = ref();
  const tableRef = ref();
  const saltInfo: any = ref({});
  const selectFeedBackList = ref([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);
  const selectDate = ref(dayjs(new Date()).add(-1, "month").format("YYYY-MM"));

  const formData = reactive({
    yearMonth: selectDate.value,
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  onMounted(() => {
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "模板编号", prop: "mbNo" },
      { label: "工号", prop: "gh" },
      { label: "姓名", prop: "name" },
      { label: "状态", prop: "statusName" },
      { label: "反馈内容", prop: "content" },
      { label: "反馈时间", prop: "inDate" }
    ];

    const { columnArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    columns.value = setColumn({ columnData, operationColumn: false, radioColumn: false, selectionColumn: { hide: false } });
    return columnData;
  };

  const onRefresh = () => {
    getColumnConfig();
    onSearch();
  };

  const onSearch = () => {
    loading.value = true;
    console.log(formData, "req");
    const userId = getUserInfo().id;
    getPaySlipHandleList({ ...formData, userId })
      .then((res: any) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const onCurrentChange = (row) => {
    if (!row) return;
    rowData.value = row;
  };

  // 导出单据
  const onExport = async () => {
    const exportCols = await getColumnConfig();
    const exportColumns = exportCols.map(({ label, prop }) => ({ label, prop }));
    const [year, month] = formData.yearMonth.split("-");
    downloadDataToExcel({
      dataList: dataList.value,
      columns: exportColumns,
      sheetName: `${year}年${month}月工资条处理表`
    });
  };

  const changeDate = (date) => {
    formData.yearMonth = date;
    onSearch();
  };

  const onRowClick = (row) => {
    // tableRef.value?.toggleRowSelection(row);
  };

  const handleSelectionChange = (selectionList) => {
    selectFeedBackList.value = selectionList;
  };

  const onDispatch = () => {
    if (JSON.stringify(selectFeedBackList.value) === "[]") {
      ElMessage({ message: "请选择至少一条记录", type: "warning" });
      return;
    }

    ElMessageBox.confirm(`确认要分发当前勾选的【${selectFeedBackList.value.length}】笔工资条吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    }).then(() => {
      const ids = selectFeedBackList.value.map((item) => item.id);
      const codes = selectFeedBackList.value.map((item) => item.gh);

      getMoneySaltDataInfo({
        gzDate: formData.yearMonth,
        gzStatus: "4",
        gzmbb: selectFeedBackList.value[0].mbb,
        payslipIds: String(ids),
        userCodes: String(codes)
      }).then((res) => {
        if (res.data) {
          saltInfo.value = res.data;
          const dispatchData = {
            mbNo: selectFeedBackList.value[0].mbNo,
            mbb: selectFeedBackList.value[0].mbb,
            gzDate: selectDate.value,
            salt: saltInfo.value.salt,
            keyIn: saltInfo.value.data[0].KeyIn,
            userCode: String(codes),
            payslipIds: String(ids)
          };
          // console.log(dispatchData, "分发的请求参数");

          dispatchPayslipDataInfo(dispatchData).then((resp: any) => {
            if (resp.data) {
              ElMessage({ message: `成功分发：${resp.data?.success}个，分发失败：${resp.data?.fail}个`, type: "success" });
              onSearch();
            }
          });
        }
      });
    });
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onDispatch, type: "info", text: "工资分发", isDropDown: true },
    { clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }
  ]);

  return {
    tableRef,
    columns,
    dataList,
    loading,
    maxHeight,
    pagination,
    buttonList,
    selectDate,
    onRefresh,
    changeDate,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange,
    onRowClick,
    handleSelectionChange
  };
};
