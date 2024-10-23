/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:37:16
 */

import { dayjs } from "element-plus";
import {
  InductionAuditItemType,
  inductionAuditList,
  submitInductionAudit,
  deleteInductionAudit,
  timeSettingList,
  fetchMachine
} from "@/api/oaManage/humanResources";
import { h, onMounted, reactive, ref } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import EditForm from "@/components/EditForm/index.vue";
import NodeDetailList from "@/components/NodeDetailList/index.vue";

import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { setColumn, getMenuColumns, updateButtonList, usePageSelect } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import { formRules, formConfigs, TemporaryFlag } from "./config";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { getDeptTreeData } from "@/api/systemManage";
import { PAGE_CONFIG, BillState, BillState_Color } from "@/config/constant";
import { Delete, SetUp, Tickets, CircleClose } from "@element-plus/icons-vue";

export const useConfig = () => {
  const tableRef = ref();
  const columns = ref<TableColumnList[]>([]);
  const dataList = ref<InductionAuditItemType[]>([]);
  const loading = ref<boolean>(false);
  const rowData = ref<InductionAuditItemType>();
  const rowsData = ref<InductionAuditItemType[]>([]);
  const optionDatas: any = ref({});
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 68 + 51);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    staffName: "",
    state: "",
    temporaryFlag: ""
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "staffName" },
    { label: "审核状态", value: "state", children: [] },
    {
      label: "类型",
      value: "temporaryFlag",
      children: [
        { label: "正式工", value: 0 },
        { label: "临时工", value: 1 }
      ]
    }
  ]);
  const queryParams = reactive<QueryParamsType>({
    state: { value: "1", valueLabel: "审核中" }
  });
  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

  onMounted(() => {
    getOptionList();
    getColumnConfig();
  });

  const findItemInfo = (key, list = []) => {
    return list.find((item) => item.optionCode === key)?.optionList || [];
  };

  const getOptionList = () => {
    getDeptTreeData().then((res) => {
      if (res.data) {
        const data = JSON.parse(res.data);
        optionDatas.value.deptInfoTree = data[0]?.children || [];
      }
    });

    // 获取工作时间
    timeSettingList({ page: 1, limit: 10000 }).then((res) => {
      if (res.data) {
        optionDatas.value.workTimeList = res.data.map((item) => ({ optionName: item.worktime, optionValue: item.id + "" }));
      }
    });

    // 获取考勤机数据
    fetchMachine({}).then((res: any) => {
      if (res.data) {
        optionDatas.value.machineList = res.data;
      }
    });

    getBOMTableRowSelectOptions({ optioncode: "BillStatus,EmployeeLevel,EmployeeType,DormitoryType" }).then((res: any) => {
      if (res.data) {
        const BillStatus = findItemInfo("BillStatus", res.data);
        const EmployeeLevel = findItemInfo("EmployeeLevel", res.data);
        const EmployeeType = findItemInfo("EmployeeType", res.data);
        const YesOrNo = findItemInfo("DormitoryType", res.data);

        optionDatas.value = {
          ...optionDatas.value,
          BillStatus,
          EmployeeLevel,
          EmployeeType,
          YesOrNo
        };

        const calcStatus = BillStatus?.map((item) => ({ label: item.optionName, value: item.optionValue }));
        searchOptions[1].children = [{ label: "全部", value: "-1" }, ...calcStatus];
      }
    });
  };

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "审核编号", prop: "billNo" },
      { label: "姓名", prop: "staffName" },
      { label: "工号", prop: "staffId", sortable: true },
      { label: "部门", prop: "deptName" },
      { label: "组别", prop: "groupName" },
      { label: "雇员种类", prop: "employeKind" },
      { label: "是否住宿", prop: "isStay", sortable: true },
      {
        label: "审核状态",
        prop: "state",
        sortable: true,
        cellRenderer: ({ row, column }) => {
          const stateObj = BillState_Color[row[column["property"]]];
          return (
            <span class="br-4 color-fff" style={{ background: stateObj?.color, padding: "4px 6px" }}>
              {stateObj?.name}
            </span>
          );
        }
      },
      { label: "登记日期", prop: "createDate", minWidth: 160 },
      {
        label: "是否为临时工",
        prop: "temporaryFlag",
        sortable: true,
        minWidth: 160,
        cellRenderer: ({ row }) => <span>{TemporaryFlag[row.temporaryFlag]}</span>
      },
      { label: "劳务公司", prop: "laborServiceCompany", sortable: true }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, selectionColumn: { hide: false }, formData, operationColumn: { hide: true } });
  };

  const getTableList = () => {
    loading.value = true;
    inductionAuditList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        if (formData.page === 1) {
          rowData.value = data.records[0];
          tableRef.value?.getTableRef().setCurrentRow(rowData.value);
        }
        setSelectCheckbox();
      })
      .catch((err) => (loading.value = false));
  };

  // 搜索
  const onTagSearch = ({ state, ...values }) => {
    formData.state = state === "-1" ? "" : state;
    Object.assign(formData, values);
    getTableList();
  };
  const onRefresh = () => getTableList();

  // 审核
  const onAudit = wrapFn(rowData, () => {
    const row = rowData.value;
    if (row.state === BillState.audited) return message("此单据已审核", { type: "error" });
    const formRef = ref();
    const formData = reactive({
      staffId: row?.staffId ?? "",
      staffName: row?.staffName ?? "",
      deptId: row?.deptId ?? "",
      groupId: row?.groupId ?? "",
      isStay: row?.isStay ?? "",
      employeKind: row?.employeKind ?? "",
      workRuleId: row?.workRuleId ?? "",
      tryDate: row?.tryDate ?? 3,
      tryDateMoney: row?.tryDateMoney ?? 0,
      moneyStartDate: row?.moneyStartDate ?? dayjs(new Date()).format("YYYY-MM-DD"),
      level: row?.level ?? "",
      inductionDate: row?.inductionDate ?? dayjs(new Date()).format("YYYY-MM-DD"),
      wageAccountingType: "",
      roleId: "",
      machineId: row?.machineId ?? "",
      id: row?.id ?? ""
    });
    addDialog({
      title: `审核-登记人：${row.staffName}`,
      props: {
        formInline: formData,
        formRules: formRules,
        formProps: { labelWidth: "120px" },
        formConfigs: formConfigs({ formData, auditOptionData: optionDatas, row })
      },
      width: "960px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: false,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef?.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要提交吗?`).then(() => {
              submitInductionAudit(formData)
                .then((res) => {
                  if (res.data || res.status === 200) {
                    done();
                    getTableList();
                    message("提交成功");
                  } else {
                    message("提交失败", { type: "error" });
                  }
                })
                .catch(console.log);
            });
          }
        });
      }
    });
  });

  // 批量删除
  const onDeleteAll = wrapFn(
    rowsData,
    () => {
      onDelete(rowsData.value);
    },
    "请勾选需要删除的记录"
  );

  // 单个删除
  const onDelete = wrapFn(rowData, () => {
    onSubmitDelete([rowData.value]);
  });

  // 提交删除
  const onSubmitDelete = (rows: InductionAuditItemType[]) => {
    showMessageBox(`确认要删除选中记录吗?`).then(() => {
      deleteInductionAudit(rows)
        .then((res) => {
          if (res.data) {
            getTableList();
            message("删除成功");
          } else {
            message("删除失败", { type: "error" });
          }
        })
        .catch(console.log);
    });
  };

  const onRowClick = (row: InductionAuditItemType) => {
    rowData.value = row;
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  function onSelect(rows: InductionAuditItemType[], row: InductionAuditItemType) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows: InductionAuditItemType[]) {
    setSelectAllChange(rows);
  }

  // 分页相关
  function onSizeChange(val: number) {
    formData.limit = val;
    getTableList();
  }

  function onCurrentChange(val: number) {
    formData.page = val;
    getTableList();
  }

  const onAuditDetail = wrapFn(rowData, () => {
    const row = rowData.value;
    if (![BillState.auditing, BillState.audited].includes(row.state)) {
      return message("只有审核中和已审核的单据才能查看", { type: "error" });
    }
    addDialog({
      title: "查看审批详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) => h(NodeDetailList, { options, billNo: row.billNo, billType: "staffCheck", billState: row.state })
    });
  });

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAudit, type: "primary", text: "审核", icon: SetUp, isDropDown: false },
    { clickHandler: onAuditDetail, type: "success", text: "审核详情", icon: Tickets, isDropDown: false },
    { clickHandler: onDelete, type: "warning", text: "删除", icon: Delete, isDropDown: true },
    { clickHandler: onDeleteAll, type: "danger", text: "批量删除", icon: CircleClose, isDropDown: true }
  ]);

  return {
    tableRef,
    loading,
    rowData,
    columns,
    dataList,
    maxHeight,
    queryParams,
    searchOptions,
    pagination,
    buttonList,
    onTagSearch,
    onRefresh,
    onSelect,
    onSelectAll,
    onRowClick,
    onSizeChange,
    onCurrentChange
  };
};
