/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:20:10
 */

import { LoadingType } from "@/components/ButtonList/index.vue";
import {
  FlowCenterItemType,
  backFlowCenter,
  flowCenterList,
  flowChartCenter,
  pauseFlowCenter,
  restoreFlowCenter,
  revokeFlowCenter,
  getIdByBillNumber,
  stopFlowCenter
} from "@/api/systemManage";
import { onMounted, h, nextTick, reactive, ref, resolveDirective, withDirectives } from "vue";
import { revokeFormConfigs, revokeFormRules } from "./config";
import { type PaginationProps } from "@pureadmin/table";

import EditForm from "@/components/EditForm/index.vue";
import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { setColumn, getMenuColumns, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { useLogicFlow } from "@/hooks/useLogicFlow";
import Detail from "@/views/workbench/infoCenter/detail/index.vue";
import { PAGE_CONFIG } from "@/config/constant";

enum StatusText {
  audit = "审核中",
  pause = "已暂停",
  revoke = "已撤销",
  finish = "已完毕",
  stop = "已终止",
  reject = "重新审核"
}

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const rowData = ref<FlowCenterItemType>();
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<FlowCenterItemType[]>([]);
  const loadingDirective = resolveDirective("loading");
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51 + 54 + 38);

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    billNo: "",
    state: ""
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "业务单号", value: "billNo" },
    {
      label: "状态",
      value: "state",
      children: [
        { label: StatusText.audit, value: StatusText.audit },
        { label: StatusText.pause, value: StatusText.pause },
        { label: StatusText.revoke, value: StatusText.revoke },
        { label: StatusText.finish, value: StatusText.finish },
        { label: StatusText.stop, value: StatusText.stop },
        { label: StatusText.reject, value: StatusText.reject }
      ]
    }
  ]);

  const queryParams = reactive<QueryParamsType>({
    state: { value: StatusText.audit, valueLabel: StatusText.audit }
  });

  onMounted(() => {
    getColumnConfig();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "流程模板", prop: "deployKey", minWidth: 220, sortable: true },
      { label: "流程名称", prop: "deployName", minWidth: 180, sortable: true },
      { label: "流程ID", prop: "processId", minWidth: 220, sortable: true },
      { label: "流程实例ID", prop: "processInstanceId", align: "right" },
      { label: "流程版本", prop: "processVersion", align: "right" },
      { label: "业务单号", prop: "billNo", minWidth: 160 },
      {
        label: "状态",
        prop: "processStatus",
        sortable: true,
        cellRenderer({ row }) {
          const bgColor = {
            [StatusText.audit]: "#409eff",
            [StatusText.pause]: "#e6a23c",
            [StatusText.revoke]: "#f56c6c",
            [StatusText.finish]: "#67c23a",
            [StatusText.stop]: "#763a96",
            [StatusText.reject]: "#ff0000"
          };
          return <span style={{ color: "#fff", padding: "3px 6px", borderRadius: "4px", background: bgColor[row.processStatus] }}>{row.processStatus}</span>;
        }
      },
      { label: "开始时间", prop: "processStartTime", minWidth: 160, sortable: true },
      { label: "结束时间", prop: "processEndTime", minWidth: 160 },
      { label: "总耗时(ms)", prop: "processDuration" },
      { label: "撤销原因", prop: "processDeleteReason" },
      { label: "创建人工号", prop: "processCreateUserNo", align: "right", sortable: true },
      { label: "创建人名称", prop: "createUserName", sortable: true }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const getTableList = () => {
    loading.value = true;
    flowCenterList(formData)
      .then((res) => {
        const data = res.data;
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  // 搜索
  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };
  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onRowClick = (row: FlowCenterItemType) => {
    rowData.value = row;
  };

  /** 回退 */
  const onBack = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    if (row.processStatus !== StatusText.audit) {
      return message(`当前业务单号状态未处于【${StatusText.audit}】，禁止操作`, { type: "error" });
    }
    showMessageBox(`确定要回退当前业务单号【${row.billNo}】到第一个审批任务吗？`).then(() => {
      const params = {
        thirdBillNo: row.billNo,
        processDefId: row.processId,
        processInstId: row.processInstanceId
      };
      backFlowCenter(params)
        .then((res) => {
          if (res.data) {
            getTableList();
            message("回退成功");
          } else {
            message("回退失败", { type: "error" });
          }
        })
        .catch(console.log);
    });
  });

  /** 撤销 */
  const onRevoke = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    if (row.processStatus !== StatusText.audit) {
      return message(`当前业务单号状态未处于【${StatusText.audit}】，禁止操作`, { type: "error" });
    }
    const formRef = ref();
    const _formData = reactive({
      deleteReason: "",
      thirdBillNo: row.billNo ?? "",
      processInstId: row.processInstanceId ?? "",
      processDeftId: row.processId ?? ""
    });

    addDialog({
      title: "输入撤销原因，并确认",
      props: { formInline: _formData, formRules: revokeFormRules, formConfigs: revokeFormConfigs() },
      width: "460px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确定要撤销当前业务单号【${row.billNo}】流程实例吗？`).then(() => {
              revokeFlowCenter(_formData)
                .then((res) => {
                  if (res.data) {
                    done();
                    getTableList();
                    message("撤销成功");
                  } else {
                    message("撤销失败", { type: "error" });
                  }
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  });

  /** 暂停 */
  const onPause = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    if (row.processStatus !== StatusText.audit) {
      return message(`当前业务单号状态未处于【${StatusText.audit}】，禁止操作`, { type: "error" });
    }
    const _formData = reactive({
      thirdBillNo: row.billNo ?? "",
      proInsId: row.processInstanceId ?? ""
    });
    showMessageBox(`确定要暂停当前业务单号【${row.billNo}】吗？`).then(() => {
      pauseFlowCenter(_formData)
        .then((res) => {
          if (res.data) {
            getTableList();
            message("暂停成功");
          } else {
            message("暂停失败", { type: "error" });
          }
        })
        .catch(console.log);
    });
  });

  /** 恢复 */
  const onRestore = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    if (row.processStatus !== StatusText.pause) {
      return message(`当前业务单号状态未处于【${StatusText.pause}】，禁止操作`, { type: "error" });
    }
    const _formData = reactive({
      thirdBillNo: row.billNo ?? "",
      proInsId: row.processInstanceId ?? ""
    });
    showMessageBox(`确定要恢复当前业务单号【${row.billNo}】吗？`).then(() => {
      restoreFlowCenter(_formData)
        .then((res) => {
          if (res.data) {
            getTableList();
            message("恢复成功");
          } else {
            message("恢复失败", { type: "error" });
          }
        })
        .catch(console.log);
    });
  });

  /** 流程图 */
  const onFlow = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    const flowLoading = ref<boolean>(true);
    addDialog({
      title: "流程实例图 - " + row.billNo,
      width: "1000px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      class: "dialog-fill_body",
      beforeSure: (done, { options }) => done(),
      contentRenderer: () => {
        const flowEle = withDirectives(
          h("div", {
            id: "bill-task_flow",
            style: { display: "flex", flex: 1 }
          }),
          [[loadingDirective, flowLoading.value]]
        );
        nextTick(async () => {
          if (flowLoading.value) {
            const res = await flowChartCenter({ billNo: row.billNo, proInsId: row.processInstanceId });
            const { lf } = useLogicFlow("#bill-task_flow");
            flowLoading.value = false;
            lf.value.render(res.data);
          }
        });
        return flowEle;
      }
    });
  });

  /** 查看单据 */
  const onLookBill = wrapFn(rowData, ({ text }) => {
    onLookBillDetail(rowData.value);
  });

  /** 终止单据 */
  const onStopBill = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    // if (row.processStatus !== StatusText.audit) {
    //   return message(`当前业务单号状态未处于【${StatusText.audit}】，禁止操作`, { type: "error" });
    // }
    const _formData = reactive({
      processInsId: row.processInstanceId ?? ""
    });
    showMessageBox(`确定要终止当前业务单号【${row.billNo}】吗？`).then(() => {
      stopFlowCenter(_formData)
        .then((res) => {
          if (res.data) {
            getTableList();
            message("终止成功");
          } else {
            message("终止失败", { type: "error" });
          }
        })
        .catch(console.log);
    });
  });

  /** 查看单据 */
  const onLookBillDetail = async (row: FlowCenterItemType) => {
    const { processId, billNo, formUrl, processInstanceId } = row;
    const params = { processDefId: processId, billNo: billNo, isCheck: 0 };
    const dbKey = "/" + formUrl.split("/")[1];
    try {
      const res = await getIdByBillNumber(params, { headers: { dbKey: dbKey } });
      addDialog({
        title: `查看单据【${billNo}】`,
        props: {
          id: res.data,
          formUrl: formUrl,
          billNo: billNo,
          processDefId: processId,
          processInstId: processInstanceId,
          projectId: dbKey,
          ischeck: "0"
        },
        width: "96%",
        draggable: true,
        fullscreenIcon: true,
        fullscreen: false,
        closeOnClickModal: false,
        okButtonText: "确定",
        contentRenderer: () => h(Detail),
        beforeSure: (done, { options }) => done()
      });
    } catch (error) {
      console.log(error);
    }
  };

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }
  function onCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onBack, type: "primary", text: "回退", isDropDown: true },
    { clickHandler: onRevoke, type: "danger", text: "删除", isDropDown: true },
    { clickHandler: onPause, type: "warning", text: "暂停", isDropDown: true },
    { clickHandler: onRestore, type: "success", text: "激活", isDropDown: true },
    { clickHandler: onFlow, type: "primary", text: "流程图", isDropDown: true },
    { clickHandler: onLookBill, type: "default", text: "查看单据", isDropDown: true },
    { clickHandler: onStopBill, type: "default", text: "终止", isDropDown: true }
  ]);
  return {
    loading,
    columns,
    dataList,
    maxHeight,
    loadingStatus,
    buttonList,
    StatusText,
    queryParams,
    searchOptions,
    pagination,
    onRefresh,
    onTagSearch,
    onRowClick,
    onLookBillDetail,
    onSizeChange,
    onCurrentChange
  };
};
