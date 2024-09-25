import { addMainTask, commonSubmit, deleteTask, editTask, fetchMyWorkOrderList } from "@/api/systemManage";
import { downloadDataToExcel, setColumn } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import Detail from "../Detail.vue";
import { ElMessage } from "element-plus";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { cloneDeep } from "@pureadmin/utils";
import { commonBackLogic } from "@/utils/common";
import dayjs from "dayjs";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { getDeptOptions } from "@/utils/requestApi";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref([]);
  const fileList: any = ref([]);
  const currentRow: any = ref({});
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const formLoading = ref(false);
  const optionInfoList = ref([]);
  const taskType = ref([]);
  const sysTypeOpts = ref([]);
  const billStateOpts = ref([]);
  const taskStateOpts = ref([]);

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const before90DayDate = dayjs().subtract(90, "day").format("YYYY-MM-DD");
  const nowDate = dayjs().format("YYYY-MM-DD");

  const queryParams = reactive({ date: `${before90DayDate} ~ ${nowDate}` });

  let formData: any = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "创建人姓名", value: "createUserName" },
    { label: "功能菜单", value: "taskName" },
    { label: "系统", value: "systemName", children: [] },
    { label: "部门", value: "deptId", children: [] },
    { label: "单据状态", value: "billState", children: [] },
    { label: "任务状态", value: "taskStatus", children: [] },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD" }
  ]);

  const fetchOpts = () => {
    getBOMTableRowSelectOptions({ optioncode: "ITTaskType,WorkOrderSystemType,BillStatus,WorkOrderTaskStatus" }).then((res) => {
      if (res.data) {
        taskType.value = res.data.find((item) => item.optionCode === "ITTaskType")?.optionList || [];
        sysTypeOpts.value = res.data.find((item) => item.optionCode === "WorkOrderSystemType")?.optionList || [];
        billStateOpts.value = res.data.find((item) => item.optionCode === "BillStatus")?.optionList || [];
        taskStateOpts.value = res.data.find((item) => item.optionCode === "WorkOrderTaskStatus")?.optionList || [];
        // 初始化下拉
        searchOptions[2].children = sysTypeOpts.value.map((item) => ({ label: item.optionName, value: item.optionValue }));
        searchOptions[4].children =
          res.data.find((item) => item.optionCode === "BillStatus")?.optionList?.map((item) => ({ label: item.optionName, value: item.optionValue })) || [];
        searchOptions[5].children = res.data
          .find((item) => item.optionCode === "WorkOrderTaskStatus")
          ?.optionList?.map((item) => ({ label: item.optionName, value: item.optionValue }));
      }
    });

    getDeptOptions().then((data: any) => {
      searchOptions[3].children = data;
    });
  };

  onMounted(() => {
    console.log(dayjs().subtract(90, "day").format("YYYY-MM-DD"), "90天前");
    fetchOpts();
    getColumnConfig();
    // onSearch();
  });

  const getColumnConfig = async () => {
    const columnData: TableColumnList[] = [
      { label: "工单编号", prop: "billNo", minWidth: 120 },
      { label: "系统", prop: "systemName", slot: "systemName", width: 90 },
      { label: "功能菜单", prop: "taskName", minWidth: 240 },
      { label: "需求描述", prop: "taskContent", minWidth: 325 },
      { label: "类型", prop: "taskTypeCode", slot: "taskTypeCode", width: 100 },
      {
        label: "期望完成时间",
        width: 110,
        prop: "expectDate"
      },
      {
        label: "计划开始时间",
        width: 110,
        prop: "startTime"
      },
      {
        label: "计划完成时间",
        width: 110,
        prop: "endTime"
      },
      {
        label: "实际开始时间",
        width: 110,
        prop: "realStartTime"
      },
      {
        label: "实际完成时间",
        width: 110,
        prop: "realEndTime"
      },
      {
        label: "单据状态",
        width: 85,
        prop: "billState",
        slot: "billState"
      },
      {
        label: "任务状态",
        width: 85,
        prop: "taskStatus",
        slot: "taskStatus"
      },
      {
        label: "部门",
        prop: "deptName"
      },
      {
        label: "创建人",
        width: 65,
        prop: "createUserName"
      },
      {
        label: "创建时间",
        width: 110,
        prop: "createDate"
      },
      {
        label: "修改人",
        width: 65,
        prop: "modifyUser"
      },
      {
        label: "修改时间",
        width: 160,
        prop: "modifyDate",
        cellRenderer(data) {
          return data.row.modifyDate ? <span>{dayjs(data.row.modifyDate).format("YYYY-MM-DD HH:mm:ss")}</span> : null;
        }
      },
      {
        label: "负责人",
        width: 65,
        prop: "responsibleMan"
      }
    ];
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const onSearch = () => {
    loading.value = true;
    const copyData = cloneDeep(formData);
    const [searchStartDate, searchEndDate] = copyData.date ? copyData.date.split(" ~ ") : [undefined, undefined];
    copyData.startDate = searchStartDate;
    copyData.endDate = searchEndDate;
    delete copyData.date;

    fetchMyWorkOrderList({ ...copyData })
      .then((res: any) => {
        if (res.data) {
          const data = res.data;
          loading.value = false;
          dataList.value = data.records || [];
          pagination.total = data.total;
        }
      })
      .catch(() => (loading.value = false));
  };

  const handleTagSearch = (values = {}) => {
    const { page, limit } = formData;
    Object.keys(values)?.forEach((key) => {
      formData[key] = values[key];
    });
    formData = { ...values, page, limit };
    onSearch();
  };

  const beforeEdit = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }

    onEdit(currentRow.value);
  };

  const beforeDel = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }

    if (![0, 3].includes(currentRow.value?.billState)) {
      ElMessage({ message: "当前状态不可删除", type: "error" });
      return;
    }

    onDelete(currentRow.value);
  };

  const beforeSubmit = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }
    showMessageBox(`确认要提交编号为【${currentRow.value.billNo}】的工单吗?`).then(() => {
      commonSubmit({ id: currentRow.value.id, billId: "10003" }).then((resp) => {
        if (resp.data) {
          ElMessage({ message: "提交成功", type: "success" });
          onSearch();
        }
      });
    });
  };

  const beforeBack = () => {
    if (JSON.stringify(currentRow.value) == "{}" || !currentRow.value) {
      return ElMessage({ message: "请选择一条记录", type: "warning" });
    }
    if (![1, 2].includes(currentRow.value.billState)) {
      return message("当前状态不能进行回退", { type: "error" });
    }
    commonBackLogic(currentRow.value.billNo, onSearch);
  };

  const onEdit = (row) => {
    openDialog("edit", row);
  };

  const onView = (row) => {
    currentRow.value = row;
    openDialog("view", row);
  };

  const openDialog = async (type: "add" | "view" | "edit", row?) => {
    const title = { add: "新增", edit: "修改", view: "查看" }[type];
    const formRef = ref();
    const _formData = ref({
      id: row?.id ?? "",
      taskName: row?.taskName ?? "",
      billNo: row?.billNo ?? "",
      taskTypeCode: row?.taskTypeCode ?? "",
      taskContent: row?.taskContent ?? "",
      systemName: row?.systemName ?? "",
      expectDate: row?.expectDate ?? "",
      parentId: row?.parentId ?? "",
      attr: []
    });

    addDialog({
      title: `${title}`,
      props: { type: type, id: row?.id, formInline: _formData },
      width: "840px",
      draggable: true,
      fullscreenIcon: true,
      okButtonText: "保存",
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(Detail, { ref: formRef, type, id: row?.id }),
      beforeSure: (done, { options }) => {
        const { getRef, formData } = formRef.value.getRef();
        getRef?.validate(async (valid) => {
          if (valid) {
            showMessageBox(`确认要${title}吗?`)
              .then(() => {
                onSubmitChange(type, title, formData.value, () => {
                  done();
                  onSearch();
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    //组装请求参数
    const copyData = cloneDeep(data);
    delete copyData.attr;
    const fData = new FormData();

    if (type === "edit") copyData.parentId = data.parentId ?? "0";
    copyData.fromType = "workOrder";
    fData.append("param", JSON.stringify(copyData));
    if (data.attr && Array.isArray(data.attr) && data.attr.length) {
      data.attr.forEach((el) => !el.id && fData.append("files", el)); // 过滤掉已经上传文件
    }

    const typeApi = { add: addMainTask, edit: editTask };

    typeApi[type](fData).then((res) => {
      if (res.data) {
        if (type === "add") {
          const resId = res.data;
          showMessageBox(`保存成功，是否提交?`)
            .then(() => {
              commonSubmit({ id: resId, billId: "10003" }).then((resp) => {
                if (resp.data) {
                  ElMessage({ message: "提交成功", type: "success" });
                  callback();
                }
              });
            })
            .catch(callback);
        } else {
          ElMessage({ message: title + "成功", type: "success" });
          callback();
        }
      }
    });
  };

  // 导出
  const onExport = () => {
    downloadDataToExcel({
      dataList: dataList.value,
      columns: columns.value,
      sheetName: "我的工单表"
    });
  };

  const onDelete = (row) => {
    showMessageBox(`确认要删除编号为【${row.billNo}】的工单吗?`)
      .then(() => {
        loading.value = true;
        deleteTask({ id: row.id, parentId: row.parentId }).then((res) => {
          if (res.data) {
            ElMessage({ message: `删除成功`, type: "success" });
            currentRow.value = {};
            onSearch();
          }
        });
      })
      .catch(() => {})
      .finally(() => (loading.value = false));
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const onAdd = () => {
    openDialog("add");
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

  const viewNodeDetail = () => {
    if (JSON.stringify(currentRow.value) === "{}") {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }

    addDialog({
      title: "查看审批节点详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: currentRow.value.billNo, billType: "workOrder", billState: +currentRow.value.billState })
    });
  };

  return {
    loading,
    columns,
    beforeEdit,
    beforeDel,
    beforeSubmit,
    beforeBack,
    dataList,
    maxHeight,
    rowClick,
    onDelete,
    searchOptions,
    taskType,
    queryParams,
    onSearch,
    onEdit,
    onView,
    optionInfoList,
    onAdd,
    viewNodeDetail,
    handleTagSearch,
    onExport,
    pagination,
    sysTypeOpts,
    onSizeChange,
    billStateOpts,
    taskStateOpts,
    onCurrentChange
  };
};
