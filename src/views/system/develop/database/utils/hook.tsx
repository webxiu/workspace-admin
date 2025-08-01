/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2025-03-12 15:37:38
 */
import { onMounted, h, reactive, ref } from "vue";

import { useEleHeight } from "@/hooks";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { setColumn, getMenuColumns, updateButtonList } from "@/utils/table";
import { addDialog } from "@/components/ReDialog";
import EditForm from "@/components/EditForm/index.vue";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { type PaginationProps } from "@pureadmin/table";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { formConfigs, formRules } from "./config";
import {
  DbMaintenanceItemType,
  dbMaintenanceList,
  sqlAuditAdd,
  sqlAuditUpdate,
  sqlAuditDelete,
  sqlAuditSubmit,
  sqlAuditExecute,
  commonSubmit
} from "@/api/systemManage";

import { Plus, Edit, Delete, Position, Pointer, Warning, View } from "@element-plus/icons-vue";
import { BillState, PAGE_CONFIG, BillState_Color, PageUrl } from "@/config/constant";
import Detail from "../Detail.vue";
import { ElMessage } from "element-plus";
import { commonBackLogic } from "@/utils/common";
import { getAgGridColumns } from "@/components/AgGridTable/config";
import type { ColDef } from "ag-grid-community";

export const useConfig = () => {
  const isAgTable = ref(true);
  const columnDefs = ref<ColDef[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const rowData = ref<DbMaintenanceItemType>();
  const dataList = ref<DbMaintenanceItemType[]>([]);
  const loading = ref<boolean>(false);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49 + 52);
  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    billNo: "",
    isExecute: "",
    billState: ""
  });
  const searchOptions = reactive<SearchOptionType[]>([
    { label: "单据编号", value: "billNo" },
    {
      label: "执行状态",
      value: "isExecute",
      children: [
        { label: "已执行", value: 1 },
        { label: "未执行", value: 0 }
      ]
    },
    {
      label: "单据状态",
      value: "billState",
      children: [
        { label: "待提交", value: 0 },
        { label: "待审核", value: 1 },
        { label: "已审批", value: 2 },
        { label: "驳回重审", value: 3 }
      ]
    }
  ]);

  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "标题", prop: "title" },
      { label: "执行原因", prop: "reason" },
      { label: "单据编号", prop: "billNo" },
      {
        label: "单据状态",
        prop: "billState",
        cellRenderer({ row }) {
          const statusObj = BillState_Color[row.billState];
          return <span style={{ background: statusObj.color, padding: "4px 6px", color: "#fff", borderRadius: "4px" }}>{statusObj.name}</span>;
        }
      },
      {
        label: "是否已执行",
        prop: "isExecute",
        cellRenderer: ({ row }) => <span>{{ 1: "已执行", 0: "未执行" }[row.isExecute]}</span>
      },
      { label: "执行数据库", prop: "dbKey", width: 180 },
      { label: "申请人", prop: "userName" },
      { label: "申请日期", prop: "createDate", width: 160 }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data] = columnArrs;
    if (data?.length) columnData = data;
    updateButtonList(buttonList, buttonArrs[0]);
    columns.value = setColumn({ columnData, formData, operationColumn: { minWidth: 160 } });
    columnDefs.value = getAgGridColumns<DbMaintenanceItemType>({
      columnData,
      formData,
      operationColumn: { minWidth: 160 },
      renderButtons: () => [
        { name: "查看", onClick: (row) => onProview(row) },
        { name: "节点详情", onClick: (row) => onNodeDetail(row) }
      ]
    });
  };

  const getTableList = () => {
    loading.value = true;
    dbMaintenanceList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
      })
      .catch(() => (loading.value = false));
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  // 搜索
  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  const onAdd = () => {
    openDialog("add");
  };

  const onEdit = wrapFn(rowData, () => {
    const row: DbMaintenanceItemType = rowData.value;
    if (![BillState.submit, BillState.reject].includes(row.billState)) {
      return message.error("只能修改【待提交/重新审核】的记录");
    }
    openDialog("edit", row);
  });

  function openDialog(type: string, row?: Partial<DbMaintenanceItemType>) {
    const title = { add: "新增", edit: "修改", view: "查看" }[type];
    const formRef = ref();

    addDialog({
      title: `${title}SQL审批`,
      props: { type, id: row?.id, pageUrl: PageUrl.database },
      width: "640px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: type !== "view",
      beforeReset: () => formRef.value.resetRef(),
      contentRenderer: () => h(Detail, { ref: formRef }),
      beforeSure: (done, { options }) => {
        if (type === "view") return done();
        formRef.value.getRef().then(({ formData, data }) => {
          showMessageBox(`确认要提交吗?`)
            .then(() => {
              onSubmitChange(type, title, formData, () => {
                done();
                getTableList();
              });
            })
            .catch(console.log);
        });
      }
    });
  }

  // 新增|修改提交
  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { add: sqlAuditAdd, edit: sqlAuditUpdate };
    API[type](data, { dbKey: "sysmaster" })
      .then((res) => {
        if (res.data) {
          callback();
          message.success(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const onSubmit = wrapFn(rowData, () => {
    const { billState, id } = rowData.value;
    if (![BillState.submit, BillState.reject].includes(billState)) {
      return message.error("只能提交【待提交/重新审核】的记录");
    }
    showMessageBox(`确定要提交该申请单吗?`)
      .then(() => {
        commonSubmit({ id: id, billId: "10035" }, { dbKey: "sysmaster" })
          .then((res) => {
            if (res.data) {
              message.success("提交成功");
              getTableList();
            } else message.error("提交失败");
          })
          .catch(console.log);
      })
      .catch(console.log);
  });

  const onExcute = wrapFn(rowData, () => {
    const row: DbMaintenanceItemType = rowData.value;
    if (![BillState.audited].includes(row.billState)) {
      return message.error("只能执行【已审批】的记录");
    } else if (row.isExecute === 1) {
      return message.error("SQL已经执行过,不能再次执行");
    }
    showMessageBox(`确定执行该单据的SQL吗?`)
      .then(() => {
        sqlAuditExecute(row, { dbKey: "sysmaster" })
          .then((res) => {
            if (res.data) {
              message.success("执行成功");
              getTableList();
            } else message.error("执行失败");
          })
          .catch(console.log);
      })
      .catch(console.log);
  });

  const onProview = (row: DbMaintenanceItemType) => {
    openDialog("view", row);
    // addDialog({
    //   title: `查看单据【${row.title}】`,
    //   props: { id: row.id, type: "view" },
    //   width: "720px",
    //   draggable: true,
    //   fullscreenIcon: true,
    //   closeOnClickModal: false,
    //   contentRenderer: () => h(Detail)
    // });
  };

  const onDelete = wrapFn(rowData, () => {
    const row: DbMaintenanceItemType = rowData.value;
    if (![BillState.submit, BillState.reject].includes(row.billState)) {
      return message.error("只能删除【待提交/重新审核】的记录");
    }
    showMessageBox(`确定要删除该申请单吗?`)
      .then(() => {
        sqlAuditDelete({ id: row.id }, { dbKey: "sysmaster" })
          .then((res) => {
            if (res.data) {
              message.success("删除成功");
              getTableList();
            } else message.error("删除失败");
          })
          .catch(console.log);
      })
      .catch(console.log);
  });

  // 节点详情
  const onNodeDetail = (row: DbMaintenanceItemType) => {
    addDialog({
      title: "查看审批详情",
      width: "900px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: true,
      hideFooter: true,
      contentRenderer: ({ options }) => h(NodeDetailList, { options, billNo: row.billNo, billType: "SQLFlow", billState: row.billState })
    });
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

  // 获取右侧分组列表
  const onRowClick = (row: DbMaintenanceItemType) => {
    rowData.value = row;
  };

  const onBack = () => {
    if (!rowData.value) {
      return ElMessage({ message: "请选择一条记录", type: "warning" });
    }
    if (![1, 2].includes(rowData.value.billState)) {
      return message.error("当前状态不能进行回退");
    }
    commonBackLogic(rowData.value.billNo, getTableList, { dbKey: "sysmaster" });
  };

  function onSwitchTable() {
    isAgTable.value = !isAgTable.value;
    rowData.value = undefined;
  }

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onEdit, type: "success", text: "修改", icon: Edit, isDropDown: false },
    { clickHandler: onSubmit, type: "warning", text: "提交", icon: Pointer, isDropDown: true },
    { clickHandler: onBack, type: "warning", text: "回退", icon: Pointer, isDropDown: true },
    { clickHandler: onExcute, type: "default", text: "执行", icon: Position, isDropDown: true },
    { clickHandler: onDelete, type: "danger", text: "删除", icon: Delete, isDropDown: true }
  ]);

  return {
    columnDefs,
    isAgTable,
    loading,
    columns,
    dataList,
    maxHeight,
    searchOptions,
    pagination,
    buttonList,
    onRefresh,
    onProview,
    onRowClick,
    onTagSearch,
    onNodeDetail,
    onSizeChange,
    onCurrentChange,
    onSwitchTable
  };
};
