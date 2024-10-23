/*
 * @Author: Hailen
 * @Date: 2023-07-24 08:41:09
 * @Last Modified by: Hailen
 * @Last Modified time: 2024-10-16 10:20:04
 */

import { Ref, onMounted, h, reactive, ref } from "vue";
import { message, showMessageBox } from "@/utils/message";
import { setColumn, getMenuColumns, updateButtonList } from "@/utils/table";
import { useEleHeight } from "@/hooks";
import EditForm from "@/components/EditForm/index.vue";
import AddModal from "../addModal.vue";
import { type PaginationProps } from "@pureadmin/table";
import { formConfigs, formRules } from "./config";
import { addDialog } from "@/components/ReDialog";

import { Plus, Delete } from "@element-plus/icons-vue";

import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import {
  TaskRoleItemType,
  TaskScheduleItemType,
  TaskUserItemType,
  addTaskSchedule,
  updateTaskSchedule,
  taskRoleList,
  taskScheduleList,
  taskUserList,
  deleteTaskSchedule,
  RoleInfoItemType,
  addSelectRole,
  addSelectUser,
  freshTaskSchedule
} from "@/api/systemManage";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { PAGE_CONFIG } from "@/config/constant";
import { ElMessage } from "element-plus";
import Cron from "../cron/index.vue";

/** 添加类型 */
type AddType = "role" | "user";

export const useConfig = () => {
  const columns = ref<TableColumnList[]>([]);
  const columns2 = ref<TableColumnList[]>([]);
  const columns3 = ref<TableColumnList[]>([]);
  const dataList = ref<TaskScheduleItemType[]>([]);
  const dataList2 = ref<TaskRoleItemType[]>([]);
  const dataList3 = ref<TaskUserItemType[]>([]);
  const loading = ref<boolean>(false);
  const loading2 = ref<boolean>(false);
  const loading3 = ref<boolean>(false);
  const rowData = ref<TaskScheduleItemType>();
  const rowsData2 = ref<TaskRoleItemType[]>([]);
  const rowsData3 = ref<TaskUserItemType[]>([]);
  const maxHeight = useEleHeight(".app-main > .el-scrollbar", 51 + 51);
  const tableRef2 = ref();
  const tableRef3 = ref();

  const searchOptions = reactive<SearchOptionType[]>([{ label: "任务名称", value: "taskName" }]);

  const formData = reactive({
    page: 1,
    limit: PAGE_CONFIG.pageSize,
    taskName: ""
  });
  const pagination = reactive<PaginationProps>({ ...PAGE_CONFIG });

  onMounted(() => {
    getColumnConfig();
    getTableList();
  });

  const getColumnConfig = async () => {
    let columnData: TableColumnList[] = [
      { label: "任务ID", prop: "id", align: "right" },
      { label: "任务标题", prop: "taskName", minWidth: 280, sortable: true },
      { label: "任务标识", prop: "jobName", minWidth: 180, sortable: true },
      { label: "任务组别", prop: "jobGroup", minWidth: 180 },
      { label: "调度表达式", prop: "cronSchedule", minWidth: 220 },
      { label: "URL地址", prop: "url", minWidth: 180 },
      { label: "状态", prop: "disabled", sortable: true, minWidth: 80, cellRenderer: ({ row }) => <span>{row.disabled ? "启用" : "停用"}</span> },
      { label: "描述", prop: "directions", minWidth: 180 },
      { label: "推送消息体查询语句", prop: "messageBody", minWidth: 220 },
      { label: "数据来源", prop: "dataSources", sortable: true },
      { label: "创建时间", prop: "createDate", minWidth: 160 }
    ];
    let columnData2: TableColumnList[] = [
      { label: "角色编号", prop: "roleCode" },
      { label: "角色名称", prop: "roleName" }
    ];
    let columnData3: TableColumnList[] = [
      { label: "用户编号", prop: "userCode" },
      { label: "用户名称", prop: "userName" }
    ];
    const { columnArrs, buttonArrs } = await getMenuColumns();
    const [data, data2, data3] = columnArrs;
    if (data?.length) columnData = data;
    if (data2?.length) columnData2 = data2;
    if (data3?.length) columnData3 = data3;

    updateButtonList(buttonList, buttonArrs[0]);
    updateButtonList(buttonList2, buttonArrs[1]);
    updateButtonList(buttonList3, buttonArrs[2]);

    columns.value = setColumn({ columnData, dragSelector: ".data-base", operationColumn: false });
    columns2.value = setColumn({
      columnData: columnData2,
      operationColumn: { minWidth: 80 },
      selectionColumn: { hide: false },
      radioColumn: false
    });
    columns3.value = setColumn({
      columnData: columnData3,
      operationColumn: { minWidth: 80 },
      selectionColumn: { hide: false },
      radioColumn: false
    });
  };

  const onRefresh = () => {
    getColumnConfig();
    getTableList();
  };
  const onRefresh2 = () => {
    if (!rowData.value) return;
    getColumnConfig();
    getTableList2(rowData.value.toRoles);
  };
  const onRefresh3 = () => {
    if (!rowData.value) return;
    getColumnConfig();
    getTableList3(rowData.value.toUsers);
  };

  const onTagSearch = (values) => {
    Object.assign(formData, values);
    getTableList();
  };

  /** 1.获取数据库列表 */
  const getTableList = () => {
    loading.value = true;
    taskScheduleList(formData)
      .then(({ data }) => {
        loading.value = false;
        dataList.value = data.records || [];
        pagination.total = data.total;
        const curRows = dataList.value.find((item) => item.id === rowData.value.id);
        if (curRows) onRowClick(curRows);
      })
      .catch((err) => (loading.value = false));
  };

  // 操作提交
  const onAdd = () => {
    openDialog("add");
  };
  const onEdit = () => {
    const row: TaskScheduleItemType = rowData.value;

    if (!row) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    openDialog("edit", row);
  };
  const onDelete = () => {
    const row: TaskScheduleItemType = rowData.value;

    if (!row) {
      ElMessage({ message: "请选择一条记录", type: "warning" });
      return;
    }
    showMessageBox(`确认要删除名称为【${row.taskName}】的任务吗?`)
      .then(() => {
        deleteTaskSchedule({ id: row.id })
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
      })
      .catch(console.log);
  };

  const onRowClick = (row: TaskScheduleItemType) => {
    rowData.value = row;
    getTableList2(row.toRoles);
    getTableList3(row.toUsers);
  };

  function openDialog(type: "add" | "edit", row?: Partial<TaskScheduleItemType>) {
    const titleObj = { add: "新增", edit: "修改" };
    const title = titleObj[type];
    const formRef = ref();
    const sLoading = ref(true);
    const statusOptions = ref([]);
    const dataSourceOptions = ref([]);
    const pushTypeOptions = ref([]);
    const taskTypeOption = ref([]);

    const formData = reactive({
      jobName: row?.jobName ?? "",
      taskName: row?.taskName ?? "",
      jobGroup: row?.jobGroup ?? "",
      disabled: row?.disabled !== undefined ? `${row?.disabled}` : "",
      cronSchedule: row?.cronSchedule ?? "",
      dataSources: row?.dataSources ?? "",
      toTitle: row?.toTitle ?? "",
      toType: row?.toType ?? "",
      url: row?.url ?? "",
      webhookUrl: row?.webhookUrl ?? "",
      messageBody: row?.messageBody ?? "",
      directions: row?.directions ?? "",
      id: row?.id ?? "",
      taskType: row?.taskType !== undefined ? `${row?.taskType}` : "",
      adviceByQywx: row?.adviceByQywx ?? false,
      adviceByEmail: row?.adviceByEmail ?? false,
      limitedWorkingDay: row?.limitedWorkingDay ?? false,
      emailAdviceWay: row?.emailAdviceWay ?? undefined
    });

    const findItemInfo = (key, list = []) => {
      return list.find((item) => item.optionCode === key)?.optionList || [];
    };

    getBOMTableRowSelectOptions({ optioncode: "SchedulingDataSource,SchedulingSendType,SchedulingStatus,SchedulingTaskType" })
      .then((res: any) => {
        if (res.data) {
          const schedulingDataSource = findItemInfo("SchedulingDataSource", res.data);
          const schedulingSendType = findItemInfo("SchedulingSendType", res.data);
          const schedulingStatus = findItemInfo("SchedulingStatus", res.data);
          const schedulingTaskType = findItemInfo("SchedulingTaskType", res.data);

          statusOptions.value = schedulingStatus;
          dataSourceOptions.value = schedulingDataSource;
          pushTypeOptions.value = schedulingSendType;
          taskTypeOption.value = schedulingTaskType;
        }
      })
      .finally(() => (sLoading.value = false));

    const onSetCronSchedule = () => {
      const modalIns = addDialog({
        title: `设置cron表达式`,
        props: {},
        width: "760px",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: false,
        showResetButton: true,
        hideFooter: true,
        contentRenderer: () => h(Cron, { ref: formRef, modalIns, formData })
      });
    };

    addDialog({
      title: `${title}定时任务`,
      props: {
        loading: sLoading,
        formInline: formData,
        formRules: formRules(formData),
        formConfigs: formConfigs({ statusOptions, dataSourceOptions, onSetCronSchedule, pushTypeOptions, taskTypeOption, formData }),
        formProps: { labelWidth: "100px" }
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
            showMessageBox(`确认要提交吗?`)
              .then(() => {
                if (!formData.adviceByEmail) {
                  formData.emailAdviceWay = undefined;
                }
                onSubmitChange(type, title, formData, () => {
                  done();
                  getTableList();
                });
              })
              .catch(console.log);
          }
        });
      }
    });
  }

  // 新增|修改提交
  const onSubmitChange = (type: string, title: string, data, callback) => {
    const API = { add: addTaskSchedule, edit: updateTaskSchedule };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`${title}成功`);
        }
      })
      .catch(console.log);
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

  // 2.获取数据表列表
  const getTableList2 = (toRoles: string) => {
    loading2.value = true;
    const params = { page: 1, limit: 10000, toRoles };
    taskRoleList(params)
      .then((res) => {
        loading2.value = false;
        dataList2.value = res.data;
      })
      .catch(() => (loading2.value = false));
  };

  const onAdd2 = () => {
    if (!rowData.value) return message("请先选择需要操作的调度任务", { type: "error" });
    openDialog2("role");
  };

  // 移除
  const onDelete2 = (row: TaskRoleItemType) => {
    onRemove2([row]);
  };
  const onDeleteAll2 = () => {
    const len = rowsData2.value.length;
    if (len <= 0) {
      return message("请选择角色", { type: "error" });
    }
    showMessageBox(`确定要将这${len}个角色移除吗?`)
      .then(() => {
        onRemove2(rowsData2.value);
      })
      .catch(console.log);
  };

  /** 移除操作要提交未勾选的所有编号(奇葩的接口) */
  const onRemove2 = (rows: TaskRoleItemType[]) => {
    const roleCodes = rows.map((item) => item.roleCode);
    const userCodes = rows.map((item) => (item as any).userCode);
    const toRoles: string[] = [];
    const toUsers: string[] = [];
    dataList2.value.forEach((item) => {
      if (!roleCodes.includes(item.roleCode)) {
        toRoles.push(item.roleCode);
      }
    });
    dataList3.value.forEach((item) => {
      if (!userCodes.includes(item.userCode)) {
        toUsers.push(item.userCode);
      }
    });
    const deleteList = String(toRoles);
    const toUserList = String(toUsers);
    const params = { toRoles: deleteList, toUsers: toUserList, id: rowData.value.id };
    addSelectRole(params).then((res) => {
      if (res.data) {
        getTableList2(deleteList);
        getTableList();
        message("移除成功");
      } else {
        message("移除失败", { type: "error" });
      }
    });
  };

  const onRowClick2 = (row: TaskRoleItemType) => {
    // tableRef2.value?.getTableRef()?.toggleRowSelection(row);
  };
  const onRowClick3 = (row: TaskRoleItemType) => {
    // tableRef3.value?.getTableRef()?.toggleRowSelection(row);
  };

  const onSelectionChange2 = (rows: TaskRoleItemType[]) => {
    rowsData2.value = rows;
  };

  const onSelectionChange3 = (rows: TaskUserItemType[]) => {
    rowsData3.value = rows;
  };

  function openDialog2(type: AddType, row?: Partial<TaskScheduleItemType>) {
    const titleObj = { role: "角色", user: "用户" };
    const title = titleObj[type];
    const formRef = ref();
    addDialog({
      title: `选择${title}`,
      props: { addType: type },
      width: "50%",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      showResetButton: false,
      contentRenderer: () => h(AddModal, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef: RoleInfoItemType[] = formRef.value.getRef();
        if (FormRef.length === 0) {
          return message(`请选择${title}`, { type: "error" });
        }
        const toRolesList: string[] = FormRef.map((item) => item.roleCode);
        const toUsersList: string[] = FormRef.map((item) => (item as any).userCode);
        // 添加操作: 要先获取所有的编号一起提交, 这接口有点奇葩
        dataList2.value.forEach((item) => toRolesList.push(item.roleCode));
        dataList3.value.forEach((item) => toUsersList.push(item.userCode));
        const toRoles = String(toRolesList.filter((item) => item));
        const toUsers = String(toUsersList.filter((item) => item));
        const params = { toRoles, toUsers, id: rowData.value.id };

        showMessageBox(`确认要提交吗?`)
          .then(() => {
            onSubmitChange2(type, title, params, () => {
              done();
              if (type === "role") {
                getTableList();
                getTableList2(toRoles);
              } else {
                getTableList();
                getTableList3(toUsers);
              }
            });
          })
          .catch(console.log);
      }
    });
  }

  // 添加
  const onSubmitChange2 = (type: AddType, title: string, data, callback) => {
    const API = { role: addSelectRole, user: addSelectUser };
    API[type](data)
      .then((res) => {
        if (res.data) {
          callback();
          message(`添加${title}成功`);
        } else {
          message(`添加${title}失败`, { type: "error" });
        }
      })
      .catch(console.log);
  };

  // 3.获取数据字段列表
  const getTableList3 = (toUsers: string) => {
    loading3.value = true;
    const params = { page: 1, limit: 10000, toUsers };
    taskUserList(params)
      .then((res) => {
        loading3.value = false;
        dataList3.value = res.data;
      })
      .catch(() => (loading3.value = false));
  };

  const onAdd3 = () => {
    if (!rowData.value) return message("请先选择需要操作的调度任务", { type: "error" });
    openDialog2("user");
  };

  // 移除
  const onDelete3 = (row: TaskUserItemType) => {
    onRemove3([row]);
  };
  const onDeleteAll3 = () => {
    const len = rowsData3.value.length;
    if (len <= 0) {
      return message("请选择用户", { type: "error" });
    }
    showMessageBox(`确定要将这${len}个用户移除吗?`)
      .then(() => {
        onRemove3(rowsData3.value);
      })
      .catch(console.log);
  };

  /** 移除操作要提交未勾选的所有编号(奇葩的接口) */
  const onRemove3 = (rows: TaskUserItemType[]) => {
    const userCodes = rows.map((item) => item.userCode);
    const roleCodes = rows.map((item) => (item as any).roleCode);
    const toUsers: string[] = [];
    const toRoles: string[] = [];
    dataList3.value.forEach((item) => {
      if (!userCodes.includes(item.userCode)) {
        toUsers.push(item.userCode);
      }
    });
    dataList2.value.forEach((item) => {
      if (!roleCodes.includes(item.roleCode)) {
        toRoles.push(item.roleCode);
      }
    });
    const deleteList = String(toUsers);
    const toRoleList = String(toRoles);
    const params = { toUsers: deleteList, toRoles: toRoleList, id: rowData.value.id };
    addSelectUser(params).then((res) => {
      if (res.data) {
        getTableList3(deleteList);
        getTableList();
        message("移除成功");
      } else {
        message("移除失败", { type: "error" });
      }
    });
  };

  const onFresh = () => {
    freshTaskSchedule().then((res) => {
      if (res.data) {
        ElMessage({ message: "刷新成功", type: "success" });
      }
    });
  };

  const buttonList = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增", isDropDown: false },
    { clickHandler: onEdit, type: "warning", text: "修改", isDropDown: false },
    { clickHandler: onDelete, type: "danger", text: "删除", isDropDown: false },
    { clickHandler: onFresh, type: "primary", text: "刷新", isDropDown: true }
  ]);

  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: onAdd2, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onDeleteAll2, type: "danger", text: "批量删除", icon: Delete, isDropDown: false }
  ]);

  const buttonList3 = ref<ButtonItemType[]>([
    { clickHandler: onAdd3, type: "primary", text: "新增", icon: Plus, isDropDown: false },
    { clickHandler: onDeleteAll3, type: "danger", text: "批量删除", icon: Delete, isDropDown: false }
  ]);

  return {
    loading,
    loading2,
    loading3,
    columns,
    columns2,
    columns3,
    dataList,
    dataList2,
    dataList3,
    maxHeight,
    searchOptions,
    pagination,
    tableRef2,
    tableRef3,
    buttonList,
    buttonList2,
    buttonList3,
    onEdit,
    onDelete,
    onDelete2,
    onDelete3,
    onTagSearch,
    onRowClick,
    onRowClick2,
    onRowClick3,
    onRefresh,
    onRefresh2,
    onRefresh3,
    onSelectionChange2,
    onSelectionChange3,
    onSizeChange,
    onCurrentChange
  };
};
