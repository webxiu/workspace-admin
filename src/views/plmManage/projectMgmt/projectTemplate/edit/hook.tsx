import { ElMessage, ElMessageBox, FormRules } from "element-plus";
import {
  delProjectGroupTemplate,
  delProjectTaskInfo,
  fetchAllTemplateList,
  fetchProjectBeforeTaskOptionList,
  fetchProjectGroupList,
  fetchProjectGroupTaskList,
  saveProjectGroupListIndex,
  saveProjectGroupTaskList,
  saveProjectGroupTaskListIndex,
  saveProjectGroupTemplate
} from "@/api/plmManage";
import { formConfigsEdit, formRulesEdit } from "./config";
import { h, onMounted, reactive, ref } from "vue";
import { moveTableRow, setColumn } from "@/utils/table";
import { onBeforeRouteLeave, useRoute } from "vue-router";

import BindTemplateModal from "./components/bindTemplateModal.vue";
import EditForm from "@/components/EditForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import { getInductionAuditRoleInfo } from "@/api/oaManage/humanResources";
import { message } from "@/utils/message";

export const useEditPage = (formData) => {
  const columnsLeft: TableColumnList[] = [
    { label: "分组名称", prop: "groupName", minWidth: 60, headerAlign: "center" },
    { label: "参考工期(天)", prop: "duration", width: 100, align: "right", headerAlign: "center" }
  ];

  const columnsRight: TableColumnList[] = [
    { label: "任务名称", prop: "taskName", minWidth: 180 },
    { label: "工期(天)", prop: "duration", width: 80, align: "right", headerAlign: "center" },
    {
      label: "负责岗位",
      prop: "projectModelResponsibleRolesList",
      minWidth: 140,
      align: "left",
      headerAlign: "center",
      cellRenderer(data) {
        return <span>{String(data.row.projectModelResponsibleRolesList?.map((item) => item.roleName) || "")}</span>;
      }
    },
    {
      label: "交付物",
      prop: "duration",
      minWidth: 180,
      align: "left",
      headerAlign: "center",
      cellRenderer(data) {
        return <span>{String(data.row.projectModelDeliverablesList?.map((item) => item.name) || "")}</span>;
      }
    },
    {
      label: "前置任务",
      prop: "projectModelTaskRequireList",
      minWidth: 180,
      align: "left",
      headerAlign: "center",
      cellRenderer(data) {
        return <span>{String(data.row.projectModelTaskRequireList?.map((item) => item.taskName) || "")}</span>;
      }
    },
    {
      label: "相关岗位",
      prop: "duration",
      minWidth: 180,
      align: "left",
      headerAlign: "center",
      cellRenderer(data) {
        return <span>{String(data.row.projectModelRelateRoleList?.map((item) => item.roleName) || "")}</span>;
      }
    }
  ];

  const formRules = reactive<FormRules>({
    groupName: [{ required: true, message: "分组名称为必填项", trigger: "change" }]
  });

  const route = useRoute();

  const dataListLeft: any = ref([]);
  const dataListRight: any = ref([]);
  const dataRightInitList: any = ref([]);
  const loadingLeft = ref(false);
  const loadingRight = ref(false);
  const currentLeftRow: any = ref({});
  const formLoadingEdit = ref(false);
  const allDeliverTemplates: any = ref([]);
  const roleList = ref([]);
  const beforeTaskList = ref([]);
  const currentRightRow: any = ref({});
  const durationDays = ref(0);
  const allTaskList = ref([]);

  const formConfigs = () => {
    const configs = [
      {
        label: "分组名称",
        labelWidth: 80,
        prop: "groupName",
        render: ({ formModel, row }) => {
          return <el-input v-model={formModel[row.prop]} placeholder="请输入分组名称" />;
        }
      }
    ];

    return configs;
  };

  const onAddGroup = () => {
    openDialog("add");
  };

  const fetchBeforeTaskList = () => {
    fetchProjectBeforeTaskOptionList({ id: route.query.id }).then((res: any) => {
      if (res.data) {
        beforeTaskList.value = res.data.map((item) => ({ optionName: item.taskModelName, optionValue: item.id }));
        allTaskList.value = res.data;
        console.log(
          res.data.map((item) => item.id),
          "前置的任务"
        );
      }
    });
  };

  const onEdit = (row) => {
    openDialog("edit", row);
  };

  const onDelete = ({ row }) => {
    ElMessageBox.confirm(`确认要删除名称为【${row.groupName}】的分组吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loadingLeft.value = true;
        delProjectGroupTemplate([row.id]).then((res) => {
          if (res.data) {
            ElMessage({ message: `删除成功`, type: "success" });
            fetchGroups();
          }
        });
      })
      .catch(() => {})
      .finally(() => (loadingLeft.value = false));
  };

  const delRight = ({ row }) => {
    const sameFlag = checkAndSort();
    if (sameFlag) {
      ElMessageBox.confirm(`确认要删除名称为【${row.taskName}】的任务吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          loadingRight.value = true;
          delProjectTaskInfo({ taskId: row.id }).then((res) => {
            if (res.data) {
              ElMessage({ message: `删除成功`, type: "success" });
              fetchGroups();
              leftRowClick(currentLeftRow.value);
            }
          });
        })
        .catch(() => {})
        .finally(() => (loadingRight.value = false));
    }
  };

  const fetchRoleList = () => {
    formLoadingEdit.value = true;
    getInductionAuditRoleInfo({ deptIds: "6,24" })
      .then((res) => {
        if (res.data) {
          roleList.value = res.data;
        }
      })
      .finally(() => (formLoadingEdit.value = false));
  };

  onMounted(() => {
    fetchGroups();
    fetchRoleList();
    fetchDeliverTemplate();
  });

  const fetchDeliverTemplate = () => {
    fetchAllTemplateList({}).then((res: any) => {
      if (res.data) {
        const resultData = res.data || [];
        allDeliverTemplates.value = resultData.map((item) => ({ optionName: item.name, optionValue: item.id }));
      }
    });
  };

  const fetchGroups = () => {
    loadingLeft.value = true;
    fetchProjectGroupList({ id: route.query.id })
      .then((res: any) => {
        if (res.data) {
          dataListLeft.value = res.data.map((item, idx) => ({ ...item, curIndex: idx, sort: item.sort + 1 }));
          durationDays.value = res.data.map((item) => item.duration).reduce((pre, next) => pre + next, 0);
        }
      })
      .finally(() => (loadingLeft.value = false));
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增", edit: "修改", view: "查看" };
    const title = titleObj[type];
    const formRef = ref();

    const _formData = reactive({
      groupName: row?.groupName ?? "",
      id: row?.id ?? ""
    });

    addDialog({
      title: `${title}分组`,
      props: {
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs()
      },
      width: "400px",
      draggable: true,
      fullscreenIcon: true,
      hideFooter: type === "view",
      closeOnClickModal: false,
      okButtonText: "保存",
      cancelButtonText: "关闭",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();

        FormRef.validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要${title}吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                fetchGroups();
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    saveProjectGroupTemplate({ ...data, projectModelId: route.query.id }).then((res) => {
      if (res.data) {
        ElMessage({ message: "保存成功", type: "success" });
        callback();
      }
    });
  };

  const leftRowClick = (row) => {
    loadingRight.value = true;
    currentLeftRow.value = row;
    fetchProjectGroupTaskList({ groupId: row.id })
      .then((res: any) => {
        if (res.data) {
          dataRightInitList.value = res.data.map((item, idx) => ({ ...item, curIndex: idx + 1, sort: idx + 1 }));
          dataListRight.value = res.data.map((item, idx) => ({ ...item, curIndex: idx + 1, sort: idx + 1 }));
        }
      })
      .finally(() => (loadingRight.value = false));
  };

  const rightRowClick = (row) => {
    currentRightRow.value = row;
  };

  const saveTask = (rows, callBack) => {
    ElMessageBox.confirm("确认进行保存?", "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        // 组装请求参数
        const reqParams = [];

        rows.map((item, idx) => {
          reqParams.push({
            groupId: currentLeftRow.value.id,
            projectModelTask: {
              unitId: formData.value?.unitId,
              duration: item.duration,
              taskModelName: item.taskName,
              taskModelCode: item.taskCode,
              taskModelId: item.id,
              groupId: currentLeftRow.value.id ?? "",
              projectModelId: route.query.id,
              keyTask: item.keyTask
            },
            projectModelTaskRequireList: item.projectModelTaskRequirelist?.map((el) => ({ requireProjectModelTaskId: el, projectModelTaskId: item.id })) || [],
            projectModelRelateRoleList: item.taskRelateRoleList.map((item) => {
              item.id = undefined;
              return item;
            }),
            projectModelDeliverablesList: item.taskModelDeliverablesList.map((item) => {
              item.id = undefined;
              item.deliverableTemplateId = item.deliverableId;
              return item;
            }),
            projectModelResponsibleRolesList: item.taskModelResponsibleRolesList.map((item) => {
              item.id = undefined;
              return item;
            })
          });
        });
        console.log(reqParams, "reqParams add task");
        saveProjectGroupTaskList(reqParams).then((res) => {
          if (res.data) {
            callBack();
          }
        });
      })
      .catch(() => {});
  };

  const onAddTask = () => {
    if (JSON.stringify(currentLeftRow.value) === "{}") {
      ElMessage({ message: "请先选择分组", type: "warning" });
      return;
    }

    let selectRows: any = [];
    const bindModalRef = ref();

    const selectRowsCallBack = (v) => {
      selectRows = v;
    };

    addDialog({
      title: `绑定任务模板`,
      props: {
        selectRowsCallBack,
        dataListRight
      },
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "保存",
      cancelButtonText: "关闭",
      contentRenderer: () => h(BindTemplateModal, { ref: bindModalRef }),
      beforeSure: (done, { options }) => {
        const modalRefRows = bindModalRef.value?.modalSelectedRows || [];
        if (modalRefRows.length) {
          saveTask(modalRefRows, () => {
            done();
            ElMessage({ message: "保存成功", type: "success" });
            fetchGroups();
            // 搜索右侧列表
            leftRowClick(currentLeftRow.value);
          });
        } else {
          ElMessage({ message: "请选择至少一条记录", type: "warning" });
        }
      }
    });
  };

  const editRight = ({ row }) => {
    const sameFlag = checkAndSort();
    if (sameFlag) {
      fetchBeforeTaskList();
      currentRightRow.value = row;
      openDialogEdit("edit", row);
    }
  };

  const openDialogEdit = async (type: string, row?) => {
    const titleObj = { edit: "编辑任务" };
    const title = titleObj[type];
    const formRef = ref();
    const modelRelationRef = ref();
    const modelBeforeTaskRef = ref();

    const _formData = reactive({
      taskName: row?.taskName ?? "",
      id: row?.id ?? "",
      duration: row?.duration ?? "",
      assignsTemplateVOS: row?.projectModelResponsibleRolesList[0]?.roleId || [],
      taskRelateSelectKeys: row?.projectModelRelateRoleList.map((item) => item.roleId) || [],
      deliverablesTemplateVOS: row?.projectModelDeliverablesList?.map((item) => ({ ...item, deliverableId: +item.deliverableId })) ?? [],
      projectModelTaskRequireList:
        row?.projectModelTaskRequireList.map((item) => ({
          beforeTaskId: item.requireProjectModelTaskId,
          requireMode: item.requireMode + "",
          delayDays: item.delayDays
        })) || []
    });

    getInductionAuditRoleInfo({ deptIds: "6,24" })
      .then((res) => {
        if (res.data) {
          roleList.value = res.data;
          setTimeout(() => {
            modelRelationRef.value.dataList = res.data.map((item) => ({ label: item.roleName, key: item.id }));
            modelRelationRef.value.setSelectedPos(row?.projectModelRelateRoleList.map((item) => item.roleId) || []);
          });
        }
      })
      .finally(() => (formLoadingEdit.value = false));

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoadingEdit,
        formInline: _formData,
        formRules: formRulesEdit,
        formConfigs: formConfigsEdit({ roleList, _formData, allDeliverTemplates, modelRelationRef, modelBeforeTaskRef, beforeTaskList })
      },
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      hideFooter: type === "view",
      closeOnClickModal: false,
      okButtonText: "保存",
      cancelButtonText: "关闭",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();

        FormRef.validate(async (valid) => {
          if (valid) {
            // 继续判断延迟天数是否合法
            const filterRequireListNeedValid = _formData.projectModelTaskRequireList.filter((el) => el.requireMode != 1 && el.beforeTaskId);
            if (filterRequireListNeedValid.length) {
              const validResult = filterRequireListNeedValid.every((item) => /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(item.delayDays + ""));

              if (!validResult) {
                ElMessage({ message: "开始时间、结束时间的模式下，延迟天数必须录入大于0的数字。", type: "error" });
                return;
              }
            }

            if (!_formData.deliverablesTemplateVOS?.length) return message("还未添加交付物", { type: "error" });

            const nameMsg = _formData.deliverablesTemplateVOS.some((item) => !item.name);
            if (nameMsg) return message("请填写交付物名称", { type: "error" });

            const deliverableMsg = _formData.deliverablesTemplateVOS.some((item) => !item.deliverableId);
            if (deliverableMsg) return message("请选择交付物模版", { type: "error" });
            ElMessageBox.confirm(`确认要${title}吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitChangeEdit(type, title, _formData, () => {
                done();
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChangeEdit = (type: string, title: string, data, callback) => {
    const getTaskRowId = (item) => {
      const findInfo = currentRightRow.value.projectModelTaskRequireList.find((el) => item.beforeTaskId === el.requireProjectModelTaskId);
      return findInfo?.id;
    };

    const findTaskModelId = (taskName) => {
      return allTaskList.value.find((item) => item.taskModelName === taskName)?.taskModelId;
    };
    const reqParams = [
      {
        projectModelTask: {
          unitId: 0,
          id: data.id,
          duration: data.duration,
          taskModelName: data.taskName,
          taskModelCode: currentRightRow.value.taskCode,
          taskModelId: findTaskModelId(data.taskName),
          groupId: currentRightRow.value.groupId ?? "",
          projectModelId: route.query.id
        },
        projectModelTaskRequireList:
          data.projectModelTaskRequireList
            ?.map((item) => {
              return {
                id: getTaskRowId(item),
                requireProjectModelTaskId: item.beforeTaskId,
                delayDays: item.delayDays,
                requireMode: item.requireMode,
                projectModelTaskId: currentRightRow.value.id
              };
            })
            .filter((el) => el.requireProjectModelTaskId) || [],
        projectModelRelateRoleList: data.taskRelateRoleList?.map((item) => {
          return { roleId: item.key, projectModelTaskId: currentRightRow.value.id };
        }),
        projectModelDeliverablesList: data.deliverablesTemplateVOS.map((item) => {
          return {
            name: item.name,
            projectModelTaskId: currentRightRow.value.id,
            deliverableTemplateId: item.deliverableId,
            deliverableId: item.deliverableId
          };
        }),
        projectModelResponsibleRolesList: [data.assignsTemplateVOS].map((item) => {
          return { roleId: item, projectModelTaskId: currentRightRow.value.id };
        })
      }
    ];
    console.log(reqParams, "reqParams====");
    // return;

    saveProjectGroupTaskList(reqParams).then((res) => {
      if (res.data) {
        ElMessage({ message: "保存成功", type: "success" });
        callback();
        fetchGroups();
        // 搜索右侧列表
        leftRowClick(currentLeftRow.value);
      }
    });
  };

  // 行上下移动
  const onRowMove = (type) => {
    if (JSON.stringify(currentRightRow.value) == "{}") {
      ElMessage({ message: "请选择任务记录", type: "warning" });
      return;
    }
    moveTableRow(dataListRight, currentRightRow.value, "sort", type, ({ newArr }) => {
      dataListRight.value = newArr;
    });
    return;
  };

  const onMoveUp = () => {
    onRowMove("up");
  };

  const onMoveDown = () => {
    onRowMove("down");
  };

  // 行上下移动
  const onGroupRowMove = (type) => {
    if (JSON.stringify(currentLeftRow.value) == "{}") {
      ElMessage({ message: "请选择分组记录", type: "warning" });
      return;
    }
    moveTableRow(dataListLeft, currentLeftRow.value, "sort", type, ({ newArr }) => {
      dataListLeft.value = newArr;
    });
    return;
  };

  const onMoveGroupUp = () => {
    onGroupRowMove("up");
  };

  const onMoveGroupDown = () => {
    onGroupRowMove("down");
  };

  const onSaveSort = (fn?) => {
    const sortAfterList = dataListRight.value.map((item, index) => ({ id: item.id, sort: index + 1 }));
    saveProjectGroupTaskListIndex(sortAfterList).then((res) => {
      if (res.data) {
        ElMessage({ message: "保存成功", type: "success" });

        if (typeof fn === "function") fn();
      }
    });
  };

  const onSaveGroupSort = () => {
    const sortAfterGroupList = dataListLeft.value.map((item, idx) => ({ id: item.id, sort: idx }));
    saveProjectGroupListIndex(sortAfterGroupList).then((res) => {
      if (res.data) {
        ElMessage({ message: "保存成功", type: "success" });
      }
    });
  };

  const checkAndSort = () => {
    const dataRightListNames = String(dataListRight.value.map((item) => item.taskName));
    const dataRightInitListNames = String(dataRightInitList.value.map((item) => item.taskName));
    const isSameRightList = dataRightListNames === dataRightInitListNames;

    if (!isSameRightList) {
      ElMessageBox.confirm(`检测到当前任务排序未保存，是否先进行保存?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "不保存",
        confirmButtonText: "保存",
        dangerouslyUseHTMLString: true,
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            await onSaveSort(() => {
              leftRowClick(currentLeftRow.value);
              done();
            });
          } else {
            done();
          }
        }
      })
        .then(() => {
          ElMessageBox.close();
        })
        .catch(() => {
          ElMessageBox.close();
        });
    }
    return isSameRightList;
  };

  onBeforeRouteLeave((to, from, next) => {
    const dataRightListNames = String(dataListRight.value.map((item) => item.taskName));
    const dataRightInitListNames = String(dataRightInitList.value.map((item) => item.taskName));
    const isSameRightList = dataRightListNames === dataRightInitListNames;

    console.log(dataRightInitListNames, "init");
    console.log(dataRightListNames, "new");
    console.log(isSameRightList, "是否一样");
    if (!isSameRightList && from.path !== to.path) {
      ElMessageBox.confirm(`检测到当前任务排序未保存，是否先进行保存?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "不保存",
        confirmButtonText: "保存",
        dangerouslyUseHTMLString: true,
        beforeClose: async (action, instance, done) => {
          if (action === "confirm") {
            await onSaveSort(() => {
              leftRowClick(currentLeftRow.value);
              done();
            });
          } else {
            done();
          }
        }
      })
        .then(() => {
          ElMessageBox.close();
          next();
        })
        .catch(() => {
          ElMessageBox.close();
          next();
        });
    } else {
      next();
    }
  });

  return {
    fetchGroups,
    formRules,
    formConfigs,
    onAddGroup,
    currentLeftRow,
    currentRightRow,
    dataListLeft,
    loadingLeft,
    onMoveUp,
    onMoveGroupUp,
    onMoveGroupDown,
    onMoveDown,
    onSaveSort,
    onSaveGroupSort,
    loadingRight,
    dataListRight,
    columnsLeft: setColumn({ columnData: columnsLeft, operationColumn: { align: "left", headerAlign: "left", width: 140 } }),
    onAddTask,
    columnsRight: setColumn({ columnData: columnsRight, operationColumn: { align: "left", headerAlign: "left", minWidth: 140 } }),
    leftRowClick,
    rightRowClick,
    onDelete,
    delRight,
    onEdit,
    durationDays,
    editRight
  };
};
