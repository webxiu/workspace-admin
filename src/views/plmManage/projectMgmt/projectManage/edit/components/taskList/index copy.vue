<template>
  <div class="top-btns-task">
    <el-space :size="16">
      <el-button size="small" type="primary" @click="() => onAddTask('up')">上方插入任务</el-button>
      <el-button size="small" type="success" @click="() => onAddTask('down')">下方插入任务</el-button>
      <el-button size="small" type="danger" @click="onDeleteTask">删除</el-button>
    </el-space>
    <div style="font-size: 14px; margin-left: 16px; color: red">注意：红色字体的任务为已延期任务</div>
    <div style="font-size: 14px; display: flex">
      <div style="display: flex; align-items: center">
        <div style="background-color: #ffbf00; width: 12px; height: 12px; border-radius: 100%; margin-left: 12px; margin-right: 4px" />
        等待
      </div>
      <div style="display: flex; align-items: center">
        <div style="background-color: #00cd66; width: 12px; height: 12px; border-radius: 100%; margin-left: 12px; margin-right: 4px" />
        进行中
      </div>
      <div style="display: flex; align-items: center">
        <div style="background-color: #1e90ff; width: 12px; height: 12px; border-radius: 100%; margin-left: 12px; margin-right: 4px" />
        已完成
      </div>
    </div>
  </div>
  <div>
    <pure-table
      border
      :height="maxHeight"
      :max-height="maxHeight"
      row-key="id"
      class="pm-task-table"
      default-expand-all
      empty-text="暂无任务信息"
      ref="flowTableRef"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :tree-props="{ children: 'taskVOList', hasChildren: 'hasChildren' }"
      :show-overflow-tooltip="true"
      :row-class-name="rowClassName"
      @row-click="clickRow"
      @select-all="selectAll"
      @row-dblclick="rowDbClick"
      @selection-change="selectChange"
    />
  </div>
</template>

<script setup lang="tsx">
import { tableEditRender, getEnumDictList, setColumn } from "@/utils/table";
import { message } from "@/utils/message";
import { onMounted, ref, h, watchEffect } from "vue";
import { addDialog } from "@/components/ReDialog";
import TaskModal from "./taskModel.vue";
import { cloneDeep } from "@pureadmin/utils";
import { v4 as uuidv4 } from "uuid";
import ResponseUserModal from "./responseUserModal.vue";
import RelationUserModal from "./relationUserModal.vue";
import DeliverableModal from "./deliverableModal.vue";
import BeforeTaskModal from "./beforeTaskModal.vue";
import { getHolidays, getHolidaysByOneDate } from "./utils";
import { getRightFreeDayList } from "@/api/plmManage";
import dayjs from "dayjs";

const dataList = ref([]);
const flowTableRef = ref();
const columns = ref([]);
const curActiveId = ref("");
const curRow = ref();
const maxHeight = ref(558);
const taskStatusOpts = ref([]);
const holidaySettingList = ref([]);

const props = defineProps(["formData", "sourceRef"]);

const setStartDate = (row) => {
  // 计算结束日期
  const planEnd = dayjs(row.start).add(+row.duration, "day").format("YYYY-MM-DD");
  let rowHolidays = getHolidays(holidaySettingList.value, row.start, row.end);
  if (+row.duration <= rowHolidays && +row.duration === 1) {
    rowHolidays = getHolidays(holidaySettingList.value, row.start, planEnd);
  }
  if (rowHolidays) {
    row.end = dayjs(planEnd).add(rowHolidays, "day").subtract(1, "day").format("YYYY-MM-DD");
  } else {
    row.end = dayjs(planEnd).subtract(1, "day").format("YYYY-MM-DD");
  }
  const freeDays = getHolidaysByOneDate(row.start, holidaySettingList.value);
  const freeDaysEnd = getHolidaysByOneDate(row.end, holidaySettingList.value);
  if (freeDays) {
    row.start = dayjs(row.start).add(freeDays, "day").format("YYYY-MM-DD");
  }
  if (freeDaysEnd) {
    if (+row.duration <= rowHolidays) {
      row.end = dayjs(planEnd).subtract(+row.duration, "day").format("YYYY-MM-DD");
    } else {
      row.end = dayjs(row.end).add(freeDaysEnd, "day").format("YYYY-MM-DD");
    }
  }
};

const getConfig = () => {
  const { editCellRender } = tableEditRender({
    editFinish: ({ row }) => {}
  });

  const stateColor = {
    STATUS_WAITING: "#ffbf00",
    STATUS_ACTIVE: "#00CD66",
    STATUS_DONE: "#1E90FF"
  };

  const columnData: TableColumnList[] = [
    {
      label: "任务名称",
      prop: "name",
      minWidth: 200,
      cellRenderer(data) {
        return (
          <div style={{ display: "inline-flex", alignItems: "baseline", cursor: "pointer" }}>
            {data.row.groupId && (
              <div style={{ background: stateColor[data.row.status], width: "11px", borderRadius: "100%", lineHeight: "100%", height: "11px" }}></div>
            )}
            <div style={{ color: data.row.groupId && data.row.expireFlag ? "red" : "", marginLeft: "5px" }}>{data.row.name}</div>
          </div>
        );
      }
    },
    {
      label: "工期",
      prop: "duration",
      width: 80,
      align: "right",
      cellRenderer: (data) => editCellRender({ data, isEdit: !data.row.taskVOList && data.row.status !== "STATUS_DONE" })
    },
    {
      label: "开始日期",
      prop: "start",
      cellRenderer: (data) =>
        editCellRender({ type: "date", isEdit: !data.row.taskVOList && data.row.status !== "STATUS_DONE" && !data.row.projectTaskRequireVOList.length, data }),
      width: 120
    },
    {
      label: "结束日期",
      prop: "end",
      cellRenderer: (data) => editCellRender({ type: "date", isEdit: false, data }),
      width: 120
    },
    { label: "实际开始日期", prop: "realStart", width: 120 },
    { label: "实际结束日期", prop: "realEnd", width: 120 },
    {
      label: "状态",
      prop: "status",
      width: 120,
      cellRenderer: (data) => {
        return editCellRender({
          type: "select",
          data,
          isEdit: !data.row.taskVOList && data.row.status !== "STATUS_DONE",
          options: taskStatusOpts.value,
          cellStyle: { color: "#606266", textAlign: "left" }
        });
      }
    },
    {
      label: "责任人",
      prop: "responseUser",
      cellRenderer: (data) => {
        if (data.row.groupId) {
          if (data.row.projectTaskResponsiblePersonnelVOList?.length) {
            const resUserName = data.row.projectTaskResponsiblePersonnelVOList.map((item) => item.masterUserName);
            return (
              <span style={{ cursor: "pointer" }} onClick={() => chooseResponseUser(data.row)}>
                {String(resUserName)}
              </span>
            );
          }
          return (
            <span style={{ cursor: "pointer", color: "#1989fa" }} onClick={() => chooseResponseUser(data.row)}>
              点击选择
            </span>
          );
        }
        return null;
      }
    },
    {
      label: "前置任务",
      prop: "beforeTask",
      cellRenderer(data) {
        if (data.row.groupId) {
          if (data.row.projectTaskRequireVOList?.length) {
            const beforeTaskList = data.row.projectTaskRequireVOList?.map((item) => item.requireProjectTaskName)?.filter(Boolean);
            return (
              <span style={{ cursor: "pointer" }} onClick={() => chooseBeforeTask(data.row)}>
                {String(beforeTaskList)}
              </span>
            );
          }
          return (
            <span style={{ cursor: "pointer", color: "#1989fa" }} onClick={() => chooseBeforeTask(data.row)}>
              点击选择
            </span>
          );
        }
        return null;
      }
    },
    {
      label: "交付物",
      prop: "deliverable",
      cellRenderer(data) {
        const rowDatas = data.row.projectTaskDeliverableVOList?.filter((el) => el.deliverableTemplateId != "0");
        if (data.row.groupId) {
          if (rowDatas.length) {
            const deliverableNames = data.row.projectTaskDeliverableVOList?.map((item) => item.deliverableName)?.filter(Boolean);
            return (
              <span style={{ cursor: "pointer" }} onClick={() => chooseDelivery(data.row)}>
                {String(deliverableNames)}
              </span>
            );
          }
          return (
            <span style={{ cursor: "pointer", color: "#1989fa" }} onClick={() => chooseDelivery(data.row)}>
              点击选择
            </span>
          );
        }
        return null;
      }
    },
    {
      label: "相关人",
      prop: "relationUsers",
      cellRenderer: (data) => {
        if (data.row.groupId) {
          if (data.row.projectTaskRelatePersonnelVOList?.length) {
            const resUserName = data.row.projectTaskRelatePersonnelVOList.map((item) => item.masterUserName);
            return (
              <span style={{ cursor: "pointer" }} onClick={() => chooseRelationUser(data.row)}>
                {String(resUserName)}
              </span>
            );
          }
          return (
            <span style={{ cursor: "pointer", color: "#1989fa" }} onClick={() => chooseRelationUser(data.row)}>
              点击选择
            </span>
          );
        }
        return null;
      }
    },
    { label: "描述", prop: "description", cellRenderer: (data) => editCellRender({ data, isEdit: !data.row.taskVOList }) },
    {
      label: "进度%",
      prop: "progress",
      width: 60,
      cellRenderer: (data) => editCellRender({ data, isEdit: false }),
      align: "right"
    }
  ];

  columns.value = setColumn({
    columnData,
    operationColumn: false
  });
};

watchEffect(() => {
  dataList.value.forEach((item) => {
    item.taskVOList.forEach((row) => {
      // 跳过假期的结束日期
      setStartDate(row);
      // 找出以当前任务作为前置任务的其他任务
      const otherTasks = dataList.value
        .map((item) => item.taskVOList)
        .flat(Infinity)
        .filter((o) => o.projectTaskRequireVOList.map((item) => item.requireProjectTaskId).includes(row.id));

      // 修改其他任务的开始日期
      otherTasks.forEach((o) => {
        const findBeforeIdx = o.projectTaskRequireVOList.findIndex((bd) => bd.requireProjectTaskId === row.id);
        if (findBeforeIdx >= 0 && o.projectTaskRequireVOList[findBeforeIdx].delayDays) {
          if (/(1|3)/.test(o.projectTaskRequireVOList[findBeforeIdx].requireMode)) {
            o.start = dayjs(row.end).add(+o.projectTaskRequireVOList[findBeforeIdx].delayDays, "day").add(1, "day").format("YYYY-MM-DD");
          } else {
            o.start = dayjs(row.start).add(+o.projectTaskRequireVOList[findBeforeIdx].delayDays, "day").format("YYYY-MM-DD");
          }
        } else {
          o.start = dayjs(row.end).add(1, "day").format("YYYY-MM-DD");
        }
        setStartDate(o);
      });
    });
  });
});

const chooseBeforeTask = (currentTaskRow) => {
  if (currentTaskRow.status === "STATUS_DONE") return message("已完成状态不能修改", { type: "error" });
  const beforeTaskModalRef = ref();

  addDialog({
    title: `编辑前置任务`,
    props: {
      currentTaskRow,
      dataTreeList: dataList
    },
    width: "700px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    okButtonText: "保存",
    cancelButtonText: "关闭",
    contentRenderer: () => h(BeforeTaskModal, { ref: beforeTaskModalRef }),
    beforeSure: (done) => {
      const modalRows = beforeTaskModalRef.value.dataList || [];
      if (modalRows.length) {
        // 继续判断延迟天数是否合法
        const filterRequireListNeedValid = modalRows.filter((el) => el.requireMode && el.requireMode != 1 && el.beforeTaskId);
        if (filterRequireListNeedValid.length) {
          const validResult = filterRequireListNeedValid.every((item) => /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/.test(item.delayDays + ""));
          if (!validResult) {
            message("开始时间、结束时间的模式下，延迟天数必须录入大于0的数字。", { type: "error" });
            return;
          }
        }

        if (modalRows.some((item) => !item.beforeTaskId)) return message("前置任务名称不能为空", { type: "error" });
        if (modalRows.some((item) => !item.requireMode)) return message("前置模式不能为空", { type: "error" });
        currentTaskRow.projectTaskRequireVOList = modalRows.map((item) => ({
          requireProjectTaskId: item.beforeTaskId,
          requireMode: item.requireMode,
          delayDays: item.delayDays,
          requireProjectTaskName: beforeTaskModalRef.value.findTaskNameById(item.beforeTaskId)
        }));
        done();
      } else {
        currentTaskRow.projectTaskRequireVOList = [];
        done();
      }
    }
  });
};

const chooseDelivery = (currentTaskRow) => {
  if (currentTaskRow.status === "STATUS_DONE") return message("已完成状态不能修改", { type: "error" });
  const deliverableModalRef = ref();

  addDialog({
    title: `编辑交付物`,
    props: {
      currentTaskRow
    },
    width: "600px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    okButtonText: "保存",
    cancelButtonText: "关闭",
    contentRenderer: () => h(DeliverableModal, { ref: deliverableModalRef }),
    beforeSure: (done) => {
      const modalRows = deliverableModalRef.value.dataList || [];
      if (modalRows.length) {
        if (modalRows.some((item) => !item.name)) return message("交付物名称不能为空", { type: "error" });
        if (modalRows.some((item) => !item.deliverableId || item.deliverableId == "0")) return message("交付物模板不能为空", { type: "error" });

        currentTaskRow.projectTaskDeliverableVOList = modalRows.map((item) => ({
          projectTaskId: currentTaskRow.id,
          deliverableTemplateId: item.deliverableId + "",
          id: item.id,
          deliverableName: item.name
        }));
        done();
      } else {
        return message("交付物不能为空", { type: "error" });
      }
    }
  });
};

const chooseRelationUser = (currentTaskRow) => {
  if (currentTaskRow.status === "STATUS_DONE") return message("已完成状态不能修改", { type: "error" });

  if (currentTaskRow.projectTaskRelatePersonnelVOList?.length) return;
  const relationUsersModalRef = ref();

  addDialog({
    title: `选择相关人`,
    props: {
      currentTaskRow
    },
    width: "800px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    okButtonText: "保存",
    cancelButtonText: "关闭",
    contentRenderer: () => h(RelationUserModal, { ref: relationUsersModalRef }),
    beforeSure: (done) => {
      const modalRows = relationUsersModalRef.value.rowsData || [];
      if (modalRows.length) {
        currentTaskRow.projectTaskRelatePersonnelVOList = modalRows.map((item) => ({
          projectTaskId: currentTaskRow.id,
          roleId: item.roleId,
          userId: item.userId,
          masterUserName: item.userName
        }));
        done();
      } else {
        return message("请选择至少一条记录", { type: "warning" });
      }
    }
  });
};

const chooseResponseUser = (currentTaskRow) => {
  if (currentTaskRow.status === "STATUS_DONE") return message("已完成状态不能修改", { type: "error" });

  if (currentTaskRow.projectTaskResponsiblePersonnelVOList?.length) return;
  const resUsersModalRef = ref();

  addDialog({
    title: `选择责任人`,
    props: {
      currentTaskRow
    },
    width: "800px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    okButtonText: "保存",
    cancelButtonText: "关闭",
    contentRenderer: () => h(ResponseUserModal, { ref: resUsersModalRef }),
    beforeSure: (done) => {
      const modalRow = resUsersModalRef.value.currentRow;
      if (modalRow) {
        currentTaskRow.projectTaskResponsiblePersonnelVOList = [
          {
            projectTaskId: currentTaskRow.id,
            roleId: modalRow.roleId,
            userId: modalRow.userId,
            masterUserName: modalRow.userName
          }
        ];
        done();
      } else {
        return message("请选择一条记录", { type: "warning" });
      }
    }
  });
};

const selectAll = () => {
  flowTableRef.value.getTableRef().clearSelection();
};

const getResUserInfo = (roleId, field) => {
  const resUserList = props.sourceRef.dataList || [];

  const findUserId = resUserList.find((item) => item.id == roleId)?.resUserOptions;
  if (field === "userId") {
    return findUserId;
  }

  if (field === "userName") {
    const findUserItem = resUserList.find((item) => item.id == roleId)?.userInfoVOList?.find((el) => el.id === findUserId);
    return findUserItem?.userName;
  }
};

const getRelateUserInfo = (roleId, field) => {
  const relateUserList = props.sourceRef.dataList2 || [];

  const findUserId = relateUserList.find((item) => item.id == roleId)?.relateUserOptions;
  if (field === "userId") {
    return findUserId;
  }

  if (field === "userName") {
    const findUserItem = relateUserList.find((item) => item.id == roleId)?.userInfoVOList?.find((el) => el.id === findUserId);
    return findUserItem?.userName;
  }
};

const onAddTask = (type: "up" | "down") => {
  if (!curActiveId.value || curRow.value.taskVOList) {
    return message("请选择任务", { type: "warning" });
  }

  let selectRows: any = [];
  const bindModalRef = ref();

  const selectRowsCallBack = (v) => {
    selectRows = v;
  };

  addDialog({
    title: `选择任务`,
    props: {
      selectRowsCallBack,
      dataTreeList: dataList
    },
    width: "1200px",
    draggable: true,
    fullscreenIcon: true,
    closeOnClickModal: false,
    okButtonText: "保存",
    cancelButtonText: "关闭",
    contentRenderer: () => h(TaskModal, { ref: bindModalRef }),
    beforeSure: (done) => {
      const modalRefRows = bindModalRef.value?.modalSelectedRows || [];
      if (modalRefRows.length) {
        const findTaskGroupIndex = dataList.value.findIndex((item) => item.taskVOList.some((el) => el.id === curActiveId.value));
        const findTaskIndex = dataList.value[findTaskGroupIndex]?.taskVOList.findIndex((item) => item.id === curActiveId.value);

        if (findTaskGroupIndex >= 0 && findTaskIndex >= 0) {
          const copyModalRows = cloneDeep(modalRefRows).map((item) => {
            const uuid = uuidv4();
            return {
              id: uuid,
              groupId: curRow.value.groupId,
              name: item.taskName,
              progress: 0,
              start: props.formData.startDate,
              status: "STATUS_WAITING",
              duration: item.duration,
              projectTaskRequireVOList: [],
              projectTaskDeliverableVOList: item.taskModelDeliverablesList,
              projectTaskResponsiblePersonnelVOList: item.taskModelResponsibleRolesList
                .map((el) => ({
                  projectTaskId: uuid,
                  roleId: el.roleId,
                  userId: getResUserInfo(el.roleId, "userId"),
                  masterUserName: getResUserInfo(el.roleId, "userName")
                }))
                .filter((el) => el.masterUserName),
              projectTaskRelatePersonnelVOList: item.taskRelateRoleList
                .map((el) => ({
                  projectTaskId: uuid,
                  roleId: el.roleId,
                  userId: getRelateUserInfo(el.roleId, "userId"),
                  masterUserName: getRelateUserInfo(el.roleId, "userName")
                }))
                .filter((el) => el.masterUserName)
            };
          });

          if (type === "up") {
            dataList.value[findTaskGroupIndex].taskVOList.splice(findTaskIndex, 0, ...copyModalRows);
          } else if (type === "down") {
            dataList.value[findTaskGroupIndex].taskVOList.splice(findTaskIndex + 1, 0, ...copyModalRows);
          }
          // 重置排序
          dataList.value.forEach((groupItem) => {
            groupItem.taskVOList = groupItem.taskVOList.map((taskItem, taskIndex) => ({ ...taskItem, sort: +taskIndex }));
            return groupItem;
          });
        }
        done();
      } else {
        message("请选择至少一条记录", { type: "warning" });
      }
    }
  });
};

const onDeleteTask = () => {
  if (!curActiveId.value || curRow.value.taskVOList) {
    return message("请选择任务", { type: "warning" });
  }

  const findTaskGroupIndex = dataList.value.findIndex((item) => item.taskVOList.some((el) => el.id === curActiveId.value));
  const findTaskIndex = dataList.value[findTaskGroupIndex]?.taskVOList.findIndex((item) => item.id === curActiveId.value);

  if (findTaskGroupIndex >= 0 && findTaskIndex >= 0) {
    dataList.value[findTaskGroupIndex].taskVOList.splice(findTaskIndex, 1);

    // 清空其他任务相关联的前置任务
    const relateDelItems = [];
    dataList.value[findTaskGroupIndex].taskVOList.forEach((el) => {
      const isIncludeDelId = el.projectTaskRequireVOList.some((bf) => bf.requireProjectTaskId === curRow.value?.id?.replaceAll("-", ""));
      if (isIncludeDelId) relateDelItems.push(el.id);
    });
    if (relateDelItems.length) {
      relateDelItems.forEach((rt) => {
        const delIdx = dataList.value[findTaskGroupIndex].taskVOList.findIndex((item) => item.id === rt);

        if (delIdx >= 0) {
          const delBeforeTaskIdx = dataList.value[findTaskGroupIndex].taskVOList[delIdx].projectTaskRequireVOList.findIndex(
            (el) => el.requireProjectTaskId === curRow.value?.id?.replaceAll("-", "")
          );
          dataList.value[findTaskGroupIndex].taskVOList[delIdx].projectTaskRequireVOList.splice(delBeforeTaskIdx, 1);
        }
      });
    }

    curActiveId.value = "";
    curRow.value = undefined;
  }
};

const clickRow = (row) => {
  curActiveId.value = row?.id;
  curRow.value = row;
  console.log(row, "click row");
};

const rowDbClick = (row) => {
  console.log(row, "rowDbClick row");
};

const selectChange = (rows) => {
  console.log(rows, "select rows");
};

const rowClassName = ({ row }) => {
  let className = "";
  if (row.id === curActiveId.value) {
    className = "current-row";
  }
  return className;
};

const fetchOpts = () => {
  getEnumDictList(["ProjectTaskStatus"]).then((res: any) => {
    if (res["ProjectTaskStatus"]) {
      taskStatusOpts.value = res["ProjectTaskStatus"].map((item) => {
        if (!["STATUS_ACTIVE", "STATUS_WAITING"].includes(item.optionValue)) {
          item.disabled = true;
        }
        return item;
      });
    }
  });

  getRightFreeDayList({}).then((res: any) => {
    if (res.data) {
      holidaySettingList.value = res.data;
    }
  });
};

onMounted(() => {
  fetchOpts();
  getConfig();
});

defineExpose({ dataList });
</script>

<style scoped lang="scss">
.top-btns-task {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}
</style>
