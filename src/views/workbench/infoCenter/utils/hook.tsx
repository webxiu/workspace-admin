/*
 * @Author: Hailen
 * @Date: 2023-07-06 14:21:11
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-09-12 18:13:14
 */

import { useEleHeight } from "@/hooks";
import { message, showMessageBox } from "@/utils/message";
import { getTableConfig, TreeDataTtype } from "./config";
import { addDialog } from "@/components/ReDialog";
import { type PaginationProps } from "@pureadmin/table";
import { ElTree } from "element-plus";
import { Ref, reactive, ref, onMounted, h, nextTick, resolveDirective, withDirectives } from "vue";
import { queryStartTask, queryPendingTask, queryFinishTask, queryMyTasks, getFlowBillConfig, getIdByBillNO, cancelBillNO } from "@/api/workbench/infoCenter";
import { QueryStartTaskResponseType, QueryPendingTaskResponseType, MyTaskResponseType } from "@/api/workbench/types";
import { useLogicFlow } from "@/hooks/useLogicFlow";
import { useRoute } from "vue-router";
import { setColumn, downloadDataToExcel, getMenuColumns, updateButtonList } from "@/utils/table";
import { debounce } from "@/utils/common";
import Detail from "../detail/index.vue";
import EditForm from "@/components/EditForm/index.vue";

import { PAGE_CONFIG } from "@/config/constant";

export type RowHandleType = "add" | "edit";
export type TaskType = "start" | "approve" | "approved" | "normal";
export type TableColumnItemType = Ref<TableColumnList[]>;

type TableItemType = QueryStartTaskResponseType & QueryPendingTaskResponseType & MyTaskResponseType;

export function useConfig() {
  const treeRef = ref<InstanceType<typeof ElTree>>();
  const route = useRoute();
  const treeRowData = ref();
  const loading = ref<boolean>(false);
  const flowLoading = ref<boolean>(true);
  const taskType = ref<TaskType>("approve");
  const loadingDirective = resolveDirective("loading");
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 36 + 50);
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<TableItemType[]>([]);

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const lastTask = ref("");
  const queryFrom = reactive({
    taskState: undefined,
    searchFrom: undefined
  });
  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    billNo: "",
    sendName: "",
    sendTime: ""
  });

  onMounted(() => {
    const { search_from, task_state, id, type } = route.query;
    if (search_from && task_state && type) {
      taskType.value = type as TaskType;
      queryFrom.searchFrom = search_from;
      queryFrom.taskState = task_state;
      treeRef.value!.setCurrentKey(id as string);
      getTableList();
    } else {
      getTaskList();
    }
  });

  const apiObj = {
    start: queryStartTask,
    approve: queryPendingTask,
    approved: queryFinishTask,
    normal: queryMyTasks
  };

  const getColumnConfig = async (taskType: "start" | "approve" | "approved" | "normal") => {
    if (taskType === lastTask.value) taskType = lastTask.value;
    let columnData = getTableConfig(taskType);
    const taskMap = { approve: 0, start: 1, approved: 2, normal: 3 };
    const { columnArrs, buttonArrs } = await getMenuColumns();
    if (columnArrs.length && columnArrs[taskMap[taskType]]) columnData = columnArrs[taskMap[taskType]];
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, dragSelector: ".info-center", operationColumn: { width: 180 }, formData });
    lastTask.value = taskType;
  };

  /** 搜索 */
  const onSearch = () => {
    getTableList();
  };

  /** 选中任务 */
  const getTaskList = (data?: TreeDataTtype) => {
    data = data || { label: "", id: "1.1", type: "approve", children: [] };
    treeRef.value!.setCurrentKey(data.id);
    treeRowData.value = data;
    if (data.type && !loading.value) {
      taskType.value = data.type as TaskType;
      queryFrom.searchFrom = data.searchFrom;
      queryFrom.taskState = data.taskState;
      getTableList();
    }
  };

  /** 获取列表数据 */
  const getTableList = () => {
    getColumnConfig(taskType.value);
    const params = { ...queryFrom, ...formData };
    loading.value = true;
    apiObj[taskType.value](params)
      .then((res) => {
        const data = res.data as any;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total || 0;
      })
      .catch(() => (loading.value = false));
  };

  /** 查看流程 */
  const onLookFlow = (row: TableItemType) => {
    const { billNo, processInstId } = row;
    flowLoading.value = true;
    addDialog({
      title: `流程实例图 - ${billNo}`,
      width: "1000px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      class: "dialog-fill_body",
      beforeSure: (done, { options }) => done(),
      contentRenderer: () => {
        const flowEle = withDirectives(
          h("div", {
            id: "bill_flow",
            style: { display: "flex", flex: 1 }
          }),
          [[loadingDirective, flowLoading.value]]
        );
        nextTick(async () => {
          if (flowLoading.value) {
            const res = await getFlowBillConfig({ billNo, proInsId: processInstId });
            const { lf } = useLogicFlow("#bill_flow");
            flowLoading.value = false;
            lf.value.render(res.data);
          }
        });
        return flowEle;
      }
    });
  };

  const callbackFn = (dialogOption) => {
    dialogOption.value.options.visible = false;
    getTableList();
  };

  /** 查看单据 */
  const onLookBill = debounce(async (row: TableItemType) => {
    console.log(row, "row=>>");
    const bLoading = ref<boolean>(true);
    const isCheck = treeRowData.value?.id === "1.1" ? "1" : "0";
    const { billNo, processDefId, processInstId, formUrl, projectId, taskId } = row;
    const params = { processDefId: processDefId, billNo, isCheck: isCheck };
    const formRef = ref();
    const resultDialog = ref();
    const id = ref(""); // 1071
    getIdByBillNO(params, { headers: { dbKey: row.projectId } })
      .then((res) => {
        bLoading.value = false;
        id.value = res.data;
      })
      .catch(() => (bLoading.value = false));

    resultDialog.value = addDialog({
      title: `查看单据【${billNo}】`,
      props: {
        id: id,
        loading: bLoading,
        formUrl: formUrl,
        billNo: billNo,
        taskId,
        processDefId: processDefId,
        processInstId: processInstId,
        projectId: projectId,
        ischeck: isCheck,
        class: "view-bill_audit",
        callbackFn: callbackFn.bind(null, resultDialog)
      },
      width: row.billNo.startsWith("QE") ? "1600px" : "1200px",
      draggable: true,
      fullscreenIcon: true,
      fullscreen: false,
      closeOnClickModal: false,
      cancelButtonText: "关闭",
      hideItem: ["ok"],
      contentRenderer: () => h(Detail, { ref: formRef }),
      beforeSure: (done, { options }) => done()
    });
  }, 310);

  /** 撤销 */
  const onRevoke = (row: TableItemType) => {
    const formRef = ref();
    const _formData = reactive({ deleteReason: "" });
    const formConfigs = [
      {
        label: "",
        prop: "deleteReason",
        colProp: { span: 24 },
        labelWidth: 0,
        render: ({ formModel, row }) => <el-input rows={4} type="textarea" v-model={formModel[row.prop]} placeholder="请输入撤销原因" clearable />
      }
    ];

    addDialog({
      title: "输入撤销原因，并确认",
      props: { formInline: _formData, formConfigs: formConfigs },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      fullscreen: false,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确定要撤销业务单号【${row.billNo}】的流程实例吗?`)
              .then(() => {
                cancelBillNO({
                  thirdBillNo: row.billNo,
                  processInstId: row.processInstId,
                  processDeftId: row.processDefId,
                  deleteReason: _formData.deleteReason
                }).then((res) => {
                  if (res.data) {
                    done();
                    getTableList();
                    message("撤销成功");
                  } else {
                    message("撤销失败", { type: "error" });
                  }
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  /** 导出 */
  const onExport = () => {
    downloadDataToExcel({
      dataList: dataList.value,
      columns: columns.value,
      sheetName: "信息中心"
    });
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    formData.page = 1;
    pagination.currentPage = 1;
    getTableList();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const buttonList = ref<ButtonItemType[]>([{ clickHandler: onExport, type: "primary", text: "导出", isDropDown: true }]);

  return {
    treeRef,
    loading,
    taskType,
    formData,
    maxHeight,
    dataList,
    columns,
    pagination,
    buttonList,
    onSearch,
    onLookBill,
    onLookFlow,
    getTaskList,
    onRevoke,
    handleSizeChange,
    handleCurrentChange
  };
}
