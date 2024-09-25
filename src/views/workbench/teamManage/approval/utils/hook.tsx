/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-05-28 11:34:37
 */

import { DeptInfoAgentResType, DeptInfoResType, getdeptInfoAgent, getdeptInfoList, updateAuditAgent } from "@/api/workbench/teamManage";
import { DeptUserItemType, TableGroupItemType } from "@/api/systemManage";
import { getMenuColumns, setColumn } from "@/utils/table";
import { h, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";

import AddModal from "@/views/system/workflow/dashboard/addModal.vue";
import { addDialog } from "@/components/ReDialog";
import { handleTree } from "@/utils/tree";
import { onMounted } from "vue";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const dataList = ref<DeptInfoResType[]>([]);
  const dataList2 = ref<DeptInfoAgentResType[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const rowData = ref<DeptInfoResType>();
  const rowData2 = ref<DeptInfoAgentResType[]>([]);
  const tableRef = ref();
  const groupArrsList = ref<TableGroupItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51);

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "部门名称", prop: "deptName", minWidth: 160 },
      { label: "部门编号", prop: "deptCode" },
      { label: "部门负责人", prop: "principalName" },
      { label: "部门文员", prop: "clerkName" }
    ];
    let columnData2: TableColumnList[] = [
      { label: "部署名称", prop: "flowName", minWidth: "160", align: "left" },
      { label: "代理人", prop: "userName", minWidth: "120", align: "left" }
    ];

    const { columnArrs, groupArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    columns.value = setColumn({ columnData, operationColumn: false });
    columns2.value = setColumn({ columnData: columnData2, selectionColumn: { hide: false }, operationColumn: { minWidth: 80 } });
  };

  const onRefresh = () => getTableList();
  const onRefresh2 = () => getTableList2(rowData.value);

  const getTableList = () => {
    loading.value = true;
    getdeptInfoList({})
      .then((res) => {
        loading.value = false;
        if (res.data) {
          dataList.value = handleTree(res.data, "itemId", "parentId", "children");
        }
      })
      .catch(() => (loading.value = false));
  };

  // 选择行
  const onCurrentChange = (row: DeptInfoResType) => {
    rowData.value = row;
    getTableList2(row);
  };

  // 获取右侧表格
  const getTableList2 = (row: DeptInfoResType) => {
    if (!row) return;
    loading2.value = true;
    getdeptInfoAgent({ deptId: row.itemId })
      .then((res) => {
        loading2.value = false;
        if (res.data) {
          dataList2.value = res.data;
        }
      })
      .catch(() => (loading2.value = false));
  };

  // 右侧表格多选
  const handleSelectionChange = (rows: DeptInfoAgentResType[]) => {
    rowData2.value = rows;
  };

  const onRowClick = (row: DeptInfoAgentResType) => {
    // tableRef.value?.getTableRef()?.toggleRowSelection(row);
  };

  // 单个修改
  const onEdit = (row) => {
    openDialog([row]);
  };

  // 批量修改
  const onAllEdit = () => {
    openDialog(rowData2.value);
  };

  function openDialog(rows: DeptInfoAgentResType[]) {
    if (rows.length === 0) {
      return message("请选择需要设置代理人的部署名称", { type: "error" });
    }

    const formRef = ref();
    addDialog({
      title: "选择用户",
      props: { multiple: false, userState: "", initUserId: rows[0].userId },
      width: "860px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(AddModal, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const selectRow: DeptUserItemType = formRef.value.getRef();
        if (!selectRow.id) {
          return message("请选择用户", { type: "error" });
        }
        showMessageBox(`确认要修改审批代理人为【${selectRow.userName}】吗?`).then(() => {
          const newData = rows.map((item) => ({ ...item, deptId: rowData.value.itemId, userId: selectRow.id }));
          updateAuditAgent(newData)
            .then(({ data }) => {
              if (data) {
                done();
                message("修改成功");
                getTableList2(rowData.value);
              } else {
                message("修改失败", { type: "error" });
              }
            })
            .catch(console.log);
        });
      }
    });
  }

  const onClear = (row) => {
    showMessageBox(`确认清空【${row.flowName}】的审批代理人【${row.userName}】吗?`)
      .then(() => {
        const newData = [row].map((item) => ({ ...item, userId: "" }));
        updateAuditAgent(newData)
          .then(({ data }) => {
            if (data) {
              message("清空成功");
              getTableList2(rowData.value);
            } else {
              message("清空失败", { type: "error" });
            }
          })
          .catch(console.log);
      })
      .catch(console.log);
  };

  return {
    tableRef,
    loading,
    loading2,
    columns,
    columns2,
    dataList,
    dataList2,
    maxHeight,
    groupArrsList,
    onEdit,
    onAllEdit,
    onRefresh,
    onRefresh2,
    onRowClick,
    onClear,
    onCurrentChange,
    handleSelectionChange
  };
};
