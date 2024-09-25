/*
 * @Author: Hailen
 * @Date: 2024-02-27 10:47:11
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-08-21 14:55:59
 */

import {
  DeptInfoItemType,
  DetartMenttemType,
  RoleUserItemType,
  TableGroupItemType,
  addDeptRole,
  deleteRuleUser,
  departTreeNotOverThreeLevel,
  roleAdd,
  roleDelete,
  roleSelectMax,
  roleUpdate,
  roleUserList,
  setKingdeeRole,
  setQYWXTag
} from "@/api/systemManage";
import { downloadDataToExcel, getMenuColumns, setColumn, updateButtonList } from "@/utils/table";
import { formConfigs, formRules } from "./config";
import { h, onMounted, reactive, ref } from "vue";
import { message, showMessageBox, wrapFn } from "@/utils/message";

import EditForm from "@/components/EditForm/index.vue";
import { ElMessage } from "element-plus";
import { addDialog } from "@/components/ReDialog";
import addModal from "../addModal.vue";
import { getInductionAuditRoleInfoByDeptId } from "@/api/oaManage/humanResources";
import { useEleHeight } from "@/hooks";

export const useConfig = () => {
  const tableRef2 = ref();
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const rowData = ref<DeptInfoItemType>();
  const roleRows = ref<RoleUserItemType[]>([]);
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const dataList = ref<DeptInfoItemType[]>([]);
  const dataList2 = ref<RoleUserItemType[]>([]);
  const deptOptions = ref<DetartMenttemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 49);
  const groupArrsList = ref<TableGroupItemType[]>([]);
  const deptTreeData = ref([]);
  const curNodeKey = ref("0");

  onMounted(() => {
    getColumnConfig();
    getDeptList();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "角色编号", prop: "roleCode", align: "right" },
      { label: "角色名称", prop: "roleName" },
      { label: "金蝶系统ID", prop: "k3RoleId" },
      { label: "金蝶系统编号", prop: "k3RoleCode" },
      { label: "说明", prop: "remark" },
      { label: "所属部门", prop: "deptName" }
    ];

    let columnData2: TableColumnList[] = [
      { label: "用户编号", prop: "userCode", align: "right" },
      { label: "用户名称", prop: "userName" },
      { label: "部门名称", prop: "deptName" }
    ];
    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data, data2] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    updateButtonList(buttonList2, buttonArrs[1]);
    columns.value = setColumn({ columnData, operationColumn: false, dragSelector: ".role-setting" });
    columns2.value = setColumn({
      columnData: columnData2,
      operationColumn: false,
      selectionColumn: { hide: false },
      radioColumn: false,
      dragSelector: ".role-setting-user"
    });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onRefresh2 = () => {
    getColumnConfig();
    getRoleList(rowData.value);
  };

  // 部门列表
  const getDeptList = () => {
    departTreeNotOverThreeLevel().then((res: any) => {
      if (res.data) {
        deptTreeData.value = res.data;
        deptOptions.value = res.data;
      }
    });
  };

  const getTableList = () => {
    getInductionAuditRoleInfoByDeptId({ deptId: curNodeKey.value }).then((res: any) => {
      if (res.data) {
        dataList.value = res.data || [];
      }
    });
    // loading.value = true;
    // getDeptTreeList()
    //   .then(({ data }) => {
    //     loading.value = false;
    //     dataList.value = data.filter((item) => item.roleName && item.roleCode);
    //   })
    //   .catch((err) => (loading.value = false));
  };

  const onAdd = () => openDialog("add", rowData.value);

  const onEdit = (row: DeptInfoItemType) => {
    if (!row.id) return message("不支持修改部门", { type: "error" });
    openDialog("edit", row);
  };

  const onDelete = (row: DeptInfoItemType) => {
    console.log(row, "row=>>");
    roleDelete({ id: row.id })
      .then((res) => {
        if (res.data) {
          message("删除成功");
          rowData.value = null;
          getTableList();
        } else {
          message("删除失败", { type: "error" });
        }
      })
      .catch(console.log);
  };

  function openDialog(type: string, row?: Partial<DeptInfoItemType>) {
    const title = { add: "新增", edit: "修改" }[type];
    const loading = ref<boolean>(false);
    const formRef = ref();

    const _formData = reactive({
      deptId: row?.deptId ?? +curNodeKey.value > 0 ? curNodeKey.value : undefined,
      roleCode: type === "add" ? "" : row?.roleCode ?? "",
      tagid: type === "add" ? "" : row?.tagid ?? "",
      roleName: type === "add" ? "" : row?.roleName ?? "",
      staffingPeopleCount: type === "add" ? "" : row?.staffingPeopleCount ?? "",
      k3RoleId: type === "add" ? "" : row?.k3RoleId ?? "",
      k3RoleCode: type === "add" ? "" : row?.k3RoleCode ?? "",
      remark: type === "add" ? "" : row?.remark ?? "",
      id: type === "add" ? "" : row?.id ?? ""
    });

    //新增分组时调用
    if (type === "add") {
      loading.value = true;
      roleSelectMax()
        .then((res) => {
          _formData.roleCode = res.data;
          loading.value = false;
        })
        .catch(() => (loading.value = false));
    }

    addDialog({
      title: `${title}角色`,
      props: {
        loading: loading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({ deptOptions }),
        formProps: { labelWidth: "140px" }
      },
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: true,
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeReset: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.resetFields();
      },
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        FormRef.validate((valid) => {
          if (valid) {
            showMessageBox(`确认要提交吗?`).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                getTableList();
              });
            });
          }
        });
      }
    });
  }
  // 新增|修改角色
  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { add: roleAdd, edit: roleUpdate };
    API[type](data)
      .then(({ data }) => {
        callback();
        message(`${title}成功`);
      })
      .catch(console.log);
  };

  const onRowClick = (row: DeptInfoItemType) => {
    rowData.value = row;
    getRoleList(row);
  };

  // 右侧用户列表
  const getRoleList = (row: DeptInfoItemType) => {
    if (!row?.id) return;
    loading2.value = true;
    roleUserList({ page: 1, limit: 10000, roleId: row.id })
      .then(({ data }) => {
        loading2.value = false;
        dataList2.value = data || [];
      })
      .catch(() => (loading2.value = false));
  };

  // 新增角色
  const onAdd2 = () => {
    if (!rowData.value) {
      return message("请先选择需要操作的角色", { type: "error" });
    }
    openRoleDialog();
  };

  // 批量删除
  const onDeleteAll2 = () => {
    showMessageBox(`确认要删除吗?`)
      .then(() => onDeleteAlls(roleRows.value))
      .catch(console.log);
  };

  // 提交批量删除
  const onDeleteAlls = (rows: RoleUserItemType[]) => {
    if (!rows?.length) {
      return message("请选择角色", { type: "error" });
    }
    const userRoleIdList: number[] = [];
    const userIdList: number[] = [];
    rows.forEach((item) => {
      userRoleIdList.push(item.id);
      userIdList.push(item.userId);
    });
    deleteRuleUser({ userRoleIdList, userIdList })
      .then(({ data }) => {
        data && message("删除成功");
        getRoleList(rowData.value);
      })
      .catch(console.log);
  };

  // 多选角色
  const handleSelectionChange2 = (rows: RoleUserItemType[]) => {
    roleRows.value = rows;
  };

  const onRowClick2 = (row: RoleUserItemType) => {
    // tableRef2.value?.getTableRef()?.toggleRowSelection(row);
  };

  // 添加角色弹窗
  function openRoleDialog() {
    const modalRef = ref();
    const loading = ref<boolean>(false);
    if (!rowData.value?.id) {
      return message("请先选择需要操作的角色", { type: "warning" });
    }

    addDialog({
      title: "添加用户",
      props: { loading: loading, deptOptions },
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(addModal, { ref: modalRef }),
      beforeSure: (done, { options }) => {
        const refData = modalRef.value.getRef();
        if (!refData?.length) return message("请选择用户", { type: "error" });
        const params = { roleId: rowData.value?.id, userIdList: refData, isPrimarily: false };
        showMessageBox(`确认要提交吗?`).then(() => {
          addDeptRole(params)
            .then(({ data }) => {
              done();
              getRoleList(rowData.value);
              message("添加成功");
            })
            .catch(console.log);
        });
      }
    });
  }

  const onExport = () => {
    const flatDataList: DeptInfoItemType[] = [];
    // 扁平化表格数据导出
    const flatFn = (data: DeptInfoItemType[]) => {
      data.forEach((item) => {
        const { children, ...reset } = item;
        flatDataList.push(reset);
        if (children?.length) flatFn(children);
      });
    };
    flatFn(dataList.value);
    downloadDataToExcel([
      {
        dataList: flatDataList,
        columns: columns.value,
        sheetName: "角色设置"
      }
    ]);
  };

  const onSetK3Role = () => {
    if (!rowData.value) {
      return message("请先选择需要操作的角色", { type: "error" });
    }
    showMessageBox(`确认要为【${rowData.value.roleName}】设置金蝶角色吗?`)
      .then(() => {
        setKingdeeRole(rowData.value.id).then((res) => {
          if (res.data) {
            ElMessage({ message: "设置金蝶角色成功", type: "success" });
            getTableList();
          }
        });
      })
      .catch(console.log);
  };

  const onEditAction = () => {
    if (rowData.value) {
      onEdit(rowData.value);
    } else {
      ElMessage({ message: "请选择一条记录", type: "warning" });
    }
  };

  const onDelAction = wrapFn(rowData, () => {
    showMessageBox("确认要删除吗?")
      .then(() => onDelete(rowData.value))
      .catch(console.log);
  });

  const onSetQYWXTag = () => {
    if (!rowData.value) return message("请选择角色", { type: "warning" });
    showMessageBox(`确认创建【${rowData.value.roleName}】企业微信标签吗?`)
      .then(() => {
        setQYWXTag(rowData.value).then((res) => {
          if (res.data || res.status === 200) {
            ElMessage({ message: "创建成功", type: "success" });
            getTableList();
          }
        });
      })
      .catch(console.log);
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, text: "新增", type: "primary", isDropDown: false },
    { clickHandler: onEditAction, text: "修改", type: "warning", isDropDown: false },
    { clickHandler: onDelAction, text: "删除", type: "danger", isDropDown: false },
    { clickHandler: onSetK3Role, text: "设置金蝶角色", type: "primary", isDropDown: true },
    { clickHandler: onSetQYWXTag, text: "创建企业微信标签", type: "primary", isDropDown: true },
    { clickHandler: onExport, text: "导出", type: "default", isDropDown: true }
  ]);
  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: onAdd2, text: "新增", type: "primary", isDropDown: false },
    { clickHandler: onDeleteAll2, text: "删除", type: "danger", isDropDown: false }
  ]);

  const handleNodeClick = (data) => {
    curNodeKey.value = data.id;
    dataList2.value = [];
    getInductionAuditRoleInfoByDeptId({ deptId: data.id }).then((res: any) => {
      if (res.data) {
        dataList.value = res.data || [];
      }
    });
  };

  return {
    tableRef2,
    loading,
    loading2,
    columns,
    columns2,
    dataList,
    dataList2,
    maxHeight,
    buttonList,
    buttonList2,
    groupArrsList,
    curNodeKey,
    deptTreeData,
    onEdit,
    onDelete,
    onRefresh,
    onRefresh2,
    onRowClick2,
    onRowClick,
    handleNodeClick,
    handleSelectionChange2
  };
};
