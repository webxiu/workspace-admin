import { fetchPersonNameProjectPartData, fetchPersonRoleProjectPartData, fetchTaskStoreList } from "@/api/plmManage";
import { groupFormConfgs, groupFormRules, taskFormConfgs, taskFormRules } from "./config";
import { h, onMounted, reactive, ref, watch } from "vue";

import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { getInductionAuditRoleInfo } from "@/api/oaManage/humanResources";
import { message } from "@/utils/message";
import { roleUserList } from "@/api/systemManage";
import { setColumn } from "@/utils/table";
import { v4 as uuidv4 } from "uuid";

export const useTaskTable = (props) => {
  const maxHeight = ref(270);
  const dataList = ref([]);
  const columns = ref([]);
  const currentRow = ref();

  const getConfig = () => {
    const columnsData: TableColumnList[] = [
      { label: "任务名称", prop: "name" },
      { label: "工期(天)", prop: "duration", width: 80, align: "right" },
      {
        label: "负责人",
        width: 90,
        prop: "responeseUser",
        cellRenderer(data) {
          if (data.row.groupId) {
            const responeseUsers = data.row.projectTaskResponsiblePersonnelVOList?.map((item) => item.masterUserName)?.filter(Boolean);
            return <span>{String(responeseUsers)}</span>;
          }
        }
      },
      {
        label: "交付物",
        prop: "deliverable",
        cellRenderer(data) {
          if (data.row.groupId) {
            const deliverableNames = data.row.projectTaskDeliverableVOList?.map((item) => item.deliverableName)?.filter(Boolean);
            return <span>{String(deliverableNames)}</span>;
          }
        }
      },
      {
        label: "前置任务",
        prop: "beforeTask",
        cellRenderer(data) {
          if (data.row.groupId) {
            const beforeTaskList = data.row.projectTaskRequireVOList?.map((item) => item.requireProjectTaskName)?.filter(Boolean);
            return <span>{String(beforeTaskList)}</span>;
          }
        }
      },
      {
        label: "相关人",
        width: 90,
        prop: "relationUser",
        cellRenderer(data) {
          if (data.row.groupId) {
            const relationUsers = data.row.projectTaskRelatePersonnelVOList?.map((item) => item.masterUserName)?.filter(Boolean);
            return <span>{String(relationUsers)}</span>;
          }
        }
      }
    ];

    columns.value = setColumn({ columnData: columnsData, operationColumn: false });
  };

  onMounted(() => {
    getConfig();
  });

  const getProjectTaskTree = (arr) => {
    const taskList = arr.map((item) => {
      item.projectGroup = {
        duration: item.projectGroup.duration,
        taskVOList: item.taskVOList.sort((a, b) => {
          return a.sort - b.sort;
        }),
        name: item.projectGroup.groupName,
        id: item.projectGroup.id
      };
      return item.projectGroup;
    });

    return taskList;
  };

  const setDataList = (list: any[]) => {
    dataList.value = getProjectTaskTree(list);
  };

  const groupAction = (type, row?) => {
    const formRef = ref();
    const title = { add: "新增", edit: "修改" };
    const _formData = reactive({ groupName: row?.name, id: row?.id });
    addDialog({
      title: `${title[type]}`,
      props: {
        formInline: _formData,
        formRules: groupFormRules,
        formConfigs: groupFormConfgs(),
        formProps: { size: "small" }
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "保存",
      cancelButtonText: "取消",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done) => {
        const FormRef = formRef.value.getRef();

        FormRef.validate(async (valid) => {
          if (valid) {
            console.log(_formData, "save group data..");
            dataList.value.push({ id: row?.id ?? uuidv4(), name: _formData.groupName, taskVOList: [] });
            done();
          }
        });
      }
    });
  };

  const taskAction = (type, row?) => {
    const formRef = ref();
    const taskOpts = ref([]);
    const title = { add: "新增", edit: "修改" };
    const roleList = ref([]);
    const userList = ref([]);
    const relationUserData = ref([]);
    const relationUserList = ref([]);
    const beforeTaskRef = ref();
    const _formData: any = reactive({
      name: row?.name,
      id: row?.id,
      duration: row?.duration,
      taskDeptId: row?.projectTaskResponsiblePersonnelVOList[0]?.roleId,
      taskUser: row?.projectTaskResponsiblePersonnelVOList[0]?.userId,
      relationUser: row?.projectTaskRelatePersonnelVOList?.map((item) => item.userId),
      deliverable: row?.projectTaskDeliverableVOList?.map((item) => ({ name: item.deliverableName, deliverableId: +item.deliverableTemplateId })),
      beforeTask: row?.projectTaskRequireVOList?.map((item) => ({
        beforeTaskId: item.requireProjectTaskId,
        requireMode: item.requireMode + "",
        delayDays: item.delayDays
      }))
    });

    fetchTaskStoreList({ page: 1, limit: 100000 }).then((res: any) => {
      if (res.data) {
        const resultData = res.data.records?.map((item) => ({ optionName: item.taskName, optionValue: item.id }));
        const tableTaskNames = dataList.value
          .map((item) => item.taskVOList)
          .flat(Infinity)
          .map((item) => item.name);
        taskOpts.value = resultData.map((item) => {
          if (tableTaskNames.includes(item.optionName)) item.disabled = true;
          return item;
        });
      }
    });

    getInductionAuditRoleInfo({}).then((res) => {
      if (res.data) {
        roleList.value = res.data.map((item) => ({ label: item.roleName, value: item.id }));
      }
    });

    const changeTaskDeptId = (val, sign?) => {
      roleUserList({ roleId: val }).then((res) => {
        if (res.data && res.data.length) {
          userList.value = res.data.map(({ userId, userName }) => ({ label: userName, value: userId }));

          if (!sign) {
            _formData.taskUser = userList.value[0]?.value;
          }
        } else {
          _formData.taskUser = row?.projectTaskResponsiblePersonnelVOList[0]?.userId;
        }
      });
    };

    if (_formData.taskDeptId) changeTaskDeptId(_formData.taskDeptId, true);

    const uniqueFunc = (arr, uniId) => {
      const res = new Map();
      return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
    };

    fetchPersonNameProjectPartData({}).then((res1: any) => {
      if (res1.data) {
        fetchPersonRoleProjectPartData({}).then((res: any) => {
          if (res.data) {
            res.data.forEach((item) => {
              const selectData = res1.data.filter((el) => el.roleId === item.id);
              selectData.forEach((el) => {
                relationUserData.value.push({
                  label: el.userName,
                  key: el.userId,
                  roleId: el.roleId
                });
              });
            });
            relationUserList.value = uniqueFunc(relationUserData.value, "label");
          }
        });
      }
    });

    addDialog({
      title: `${title[type]}`,
      props: {
        formInline: _formData,
        formRules: taskFormRules,
        formProps: { size: "small" },
        formConfigs: taskFormConfgs({
          taskOpts,
          roleList,
          changeTaskDeptId,
          userList,
          relationUserList,
          topFormData: props.formTopData,
          beforeTaskRef
        })
      },
      width: "1100px",
      class: "project-change-task-modal",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "保存",
      cancelButtonText: "取消",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done) => {
        const FormRef = formRef.value.getRef();

        FormRef.validate(async (valid) => {
          if (valid) {
            // 继续判断延迟天数是否合法
            const filterRequireListNeedValid = _formData.beforeTask.filter((el) => el.requireMode != 1 && el.beforeTaskId);
            if (filterRequireListNeedValid.length) {
              const validResult = filterRequireListNeedValid.every((item) => /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(item.delayDays + ""));

              if (!validResult) {
                message("开始时间、结束时间的模式下，延迟天数必须录入大于0的数字。", { type: "error" });
                return;
              }
            }

            if (!_formData.deliverable?.length) return message("还未添加交付物", { type: "error" });

            const nameMsg = _formData.deliverable.some((item) => !item.name);
            if (nameMsg) return message("请填写交付物名称", { type: "error" });

            const deliverableMsg = _formData.deliverable.some((item) => !item.deliverableId);
            if (deliverableMsg) return message("请选择交付物模版", { type: "error" });

            const findGroupInfo = props.taskTreeData.value.find((item) => item.projectGroup?.id === currentRow.value.groupId);
            console.log(findGroupInfo, "findGroupInfo=>>>>>>>>>>>");
            const headUserInfo = userList.value.find((item) => item.value == _formData.taskUser) || {};
            const findBeforeTaskName = (beforeTaskItem) =>
              beforeTaskRef.value.beforeTaskList.find((item) => item.optionValue == beforeTaskItem.beforeTaskId)?.optionName;
            // 构造插入对应分组下的子数据
            const insertTreeChildData = {
              id: type === "edit" ? row?.id : uuidv4(),
              groupId: currentRow.value.groupId,
              name: taskOpts.value.find((item) => item.optionValue == _formData.name)?.optionName,
              duration: _formData.duration,
              sort: findGroupInfo?.taskVOList?.length + 1,
              projectTaskRequireVOList: _formData.beforeTask.map((item) => ({
                requireProjectTaskId: item.beforeTaskId,
                requireMode: item.requireMode,
                delayDays: item.delayDays,
                requireProjectTaskName: findBeforeTaskName(item)
              })),
              projectTaskDeliverableVOList: _formData.deliverable.map((item) => ({ deliverableName: item.name, deliverableTemplateId: item.deliverableId })),
              projectTaskResponsiblePersonnelVOList: [{ roleId: _formData.taskDeptId, userId: headUserInfo.value, masterUserName: headUserInfo.label }],
              projectTaskRelatePersonnelVOList: _formData.relationUser.map((item) => ({
                roleId: relationUserList.value.find((el) => el.key == item)?.roleId,
                userId: item,
                masterUserName: relationUserList.value.find((el) => el.key == item)?.label
              }))
            };
            console.log(insertTreeChildData, "insertTreeChildData=====");
            console.log(dataList.value, "dataList=>>>>>>>>>>>>>>>>>>>");
            console.log(beforeTaskRef.value.beforeTaskList, "beforeTaskRef=======");
            const findIdx = dataList.value.findIndex((item) => item.id == currentRow.value.groupId);
            if (findIdx >= 0) {
              dataList.value[findIdx].taskVOList.push(insertTreeChildData);
            }
            done();
          }
        });
      }
    });
  };

  const onAdd = () => {
    // if (!currentRow.value) return message("请选择分组或者任务", { type: "warning" });
    if (!currentRow.value) return message("请选择任务", { type: "warning" });
    if (currentRow.value.groupId) {
      taskAction("add");
    } else {
      // groupAction("add");
    }
  };

  const onEdit = () => {
    // if (!currentRow.value) return message("请选择分组或者任务", { type: "warning" });
    if (!currentRow.value) return message("请选择任务", { type: "warning" });
    if (currentRow.value.groupId) {
      taskAction("edit", currentRow.value);
    } else {
      // groupAction("edit", currentRow.value);
    }
  };

  const onDelete = () => {
    if (!currentRow.value) return message("请选择任务", { type: "warning" });

    if (currentRow.value.groupId) {
      const { groupId, id } = currentRow.value;
      const findGroupIndex = dataList.value.findIndex((item) => item.id === groupId);
      const findTaskIndex = dataList.value[findGroupIndex]?.taskVOList?.findIndex((item) => item.id === id);
      dataList.value[findGroupIndex].taskVOList.splice(findTaskIndex, 1);
    } else {
      // groupAction("edit", currentRow.value);
    }
  };

  const rowClick = (row) => {
    currentRow.value = row;
  };

  const buttonList2 = ref<ButtonItemType[]>([
    { clickHandler: onAdd, type: "primary", text: "新增" },
    { clickHandler: onEdit, type: "warning", text: "修改" },
    { clickHandler: onDelete, type: "danger", text: "删除" }
  ]);

  return { maxHeight, dataList, columns, buttonList2, setDataList, rowClick };
};
