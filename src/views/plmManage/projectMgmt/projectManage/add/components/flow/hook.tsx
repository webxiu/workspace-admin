import { ElMessage, ElMessageBox } from "element-plus";
import {
  backProjectTaskDeliverableInfo,
  deleteProjectTask,
  deleteProjectTaskGroup,
  fetchAllTemplateList,
  fetchEditProjectBeforeTaskOptionList,
  fetchPersonNameProjectPartData,
  fetchPersonRoleProjectPartData,
  fetchProjectTaskDelivers,
  fetchTaskStoreList,
  insertProjectTask,
  revokeProjectTaskDeliverableInfo,
  saveProjectTaskDeliverableInfo,
  saveProjectTaskGroup,
  sortProjectTask,
  submitProjectTaskDeliverableInfo,
  updateProjectTask,
  updateProjectTaskDeliverableInfo
} from "@/api/plmManage";
import { formConfigs, formDeliverConfigs, formDeliverConfigs2, formDeliverRules, formDeliverRules2, formRules } from "./config";
import { h, reactive, ref } from "vue";

import DeliverModelList from "./deliverList.vue";
import EditForm from "@/components/EditForm/index.vue";
import NodeDetailList from "@/components/NodeDetailList/index.vue";
import { addDialog } from "@/components/ReDialog";
import { commonDeliverChangeAction } from "@/views/plmManage/projectMgmt/deliveryChange/utils/hook";
import dayjs from "dayjs";
import { gantt } from "dhtmlx-gantt";
import { getInductionAuditRoleInfo } from "@/api/oaManage/humanResources";
import { message } from "@/utils/message";
import { setColumn } from "@/utils/table";
import { useRoute } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";
import HandleMakeSheet from "./handleMakeSheet/index.vue";
import DesignInputSheet from "./designInputSheet/index.vue";

export const useFlow = (props) => {
  const currentTreeRow: any = ref({});
  const currentTemplateId = ref("");
  const dataList = ref([]);
  const deliverList: any = ref([]);
  const statusOpts = ref([]);
  const route = useRoute();
  const namePartOpts = ref([]);
  const billStateOpts = ref([]);
  const deliverLoading = ref(false);
  const curActiveId = ref("");
  const curMaxSort = ref(0);
  const maxGroupIndex = ref(0);
  const columns = ref([]);
  const flowTableRef = ref();
  const selectDelRows = ref([]);

  const stateColor = {
    STATUS_WAITING: "#ffbf00",
    STATUS_ACTIVE: "#00CD66",
    STATUS_DONE: "#1E90FF"
  };

  const clickCellText = (e, row) => {
    if (!row.taskVOList) {
      curActiveId.value = row.id;
      flowTableRef.value.getTableRef().setCurrentRow(row);
      rowView(row);
    }
  };

  const columnData: TableColumnList[] = [
    {
      label: "任务名称",
      prop: "name",
      minWidth: 240,
      cellRenderer(data) {
        return (
          <div style={{ display: "inline-flex", alignItems: "baseline", cursor: "pointer" }}>
            {data.row.groupId && (
              <div style={{ background: stateColor[data.row.status], width: "11px", borderRadius: "100%", lineHeight: "100%", height: "11px" }}></div>
            )}
            <div onClick={(e) => clickCellText(e, data.row)} style={{ color: data.row.groupId && data.row.expireFlag ? "red" : "", marginLeft: "5px" }}>
              {data.row.name}
            </div>
          </div>
        );
      }
    },
    { label: "工期", prop: "duration", align: "right", width: 50 },
    {
      label: "开始日期",
      prop: "start",
      minWidth: 100,
      cellRenderer(data) {
        return data.row.start ? <span>{dayjs(data.row.start).format("YYYY-MM-DD")}</span> : null;
      }
    },
    {
      label: "结束日期",
      prop: "end",
      minWidth: 100,
      cellRenderer(data) {
        return data.row.end ? <span>{dayjs(data.row.end).format("YYYY-MM-DD")}</span> : null;
      }
    },
    {
      label: "实际开始日期",
      prop: "realStart",
      minWidth: 120,
      cellRenderer(data) {
        return data.row.realStart ? <span>{dayjs(data.row.realStart).format("YYYY-MM-DD")}</span> : null;
      }
    },
    {
      label: "实际结束日期",
      prop: "realEnd",
      minWidth: 120,
      cellRenderer(data) {
        return data.row.realEnd ? <span>{dayjs(data.row.realEnd).format("YYYY-MM-DD")}</span> : null;
      }
    },
    { label: "状态", prop: "status", slot: "status", width: 60 },
    {
      label: "责任人",
      width: 65,
      prop: "projectTaskResponsiblePersonnelVOList",
      cellRenderer(data) {
        return data.row.projectTaskResponsiblePersonnelVOList ? data.row.projectTaskResponsiblePersonnelVOList[0]?.masterUserName : "";
      }
    },
    {
      label: "前置任务",
      minWidth: 140,
      prop: "projectTaskRequireVOList",
      cellRenderer(data) {
        return data.row.projectTaskRequireVOList ? <span>{String(data.row.projectTaskRequireVOList.map((item) => item.requireProjectTaskName))}</span> : null;
      }
    },
    {
      label: "相关人",
      minWidth: 100,
      prop: "projectTaskRelatePersonnelVOList",
      cellRenderer(data) {
        return (
          <span>
            {data.row.projectTaskRelatePersonnelVOList
              ? String(data.row.projectTaskRelatePersonnelVOList.filter((item) => item.masterUserName).map((item) => item.masterUserName))
              : ""}
          </span>
        );
      }
    },
    { label: "描述", prop: "description" },
    { label: "进度(%)", prop: "progress", minWidth: 80, align: "right" }
  ];

  columns.value = setColumn(
    {
      columnData,
      operationColumn: false,
      selectionColumn: {
        hide: false,
        selectable(row) {
          if (!row.groupId) {
            return false; //禁用状态
          } else {
            return true; //非禁用状态
          }
        }
      },
      dragSelector: ".pm-task-table",
      isDragRow: true
      // dataList
    },
    ({ sortable, oldIndex, newIndex, fromName, toName }) => {
      // console.log(oldIndex, newIndex);

      const flatTaskList = dataList.value.map((item) => item.taskVOList).flat(Infinity);
      console.log(
        flatTaskList.map((item) => item.sort),
        "任务排序前打印sort信息...."
      );
      const fromTaskName = fromName.replace(/[\n]/g, "").split("\t").filter(Boolean)[1];
      const toTaskName = toName.replace(/[\n]/g, "").split("\t").filter(Boolean)[1];
      const fromRow = flatTaskList.find((item) => item.name === fromTaskName);
      const toRow = flatTaskList.find((item) => item.name === toTaskName);

      console.log(fromRow, "起始行===");
      console.log(toRow, "结束行===");

      if (fromRow.groupId !== toRow.groupId) {
        message("不能跨分组进行移动", { type: "error" });
        setTimeout(() => {
          dataList.value = [];
          props.fetchDetailFormData();
        }, 500);
      } else {
        // 将起始行的任务id排序为结束行的sort值
        sortProjectTask({ id: fromRow.id, sort: toRow.sort }).then((res) => {
          if (res.status === 200 || res.data) {
            dataList.value = [];
            props.fetchDetailFormData();
          }
        });
      }
    }
  );

  const uniqueFunc = (arr, uniId) => {
    const res = new Map();
    return arr.filter((item) => !res.has(item[uniId]) && res.set(item[uniId], 1));
  };

  const openDialog = async (type: string, row?) => {
    const titleObj = { add: "新增任务", edit: "修改任务", view: "查看任务" };
    const title = titleObj[type];
    const formRef = ref();
    const formLoading = ref(true);
    const taskList = ref([]);
    const rolePartOpts = ref([]);
    const allDeliverTemplates = ref([]);
    const projectRelationRef = ref();
    const projectBeforeTaskRef = ref();
    //责任人
    const personResponsible: any = ref([]);
    const beforeTask: any = ref([]);
    const responseUserList = ref([]);

    const _formData = reactive({
      duration: row?.duration ?? 0,
      progress: row?.progress ?? 0,
      start: row?.start ?? "",
      end: row?.end ?? "",
      realStart: row?.realStart,
      realEnd: row?.realEnd,
      name: row?.name ?? "",
      number: row?.number ?? "",
      sort: type === "add" ? curMaxSort.value : undefined,
      id: row?.id ?? undefined,
      editResponsePos: row?.projectTaskResponsiblePersonnelVOList[0]?.roleId ?? null,
      status: row?.status ? row?.status : "STATUS_WAITING",
      description: row?.description ?? "",
      taskRequires:
        row?.projectTaskRequireVOList.map((item) => ({
          beforeTaskId: item.requireProjectTaskId,
          requireMode: item.requireMode,
          delayDays: item.delayDays
        })) || [],
      deliverablesTemplateVOS:
        row?.projectTaskDeliverableVOList?.map((item) => ({ name: item.deliverableName, deliverableTemplateId: +item.deliverableTemplateId })) ?? [],
      headUser: row && row?.projectTaskResponsiblePersonnelVOList[0]?.userId,
      taskRelateRoleList: row?.projectTaskRelatePersonnelVOList?.map((item) => item.userId) || []
    });

    fetchTaskStoreList({ page: 1, limit: 100000 })
      .then((res: any) => {
        if (res.data && res.data.records) {
          // 过滤分组下的同名任务
          const allTaskNames = dataList.value
            .map((item) => item.taskVOList)
            .flat(Infinity)
            .map((item) => item.name);
          taskList.value = res.data.records.map((item) => {
            if (allTaskNames.includes(item.taskName)) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
            return item;
          });
        }
      })
      .finally(() => (formLoading.value = false));

    fetchPersonNameProjectPartData({})
      .then((res: any) => {
        if (res.data) {
          namePartOpts.value = res.data;

          fetchPersonRoleProjectPartData({})
            .then((res: any) => {
              if (res.data) {
                rolePartOpts.value = res.data;

                rolePartOpts.value.forEach((item) => {
                  const selectData = namePartOpts.value.filter((el) => el.roleId === item.id);
                  selectData.forEach((el) => {
                    personResponsible.value.push({
                      label: el.userName,
                      key: el.userId,
                      roleId: el.roleId
                    });
                  });
                });
                projectRelationRef.value.dataList = uniqueFunc(personResponsible.value, "label");
                setTimeout(() => {
                  projectRelationRef.value?.checkRows(row ? row.projectTaskRelatePersonnelVOList.map((item) => item.userId) : {});
                  if (["edit", "view"].includes(type)) {
                    projectRelationRef.value.multipleSelect = row.projectTaskRelatePersonnelVOList.map((item) => item.userId);
                  }
                });
              }
            })
            .finally(() => (formLoading.value = false));
        }
      })
      .finally(() => (formLoading.value = false));

    fetchAllTemplateList({})
      .then((res: any) => {
        if (res.data) {
          const resultData = res.data || [];
          allDeliverTemplates.value = resultData.map((item) => ({ optionName: item.name, optionValue: item.id }));
        }
      })
      .finally(() => (formLoading.value = false));

    fetchEditProjectBeforeTaskOptionList({ projectId: route.query.id })
      .then((res: any) => {
        if (res.data) {
          beforeTask.value = res.data.map((item) => ({ optionName: item.name, optionValue: item.id }));
          setTimeout(() => {
            projectBeforeTaskRef.value.beforeTaskList = res.data.map((item) => ({ optionName: item.name, optionValue: item.id }));
            projectBeforeTaskRef.value.taskName = _formData.name;
          });
        }
      })
      .finally(() => (formLoading.value = false));

    getInductionAuditRoleInfo({})
      .then((res: any) => {
        if (res.data) {
          responseUserList.value = res.data.map((item) => ({ label: item.roleName, value: item.id }));
        }
      })
      .finally(() => (formLoading.value = false));
    if (type === "edit") {
      formRules.start = [{ required: true, message: "开始日期为必填项", trigger: "submit" }];
      formRules.end = [{ required: true, message: "结束日期为必填项", trigger: "submit" }];
    } else if (type === "add") {
      formRules.start = undefined;
      formRules.end = undefined;
    }

    addDialog({
      title: `${title}`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formRules,
        formConfigs: formConfigs({
          _formData,
          row,
          type,
          projectBeforeTaskRef,
          allDeliverTemplates,
          taskList,
          statusOpts,
          projectRelationRef,
          responseUserList,
          isReadOnly: row?.projectTaskDeliverableVOList?.some((item) => [1, 2].includes(item?.generalTemplateVO?.billState)) || type === "view"
        })
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
            const filterRequireListNeedValid = _formData.taskRequires.filter((el) => el.requireMode != 1 && el.beforeTaskId);
            if (filterRequireListNeedValid.length) {
              const validResult = filterRequireListNeedValid.every((item) => /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(item.delayDays + ""));

              if (!validResult) {
                ElMessage({ message: "开始时间、结束时间的模式下，延迟天数必须录入大于0的数字。", type: "error" });
                return;
              }
            }
            ElMessageBox.confirm(`确认要${title}吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              onSubmitChange(type, title, _formData, () => {
                done();
                gantt.clearAll();
                props.fetchDetailFormData(route.query.id, (list) => {
                  const row = list
                    .map((item) => item.taskVOList)
                    .flat(Infinity)
                    .find((item) => item.id === currentTreeRow.value.id);
                  if (row) clickRow(row);
                });
              });
            });
          }
        });
      }
    });
  };

  const onSubmitChange = (type: string, title: string, data, callback) => {
    if (data.start && data.end) {
      data.start = dayjs(data.start).format("YYYY-MM-DD");
      data.end = dayjs(data.end).format("YYYY-MM-DD");
    }

    if (data.realStart && data.realEnd) {
      data.realStart = dayjs(data.realStart).format("YYYY-MM-DD");
      data.realEnd = dayjs(data.realEnd).format("YYYY-MM-DD");
    }
    // 组装请求参数
    const reqParams: any = {
      projectTask: {
        groupId: currentTreeRow.value.groupId,
        name: data.name,
        progress: data.progress,
        status: data.status,
        projectId: route.query.id,
        duration: data.duration,
        number: data.number,
        sort: type === "add" ? data.sort : undefined,
        description: data.description,
        start: data.start ? (data.start + " " + route.query.time + ":00").substring(0, 19) : undefined,
        end: data.end ? (data.end + " " + route.query.time + ":00").substring(0, 19) : undefined,
        realStart: data.realStart ? (data.realStart + " " + route.query.time + ":00").substring(0, 19) : undefined,
        realEnd: data.realEnd ? (data.realEnd + " " + route.query.time + ":00").substring(0, 19) : undefined
      },
      taskDeliverables: data.deliverablesTemplateVOS.map((item) => ({
        deliverableId: item.deliverableTemplateId,
        deliverableName: item.name
      })),
      taskRelatePersonnels: data.taskRelateRoleList.map((item) => ({ userId: item.key, roleId: item.roleId })),
      taskRequires: data.taskRequires
        .map((item) => ({
          delayDays: item.delayDays,
          id: "",
          requireMode: item.requireMode,
          projectTaskId: currentTreeRow.value.groupId ? currentTreeRow.value.id : "",
          requireProjectTaskId: item.beforeTaskId
        }))
        .filter((item) => item.requireProjectTaskId),
      taskResponsiblePersonnels: [
        {
          roleId: data.editResponsePos,
          userId: data.headUser
        }
      ]
    };
    const APIs = { add: insertProjectTask, edit: updateProjectTask };

    if (type === "edit") reqParams.projectTask.id = data.id;
    // 校验交付物模版是否可用
    const hasZero = reqParams.taskDeliverables.some((item) => item.deliverableId == 0);
    if (hasZero) {
      const zeroDeliverNames = reqParams.taskDeliverables
        .filter((item) => item.deliverableId == 0)
        .map((item) => item.deliverableName)
        .filter(Boolean);
      if (zeroDeliverNames.length) {
        return message(`交付物【${String(zeroDeliverNames)}】的模版不能为空`, { type: "error" });
      }
    }
    console.log(reqParams, "reqParams=========");

    if (!reqParams.taskDeliverables?.length) return message("还未添加交付物", { type: "error" });

    const nameMsg = reqParams.taskDeliverables.some((item) => !item.deliverableName);
    if (nameMsg) return message("请填写交付物名称", { type: "error" });

    const deliverableMsg = reqParams.taskDeliverables.some((item) => !item.deliverableId);
    if (deliverableMsg) return message("请选择交付物模版", { type: "error" });

    APIs[type](reqParams).then((res) => {
      if (res.status === 200) {
        ElMessage({ message: "保存成功", type: "success" });
        callback();
      }
    });
  };

  const onSubmitGroupChange = (type: string, title: string, data, callback) => {
    data.projectId = route.query.id;
    data.sort = maxGroupIndex.value;
    saveProjectTaskGroup(data).then((res) => {
      if (res.data) {
        ElMessage({ message: "保存成功", type: "success" });
        callback();
      }
    });
  };

  const openDialogGroup = (type: string, row?) => {
    const formRef = ref();
    const _formData = {
      groupName: row?.name ?? "",
      id: row?.id ?? undefined
    };
    const title = type === "add" ? "新增分组" : "修改分组";
    addDialog({
      title: `${title}`,
      props: {
        formInline: _formData,
        formRules: {
          groupName: [{ required: true, message: "分组名称为必填项", trigger: "submit" }]
        },
        formConfigs: [
          {
            label: "分组名称",
            colProp: { span: 24 },
            labelWidth: 80,
            prop: "groupName",
            render: ({ formModel, row }) => {
              return <el-input style={{ width: "100%" }} v-model={formModel[row.prop]} placeholder="请输入分组名称" />;
            }
          }
        ]
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
              onSubmitGroupChange(type, title, _formData, () => {
                done();
                props.fetchDetailFormData();
              });
            });
          }
        });
      }
    });
  };

  const handleAdd = () => {
    if (!props.isCurrentProjectUser) {
      return message("只有当前项目负责人才能操作任务", { type: "warning" });
    }
    if (JSON.stringify(currentTreeRow.value) == "{}") return message("请选择新增分组还是任务", { type: "warning" });
    if (currentTreeRow.value?.taskVOList) {
      maxGroupIndex.value = props.detailPageInfo?.projectTaskGroupVoList.map((item) => item.projectGroup).length;
      // return;
      openDialogGroup("add");
    } else {
      const curGroupId = currentTreeRow.value.groupId;
      const groupMaxIndex = props.detailPageInfo?.projectTaskGroupVoList
        ?.find((item) => item?.projectGroup?.id === curGroupId)
        ?.taskVOList.map((el) => el?.sort)
        .sort((a, b) => a - b)
        .at(-1);

      if (typeof groupMaxIndex === "number" && groupMaxIndex >= 0) {
        curMaxSort.value = groupMaxIndex + 1;
      }

      openDialog("add");
    }
  };

  const clickRow = (row) => {
    console.log(row, "click row");
    currentTreeRow.value = row;
    curActiveId.value = row?.id;
    if (!Array.isArray(row?.taskVOList)) {
      deliverLoading.value = true;
      deliverList.value = row?.projectTaskDeliverableVOList;
      fetchProjectTaskDelivers({ taskId: row?.id })
        .then((res) => {
          if (res.data) {
            console.log(res.data, "交付物右侧的数据列表");
            deliverList.value = res.data;
          }
        })
        .finally(() => (deliverLoading.value = false));
    } else {
      deliverList.value = [];
    }
  };

  // 产品设计输入表
  const openInputSheet = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow) => {
    const inputSheetRef = ref();
    addDialog({
      title: `产品设计输入表`,
      width: "1500px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      props: {},
      contentRenderer: () => h(DesignInputSheet, { ref: inputSheetRef }),
      beforeSure: (done, { options }) => {
        const modalRef = inputSheetRef.value;
        modalRef.formRef.getRef().validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要保存吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            })
              .then(() => {
                console.log(modalRef.formData, "收集数据");
                message("接口未完善", { type: "warning" });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  // 手板清单制作模版
  const openHandleMake = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow) => {
    const handleRef = ref();
    addDialog({
      title: `手板制作申请单`,
      width: "1200px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      props: {},
      contentRenderer: () => h(HandleMakeSheet, { ref: handleRef }),
      beforeSure: (done, { options }) => {
        const modalRef = handleRef.value;
        modalRef.formRef.getRef().validate(async (valid) => {
          if (valid) {
            ElMessageBox.confirm(`确认要保存吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            })
              .then(() => {
                console.log(modalRef.formData, "收集数据");
                message("接口未完善", { type: "warning" });
              })
              .catch(console.log);
          }
        });
      }
    });
  };

  const onEditDeliver = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const formLoading = ref(false);
    const formRef = ref();
    const deleteFileIds = ref([]);

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能上传交付物", { type: "error" });
    }

    if (row.deliverableTemplateId == "10") {
      // 手板制作模版
      openHandleMake(row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow);
      return;
    }

    if (row.deliverableTemplateId == "2") {
      // 产品设计输入表
      openInputSheet(row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow);
      return;
    }

    const calcTaskName = fetchDetailFormData?.projectTaskGroupVoList
      ?.map((item) => item.taskVOList)
      .flat()
      .find((item) => item.id === row.projectTaskId);
    const _formData: any = reactive({
      projectName: fetchDetailFormData?.projectInfoListVO?.projectName ?? "",
      taskName: calcTaskName?.name ?? "",
      version: row?.generalTemplateVO?.version ?? "V0",
      title: row?.generalTemplateVO?.title ?? row?.deliverableName,
      remark: row?.generalTemplateVO?.remark ?? fetchDetailFormData.projectInfoListVO?.projectName + "-" + currentTreeRow.name + "-" + row?.deliverableName,
      billNo: row?.generalTemplateVO?.billNo,
      billState: billStateOpts.value.find((item) => item.optionValue == row?.generalTemplateVO?.billState)?.optionName,
      createUserName: row?.generalTemplateVO?.createUserName,
      createDate: row?.generalTemplateVO?.createDate ? dayjs(row?.generalTemplateVO?.createDate).format("YYYY-MM-DD HH:mm:ss") : undefined
    });

    if (row?.generalTemplateVO?.newGeneralTemplateEntryVOList?.every((el) => el.entryid)) {
      const validArr = row?.generalTemplateVO?.newGeneralTemplateEntryVOList.map((item) => ({ ...item, name: item.fileName, url: item.virtualFileUrl }));
      _formData.files = validArr;
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };
    // 如果是修改的情况，文件就不是必填项。传个null给后端
    addDialog({
      title: `${titleMap[actionType]}交付物【${row.deliverableName}】`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formDeliverRules,
        formConfigs: formDeliverConfigs([1, 2].includes(row?.generalTemplateVO?.billState), deleteFileIds)
      },
      width: "850px",
      draggable: true,
      fullscreenIcon: true,
      class: "deliverable-modal",
      closeOnClickModal: false,
      okButtonText: "保存",
      hideItem: [1, 2].includes(row?.generalTemplateVO?.billState) ? ["ok"] : [],
      cancelButtonText: "关闭",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();

        FormRef.validate(async (valid) => {
          if (valid) {
            // 判断是否可以保存
            if (currentTreeRow.status !== "STATUS_ACTIVE") {
              ElMessage({ message: "当前任务状态不是进行中，不允许保存", type: "error" });
              return;
            }
            ElMessageBox.confirm(`确认要保存吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              const fileList = _formData.files.map((item) => item.raw).filter(Boolean);

              // 组装请求参数
              const reqParams = {
                projectIntoId: route.query.id,
                remark: _formData.remark,
                taskDeliverableId: row.id,
                deliverableTemplateId: row.deliverableTemplateId,
                id: row.generalTemplateVO?.id, // 修改才会传id
                taskId: row.projectTaskId,
                title: _formData.title,
                version: _formData.version
              };

              console.log(reqParams, "reqParams");

              const formDataReq = new FormData();
              if (fileList.length) {
                fileList.forEach((item) => formDataReq.append("files", item));
              }
              Object.keys(reqParams).forEach((objKey) => formDataReq.append(objKey, reqParams[objKey]));
              if (deleteFileIds.value.length) {
                deleteFileIds.value.forEach((objKey) => formDataReq.append("deleteIds", objKey));
              }
              const apiType = { add: saveProjectTaskDeliverableInfo, edit: updateProjectTaskDeliverableInfo };
              apiType[actionType](formDataReq).then((res) => {
                if (res.data || res.status === 200) {
                  ElMessage({ message: "保存成功", type: "success" });
                  done();
                  clickRow(currentTreeRow);
                }
              });
            });
          }
        });
      }
    });
  };

  const onEditDeliver2 = (row, fetchDetailFormData, refresh, flowTableRef, currentTreeRow, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const actionType = row.generalTemplateVO?.id ? ([1, 2].includes(row.generalTemplateVO?.billState) ? "view" : "edit") : "add";

    const formLoading = ref(false);
    const formRef = ref();
    const deleteFileIds = ref([]);

    if (actionType !== "view") {
      const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
      if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能进行操作", { type: "error" });
    }

    const calcTaskName = fetchDetailFormData?.projectTaskGroupVoList
      ?.map((item) => item.taskVOList)
      .flat()
      .find((item) => item.id === row.projectTaskId);
    const _formData: any = reactive({
      projectName: fetchDetailFormData?.projectInfoListVO?.projectName ?? "",
      taskName: calcTaskName?.name ?? "",
      version: row?.generalTemplateVO?.version ?? "V0",
      title: row?.generalTemplateVO?.title ?? row?.deliverableName,
      remark: row?.generalTemplateVO?.remark ?? fetchDetailFormData.projectInfoListVO?.projectName + "-" + currentTreeRow.name + "-" + row?.deliverableName,
      billNo: row?.generalTemplateVO?.billNo,
      billState: billStateOpts.value.find((item) => item.optionValue == row?.generalTemplateVO?.billState)?.optionName,
      createUserName: row?.generalTemplateVO?.createUserName,
      createDate: row?.generalTemplateVO?.createDate ? dayjs(row?.generalTemplateVO?.createDate).format("YYYY-MM-DD HH:mm:ss") : undefined
    });

    if (row?.generalTemplateVO?.newGeneralTemplateEntryVOList?.every((el) => el.entryid)) {
      _formData.files = row?.generalTemplateVO?.newGeneralTemplateEntryVOList.map((item) => ({ ...item, name: item.fileName, url: item.virtualFileUrl }));
    }

    const titleMap = {
      add: "新增",
      edit: "修改",
      view: "查看"
    };

    // 如果是修改的情况，文件就不是必填项。传个null给后端
    addDialog({
      title: `${titleMap[actionType]}【${row.deliverableName}】`,
      props: {
        loading: formLoading,
        formInline: _formData,
        formRules: formDeliverRules2,
        formConfigs: formDeliverConfigs2([1, 2].includes(row?.generalTemplateVO?.billState), deleteFileIds)
      },
      width: "850px",
      draggable: true,
      fullscreenIcon: true,
      closeOnClickModal: false,
      okButtonText: "保存",
      hideItem: [1, 2].includes(row?.generalTemplateVO?.billState) ? ["ok"] : [],
      cancelButtonText: "关闭",
      contentRenderer: () => h(EditForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();

        FormRef.validate(async (valid) => {
          if (valid) {
            // 判断是否可以保存
            if (currentTreeRow.status !== "STATUS_ACTIVE") {
              ElMessage({ message: "当前任务状态不是进行中，不允许保存", type: "error" });
              return;
            }
            ElMessageBox.confirm(`确认要保存吗?`, "系统提示", {
              type: "warning",
              draggable: true,
              cancelButtonText: "取消",
              confirmButtonText: "确定",
              dangerouslyUseHTMLString: true
            }).then(() => {
              // 组装请求参数
              const reqParams = {
                projectIntoId: route.query.id,
                remark: _formData.remark,
                taskDeliverableId: row.id,
                deliverableTemplateId: row.deliverableTemplateId,
                id: row.generalTemplateVO?.id, // 修改才会传id
                taskId: row.projectTaskId,
                title: _formData.title
                // version: _formData.version
              };

              const formDataReq = new FormData();

              Object.keys(reqParams).forEach((objKey) => formDataReq.append(objKey, reqParams[objKey]));
              if (deleteFileIds.value.length) {
                deleteFileIds.value.forEach((objKey) => formDataReq.append("deleteIds", objKey));
              }
              const apiType = { add: saveProjectTaskDeliverableInfo, edit: updateProjectTaskDeliverableInfo };
              apiType[actionType](formDataReq).then((res) => {
                if (res.data || res.status === 200) {
                  ElMessage({ message: "保存成功", type: "success" });
                  done();
                  clickRow(currentTreeRow);
                }
              });
            });
          }
        });
      }
    });
  };

  const clickDeliverName = (item) => {
    if (["10", "2"].includes(item.deliverableTemplateId)) {
      // 手板制作模版、产品设计输入表
      return;
    }
    console.log(item, "row....");
    addDialog({
      title: `交付物【${item.deliverableName}】的历史信息`,
      props: {
        leftRowData: item,
        detailPageInfo: props.detailPageInfo,
        fullLeftRow: currentTreeRow,
        dataList: item.generalTemplateVO?.projectChangeRecordVOList || []
      },
      width: "1300px",
      draggable: true,
      fullscreenIcon: true,
      cancelButtonText: "关闭",
      hideItem: ["ok"],
      contentRenderer: () => h(DeliverModelList),
      beforeSure: (done, { options }) => done()
    });
  };

  const clickDeliverName2 = (item) => {
    console.log(item.generalTemplateVO?.remark, "item.generalTemplateVO?.remark");
    addDialog({
      title: `查看【${item.deliverableName}】信息`,
      width: "800px",
      draggable: true,
      fullscreenIcon: true,
      hideItem: ["ok"],
      contentRenderer: () =>
        h(item.generalTemplateVO?.remark ? <div style={{ whiteSpace: "pre-line" }}>{item.generalTemplateVO?.remark}</div> : <div>暂无信息</div>),
      beforeSure: (done, { options }) => done()
    });
  };

  const handleEdit = () => {
    if (!props.isCurrentProjectUser) {
      return message("只有当前项目负责人才能操作任务", { type: "warning" });
    }
    console.log(currentTreeRow.value, "currentTreeRow.value");
    if (JSON.stringify(currentTreeRow.value) == "{}") {
      ElMessage({ message: "请选择任务", type: "warning" });
      return;
    }

    if (currentTreeRow.value.name && !currentTreeRow.value.taskVOList) {
      if (["STATUS_DONE", "STATUS_STOP"].includes(currentTreeRow.value.status)) {
        rowView(currentTreeRow.value);
      } else {
        openDialog("edit", currentTreeRow.value);
        return;
      }
    }

    if (currentTreeRow.value.taskVOList) {
      openDialogGroup("edit", currentTreeRow.value);
    }
  };

  const delManyTask = () => {
    const selectNames = selectDelRows.value.map((item) => item.name);

    ElMessageBox.confirm(`确认要删除名称为【${String(selectNames)}】的任务吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        const delIds = selectDelRows.value.map((item) => item.id);

        deleteProjectTask(delIds).then((res) => {
          if (res.status === 200 || res.data) {
            message("删除成功", { type: "success" });
            props.fetchDetailFormData();
          }
        });
      })
      .catch(() => {});
  };

  const handleDel = () => {
    if (!props.isCurrentProjectUser) {
      return message("只有当前项目负责人才能操作任务", { type: "warning" });
    }
    if (selectDelRows.value.length) {
      return delManyTask();
    }
    if (JSON.stringify(currentTreeRow.value) == "{}") {
      ElMessage({ message: "请选择任务", type: "warning" });
      return;
    }
    if (currentTreeRow.value.taskVOList) {
      ElMessageBox.confirm(`确认要删除名称为【${currentTreeRow.value.name}】的分组吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          deleteProjectTaskGroup([currentTreeRow.value.id]).then((res) => {
            if (res.data) {
              ElMessage({ message: "删除成功", type: "success" });
              props.fetchDetailFormData();
              currentTreeRow.value = {};
            }
          });
        })
        .catch(() => {});
    } else {
      ElMessageBox.confirm(`确认要删除名称为【${currentTreeRow.value.name}】的任务吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          deleteProjectTask([currentTreeRow.value.id]).then((res) => {
            if (res.data) {
              ElMessage({ message: "删除成功", type: "success" });
              props.fetchDetailFormData();
              currentTreeRow.value = {};
            }
          });
        })
        .catch(() => {});
    }
  };

  const setTemplateId = (val) => (currentTemplateId.value = val);

  const rowView = (row) => {
    currentTreeRow.value = row;
    if (row.name && !row.groupName) {
      openDialog("view", currentTreeRow.value);
    }
  };

  const rowDbClick = (row) => {
    // currentTreeRow.value = row;
    // if (row.name && !row.groupName) {
    //   openDialog("view", currentTreeRow.value);
    // }
    // if (row.groupName) {
    //   openDialogGroup("edit", currentTreeRow.value);
    // }
  };

  const onSubmitDeliver = (item, fetchDetailFormData, refresh, flowTableRef, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.value.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
    if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) {
      return message("不是当前负责人，不能提交交付物", { type: "error" });
    }
    if ([0, 3].includes(item.generalTemplateVO?.billState)) {
      ElMessageBox.confirm(`确认要提交名称为【${item.deliverableName}】的交付物吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          submitProjectTaskDeliverableInfo({ id: item.generalTemplateVO?.id }).then((res) => {
            if (res.data || res.status === 200) {
              ElMessage({ message: "提交成功", type: "success" });
              refresh(null, () => {
                clickRow(currentTreeRow.value);
              });
            }
          });
        })
        .catch(() => {});
    } else {
      ElMessage({ message: "当前交付物处于不可提交状态", type: "error" });
    }
  };

  const onBackDeliver = (item, fetchDetailFormData, refresh, flowTableRef) => {
    if (item.generalTemplateVO?.billState === 2) {
      ElMessageBox.confirm(`确认要回退名称为【${item.deliverableName}】的交付物吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          backProjectTaskDeliverableInfo({ billNo: item.generalTemplateVO?.billNo }).then((res) => {
            if (res.data || res.status === 200) {
              ElMessage({ message: "回退成功", type: "success" });
              refresh(null, () => {
                clickRow(currentTreeRow.value);
              });
            }
          });
        })
        .catch(() => {});
    } else {
      ElMessage({ message: "当前交付物处于不可回退状态", type: "error" });
    }
  };

  const onRevokeDeliver = (item, fetchDetailFormData, refresh, flowTableRef, resourceAuthDeptIds) => {
    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.value.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
    if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) return message("不是当前负责人，不能撤销交付物", { type: "error" });
    if (item.generalTemplateVO?.billState === 1) {
      ElMessageBox.confirm(`确认要撤销名称为【${item.deliverableName}】的交付物吗?`, "系统提示", {
        type: "warning",
        draggable: true,
        cancelButtonText: "取消",
        confirmButtonText: "确定",
        dangerouslyUseHTMLString: true
      })
        .then(() => {
          console.log("revoke", item);
          revokeProjectTaskDeliverableInfo({ billNo: item.generalTemplateVO?.billNo }).then((res) => {
            if (res.data || res.status === 200) {
              ElMessage({ message: "撤销成功", type: "success" });
              refresh(null, () => {
                clickRow(currentTreeRow.value);
              });
            }
          });
        })
        .catch(() => {});
    } else {
      ElMessage({ message: "当前交付物处于不可撤销状态", type: "error" });
    }
  };

  const rowClassName = ({ row }) => {
    let className = "";
    if (row.id === curActiveId.value) {
      className = "current-row";
    }
    return className;
  };

  const onViewNodeDetailDeliver = (item) => {
    if (item.generalTemplateVO?.billState) {
      addDialog({
        title: "查看审批节点详情",
        width: "900px",
        draggable: true,
        fullscreenIcon: true,
        closeOnClickModal: true,
        hideFooter: true,
        contentRenderer: ({ options }) =>
          h(NodeDetailList, { options, billNo: item.generalTemplateVO?.billNo, billType: "deliverableAppravel", billState: +item.generalTemplateVO?.billState })
      });
    }
  };

  const cellClick = (row, column) => {
    // if (column.property === "name" && !row.taskVOList) {
    //   rowView(row);
    // }
  };

  const onChangeDeliver = (val, fetchDetailFormData, refresh, flowTableRef, resourceAuthDeptIds) => {
    const row = {
      projectId: val.generalTemplateVO?.projectIntoId,
      projectName: val.generalTemplateVO?.projectName,
      taskId: val.generalTemplateVO?.taskId,
      taskName: val.generalTemplateVO?.taskName,
      version: val.generalTemplateVO?.version,
      title: val.generalTemplateVO?.title,
      remark: val.generalTemplateVO?.remark,
      describeChange: val.generalTemplateVO?.describeChange,
      deliverableId: val.id
      // files: val.generalTemplateVO?.newGeneralTemplateEntryVOList?.filter((item) => item.entryid)?.map((item) => ({ ...item, name: item.fileName }))
    };

    const projectUserId = fetchDetailFormData.projectInfoListVO?.projectUserId;
    const curUserId = useUserStoreHook().userInfo.id;
    const curUserDeptId = useUserStoreHook().userInfo.deptId;
    const rowUserId = currentTreeRow.value.projectTaskResponsiblePersonnelVOList[0]?.userId;
    const isHasAuth = resourceAuthDeptIds.map(Number).includes(curUserDeptId);
    if (![rowUserId, projectUserId].includes(curUserId) && !isHasAuth) {
      // commonDeliverChangeAction({ row, type: "view", freshDeliverableNow: true, disabledSomeCtrl: true });
      return message("不是当前负责人，不能进行变更", { type: "error" });
    } else {
      commonDeliverChangeAction({ row, type: "add", freshDeliverableNow: true, disabledSomeCtrl: true, fromTaskList: true }, () => {
        refresh(null, () => {
          clickRow(currentTreeRow.value);
        });
      });
    }
  };

  const selectChange = (rows) => {
    selectDelRows.value = rows;
  };

  return {
    handleAdd,
    handleEdit,
    onSubmitDeliver,
    onBackDeliver,
    onRevokeDeliver,
    clickDeliverName,
    onEditDeliver,
    onEditDeliver2,
    clickDeliverName2,
    columns,
    flowTableRef,
    deliverList,
    rowDbClick,
    cellClick,
    currentTreeRow,
    clickRow,
    deliverLoading,
    rowClassName,
    dataList,
    setTemplateId,
    onViewNodeDetailDeliver,
    statusOpts,
    billStateOpts,
    selectChange,
    handleDel,
    onChangeDeliver
  };
};
