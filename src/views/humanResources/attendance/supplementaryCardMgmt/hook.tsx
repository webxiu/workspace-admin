import {
  addSupplementaryCardMgmt,
  deleteSupplementaryCardMgmt,
  exportSupplementaryCardMgmt,
  fetchOneSupplementaryCardMgmt,
  fetchSupplementaryCardMgmt,
  updateSupplementaryCardMgmt
} from "@/api/oaManage/humanResources";
import { commonSubmit, queryUserDeptList, userInfoList } from "@/api/systemManage";
import { formConfigs, formRules } from "./config";
import { getEnumDictList, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { h, onMounted, reactive, ref, watch } from "vue";
import { message, showMessageBox } from "@/utils/message";

import { AuditState } from "../../leaveApply/utils/hook";
import type { ColDef } from "ag-grid-community";
import Detail from "./Detail.vue";
import { PAGE_CONFIG } from "@/config/constant";
import { PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { addDialog } from "@/components/ReDialog";
import { downloadFile } from "@/utils/common";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import { getDeptOptions } from "@/utils/requestApi";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const columns = ref([]);
  const dataList = ref([]);
  const loading = ref(false);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 95);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "单据编号", value: "billNo" },
    { label: "单据状态", value: "billState", children: [] },
    { label: "部门", value: "deptId", children: [] },
    { label: "补卡日期", value: "attDate", type: "date", format: "YYYY-MM-DD" }
  ]);
  const currentRow = ref();
  const formData = reactive({ page: 1, limit: PAGE_CONFIG.pageSize });

  const getOpts = () => {
    getEnumDictList(["BillStatus"]).then(({ BillStatus }) => {
      searchOptions[1].children = BillStatus;
    });

    getDeptOptions().then((data) => {
      searchOptions[2].children = data[0].children;
    });
  };

  onMounted(() => {
    getOpts();
    getConfig();
    onSearch();
  });

  const getConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "单据编号", prop: "billNo", width: 140 },
      { label: "单据状态", prop: "billState", width: 140 },
      { label: "部门", prop: "deptName", width: 140 },
      { label: "创建人", prop: "createUserName", width: 140 },
      { label: "创建时间", prop: "createDate", width: 140 },
      { label: "最后修改人", prop: "modifyUserName", width: 140 },
      { label: "最后修改时间", prop: "modifyDate", width: 140 }
    ];

    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [menuCols] = columnArrs;
    if (menuCols?.length) columnData = menuCols;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, operationColumn: false });
    columnDefs.value = getAgGridColumns({ columnData, operationColumn: false });
    return columnData;
  };

  const onRefresh = () => {
    getConfig();
    onSearch();
  };

  const onAdd = () => {
    openDialog("add");
  };

  const openDialog = (type: "add" | "edit" | "view", row?) => {
    const title = { add: "新增", edit: "修改" }[type];
    const formRef = ref();
    addDialog({
      title: `${title}补卡单`,
      props: { type, row },
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: type === "view" ? "确定" : "保存",
      hideFooter: type === "view",
      contentRenderer: () => h(Detail, { ref: formRef }),
      beforeSure: (done, { options }) => {
        formRef.value.getRef().then((data) => {
          if (data.detailList.length) {
            showMessageBox(`确认要${title}吗?`)
              .then(() => {
                onSubmitChange(type, title, data, () => {
                  done();
                  onSearch();
                });
              })
              .catch(console.log);
          } else {
            message.warning("请添加补卡人员");
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    console.log(type, data);
    const apiType = { add: addSupplementaryCardMgmt, edit: updateSupplementaryCardMgmt };

    const reqParams = {
      deptId: data.deptId,
      id: currentRow.value?.id,
      billState: currentRow.value?.billState,
      attendanceReissueDetailList: data.detailList.map((item) => ({
        attDate: item.supCardDate,
        attTime: item.supCardTime,
        id: item.did,
        reissueType: item.supCardAttendance,
        staffId: item.supCardStaffId,
        staffName: item.supCardUserName
      }))
    };
    apiType[type](reqParams).then((res) => {
      if (res.data) {
        message.success(`${title}成功`);
        callback();
      }
    });
  };

  const onSearch = () => {
    loading.value = true;
    fetchSupplementaryCardMgmt(formData)
      .then((res: any) => {
        if (res.data) {
          pagination.total = res.data.total;
          dataList.value = res.data.records;
        }
      })
      .finally(() => (loading.value = false));
  };

  const onEdit = () => {
    const row = currentRow.value;
    if (!row) return message.warning("请选择记录");

    const type = [AuditState.submit, AuditState.reAudit].includes(row.billState);

    openDialog(type ? "edit" : "view", row);
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    onSearch();
  };

  const onExport = () => {
    exportSupplementaryCardMgmt({ ...formData, limit: 100000 })
      .then((res: any) => {
        if (res.data) {
          const fileName = res.data.split("/").at(-1);
          downloadFile(res.data, fileName);
        }
      })
      .catch(console.log);
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

  const onDel = () => {
    if (!currentRow.value) return message.warning("请选择记录");

    showMessageBox(`确认要删除【${currentRow.value.staffName}】 ${currentRow.value.attDate + " " + currentRow.value.attTime}的数据吗?`)
      .then(() => {
        deleteSupplementaryCardMgmt({ did: currentRow.value.did }).then((res) => {
          if (res.data) {
            message.success("删除成功");
            currentRow.value = null;
            onSearch();
          }
        });
      })
      .catch(console.log);
  };

  const onSubmit = () => {
    if (!currentRow.value) return message.warning("请选择记录");
    const row = currentRow.value;
    if (![AuditState.submit, AuditState.reAudit].includes(row.billState)) {
      return message.error("只能提交【待提交/重新审核】的记录");
    }

    showMessageBox(`确认提交【${row.staffName}】【${currentRow.value.attDate + " " + currentRow.value.attTime}】的数据吗?`).then(() => {
      commonSubmit({ billId: "10072", billNo: row.billNo })
        .then((res) => {
          if (!res.data) return message.error("提交失败");
          message.success("提交成功");
          onSearch();
        })
        .catch(console.log);
    });
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const rowDbClick = (row) => {
    currentRow.value = row;
    onEdit();
  };
  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    currentRow.value = undefined;
  }
  const buttonList = ref([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDel, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onSubmit, type: "success", text: "提交", isDropDown: false },
    { clickHandler: onExport, type: "info", text: "导出", isDropDown: true }
  ]);

  return {
    isAgTable,
    columnDefs,
    columns,
    loading,
    maxHeight,
    dataList,
    pagination,
    buttonList,
    searchOptions,
    onRefresh,
    onTagSearch,
    rowDbClick,
    rowClick,
    onSizeChange,
    onCurrentChange,
    onSwitchTable
  };
};
