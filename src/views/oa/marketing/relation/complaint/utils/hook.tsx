/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:23:30
 */

import { LoadingType } from "@/components/ButtonList/index.vue";
import { ElMessage, MessageBoxData } from "element-plus";
import {
  CustomerComplaintItemType,
  addBill,
  updateBill,
  customerComplaint,
  submitEditBill,
  acceptBill,
  replyBill,
  deleteBill,
  exportBill,
  withdrawBill,
  backBill,
  discardBill,
  ComplaintTypeItemType
} from "@/api/oaManage/marketing";
import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import AddModal from "../addModal.vue";
import EditForm from "@/components/EditForm/index.vue";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { PAGE_CONFIG } from "@/config/constant";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { downloadFile, getFileNameOnUrlPath } from "@/utils/common";
import { setColumn, getExportConfig, getMenuColumns, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { Plus, Edit, Delete, Refresh, Position, Pointer, Download, RefreshLeft, Remove, Close, View } from "@element-plus/icons-vue";
import { billState, auditState, BillState, AuditState } from "./config";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { commonBack, commonSubmit } from "@/api/systemManage";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<CustomerComplaintItemType[]>([]);
  const loading = ref<boolean>(false);
  const rowData = ref<CustomerComplaintItemType>();
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51 + 51);
  const billTypeList = ref<ComplaintTypeItemType[]>([]);

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    title: "",
    billNo: "",
    ksdate: "",
    marketState: "",
    state: "",
    startDate: "",
    endDate: ""
  });

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "标题", value: "title" },
    { label: "单据编号", value: "billNo" },
    { label: "客诉日期", value: "date", type: "daterange", format: "YYYY-MM-DD" },
    { label: "单据状态", value: "marketState", children: [] },
    { label: "审核状态", value: "state", children: [] }
  ]);

  onMounted(() => {
    getColumnConfig();
    getOptionList();
    getTableList();
  });

  const getOptionList = () => {
    getBOMTableRowSelectOptions({ optioncode: "BillStatus,ComplaintsBillStatus,ComplaintsType" }).then((res: any) => {
      if (res.data) {
        const billStausList = res.data.find((item) => item.optionCode === "BillStatus")?.optionList || [];
        const complaintsBillStatusList = res.data.find((item) => item.optionCode === "ComplaintsBillStatus")?.optionList || [];
        const complaintsType = res.data.find((item) => item.optionCode === "ComplaintsType")?.optionList || [];

        const billStatusOptions = complaintsBillStatusList.map((item) => ({ label: item.optionName, value: item.optionValue }));
        const auditStatusOptions = billStausList.map((item) => ({ label: item.optionName, value: item.optionValue }));
        searchOptions[3].children = billStatusOptions;
        searchOptions[4].children = auditStatusOptions;
        billTypeList.value = complaintsType;
      }
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "订单号", prop: "orderNo", sortable: true },
      { label: "客户名称", prop: "customer" },
      { label: "标题", prop: "title", minWidth: 200 },
      { label: "单据编号", prop: "billNo", sortable: true },
      { label: "单据状态", prop: "marketStateName", sortable: true },
      { label: "审核状态", prop: "stateName", sortable: true },
      { label: "单据提交人", prop: "marketSubmitUserName", sortable: true },
      { label: "单据提交时间", prop: "marketSubmitDate", minWidth: 160, sortable: true },
      { label: "接收人", prop: "acceptUserName" },
      { label: "接收时间", prop: "acceptDate", minWidth: 160 },
      { label: "回复人", prop: "replyUserName", sortable: true },
      { label: "回复时间", prop: "replyDate", minWidth: 160, sortable: true },
      { label: "撤回/退回人", prop: "backUserName" },
      { label: "撤回/退回时间", prop: "backDate", minWidth: 160 },
      { label: "审核提交人", prop: "submitUserName" },
      { label: "审核提交时间", prop: "submitDate", minWidth: 160, sortable: true },
      { label: "最后修改人", prop: "modifyUserName" },
      { label: "最后修改时间", prop: "modifyDate", minWidth: 160 },
      { label: "创建人", prop: "createUserName" },
      { label: "创建时间", prop: "createDate", minWidth: 160 },
      { label: "作废人", prop: "abolishUserName" },
      { label: "作废时间", prop: "abolishDate", minWidth: 160, sortable: true },
      { label: "作废原因", prop: "cause" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
  };

  const getTableList = () => {
    loading.value = true;
    customerComplaint(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  // 搜索
  const onTagSearch = ({ date, ...values }) => {
    const dates = date ? date.split(" ~ ") : [];
    formData.startDate = dates[0];
    formData.endDate = dates[1];
    Object.assign(formData, values);
    getTableList();
  };
  const onRefresh = () => getTableList();

  const onRowClick = (row: CustomerComplaintItemType) => {
    rowData.value = row;
  };

  /** 新增 */
  const onAdd = ({ text }) => {
    openDialog("add");
  };

  /** 编辑 */
  const onEdit = wrapFn(rowData, ({ text }) => {
    openDialog("edit", rowData.value);
  });

  /** 添加弹窗 */
  const openDialog = (type: "add" | "edit" | "reply", row?: CustomerComplaintItemType) => {
    const title = { add: "新增", edit: "修改", reply: "回复" }[type];
    const FormRef = ref();

    addDialog({
      title: `${title}客诉单`,
      props: { row, type, billTypeList },
      width: "960px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: false,
      customButtonText: row?.marketState === 0 ? "提交单据" : "",
      contentRenderer: () => h(AddModal, { ref: FormRef }),
      beforeCustom: (done, { options }) => {
        onSubmitChange("submit", FormRef, done);
      },
      beforeSure: (done, { options }) => {
        onSubmitChange(type, FormRef, done);
      }
    });
  };

  const onSubmitChange = (type: "add" | "edit" | "submit" | "reply", FormRef, done) => {
    const title = { add: "新增", edit: "修改", submit: "提交", reply: "回复" }[type];
    let msgText = "若您在页面进行了修改，也会一并提交";
    if (type !== "submit") {
      msgText = `确定要${title}客诉单吗？`;
    }

    const { formRef, sendList, formData, detailData } = FormRef.value.getRef();
    switch (detailData?.marketState) {
      //单据状态为已提交，禁用客诉明细修改
      case 1:
        return message("单据状态为已提交，禁止修改", { type: "error" });
      //单据状态为已接收或已回复，禁用客诉明细修改
      case 2:
      case 3:
        {
          const state = detailData?.state;
          if (state === 1 || state === 2) {
            return message(`单据状态为${auditState[state]}，禁止修改`, { type: "error" });
          }
        }
        break;
      case 4: {
        return message("单据状态为已作废，禁止修改", { type: "error" });
      }
    }

    formRef?.validate((valid) => {
      if (valid) {
        if (!formData.complaintEntryList?.length) {
          return message("客诉明细表不能为空", { type: "error" });
        }
        if (!sendList.value?.length) {
          return message("抄送人清单不能为空", { type: "error" });
        }
        const remindList = sendList.value.map((item) => `${item.userName}-${item.id}`).join(";");
        const params = {
          id: formData.id,
          billNo: formData.billNo,
          complaintEntryList: formData.complaintEntryList,
          createDate: formData.createDate,
          createUserName: formData.createUserName,
          reply: formData.reply,
          updateReplyFile: formData.updateReplyFile,
          fileName: formData.fileName,
          resourceName: formData.resourceName,
          customer: formData.customer,
          orderNo: formData.orderNo,
          remindList: remindList,
          title: formData.title
        };
        showMessageBox(msgText).then(() => {
          const API = { add: addBill, edit: updateBill, submit: submitEditBill, reply: replyBill };
          API[type](params)
            .then((res) => {
              if (res.data) {
                done();
                getTableList();
                message(title + "成功");
              } else {
                message(title + "失败", { type: "error" });
              }
            })
            .catch(console.log);
        });
      }
    });
  };

  /** 删除 */
  const onDelete = wrapFn(rowData, ({ text }) => {
    deleteBill({ id: rowData.value.id }).then((res) => {
      if (res.data) {
        message("删除成功");
        getTableList();
      } else {
        message("删除失败", { type: "error" });
      }
    });
  });

  /** 接收 */
  const onReceive = wrapFn(rowData, ({ text }) => {
    onReceiveBill(rowData.value);
  });

  const onReceiveBill = (row: CustomerComplaintItemType) => {
    if (row.marketState !== BillState.submited) {
      return message("单据状态不是已提交，不能接收！(需要业务员在修改页面提交单据)", { type: "error" });
    }
    acceptBill({ id: row.id }).then((res) => {
      if (res.data) {
        message("接收成功");
        getTableList();
      } else {
        message("接收失败", { type: "error" });
      }
    });
  };

  /** 回复 */
  const onReply = wrapFn(rowData, ({ text }) => {
    onReplyBill(rowData.value);
  });
  const onReplyBill = (row: CustomerComplaintItemType) => {
    if (row.marketState === BillState.receive || row.marketState === BillState.reply) {
      openDialog("reply", row);
    } else {
      message("单据状态不是已接收，不能回复", { type: "error" });
    }
  };

  /** 提交 */
  const onSubmit = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    if (row.marketState !== BillState.reply) {
      return message("请接收并回复单据后，再提交审批", { type: "error" });
    } else if ([AuditState.submit, AuditState.reAudit].includes(row.state)) {
      return message("审核状态不是待提交或重新审核，不能进行提交", { type: "error" });
    }
    showMessageBox(`确定提交【${row.title}】进行审核吗？<br />提交审核后不可再修改回复！`).then(() => {
      commonSubmit({ id: row.id, billId: "10013" }).then((res) => {
        if (res.data) {
          message("提交成功");
          getTableList();
        } else {
          message("提交失败", { type: "error" });
        }
      });
    });
  });

  /** 导出 */
  const onExport = ({ text }) => {
    const headConfig = getExportConfig("客诉管理", columns.value);
    exportBill(headConfig)
      .then((res) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName, true);
        }
      })
      .catch(console.log);
  };

  /** 撤回单据 */
  const onRevoke = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    //单据已提交，可以撤回
    if (row.marketState === BillState.submited) {
      showMessageBox(`确定撤回【${row.title}的提交吗？`).then(() => {
        withdrawBill({ id: row.id }).then((res) => {
          if (res.data) {
            message("撤回成功");
            getTableList();
          } else {
            message("撤回失败", { type: "error" });
          }
        });
      });
    } else if (row.marketState === BillState.receive) {
      message("单据已被品质工程师接收，无法主动撤回，请联系品质工程师对单据进行【退回单据】操作。", { type: "error" });
    } else {
      message("只能对单据状态为【已提交】的客诉单进行撤回！", { type: "error" });
    }
  });

  /** 退回单据 */
  const onBack = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    //单据已提交，可以撤回
    if ([AuditState.reAudit, AuditState.reAudit].includes(row.state)) {
      //单据状态为已接收或已回复，可以进行退回
      if ([BillState.receive, BillState.reply].includes(row.marketState)) {
        showMessageBox(`确定退回单据${row.title}吗？`).then(() => {
          commonBack({ id: row.id }).then((res) => {
            if (res.data) {
              message("退回成功");
              getTableList();
            } else {
              message("退回失败", { type: "error" });
            }
          });
        });
      } else {
        message("只能对单据状态为【已接收】或【已回复】的客诉单进行退回！", { type: "error" });
      }
    } else {
      message("只能对审核状态为【待提交】或【退回重审】的客诉单进行退回！", { type: "error" });
    }
  });

  /** 作废 */
  const onDiscard = wrapFn(rowData, ({ text }) => {
    const row = rowData.value;
    const FormRef = ref();
    const formData = reactive({ cause: "" });
    addDialog({
      title: "输入作废原因，并确认:",
      props: {
        formInline: formData,
        formRules: [{ cause: [{ required: true, message: "请输入作废原因", trigger: "blur" }] }],
        formConfigs: [
          {
            prop: "cause",
            render: ({ formModel, row }) => (
              <el-input v-model={formModel[row.prop]} rows={4} type="textarea" autosize={{ minRows: 4, maxRows: 4 }} placeholder="请输入作废原因" />
            )
          }
        ]
      },
      width: "360px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: false,
      contentRenderer: () => h(EditForm, { ref: FormRef }),
      beforeSure: (done, { options }) => {
        showMessageBox("确认提交吗?").then((res) => {
          discardBill({ id: row.id, cause: formData.cause }).then((res) => {
            if (res.data) {
              message("作废成功");
              done();
              getTableList();
            } else {
              message("作废失败", { type: "error" });
            }
          });
        });
      }
    });
  });

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }
  function onCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const onNodeDetail = () => {
    if (!rowData.value) {
      ElMessage({ message: "请选择记录", type: "warning" });
      return;
    }
    addDialog({
      title: "查看审批详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: rowData.value.billNo, billType: "customerComplaint", billState: rowData.value.state })
    });
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus },
    { clickHandler: onEdit, type: "warning", text: "修改", icon: Edit },
    { clickHandler: onDelete, type: "danger", text: "删除", icon: Delete },
    { clickHandler: onReceive, type: "info", text: "接收", isDropDown: true, icon: Refresh },
    { clickHandler: onReply, type: "warning", text: "回复", isDropDown: true, icon: Position },
    { clickHandler: onSubmit, type: "success", text: "提交", isDropDown: true, icon: Pointer },
    { clickHandler: onExport, type: "default", text: "导出", isDropDown: true, icon: Download },
    { clickHandler: onRevoke, type: "warning", text: "撤回单据", isDropDown: true, icon: RefreshLeft },
    { clickHandler: onBack, type: "info", text: "回退", isDropDown: true, icon: Remove },
    { clickHandler: onDiscard, type: "danger", text: "作废", isDropDown: true, icon: Close },
    { clickHandler: onNodeDetail, type: "primary", text: "审批详情", isDropDown: true, icon: View }
  ]);

  return {
    loading,
    columns,
    dataList,
    maxHeight,
    loadingStatus,
    buttonList,
    searchOptions,
    pagination,
    onRefresh,
    onTagSearch,
    onRowClick,
    onReceiveBill,
    onReplyBill,
    onSizeChange,
    onCurrentChange
  };
};
