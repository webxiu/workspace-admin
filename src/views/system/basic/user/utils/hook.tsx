/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:05:03
 */

import {
  UserInfoReqType,
  UserInfoItemType,
  userRoleDelete,
  userInfoAdd,
  userInfoRole,
  UserInfoRoleItemType,
  userInfoUpdate,
  DetartMenttemType,
  userInfoList,
  addDeptRole,
  resetPassword,
  createDatabase,
  deleteDatabase,
  exportUserInfo,
  createKingdee,
  TableGroupItemType,
  queryUserDeptList,
  detartMentList,
  insertUserDeptList,
  setMainRole,
  deleteUserDeptList,
  deleteUserRoleInfo,
  getRoleInfoList
} from "@/api/systemManage";
import { formConfigs, formRules } from "./config";
import { h, onMounted, reactive, ref } from "vue";
import { handleTree } from "@/utils/tree";
import { type PaginationProps } from "@pureadmin/table";
import { SearchOptionType, QueryParamsType } from "@/components/BlendedSearch/index.vue";
import { LoadingType } from "@/components/ButtonList/index.vue";
import { Plus, Edit, Delete, RefreshLeft, User, Download, Position } from "@element-plus/icons-vue";

import EditForm, { FormConfigItemType } from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { message, showMessageBox, wrapFn } from "@/utils/message";
import { useEleHeight } from "@/hooks";
import AddModal from "../addModal.vue";
import AddDeptModal from "../addDeptModal.vue";
import OnlineModal from "../onlineModal.vue";
import MoveModal from "../moveModal.vue";
import { downloadFile, getChildIDs, getTreeArrItem, getFileNameOnUrlPath } from "@/utils/common";
import { getExportConfig, setColumn, getMenuColumns, getEnumDictList, updateButtonList } from "@/utils/table";
import { PAGE_CONFIG } from "@/config/constant";
import { getDeptOptions } from "@/utils/requestApi";
import { getInductionAuditRoleInfoByDeptId } from "@/api/oaManage/humanResources";
import { getFormColumns, CustomPropsType } from "@/utils/form";

export const useConfig = () => {
  const tableRef2 = ref();
  const stateOptions = ref([]);
  const rowData = ref<UserInfoItemType>();
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const columns3 = ref<TableColumnList[]>([]);
  const dataList = ref<UserInfoItemType[]>([]);
  const dataList2 = ref<UserInfoRoleItemType[]>([]);
  const dataList3 = ref<UserInfoRoleItemType[]>([]);
  const roleRows = ref<UserInfoRoleItemType[]>([]);
  const roleRows2 = ref<UserInfoRoleItemType[]>([]);
  const deptOptions = ref<DetartMenttemType[]>([]);
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 48 + 50);
  const loadingStatus = ref<LoadingType>({ loading: false, text: "" });
  const groupArrsList = ref<TableGroupItemType[]>([]);
  const userTableRef = ref();
  const loading2 = ref<boolean>(false);
  const loading3 = ref<boolean>(false);

  const formData = reactive<UserInfoReqType>({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    userName: "",
    userCode: "",
    deptId: "",
    userState: "",
    deptIdList: []
  });

  const searchOptions = reactive<SearchOptionType[]>([
    { label: "员工姓名", value: "userName" },
    { label: "员工工号", value: "userCode" },
    { label: "状态", value: "userState", children: [] },
    { label: "部门", value: "deptId", children: [] }
  ]);
  const queryParams = reactive<QueryParamsType>({
    userState: { value: "A", valueLabel: "在职" }
  });

  onMounted(() => {
    getColumnConfig();
    getOptions();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "员工ID", prop: "id", align: "right" },
      { label: "员工工号", prop: "userCode", align: "right", sortable: true },
      { label: "员工姓名", prop: "userName", sortable: true },
      { label: "部门编号", prop: "deptId", align: "right", sortable: true },
      { label: "部门", prop: "deptName", minWidth: 160, sortable: true },
      { label: "组别", prop: "groupName", minWidth: 160, sortable: true },
      { label: "员工状态", prop: "userState", sortable: true, cellRenderer: ({ row }) => ({ A: "在职", B: "离职" }[row.userState]) },
      { label: "移动电话", prop: "mobile" },
      { label: "企业微信ID", prop: "wxOpenid", minWidth: 160 },
      { label: "职位", prop: "roleName" },
      { label: "邮箱", prop: "email" },
      { label: "创建时间", prop: "createDate", minWidth: 160 }
    ];
    let columnData2: TableColumnList[] = [
      { label: "角色名称", prop: "roleName" },
      { label: "部门", prop: "deptPath" },
      { label: "主角色", prop: "isPrimarily" }
    ];

    let columnData3: TableColumnList[] = [
      { label: "部门编号", prop: "deptCode" },
      { label: "部门名称", prop: "deptName" },
      { label: "是否主部门", prop: "isMaster" },
      { label: "部门ID", prop: "deptId" }
    ];

    const { columnArrs, groupArrs, buttonArrs } = await getMenuColumns();
    const [data, data2, data3] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (data3?.length) columnData3 = data3;
    if (groupArrs?.length) groupArrsList.value = groupArrs;
    updateButtonList(buttonList, buttonArrs[0]);
    updateButtonList(buttonList2, buttonArrs[1]);
    columns.value = setColumn({ columnData, dragSelector: ".user-manage", operationColumn: false });
    columns2.value = setColumn({
      columnData: columnData2,
      operationColumn: { width: 180 },
      selectionColumn: { hide: false },
      radioColumn: false,
      dragSelector: ".user-manage-role"
    });
    columns3.value = setColumn({
      columnData: columnData3,
      operationColumn: { width: 130 },
      selectionColumn: { hide: false },
      radioColumn: false,
      dragSelector: ".user-manage-dept"
    });
  };

  const getOptions = () => {
    getEnumDictList(["UserStatus"])
      .then((res) => {
        const states = res.UserStatus.map(({ optionName, optionValue }) => ({ label: optionName, value: optionValue }));
        stateOptions.value = res.UserStatus;
        searchOptions[2].children = states;
      })
      .catch(console.log);

    getDeptOptions().then((data: any) => {
      deptOptions.value = data;
      searchOptions[3].children = data;
    });
  };

  const getDeptList = (row) => {
    console.log(row, "fetch dept..");
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };

  const onRefresh2 = () => {
    getColumnConfig();
    getRoleList(rowData.value);
  };

  const onRefresh3 = () => {
    getColumnConfig();
    getDeptList(rowData.value);
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    formData.deptIdList = [];
    if (values.deptId) {
      const result = getTreeArrItem(deptOptions.value, "value", values.deptId);
      formData.deptIdList = getChildIDs([result], "value");
    }
    getTableList();
  };

  const getTableList = () => {
    userInfoList(formData).then(({ data }) => {
      dataList.value = data.records || [];
      pagination.total = data.total;

      const _rowIndex = dataList.value.findIndex((item) => item.id === rowData.value?.id);

      if (_rowIndex > -1) {
        userTableRef.value?.getTableRef().setCurrentRow(dataList.value[_rowIndex]);
      }
    });
  };

  const onAdd = () => openDialog("add");
  const onEdit = (row: UserInfoItemType) => openDialog("edit", row);
  const onDorpEdit = wrapFn(rowData, () => onEdit(rowData.value));

  function openDialog(type: string, row?: Partial<UserInfoItemType>) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const loading = ref(false);
    const myFormConfig = ref<FormConfigItemType[]>([]);

    const _formData = reactive({
      userCode: row?.userCode ?? "",
      userName: row?.userName ?? "",
      deptId: row?.deptId ? `${row?.deptId}` : "",
      roleName: row?.roleName ?? "",
      mobile: row?.mobile ?? "",
      wxOpenid: row?.wxOpenid ?? "",
      qunhuiAccount: row?.qunhuiAccount ?? "",
      qunhuiPassword: row?.qunhuiPassword ?? "",
      k3UserAccount: row?.k3UserAccount ?? "",
      userState: row?.userState ?? "",
      id: row?.id ?? "",
      email: row?.email ?? ""
    });

    const customProps = reactive<{ [key: string]: CustomPropsType }>({
      userCode: { disabled: type === "edit" },
      k3UserAccount: { disabled: true },
      deptId: { formatAPI: (data) => data.deptInfoTree }
    });

    getFormColumns({ loading, customProps })
      .then((data) => {
        loading.value = false;
        if (!data.formColumns.length) return;
        myFormConfig.value = data.formColumns.filter((item) => {
          if (type === "add") return item.prop !== "k3UserAccount";
          return true;
        });
      })
      .catch(() => (loading.value = false));

    addDialog({
      title: `${title}用户`,
      props: {
        formInline: _formData,
        formRules: formRules,
        // formConfigs: formConfigs({ type, stateOptions, deptOptions }),
        formConfigs: myFormConfig,
        formProps: { labelWidth: "140px" }
      },
      width: "860px",
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
  // 新增|修改用户
  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { add: userInfoAdd, edit: userInfoUpdate };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
  };

  const getRightDeptList = (row) => {
    loading3.value = true;
    queryUserDeptList({ userId: row.id })
      .then((res: any) => {
        if (res.data) {
          dataList3.value = res.data;
        }
      })
      .finally(() => (loading3.value = false));
  };

  // 获取右侧分组列表
  const onRowClick = (row: UserInfoItemType) => {
    if (!row) return;
    rowData.value = row;
    getRoleList(row);
    getRightDeptList(row);
  };

  // 获取右侧分组列表
  const onRowClick3 = (row: UserInfoItemType) => {
    if (!row) return;
    rowData.value = row;
    getDeptList(row);
  };

  // 获取右侧分组列表
  const getRoleList = (row: UserInfoItemType) => {
    if (!row?.id) return;
    loading2.value = true;
    userInfoRole({ page: 1, limit: 10000, id: row.id })
      .then((res) => {
        dataList2.value = res.data;
      })
      .finally(() => (loading2.value = false));
  };

  // 新增角色
  const onAdd2 = () => {
    if (!rowData.value) {
      return message("请选择要修改的用户", { type: "error" });
    }
    openRoleDialog();
  };

  // 删除单个
  const onDelete2 = (row: UserInfoRoleItemType) => {
    onDeleteAlls([row]);
  };

  // 批量删除
  const onDeleteAll2 = () => {
    onDeleteAlls(roleRows.value);
  };

  // 提交批量删除
  const onDeleteAlls = (rows: UserInfoRoleItemType[]) => {
    if (!rows?.length) {
      return message("请选择角色", { type: "error" });
    }

    deleteUserRoleInfo({ userRoleIdList: rows.map((item) => item.id) })
      .then((res) => {
        res.data && message("删除成功");
        getRoleList(rowData.value);
      })
      .catch(console.log);
  };

  // 多选角色
  const handleSelectionChange2 = (rows: UserInfoRoleItemType[]) => {
    roleRows.value = rows;
  };

  // 多选部门
  const handleSelectionChange3 = (rows: UserInfoRoleItemType[]) => {
    roleRows2.value = rows;
  };

  const onRowClick2 = (row: UserInfoRoleItemType) => {
    // tableRef2.value?.getTableRef()?.toggleRowSelection(row);
  };

  // 添加角色弹窗
  function openRoleDialog() {
    const modalRef = ref();

    addDialog({
      title: "添加角色",
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(AddModal, { ref: modalRef }),
      beforeSure: (done, { options }) => {
        const rowItem = modalRef.value.getRef();
        if (!rowItem.id) {
          return message("请选择具体的角色", { type: "error" });
        }
        showMessageBox(`确认要提交吗?`).then(() => {
          const params = {
            roleId: rowItem.id,
            isPrimarily: false,
            userIdList: [rowData.value.id]
          };
          addDeptRole(params)
            .then((res) => {
              if (res.data) {
                done();
                message("添加成功");
                getRoleList(rowData.value);
              } else {
                message("添加失败", { type: "error" });
              }
            })
            .catch(console.log);
        });
      }
    });
  }

  // 添加部门弹窗
  const openDeptDialog = () => {
    const modalRef = ref();

    // 获取部门列表
    detartMentList().then((res) => {
      modalRef.value.dataList = handleTree(res.data, "itemId", "parentId");
    });

    addDialog({
      title: "添加部门",
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(AddDeptModal, { ref: modalRef }),
      beforeSure: (done, { options }) => {
        const rowItem = modalRef.value.getRef();
        if (!rowItem) {
          return message("请选择部门", { type: "error" });
        }
        showMessageBox(`确认要提交吗?`).then(() => {
          const params = {
            deptId: rowItem.itemId,
            userId: rowData.value.id
          };
          insertUserDeptList(params)
            .then((res) => {
              if (res.data) {
                done();
                message("添加成功");
                getRightDeptList(rowData.value);
              } else {
                message("添加失败", { type: "error" });
              }
            })
            .catch(console.log);
        });
      }
    });
  };

  /** 导出 */
  const onMoveUser = () => {
    const moveRef = ref();
    addDialog({
      title: "修改部门",
      props: { deptOptions },
      width: "80%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(MoveModal, { ref: moveRef }),
      beforeSure: (done, { options }) => {
        const rowItem = moveRef.value.getRef();
        showMessageBox(`确认要提交吗?`).then(() => done());
      }
    });
  };

  /** 导出 */
  const onExport = () => {
    const headConfig = getExportConfig("用户管理", columns.value, { ...formData, limit: 100000 });
    exportUserInfo(headConfig)
      .then((res) => {
        if (res.data) {
          const fileName = getFileNameOnUrlPath(res.data);
          downloadFile(res.data, fileName, true);
        }
      })
      .catch(console.log);
  };

  /** 在线人员明细 */
  const onDetail = () => {
    addDialog({
      title: "在线用户",
      props: {},
      width: "60%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      destroyOnClose: true,
      contentRenderer: () => h(OnlineModal),
      beforeSure: (done, { options }) => done()
    });
  };

  /** 重置密码 */
  const onResetPassword = wrapFn(rowData, () => {
    const row = rowData.value;
    showMessageBox(`确定为【${row.userName}】重置密码吗?<br />(手机后4位+身份证后4位)`).then(() => {
      resetPassword(row)
        .then((res) => {
          if (res.data) {
            message("重置密码成功");
          } else {
            message("重置密码失败", { type: "error" });
          }
        })
        .catch(console.log);
    });
  });
  /** 创建数据库帐号 */
  const onCreateDBAccount = wrapFn(rowData, () => {
    const row = rowData.value;
    showMessageBox(`确定为【${row.userName}】创建数据库账号吗?`).then(() => {
      createDatabase({ userCode: row.userCode })
        .then((res) => {
          if (res.data) {
            message("创建成功");
          } else {
            message("创建失败", { type: "error" });
          }
        })
        .catch(console.log);
    });
  });

  /** 为用户创建金蝶账号 */
  const onCreateKingdeeAccount = wrapFn(rowData, () => {
    const row = rowData.value;
    showMessageBox(`确定为【${row.userName}】创建金蝶账号吗?`).then(() => {
      createKingdee(row.id)
        .then((res) => {
          if (res.data) {
            message("创建成功");
            getTableList();
          } else {
            message("创建失败", { type: "error" });
          }
        })
        .catch(console.log);
    });
  });

  /** 删除数据库帐号 */
  const onDeleteDBAccount = wrapFn(rowData, () => {
    const row = rowData.value;
    showMessageBox(`确定删除【${row.userName}】的数据库账号吗?`).then(() => {
      deleteDatabase({ userCode: row.userCode })
        .then((res) => {
          if (res.data) {
            message("删除成功");
          } else {
            message("删除失败", { type: "error" });
          }
        })
        .catch(console.log);
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

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", icon: Plus },
    { clickHandler: onDorpEdit, type: "warning", text: "修改", icon: Edit },
    { clickHandler: onDetail, type: "danger", text: "在线人员明细", icon: User, isDropDown: true },
    { clickHandler: onResetPassword, type: "info", text: "重置密码", icon: RefreshLeft, isDropDown: true },
    { clickHandler: onMoveUser, type: "default", text: "用户迁移", icon: Position, isDropDown: true },
    { clickHandler: onExport, type: "default", text: "导出", icon: Download, isDropDown: true },
    { clickHandler: onCreateDBAccount, type: "warning", text: "创建数据库帐号", icon: Plus, isDropDown: true },
    { clickHandler: onCreateKingdeeAccount, type: "warning", text: "创建金蝶帐号", icon: Plus, isDropDown: true },
    { clickHandler: onDeleteDBAccount, type: "warning", text: "删除数据库帐号", icon: Delete, isDropDown: true }
  ]);
  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: onAdd2, type: "primary", text: "新增", icon: Plus },
    { clickHandler: onDeleteAll2, type: "danger", text: "删除", icon: Delete }
  ]);

  const onAdd3 = () => {
    if (!rowData.value) {
      return message("请选择要修改的用户", { type: "error" });
    }
    openDeptDialog();
  };

  const onDeleteAll3 = () => {
    if (!roleRows2.value?.length) {
      return message("请选择部门", { type: "error" });
    }

    const delData = { deleteIds: roleRows2.value.map((item) => item.id), userId: roleRows2.value[0]?.userId };

    deleteUserDeptList(delData)
      .then((res) => {
        res.data && message("删除成功");
        getRightDeptList(rowData.value);
      })
      .catch(console.log);
  };

  const buttonList3 = ref<ButtonItemType[]>([
    { clickHandler: onAdd3, type: "primary", text: "新增" },
    { clickHandler: onDeleteAll3, type: "danger", text: "删除" }
  ]);

  const onSetMainRole = (row) => {
    setMainRole({ id: row.id, isPrimarily: true }).then((res) => {
      if (res.data || res.status === 200) {
        message("设置成功");
        getTableList();
        onRowClick(rowData.value);
      }
    });
  };

  const onSetMainDept = (row) => {
    const updateData = { ...row, isMaster: true };
    insertUserDeptList(updateData)
      .then((res) => {
        if (res.data) {
          message("设置成功");
          getTableList();
          onRowClick(rowData.value);
        } else {
          message("设置失败", { type: "error" });
        }
      })
      .catch(console.log);
  };

  return {
    tableRef2,
    loading2,
    loading3,
    columns,
    columns2,
    dataList,
    columns3,
    dataList3,
    buttonList3,
    dataList2,
    maxHeight,
    queryParams,
    userTableRef,
    searchOptions,
    buttonList,
    buttonList2,
    loadingStatus,
    pagination,
    groupArrsList,
    onTagSearch,
    onRefresh,
    onRefresh2,
    onEdit,
    onRowClick,
    onSizeChange,
    onSetMainRole,
    onDelete2,
    onRowClick2,
    onRefresh3,
    onRowClick3,
    onSetMainDept,
    onCurrentChange,
    handleSelectionChange3,
    handleSelectionChange2
  };
};
