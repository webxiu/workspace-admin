import { onMounted, reactive, ref, h } from "vue";
import { type PaginationProps } from "@pureadmin/table";
import { getDeptOptions } from "@/utils/requestApi";
import { Plus, Delete, Upload } from "@element-plus/icons-vue";

import { ElMessage, UploadProps } from "element-plus";
import {
  SummaryMethodProps,
  setColumn,
  getMenuColumns,
  getSummaries,
  updateButtonList,
  usePageSelect,
  RendererType,
  tableEditRender,
  getEnumDictList
} from "@/utils/table";

import { useEleHeight } from "@/hooks";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox } from "@/utils/message";
import dayjs from "dayjs";
import NodeDetailList from "@/components/NodeDetailList/index.vue";

import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { getFileNameOnUrlPath, downloadFile, commonBackLogic } from "@/utils/common";
import {
  deleteCommissionSheet,
  exportCommissionSheetDetail,
  fetchCommissionSheetDetail,
  fetchCommissionSheetList,
  insertCommissionSheet,
  parseFileCommission,
  updateCommissionSheet
} from "@/api/oaManage/humanResources";
import TableEditList from "@/components/TableEditList/index.vue";
import { FormTableConfigType } from "@/utils/form";
import { commonRevoke, commonSubmit, queryUserDeptList, userInfoList } from "@/api/systemManage";
import { useUserStore } from "@/store/modules/user";
import { HxUploadProgress } from "@/config/elements";
import { AuditState } from "../../leaveApply/utils/hook";
import axios from "axios";
import * as CommonUtils from "@/utils/common";
import { useRoute } from "vue-router";

export const useConfig = () => {
  const tableRef = ref();
  const treeData = ref([]);
  const currentRow = ref();
  const loading = ref<boolean>(false);
  const columns = ref<TableColumnList[]>([]);
  const rowData = ref<any>();
  const rowsData = ref<any[]>([]);
  const dataList = ref<any[]>([]);
  const yearMonthStr = dayjs(new Date()).add(-1, "month").format("YYYY-MM");
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);
  const deptOptions = ref<Record<string, any>[]>([]);

  const route = useRoute();

  const formData = reactive({
    deptId: "",
    billState: "",
    // deptIdList: [],
    billNo: "",
    staffName: "",
    staffCode: "",
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    yearMonth: yearMonthStr
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "姓名", value: "userName" },
    { label: "工号", value: "userCode" },
    { label: "部门", value: "deptId", children: [] },
    { label: "单据状态", value: "billState", children: [] },
    { label: "日期", value: "yearMonth", type: "month", format: "YYYY-MM" }
  ]);

  const queryParams = reactive<QueryParamsType>({ yearMonth: yearMonthStr });
  const { setSelectCheckbox, setSelectChange, setSelectAllChange } = usePageSelect({ tableRef, dataList, rowsData, uniId: "id" });

  onMounted(() => {
    getColumnConfig();
    getOptions();
    onSearch();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "年月", prop: "yearMonth", width: 110 },
      { label: "部门", prop: "deptName", minWidth: 180 },
      { label: "工号", prop: "userCode", minWidth: 180 },
      { label: "姓名", prop: "staffName", minWidth: 180 },
      { label: "金额", prop: "money", minWidth: 120, align: "right" },
      { label: "创建日期", prop: "createDate", minWidth: 160 },
      { label: "修改日期", prop: "modifyDate", minWidth: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, selectionColumn: { hide: false }, radioColumn: { width: 50 }, operationColumn: false });
    return columnData;
  };

  const getOptions = () => {
    getDeptOptions().then((data: any) => {
      treeData.value = data;
      searchOptions[2].children = data;
    });
    const userId = useUserStore().userInfo.id;

    queryUserDeptList({ userId }).then((res: any) => {
      if (res.data) {
        deptOptions.value = res.data;
      }
    });
    getEnumDictList(["BillStatus"]).then(({ BillStatus }) => {
      searchOptions[3].children = BillStatus;
    });
  };

  const handleTagSearch = (values: any) => {
    Object.assign(formData, values);

    onSearch();
  };

  const onSearch = (idx?) => {
    fetchCommissionSheetList(formData).then((res: any) => {
      const data = res.data;
      dataList.value = data.records || [];
      pagination.total = data.total;

      if (typeof idx === "number" && idx >= 0) {
        currentRow.value = dataList.value[idx];
      } else {
        currentRow.value = null;
      }
      setSelectCheckbox();
    });
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

  const onDownload = async () => {
    return axios({
      method: "get",
      responseType: "blob",
      url: `${import.meta.env.VITE_PUBLIC_PATH}template/绩效管理模板.xlsx`
    })
      .then(({ data }) => CommonUtils.onDownload(data, "提成管理模板.xlsx"))
      .catch(() => {});
  };

  const onDelete = (rows: any[]) => {
    deleteCommissionSheet({ commissionDTOList: rows.map((item: any) => ({ id: item.id, billState: item.billState })) }).then((res) => {
      if (res.data) {
        ElMessage({ message: "删除成功!", type: "success" });
        currentRow.value = null;
        const _rowIndex = dataList.value.findIndex((item) => item.id === currentRow.value?.id);
        onSearch(_rowIndex);
      }
    });
  };

  // 批量删除
  const onDeleteAll = () => {
    if (rowsData.value.length === 0) {
      return message.error("请选择要删除的记录");
    }
    showMessageBox(`确认删除选中的记录吗？`)
      .then(() => onDelete(rowsData.value))
      .catch(console.log);
  };

  const onExport = () => {
    exportCommissionSheetDetail({ ...formData }).then((res: any) => {
      if (res.data) {
        const fileName = getFileNameOnUrlPath(res.data);
        downloadFile(res.data, fileName, true);
      }
    });
  };

  const rowClick = (row) => {
    currentRow.value = row;
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  const onDbClick = (row) => {
    row.deptId = +row.deptId;
    currentRow.value = row;
    // onEdit(row);
    onEditAction();
  };

  function onSelect(rows: any[], row: any) {
    setSelectChange({ rows, row });
  }

  function onSelectAll(rows: any[]) {
    setSelectAllChange(rows);
  }

  /** 自定的统计 */
  const onSummaryMethod = (params: SummaryMethodProps<any>) => {
    return getSummaries({ params: params, moneyCommaProps: ["money"] });
  };

  const openImportAddDialog = (type, row?) => {
    const title = { add: "新增", edit: "修改", view: "查看" };
    const formRef = ref();
    const dataImportList = ref([]);
    const selectUserOptsValue = ref([]);

    const deptId = deptOptions.value.find((item) => item.isMaster)?.deptId;
    const _formData = reactive({
      staffCode: row?.staffCode ?? "",
      billNo: row?.billNo ?? "",
      billState: row?.billState ?? "",
      billStateName: row?.billStateName ?? "",
      createUserName: row?.createUserName,
      createDate: row?.createDate,
      modifyUserName: row?.modifyUserName,
      modifyDate: row?.modifyDate,
      id: row?.id ?? "",
      deptId: row?.deptId ? +row?.deptId : +deptId,
      yearMonth: row?.yearMonth ?? ""
    });

    if (type === "add") _formData.yearMonth = formData.yearMonth;

    const onDelete = (row, index) => {
      if (typeof index === "number") {
        dataImportList.value.splice(index, 1);
        return;
      }
    };

    if (row?.id) {
      fetchCommissionSheetDetail({ id: row?.id }).then((res: any) => {
        if (res.data) {
          dataImportList.value = res.data;
        }
      });
    }

    const initUserOpts = (deptId) => {
      userInfoList({
        page: 1,
        limit: 100000,
        userName: "",
        userCode: "",
        deptId,
        userState: "A",
        deptIdList: [deptId]
      }).then((res) => {
        if (res.data) {
          const result = res.data.records || [];
          selectUserOptsValue.value = result.map((item) => ({ optionName: item.userName, optionValue: item.userName, reflectVal: item.userCode }));
          console.log(selectUserOptsValue.value, "====");
        }
      });
    };

    initUserOpts(row?.deptId || deptId);

    // 编辑表格
    const { editCellRender } = tableEditRender({
      editFinish: ({ prop, index, row }) => {
        const value = row[prop];
        if (prop === "staffName") {
          dataImportList.value[index]["staffCode"] = selectUserOptsValue.value.find((el) => el.optionValue === value)?.reflectVal;
        } else if (prop === "staffCode") {
          dataImportList.value[index]["staffName"] = selectUserOptsValue.value.find((el) => el.reflectVal === value)?.optionValue;
        }

        dataImportList.value[index][prop] = value;
      }
    });

    const tableSlots = () => {
      return {
        operation: ({ row, index }) => (
          <el-popconfirm width={280} title={`确认删除吗?`} onConfirm={() => onDelete(row, index)}>
            {{
              reference: () => (
                <el-button size="small" type="danger" icon={Delete} onClick={(e) => e.preventDefault()} disabled={type === "view"}>
                  删除
                </el-button>
              )
            }}
          </el-popconfirm>
        )
      };
    };

    const custmRender = (): Record<string, RendererType> => {
      const isEdit = type !== "view";
      return {
        staffCode: (data) => editCellRender({ data, isEdit }),
        staffName: (data) =>
          editCellRender({
            type: "select",
            data,
            isEdit,
            options: selectUserOptsValue.value,
            cellStyle: { color: "#606266", textAlign: "left" },
            eleProps: { filterable: true }
          }),
        commissionAmount: (data) => editCellRender({ data, isEdit })
      };
    };
    const onAdd = () => {
      dataImportList.value.push({ staffCode: "", staffName: "", commissionAmount: "" });
    };
    const onUploadCommission: UploadProps["onChange"] = (uploadFile) => {
      const rawFile = uploadFile.raw;
      const fd = new FormData();
      fd.append("file", rawFile);
      HxUploadProgress({ fd, uploadApi: parseFileCommission }).then((res: any) => {
        if (res.data) {
          if (res.data.length) {
            message.success(`导入成功`);
            dataImportList.value = res.data.filter((el) => el.staffCode);
          } else {
            message.success("没有解析到数据");
          }
        }
      });
    };
    const tableConfig: FormTableConfigType[] = [
      {
        dataList: dataImportList,
        custmRender: custmRender(),
        tableProps: { height: 300, maxHeight: 300 },
        tableSlots: tableSlots(),
        buttonConfig: {
          autoLayout: false,
          buttonList: [
            { icon: Plus, size: "small", type: "primary", text: "添加", disabled: type === "view", clickHandler: onAdd },
            // { icon: Upload, size: "small", type: "success", text: "导入", disabled: type === "view", clickHandler: onImportFun },
            {
              icon: Upload,
              type: "success",
              size: "small",
              text: "导入",
              disabled: type === "view",
              isDropDown: false,
              uploadProp: { action: "#", accept: ".xlsx, .xls", autoUpload: false, onChange: onUploadCommission }
            }
          ]
        },
        tableColumnOption: {
          operationColumn: { width: 125 }
        }
      }
    ];

    addDialog({
      title: `${title[type]}提成`,
      props: {
        params: { groupCode: "1" },
        tableConfig,
        formConfig: [
          {
            formData: _formData,
            customProps: {
              deptId: {
                disabled: type === "view",
                onChange: (val) => {
                  if (dataImportList.value.length) {
                    showMessageBox(`切换部门会导致明细数据清空，确认操作?`)
                      .then(() => {
                        dataImportList.value = [];
                        initUserOpts(val);
                      })
                      .catch(console.log);
                  } else {
                    initUserOpts(val);
                  }
                },
                apiParams: { menuId: route.query.menuId, userId: useUserStore().userInfo.id },
                formatAPI: (data) => {
                  return data ? data[0].children : [];
                }
              },
              yearMonth: {
                disabled: type === "view"
              }
            },
            formProps: { labelWidth: "90px", size: "small" }
          }
        ]
      },
      width: "900px",
      class: "commission-modal",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideFooter: type === "view",
      contentRenderer: () => h(TableEditList, { ref: formRef }),
      beforeSure: (done) => {
        formRef.value.getRef().then(({ valid, data }) => {
          if (valid) {
            const filteredList = dataImportList.value.filter((el) => el.staffCode && el.staffName).map((item, index) => ({ ...item, rowIndex: index + 1 }));
            if (!filteredList.length) return message.error("明细数据不能为空");
            showMessageBox(`确认要${title[type]}吗?`)
              .then(() => {
                const apiType = { add: insertCommissionSheet, edit: updateCommissionSheet };
                const params = {
                  ..._formData,
                  list: filteredList
                };
                apiType[type](params).then((res) => {
                  if (res.data) message.success(`${title[type]}成功`);
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

  const onAddAction = () => {
    openImportAddDialog("add");
  };

  const onEditAction = () => {
    if (!currentRow.value) return message.warning("请选择单据");
    const isAllowEdit = [AuditState.submit, AuditState.reAudit].includes(+currentRow.value.billState);
    openImportAddDialog(isAllowEdit ? "edit" : "view", currentRow.value);
  };

  const onSubmitAction = () => {
    if (!currentRow.value) {
      return message.warning("请选择单据");
    }
    if (![AuditState.submit, AuditState.reAudit].includes(+currentRow.value.billState)) {
      return message.error("只能提交【待提交/重新审核】的记录");
    }

    showMessageBox(`确认提交单据吗?`).then(() => {
      // TODO: 提成流程id
      commonSubmit({ billId: "10074", billNo: currentRow.value.billNo })
        .then((res) => {
          if (!res.data) return message.error("提交失败");
          message.success("提交成功");
          onSearch();
        })
        .catch(console.log);
    });
  };

  const onRevokeAction = () => {
    if (!currentRow.value) {
      return message.warning("请选择单据");
    }
    if (![AuditState.auditing].includes(+currentRow.value.billState)) {
      return message.error("只能撤销【审核中】的记录");
    }

    showMessageBox(`确认撤销单据吗?`).then(() => {
      commonRevoke({ billNo: currentRow.value.billNo })
        .then((res) => {
          if (!res.data) return message.error("撤销失败");
          message.success("撤销成功");
          onSearch();
        })
        .catch(console.log);
    });
  };

  const onBackAction = () => {
    if (!currentRow.value) {
      return message.warning("请选择单据");
    }
    if (![AuditState.auditing, AuditState.audited].includes(+currentRow.value.billState)) {
      return message.error("当前状态不能进行回退");
    }
    commonBackLogic(currentRow.value.billNo, onSearch);
  };

  const onViewNodeDetail = () => {
    if (!currentRow.value) {
      return message.warning("请选择单据");
    }
    addDialog({
      title: "查看审批详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) =>
        h(NodeDetailList, { options, billNo: currentRow.value.billNo, billType: "commission", billState: currentRow.value.billState })
    });
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAddAction, type: "primary", text: "新增" },
    { clickHandler: onEditAction, type: "warning", text: "修改" },
    { clickHandler: onDeleteAll, type: "danger", text: "批量删除" },
    { clickHandler: onDownload, type: "info", text: "下载模板", isDropDown: true },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true },
    { clickHandler: onSubmitAction, type: "info", text: "提交", isDropDown: true },
    { clickHandler: onRevokeAction, type: "info", text: "撤销", isDropDown: true },
    { clickHandler: onBackAction, type: "info", text: "回退", isDropDown: true },
    { clickHandler: onViewNodeDetail, type: "info", text: "审批详情", isDropDown: true }
  ]);

  return {
    tableRef,
    columns,
    dataList,
    loading,
    maxHeight,
    pagination,
    buttonList,
    searchOptions,
    queryParams,
    onDelete,
    onSearch,
    handleTagSearch,
    onCurrentChange,
    handleSizeChange,
    onSelect,
    onSelectAll,
    rowClick,
    onDbClick,
    onSummaryMethod,
    handleCurrentChange
  };
};
