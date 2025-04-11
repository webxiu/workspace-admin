<template>
  <div class="list-table">
    <div class="tb">
      <pure-table
        :expand-row-keys="rowKeys"
        row-key="id"
        :height="maxHeight"
        class="list-main-table"
        :adaptive="true"
        size="small"
        show-overflow-tooltip
        :data="tableData"
        :columns="columns"
        highlight-current-row
      />
    </div>
    <!-- <div v-if="type === '1'"><el-button size="small" :icon="Plus" @click="onAddMainTask">添加任务</el-button></div> -->
  </div>
</template>

<script setup lang="tsx">
import { setColumn, tableEditRender } from "@/utils/table";
import { onMounted, ref } from "vue";
import { Delete, Plus, EditPen, Check } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { message, showMessageBox } from "@/utils/message";
import { updateTaskStatus, deleteTask } from "@/api/systemManage";

const props = defineProps(["type", "tableData", "nameOptions", "boardRef"]);
const maxHeight = ref(200);

const typeState = {
  3: "已完成",
  2: "进行中",
  1: "待处理"
};

const dataList = ref(
  //   [
  //   {
  //     taskName: "测试任务名称",
  //     id: "1",
  //     priority: "紧急",
  //     assignUser: 2222,
  //     status: typeState[props.type],
  //     endDate: dayjs().format("YYYY-MM-DD"),
  //     remark: "备注信息...",
  //     children: [
  //       {
  //         id: "11",
  //         taskName: "测试二级名称",
  //         assignUser: 1111,
  //         endDate: dayjs().format("YYYY-MM-DD"),
  //         priority: "一般",
  //         status: typeState[props.type],
  //         remark: "备注..",
  //         parentId: "1"
  //       }
  //     ]
  //   }
  // ]
  []
);

const columns = ref([]);
const rowKeys = ref([]);
const statusOptionValue = ref([
  { optionName: "待处理", optionValue: "1" },
  { optionName: "进行中", optionValue: "2" },
  { optionName: "已完成", optionValue: "3" }
]);
const priorityOptionValue = ref([
  { optionName: "紧急", optionValue: "紧急" },
  { optionName: "高", optionValue: "高" },
  { optionName: "一般", optionValue: "一般" },
  { optionName: "低", optionValue: "低" }
]);

const assignUserOptionValue = ref([
  { optionName: "张三", optionValue: 1111 },
  { optionName: "李四", optionValue: 2222 },
  { optionName: "王五", optionValue: 3333 }
]);

// 编辑表格
const { editCellRender } = tableEditRender();

const getConfig = () => {
  const remarkRenderer = (data) => editCellRender({ data, isEdit: props.type === "1" });
  const taskNameRenderer = (data) => editCellRender({ data, isEdit: props.type === "1" });
  const statusRender = (data) =>
    editCellRender({
      type: "select",
      data,
      isEdit: props.type === "1",
      options: statusOptionValue.value,
      cellStyle: { color: "#606266", textAlign: "left" }
    });
  const priorityRender = (data) =>
    editCellRender({
      type: "select",
      data,
      isEdit: props.type === "1",
      options: priorityOptionValue.value,
      cellStyle: { color: "#606266", textAlign: "left" }
    });

  const assignUserNameRender = (data) =>
    editCellRender({
      type: "select",
      data,
      isEdit: props.type === "1",
      options: props.nameOptions,
      cellStyle: { color: "#606266", textAlign: "left" }
    });

  const endDateRender = (data) =>
    editCellRender({
      type: "date",
      data,
      isEdit: props.type === "1",
      options: priorityOptionValue.value,
      eleProps: { format: "YYYY-MM-DD", valueFormat: "YYYY-MM-DD" },
      cellStyle: { color: "#606266", textAlign: "left" }
    });

  const columnData: TableColumnList[] = [
    { label: "任务名称", prop: "taskName", minWidth: 240, cellRenderer: taskNameRenderer },
    { label: "优先级", prop: "priority", width: 140, cellRenderer: priorityRender },
    { label: "截止日期", prop: "endTime", width: 140, cellRenderer: endDateRender },
    { label: "指派人员", prop: "responsibleUserCode", width: 140, cellRenderer: assignUserNameRender },
    { label: "状态", prop: "taskStatus", width: 140, cellRenderer: statusRender },
    { label: "备注", prop: "taskContent", width: 280, cellRenderer: remarkRenderer }
  ];

  columns.value = setColumn({
    columnData,
    radioColumn: { hide: true },
    indexColumn: { hide: true },
    operationColumn:
      props.type === "3"
        ? false
        : {
            align: "center",
            width: 120,
            cellRenderer({ row, index }) {
              return ["2", "5"].includes(props.type) ? (
                !row.children?.length ? (
                  <div style={{ cursor: "pointer" }}>
                    <el-icon onClick={() => confirmTask(row)}>
                      {" "}
                      <Check />
                    </el-icon>
                  </div>
                ) : null
              ) : (
                <div style={{ display: "flex", alignItem: "center", cursor: "pointer" }}>
                  <el-space size={16}>
                    {row.children ? (
                      <div onClick={() => onAddSubTask(row)}>
                        <el-icon>
                          <Plus />
                        </el-icon>
                      </div>
                    ) : (
                      <div onClick={() => onSave(row)}>
                        <el-icon>
                          <Check />
                        </el-icon>
                      </div>
                    )}
                    <div onClick={() => onDelMainTask(row)}>
                      <el-icon>
                        <Delete />
                      </el-icon>
                    </div>
                  </el-space>
                </div>
              );
            }
          }
  });
};

// 公共逻辑抽取
const commonActionFn = (newStatus, title, row, cb?) => {
  showMessageBox(`确认要${title}吗?`)
    .then(() => {
      updateTaskStatus({ ...row, newStatus }).then(({ data }) => {
        if (data) {
          message.success("操作成功");
          if (cb) cb();
          props.boardRef.changeUserName(props.boardRef.searchName);
        }
      });
    })
    .catch(() => {});
};

const confirmTask = (item) => {
  switch (props.type) {
    case "1":
      commonActionFn("2", "开始", item);
      return;
    case "2":
      commonActionFn("5", "提交", item);
      return;
    case "5":
      commonActionFn("3", "完成", item);
      return;
    default:
      return;
  }
};

const onSave = (item) => {
  if (props.type === "1" && item.id) {
    commonActionFn("2", "开始", item);
  } else {
  }
};

const onAddSubTask = (row) => {
  row.children.push({
    taskName: "",
    id: uuidv4(),
    priority: undefined,
    status: typeState[props.type],
    assignUser: undefined,
    endDate: dayjs().format("YYYY-MM-DD"),
    remark: "",
    parentId: row.id
  });
  rowKeys.value = [row.id + ""];
};

const onDelMainTask = (row) => {
  // if (row.parentId) {
  //   const mainDelIdx = dataList.value.findIndex((el) => el.id === row.parentId);
  //   if (mainDelIdx >= 0) {
  //     const innerDelIdx = dataList.value[mainDelIdx].children?.findIndex((el) => el.id === row.id);

  //     if (innerDelIdx >= 0) {
  //       dataList.value[mainDelIdx].children.splice(innerDelIdx, 1);
  //     }
  //   }
  // } else {
  //   const mainDelIdx = dataList.value.findIndex((el) => el.id === row.id);
  //   if (mainDelIdx >= 0) {
  //     dataList.value.splice(mainDelIdx, 1);
  //   }
  // }
  commonActionFn("4", "删除", row, () => {
    deleteTask({ id: row.id, parentId: row.parentId }).then((res) => {
      if (res.data) {
        message.success("删除成功");
      }
    });
  });
};

const onAddMainTask = () => {
  props.tableData.push({
    taskName: "",
    id: uuidv4(),
    isNewRow: true,
    priority: undefined,
    assignUser: undefined,
    status: typeState[props.type],
    endDate: dayjs().format("YYYY-MM-DD"),
    remark: "",
    children: undefined
  });
  rowKeys.value = [];
};

onMounted(() => {
  getConfig();
});
</script>

<style scoped lang="scss">
.list-table {
  width: 1100px;

  .tb {
    margin-bottom: 8px;

    :deep(.el-input) {
      width: 90%;
    }

    :deep(.cell) {
      display: flex;
      align-items: center;
    }
  }
}
</style>
