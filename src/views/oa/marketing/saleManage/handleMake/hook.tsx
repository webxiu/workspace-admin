import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";

import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import dayjs from "dayjs";
import { getDeptOptions } from "@/utils/requestApi";
import { useEleHeight } from "@/hooks";
import { message, showMessageBox } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import HandleMakeSheet from "@/views/plmManage/projectMgmt/projectManage/add/components/flow/handleMakeSheet/index.vue";
import { useRouter } from "vue-router";
import { commonBack, commonSubmit } from "@/api/systemManage";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { deleteHandleApplyPageList, fetchHandleApplyPageList } from "@/api/oaManage/marketing";

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
  const curRow = ref();
  const router = useRouter();

  const nowDate = dayjs().format("YYYY-MM-DD");
  const firstDay = dayjs().startOf("month").format("YYYY-MM-DD");

  const queryParams = reactive({ date: `${firstDay} ~ ${nowDate}` });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "申请人姓名", value: "applyUserName" },
    { label: "申请部门", value: "deptId", children: [] },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ]);

  const fetchOptions = () => {
    getDeptOptions().then((data: any) => {
      searchOptions[1].children = data;
    });
  };

  onMounted(() => {
    fetchOptions();
    getColumnConfig();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "产品名称", prop: "productName" },
      { label: "产品预研号", prop: "productBeforeCode" },
      { label: "申请时间", prop: "applyDate" },
      { label: "手板类别", prop: "handleType" },
      { label: "承担费用", prop: "resFee" },
      { label: "预估费用", prop: "testFee" },
      { label: "要求完成时间", prop: "reqFinishDate" },
      { label: "一般测试要求", prop: "normalTestRequire" },
      { label: "申请人", prop: "applyUserName" },
      { label: "申请部门", prop: "deptName" },
      { label: "预计完成时间", prop: "testFinishDate" },
      { label: "申请原因", prop: "applyReason" },
      { label: "特殊测试要求", prop: "peculiarRequire" },
      { label: "研发部回复", prop: "reply" }
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
    fetchHandleApplyPageList(formData).then((res: any) => {
      if (res.data) {
        dataList.value = res.data.records || [];
        pagination.total = res.data.total;
      }
    });
  };

  const onFresh = () => {
    getColumnConfig();
    onSearch();
  };

  const handleTagSearch = (val) => {
    formData.productName = val.productName;
    formData.applyUserName = val.applyUserName;
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

  const onAdd = () => {
    // const handleRef = ref();
    // addDialog({
    //   title: `新增`,
    //   width: "1200px",
    //   draggable: true,
    //   fullscreenIcon: true,
    //   closeOnClickModal: false,
    //   props: {},
    //   contentRenderer: () => h(HandleMakeSheet, { ref: handleRef }),
    //   beforeSure: (done, { options }) => {
    //     const modalRef = handleRef.value;
    //     modalRef.formRef.getRef().validate(async (valid) => {
    //       if (valid) {
    //         ElMessageBox.confirm(`确认要保存吗?`, "系统提示", {
    //           type: "warning",
    //           draggable: true,
    //           cancelButtonText: "取消",
    //           confirmButtonText: "确定",
    //           dangerouslyUseHTMLString: true
    //         })
    //           .then(() => {
    //             console.log(modalRef.formData, "收集数据");
    //             message("接口未完善", { type: "warning" });
    //           })
    //           .catch(console.log);
    //       }
    //     });
    //   }
    // });

    router.push("/oa/marketing/saleManage/handleMake/add/index");
  };

  const rowClick = (row) => {
    curRow.value = row;
  };

  const onEdit = () => {
    if (!curRow.value) return message("请选择一条记录", { type: "warning" });
    router.push("/oa/marketing/saleManage/handleMake/add/index?id=" + curRow.value.id);
  };

  const onDel = () => {
    if (!curRow.value) return message("请选择一条记录", { type: "warning" });
    showMessageBox(`确认删除产品名称为【${curRow.value.productName}】的申请吗?`).then(() => {
      deleteHandleApplyPageList({ id: curRow.value.id }).then(({ data }) => {
        if (data) {
          message("删除成功");
          curRow.value = null;
          onSearch();
        }
      });
    });
  };

  const onPrint = () => {
    if (!curRow.value) return message("请选择一条记录", { type: "warning" });
    router.push("/oa/marketing/saleManage/handleMake/print/index?id=" + curRow.value.id);
  };

  const onSubmit = () => {
    if (JSON.stringify(curRow.value) == "{}" || !curRow.value) {
      return message("请选择一条记录", { type: "warning" });
    } else {
      const { billNo } = curRow.value;
      showMessageBox(`确认要提交【${billNo}】吗?`).then(() => {
        commonSubmit({ billNo, billId: "10062" }).then(({ data }) => {
          if (data) {
            message("提交成功");
            onSearch();
          }
        });
      });
    }
  };

  const onRevoke = () => {
    if (JSON.stringify(curRow.value) == "{}" || !curRow.value) {
      return message("请选择一条记录", { type: "warning" });
    } else {
      const { billNo } = curRow.value;
      showMessageBox(`确认要撤销【${billNo}】吗?`).then(() => {
        commonBack({ comment: "", backToActivityId: "startEvent1", billNo }).then(({ data }) => {
          if (data) {
            message("撤销成功");
            onSearch();
          }
        });
      });
    }
  };

  const onViewDetail = () => {
    if (JSON.stringify(curRow.value) == "{}" || !curRow.value) {
      return message("请选择一条记录", { type: "warning" });
    } else {
      addDialog({
        title: "查看审批详情",
        width: "900px",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: true,
        hideFooter: true,
        contentRenderer: ({ options }) => h(NodeDetailList, { options, billNo: curRow.value.billNo, billType: "palmApply", billState: curRow.value.billState })
      });
    }
  };

  const buttonList = ref([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDel, type: "warning", text: "删除", isDropDown: false },
    { clickHandler: onSubmit, type: "info", text: "提交", isDropDown: true },
    { clickHandler: onRevoke, type: "info", text: "撤销", isDropDown: true },
    { clickHandler: onViewDetail, type: "info", text: "审批详情", isDropDown: true },
    { clickHandler: onPrint, type: "info", text: "打印", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    onSearch();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    onSearch();
  }

  const rowDbClick = (row) => {
    curRow.value = row;
    onEdit();
  };

  return {
    columns,
    onFresh,
    queryParams,
    rowClick,
    handleTagSearch,
    searchOptions,
    rowDbClick,
    buttonList,
    maxHeight,
    loading,
    dataList,
    pagination,
    onSizeChange,
    onCurrentChange
  };
};
