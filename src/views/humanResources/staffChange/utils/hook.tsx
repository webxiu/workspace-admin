import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";

import { getEnumDictList, getMenuColumns, RendererType, setColumn, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import {
  staffChangeList,
  addStaffChange,
  updateStaffChange,
  getUserBasicInfo,
  deleteStaffChange,
  StaffChangeItemType,
  staffInfoList
} from "@/api/oaManage/humanResources";
import TableEditList from "@/components/TableEditList/index.vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import { boolOptions, PAGE_CONFIG } from "@/config/constant";
import { adjustTypeList } from "./config";
import { FormItemConfigType } from "@/utils/form";
import { AuditState } from "../../leaveApply/utils/hook";
import { commonRevoke, commonSubmit } from "@/api/systemManage";
import { commonBackLogic } from "@/utils/common";
import NodeDetailList from "@/components/NodeDetailList/index.vue";

export const useTestReportConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const loading = ref<boolean>(false);
  const dataList = ref<StaffChangeItemType[]>([]);
  const statusOpts = ref([]);
  const rowData = ref<StaffChangeItemType>();
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const formData = reactive({ staffName: "", page: 1, limit: PAGE_CONFIG.pageSize });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 46);
  const searchOptions = reactive<SearchOptionType[]>([{ label: "姓名", value: "staffName" }]);

  onMounted(() => {
    getOptions();
    getColumnConfig();
    getTableList();
  });

  const getOptions = () => {
    getEnumDictList(["BillStatus"]).then(({ BillStatus }) => {
      statusOpts.value = BillStatus.map(({ optionName, optionValue }) => ({ optionName, optionValue }));
    });
  };

  const getColumnConfig = async () => {
    const transferTypeRender: RendererType = ({ row, column }) => {
      const value = row[column["property"]] as string;
      return <span>{value.slice(0, 2)}</span>;
    };
    let columnData: TableColumnList[] = [
      { label: "姓名", prop: "staffName", minWidth: 140 },
      { label: "部门", prop: "deptName", minWidth: 140 },
      { label: "异动前部门", prop: "deptName", minWidth: 140 },
      { label: "异动前职位", prop: "roleName", minWidth: 140 },
      { label: "入职时间", prop: "startDate", minWidth: 160 },
      { label: "异动类型", prop: "transferType", minWidth: 140, cellRenderer: transferTypeRender },
      { label: "异动后部门", prop: "transferAfterDeptName", minWidth: 140 },
      { label: "异动后职位", prop: "transferAfterRoleName", minWidth: 140 },
      { label: "异动时间", prop: "transferDate", minWidth: 160 },
      { label: "调整原因", prop: "transferReason", minWidth: 140 },
      { label: "薪资是否调整", prop: "adjustSalaryFlag", minWidth: 140 },
      { label: "调整后薪资", prop: "adjustAfterSalary", minWidth: 140 },
      { label: "生效日期", prop: "effectiveDate", minWidth: 140 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns([{ transferType: transferTypeRender }]);
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    return columnData;
  };

  const getTableList = () => {
    loading.value = true;
    staffChangeList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch((err) => (loading.value = false));
  };

  const onReFresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  function onAdd() {
    openDialog("add", {} as StaffChangeItemType);
  }

  const onEdit = wrapFn(rowData, () => {
    openDialog("edit", rowData.value);
  });

  const openDialog = (type: "add" | "edit", row?: StaffChangeItemType) => {
    let title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    const sLoading = ref(false);
    const staffUserList = ref([]);
    const mergeType = row?.transferType ?? "";
    const _formData = reactive({
      ...row,
      transferType: mergeType.slice(0, 2),
      other: mergeType.slice(2),
      transferAfterDeptId: row.transferAfterDeptId ? `${row.transferAfterDeptId}` : ""
    });

    if (type === "edit") {
      _formData.billState = statusOpts.value.find((el) => el.optionValue == _formData.billState)?.optionName || "";
    }

    // 获取人员信息
    function onUserChange(staffCode) {
      sLoading.value = true;
      getUserBasicInfo({ staffCode })
        .then(({ data }) => {
          data[0].transferDeptName = data[0].deptName;
          data[0].transferRoleName = data[0].roleName;
          Object.assign(_formData, data[0]);
          _formData.staffCode = staffCode;
          _formData["education"] = staffUserList.value.find((el) => el.value == staffCode)?.education;
        })
        .finally(() => (sLoading.value = false));
    }

    staffInfoList({ page: 1, limit: 10000, state: "在职" }).then((res) => {
      if (res.data) {
        const result = res.data.records;
        staffUserList.value = result.map(({ staffName, staffId, deptName, education }) => ({
          label: staffId + " - " + staffName + " - " + deptName,
          value: staffId,
          education
        }));
      }
    });
    const cannotEdit = [AuditState.auditing, AuditState.audited].includes(row?.billState);
    if (cannotEdit) title = "查看";

    const formConfig: FormItemConfigType[] = [
      {
        formData: _formData,
        customElement: {
          staffName: ({ formModel, row }) => {
            return (
              <el-tree-select
                onChange={onUserChange}
                disabled={type === "edit"}
                v-model={formModel[row.prop]}
                data={staffUserList.value}
                placeholder="请选择"
                filterable
                style={{ width: "100%" }}
              />
            );
          }
        },
        customProps: {
          transferType: {
            onChange: (val, columns) => {
              const isHide = val !== "其他";
              columns.value.forEach((col) => col.prop === "other" && (col.hide = isHide));
            }
          },
          transferAfterDeptId: { apiFields: ["transferAfterRoleId"] },
          transferAfterRoleId: {
            paramField: "deptId",
            apiParams: { deptId: row.transferAfterDeptId }
          }
        },
        dataOption: {
          transferType: adjustTypeList,
          adjustSalaryFlag: boolOptions
        },
        formProps: { labelWidth: "120px", disabled: cannotEdit }
      }
    ];
    addDialog({
      title: `${title}人事异动`,
      props: {
        params: { groupCode: "1" },
        formConfig: formConfig
      },
      width: "960px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideFooter: cannotEdit,
      showResetButton: true,
      beforeReset: () => formRef.value.resetRef(),
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const { other, ...reset } = _formData;
        reset.transferType = reset.transferType + (other ?? "");
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            showMessageBox("确认提交吗").then(() => {
              const reqApi = { add: addStaffChange, edit: updateStaffChange };
              reqApi[type]({ ...reset, billState: undefined }).then((res) => {
                if (res.data) {
                  message.success(`${title}成功`);
                  getTableList();
                  done();
                } else {
                  message.error(`${title}失败`);
                }
              });
            });
          }
        });
      }
    });
  };

  const onDelete = wrapFn(rowData, () => {
    const { id, staffName } = rowData.value;
    showMessageBox(`确认要删除【${staffName}】吗?`).then(() => {
      deleteStaffChange({ id }).then(({ data }) => {
        if (!data) return message.error("删除失败");
        message.success("删除成功");
        getTableList();
      });
    });
  });

  const onCurrentChange = (row: StaffChangeItemType) => {
    rowData.value = row;
  };
  const onDblclick = (row: StaffChangeItemType) => {
    openDialog("edit", row);
  };

  // 分页相关
  function handleSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function handleCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const onSubmitAct = () => {
    if (!rowData.value) {
      return message.warning("请选择单据");
    }
    if (![AuditState.submit, AuditState.reAudit].includes(+rowData.value.billState)) {
      return message.error("只能提交【待提交/重新审核】的记录");
    }

    showMessageBox(`确认提交单据吗?`).then(() => {
      commonSubmit({ billId: "10060", billNo: rowData.value.billNo })
        .then((res) => {
          if (!res.data) return message.error("提交失败");
          message.success("提交成功");
          getTableList();
        })
        .catch(console.log);
    });
  };

  const onRevokeAct = () => {
    if (!rowData.value) {
      return message.warning("请选择单据");
    }
    if (![AuditState.auditing].includes(+rowData.value.billState)) {
      return message.error("只能撤销【审核中】的记录");
    }

    showMessageBox(`确认撤销单据吗?`).then(() => {
      commonRevoke({ billNo: rowData.value.billNo })
        .then((res) => {
          if (!res.data) return message.error("撤销失败");
          message.success("撤销成功");
          getTableList();
        })
        .catch(console.log);
    });
  };

  const onBackAct = () => {
    if (!rowData.value) {
      return message.warning("请选择单据");
    }
    if (![AuditState.auditing, AuditState.audited].includes(+rowData.value.billState)) {
      return message.error("当前状态不能进行回退");
    }
    commonBackLogic(rowData.value.billNo, getTableList);
  };

  const onViewNodeDetail = () => {
    if (!rowData.value) {
      return message.warning("请选择单据");
    }
    addDialog({
      title: "查看审批详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) => h(NodeDetailList, { options, billNo: rowData.value.billNo, billType: "hrChange", billState: rowData.value.billState })
    });
  };

  const onExportAct = () => {
    message.warning("暂无接口");
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false },

    { clickHandler: onSubmitAct, type: "info", text: "提交", isDropDown: true },
    { clickHandler: onRevokeAct, type: "info", text: "撤销", isDropDown: true },
    { clickHandler: onBackAct, type: "info", text: "回退", isDropDown: true },
    { clickHandler: onViewNodeDetail, type: "info", text: "审批详情", isDropDown: true },
    { clickHandler: onExportAct, type: "info", text: "导出", isDropDown: true }
  ]);

  const rowClick = (row) => {
    rowData.value = row;
  };

  return {
    loading,
    columns,
    rowClick,
    dataList,
    maxHeight,
    pagination,
    searchOptions,
    buttonList,
    onReFresh,
    onTagSearch,
    onDblclick,
    onCurrentChange,
    handleSizeChange,
    handleCurrentChange
  };
};
