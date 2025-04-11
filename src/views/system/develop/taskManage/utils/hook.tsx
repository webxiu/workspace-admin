/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-03-13 09:33:46
 */

import { LoadingType } from "@/components/ButtonList/index.vue";
import {
  TaskLogItemType,
  TaskManageItemType,
  TaskMangeOptionType,
  addMainTask,
  deleteTask,
  editTask,
  getTaskLog,
  taskManageList,
  updateTaskStatus,
  userInfoList,
  viewTask
} from "@/api/systemManage";
import { getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { getUserInfo } from "@/utils/storage";
import NodeDetailList from "@/components/NodeDetailList/index.vue";

import AddModel from "../component/AddModel.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { addDialog } from "@/components/ReDialog";
import { dayjs } from "element-plus";
import { downloadFile } from "@/utils/common";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { useEleHeight } from "@/hooks";
import { useUserStore } from "@/store/modules/user";
import { type PaginationProps } from "@pureadmin/table";
import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { useRouter } from "vue-router";

/** 任务状态 */
export enum TaskStatus {
  /** 未开始 */
  pending = "1",
  /** 进行中 */
  start = "2",
  /** 已完成 */
  finish = "3",
  /** 终止 */
  stop = "4",
  /** 待确认 */
  confirm = "5",
  /** 已回退 */
  back = "6"
}

export const useConfig = (props) => {
  const userInfo = getUserInfo();
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<TaskManageItemType[]>([]);
  const loading = ref<boolean>(false);
  const oLoading = ref<boolean>(false);
  const rowData = ref<TaskManageItemType>();
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 64 + 116);
  const taskManageOptions = ref<Partial<TaskMangeOptionType>>({ userinfoList: [] });
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const taskLogList = ref<TaskLogItemType[]>([]);
  const tableRef = ref();
  const router = useRouter();
  const curDate = dayjs().format("YYYY-MM-DD");
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const userStore = useUserStore();
  const billStateList = ref([]);
  const taskView = ref("");
  const activeView = ref<"task" | "log">("task");

  const formData = reactive<Record<string, any>>(props.formData);

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "任务名称", value: "taskName" },
    { label: "责任人", value: "responsibleUserName", children: [] },
    { label: "日期范围", value: "date", type: "daterange", format: "YYYY-MM-DD", startKey: "startTime", endKey: "endTime" },
    { label: "任务编号", value: "billNo" }
  ]);
  const queryParams = reactive<QueryParamsType>({
    responsibleUserName: { value: userInfo.userName, valueLabel: userInfo.userName }
  });

  onMounted(() => {
    getOptionList();
    getColumnConfig();
    getTableList();
  });

  const findItemInfo = (key, list = []) => list.find((item) => item.optionCode === key)?.optionList || [];

  const getOptionList = () => {
    userInfoList({
      page: 1,
      limit: 100000,
      deptId: userStore.userInfo.deptId + "",
      userState: "A",
      deptIdList: [userStore.userInfo.deptId + ""]
    }).then(({ data }) => {
      if (data && data.records) {
        taskManageOptions.value.userinfoList = data.records;
        searchOptions[1].children = data.records.map((item) => ({ label: item.userName, value: item.userName }));
      }
    });

    getBOMTableRowSelectOptions({ optioncode: "ITTaskDenailType,TaskPriority,WorkOrderTaskStatus,ITTaskType,BillStatus" }).then((res: any) => {
      if (res.data) {
        formData.select = [TaskStatus.pending, TaskStatus.start, TaskStatus.confirm, TaskStatus.back];
        const backtask = findItemInfo("ITTaskDenailType", res.data);
        const priorityList = findItemInfo("TaskPriority", res.data);
        const taskStatusList = findItemInfo("WorkOrderTaskStatus", res.data);
        const taskTypeCodeList = findItemInfo("ITTaskType", res.data);
        billStateList.value = findItemInfo("BillStatus", res.data);
        const kkFileView = localStorage.getItem("kkView_url") || "";
        taskManageOptions.value = {
          ...taskManageOptions.value,
          backtask,
          filePath: "OA/systaskregister/",
          kkFileView,
          priorityList,
          taskStatusList,
          taskTypeCodeList
        };
      }
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "任务编号", prop: "billNo", minWidth: 180 },
      { label: "任务名称", prop: "taskName", minWidth: 220 },
      { label: "任务状态", prop: "taskStatusName", width: 80 },
      { label: "单据状态", prop: "billState", width: 100 },
      { label: "责任人", prop: "responsibleUserName", width: 80 },
      { label: "工时", prop: "duration", width: 80 },
      { label: "优先级", prop: "priority", width: 100 },
      { label: "开始时间", prop: "startTime", width: 100 },
      { label: "结束时间", prop: "endTime", width: 100 },
      { label: "实际开始时间", prop: "realStartTime", width: 110 },
      { label: "实际结束时间", prop: "realEndTime", width: 110 },
      { label: "单据创建人", prop: "createUserName", width: 100 },
      { label: "分值", prop: "score", width: 50 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({
      columnData,
      isCustomExpend: true,
      selectionColumn: { hide: true },
      operationColumn: { width: 185 }
    });
  };

  // 获取列表
  const getTableList = () => {
    loading.value = true;
    const select = formData.select.join(",");
    const params = { ...formData, select };
    taskLogList.value = [];
    taskManageList(params)
      .then(({ data }) => {
        loading.value = false;
        pagination.total = data.total;
        dataList.value = data.records;
        rowData.value = dataList.value.find((item) => item.id == rowData.value.id);
      })
      .catch((err) => (loading.value = false));
  };

  const onSearch = () => getTableList();

  const handleTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  // 新增
  const onAdd = () => {
    openDepDialog("add", {});
  };

  // 修改
  const onEdit = wrapFn(rowData, () => {
    openDepDialog("edit", rowData.value);
  });

  const openDepDialog = (type: "add" | "edit", row?: Partial<TaskManageItemType>) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const initDate = dayjs().format("YYYY-MM-DD");
    const isAdd = type === "add";

    const addRow = isAdd ? rowData.value ?? {} : row;
    const pIndex = addRow.billNo?.lastIndexOf("-");
    // 存在上级则获取上级任务
    const parentBillNo = isAdd || addRow?.parentId ? (pIndex > -1 ? addRow.billNo.slice(0, pIndex) : addRow.billNo) : undefined;

    let number = addRow.number;
    if (isAdd && addRow.children?.length) {
      number = addRow.children.length + 1;
    }

    // 数据回显
    const formData = reactive({
      taskName: row.taskName,
      startTime: isAdd ? initDate : row.startTime,
      endTime: isAdd ? initDate : row.endTime,
      responsibleUserCode: row.responsibleUserCode ?? undefined,
      priority: row.priority,
      duration: row.duration,
      number: number ?? 1,
      file: row.file ?? "",
      taskTypeCode: row.taskTypeCode ?? "",
      id: row.id,
      parentId: addRow.parentId ?? 0,
      billNo: addRow.billNo,
      parentBillNo: parentBillNo,
      taskContent: row.taskContent ?? "",
      score: row.score ?? 0
    });
    if (isAdd && rowData.value) formData.billNo = undefined;
    const billName = row.billNo ? `: ${row.billNo}` : "";

    /** 1.获取提交参数 */
    function getParams(callback) {
      const { fd, getRef, formInline } = formRef.value.getRef();
      getRef.validate((valid) => {
        if (!valid) return;
        const fileList = formRef.value.fileNameList;
        const userList = taskManageOptions.value.userinfoList;
        const userInfo = userList.find((f) => f.userCode == formInline.responsibleUserCode);

        if (fileList?.length) formInline.descFileNameList = fileList;
        if (userInfo) formInline["responsibleUserName"] = userInfo.userName;
        // 新增:存在上级任务, 在上级任务下新增子任务, 没有上级任务, 新增主任务
        if (isAdd) formInline.billNo = undefined;
        // 修改:不存在上级任务处理
        // else if (!formInline.parentId) formInline.parentBillNo = undefined;

        fd.append("param", JSON.stringify(formInline));
        callback(fd);
      });
    }

    /** 2.提交到接口 */
    function submitAPI(fd, msg) {
      return new Promise<any>((resolve) => {
        // 未填写上级任务, 按照主任务新增
        const API = isAdd ? addMainTask : editTask;
        API(fd)
          .then(({ data }) => {
            if (!data) return message.error(`${msg}失败`);
            message.success(`${msg}成功`);
            resolve(data);
          })
          .catch(() => resolve(null));
      });
    }

    addDialog({
      title: `${title}任务${billName}`,
      props: { loading: loading, formData, taskOptions: taskManageOptions },
      width: "88%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      okButtonText: "提交",
      customButtonText: "保存",
      contentRenderer: () => h(AddModel, { ref: formRef, type }),
      beforeCustom: () => getParams((fd) => submitAPI(fd, "保存")),
      beforeSure: (done) => {
        showMessageBox(`确认要提交吗?`).then(() => {
          getParams(async (fd) => {
            const data = await submitAPI(fd, `${title}任务`);
            if (!data) return;
            done();
            getTableList();
          });
        });
      }
    });
  };

  // 删除
  const onDelete = wrapFn(rowData, () => {
    const row = rowData.value;
    showMessageBox(`确认要删除编号为【${row.billNo}】的任务吗?`).then(() => {
      deleteTask({ id: row.id, parentId: row.parentId }).then(({ data }) => {
        if (!data) return message.error("删除失败");
        getTableList();
        message.success("删除成功");
      });
    });
  });

  // 导出md
  const onExport = wrapFn(rowData, () => {
    const row = rowData.value;
    downloadFile(`/oa/sys/systaskregister/export?ids=${row.id}`, `${row.taskName}.d`);
  });

  // 预览md
  const onView = wrapFn(rowData, () => {
    router.push({
      path: "/system/develop/taskManage/preview",
      query: { isNewTag: "yes", id: rowData.value.id, title: rowData.value.billNo }
    });
  });

  // 公共逻辑抽取
  const commonActionFn = (oldStatus: string[], newStatus, title, finishFlag = false) => {
    const row = rowData.value;
    if (oldStatus.includes(row.taskStatus) || finishFlag) {
      console.log("提交", row);
      showMessageBox(`确认要${title}吗?`)
        .then(() => {
          updateTaskStatus({ ...row, newStatus }).then(({ data }) => {
            if (!data) return message.error("操作失败");
            message.success("操作成功");
            getTableList();
          });
        })
        .catch(() => {});
    } else {
      message.error(`当前任务状态不可${title}`);
    }
  };

  // 开始
  const onStartTask = wrapFn(rowData, () => onStart(rowData.value));
  // 开始任务
  const onStart = (row: TaskManageItemType) => {
    rowData.value = row;
    if (!row.responsibleUserCode) {
      message.error("任务未设置责任人，不能开始");
      return;
    }
    commonActionFn([TaskStatus.pending, TaskStatus.stop], TaskStatus.start, "开始");
  };

  // 完成
  const onFinishTask = wrapFn(rowData, () => onFinish(rowData.value));
  // 完成任务
  const onFinish = (row: TaskManageItemType) => {
    rowData.value = row;
    commonActionFn([TaskStatus.confirm], TaskStatus.finish, "完成", true);
  };

  // 终止
  const onStop = wrapFn(rowData, () => {
    const row = rowData.value;
    showMessageBox("确认要终止该任务吗?")
      .then(() => {
        updateTaskStatus({ ...row, newStatus: "4" }).then(({ data }) => {
          if (!data) return message.error("操作失败");
          message.success("操作成功");
          getTableList();
        });
      })
      .catch(() => {});
  });

  //审批详情
  const onViewDetail = wrapFn(rowData, () => {
    let billNo = rowData.value?.billNo;
    if (rowData.value?.parentId != 0) billNo = billNo.split("-")[0];
    addDialog({
      title: "查看审批节点详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) => h(NodeDetailList, { options, billNo, billType: "workOrder", billState: +rowData.value.billState })
    });
  });

  // 提交
  const onSubmitTask = wrapFn(rowData, () => onSubmit(rowData.value));
  // 提交任务
  const onSubmit = (row: TaskManageItemType) => {
    rowData.value = row;
    commonActionFn([TaskStatus.start, TaskStatus.back], TaskStatus.confirm, "提交");
  };

  // 回退
  const onReject = wrapFn(rowData, () => {
    commonActionFn([TaskStatus.confirm], TaskStatus.back, "回退");
  });

  // 隐藏子任务
  const onHideDone = (val) => {
    formData.hideChildDone = val;
  };

  // 表格行样式
  const rowStyle = ({ row }) => {
    if (row.priority === "紧急" && row.parentId === 0) {
      return { background: "#FF0000", color: "#fff" };
    } else if (row.endTime <= curDate && row.parentId === 0) {
      return { background: "#8B0000", color: "#fff" };
    } else if (row.billState === 0) {
      return { background: "#61719FFF", color: "#fff" }; // 待提交
    } else if (row.billState === 1) {
      return { background: "#004e9f", color: "#fff" }; // 审核中
    } else if (row.billState === 2) {
      return { background: "#227700", color: "#fff" }; // 已审核
    } else if (row.billState === 3) {
      return { background: "#F1108CBF", color: "#fff" }; // 重新审核
    }
    return {};
  };

  async function onRowDBClick(row: TaskManageItemType) {
    openDepDialog("edit", row);
  }

  const rowClick = (row: TaskManageItemType) => {
    rowData.value = row;
    taskView.value = "";
    const cLen = row.children?.length;
    if (cLen || activeView.value === "log") oLoading.value = true;
    const apiList: Array<Promise<any>> = [getTaskLog({ Id: row.id })];

    if (cLen) {
      // 预览主任务下所有任务
      apiList.push(viewTask({ ids: row.id }));
    } else {
      // 预览当前选中任务
      taskView.value = `# ${row.taskName}\n${row.taskContent}`;
    }

    Promise.all(apiList)
      .then((data) => {
        oLoading.value = false;
        const res1 = data[0];
        const res2 = data[1];
        taskLogList.value = res1.data || [];
        if (res2.data?.markdown_content) {
          taskView.value = res2.data.markdown_content;
        }
      })
      .catch(() => (oLoading.value = false));
  };

  // 分页相关
  function onPageCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  function onPageSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onView, type: "primary", text: "预览md", isDropDown: false },
    { clickHandler: onStartTask, type: "default", text: "开始", isDropDown: true },
    { clickHandler: onSubmitTask, type: "primary", text: "提交", isDropDown: true },
    { clickHandler: onReject, type: "default", text: "回退", isDropDown: true },
    { clickHandler: onFinishTask, type: "default", text: "完成", isDropDown: true },
    { clickHandler: onStop, type: "warning", text: "终止", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出md", isDropDown: true },
    { clickHandler: onViewDetail, type: "info", text: "审批详情", isDropDown: true }
  ]);

  return {
    tableRef,
    formData,
    loading,
    oLoading,
    columns,
    dataList,
    maxHeight,
    taskView,
    loadingStatus,
    buttonList,
    pagination,
    taskLogList,
    queryParams,
    activeView,
    searchOptions,
    taskManageOptions,
    rowStyle,
    onSearch,
    rowClick,
    onStart,
    onSubmit,
    onFinish,
    onHideDone,
    onRowDBClick,
    getTableList,
    handleTagSearch,
    onPageSizeChange,
    onPageCurrentChange
  };
};
