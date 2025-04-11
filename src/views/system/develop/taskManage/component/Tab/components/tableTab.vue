<template>
  <div class="list-table">
    <!-- <div class="switch">
      <div>
        <span>分组展示</span>
        <el-select v-model="displayGroup" placeholder="请选择" size="small" style="margin-left: 8px">
          <el-option v-for="item in displayGroupOptions" :key="item.optionValue" :label="item.optionName" :value="item.optionValue" />
        </el-select>
      </div>
      <div style="margin-left: 32px">
        <span>隐藏子任务</span>
        <el-switch v-model="hideChildren" style="margin-left: 8px" size="small" />
      </div>
    </div> -->
    <div class="tb">
      <pure-table
        border
        :expand-row-keys="rowKeys"
        row-key="id"
        class="list-main-table"
        :adaptive="true"
        size="small"
        :data="dataList"
        :columns="columns"
        highlight-current-row
      />
    </div>
    <div><el-button size="small" :icon="Plus" @click="onAddMainTask">添加任务</el-button></div>
  </div>
</template>

<script setup lang="tsx">
import { setColumn, tableEditRender } from "@/utils/table";
import { onMounted, ref, watch } from "vue";
import { Delete, Plus, EditPen, Check } from "@element-plus/icons-vue";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

const typeState = {
  3: "已完成",
  2: "进行中",
  1: "待处理"
};

const displayGroup = ref("");

const displayGroupOptions = ref([
  { optionName: "状态", optionValue: "状态" },
  { optionName: "指派人", optionValue: "指派人" },
  { optionName: "优先级", optionValue: "优先级" },
  { optionName: "截止日期", optionValue: "截止日期" }
]);

const hideChildren = ref(true);

const dataList = ref([
  {
    taskName: "测试任务名称",
    id: "1",
    priority: "紧急",
    assignUser: 2222,
    status: "待处理",
    endDate: dayjs().format("YYYY-MM-DD"),
    children: [
      {
        id: "11",
        taskName: "测试二级名称",
        assignUser: 1111,
        endDate: dayjs().format("YYYY-MM-DD"),
        priority: "一般",
        status: "待处理",
        parentId: "1"
      }
    ]
  }
]);

const columns = ref([]);
const rowKeys = ref([]);
const statusOptionValue = ref([
  { optionName: "待处理", optionValue: "待处理" },
  { optionName: "进行中", optionValue: "进行中" },
  { optionName: "已完成", optionValue: "已完成" }
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
  const taskNameRenderer = (data) => editCellRender({ data });
  const statusRender = (data) =>
    editCellRender({
      type: "select",
      data,
      options: statusOptionValue.value,
      cellStyle: { color: "#606266", textAlign: "left" }
    });
  const priorityRender = (data) =>
    editCellRender({
      type: "select",
      data,
      options: priorityOptionValue.value,
      cellStyle: { color: "#606266", textAlign: "left" }
    });

  const assignUserNameRender = (data) =>
    editCellRender({
      type: "select",
      data,
      options: assignUserOptionValue.value,
      cellStyle: { color: "#606266", textAlign: "left" }
    });

  const endDateRender = (data) =>
    editCellRender({
      type: "date",
      data,
      options: priorityOptionValue.value,
      eleProps: { format: "YYYY-MM-DD", valueFormat: "YYYY-MM-DD" },
      cellStyle: { color: "#606266", textAlign: "left" }
    });

  const columnData: TableColumnList[] = [
    { label: "任务名称", prop: "taskName", minWidth: 240, cellRenderer: taskNameRenderer },
    { label: "指派人员", prop: "assignUser", width: 140, cellRenderer: assignUserNameRender },
    { label: "状态", prop: "status", width: 140, cellRenderer: statusRender },
    { label: "截止日期", prop: "endDate", width: 140, cellRenderer: endDateRender },
    { label: "优先级", prop: "priority", width: 140, cellRenderer: priorityRender }
  ];

  columns.value = setColumn({
    columnData,
    radioColumn: { hide: true },
    indexColumn: {
      headerAlign: "center",
      cellRenderer({ index }) {
        return <div style={{ textAlign: "center", flex: 1 }}>{index + 1}</div>;
      }
    },
    operationColumn: {
      align: "center",
      width: 120,
      cellRenderer({ row, index }) {
        return (
          <div style={{ display: "flex", alignItem: "center", cursor: "pointer", lineHeight: "10px" }}>
            <el-space size={16}>
              {row.children ? (
                <div onClick={() => onAddSubTask(row)}>
                  <el-icon>
                    <Plus />
                  </el-icon>
                </div>
              ) : (
                <div onClick={onSave}>
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

const onSave = () => {
  console.log(dataList.value, "dataList");
};

const onAddSubTask = (row) => {
  row.children.push({
    taskName: "",
    id: uuidv4(),
    priority: undefined,
    status: "待处理",
    assignUser: undefined,
    endDate: dayjs().format("YYYY-MM-DD"),
    parentId: row.id
  });
  rowKeys.value = [row.id + ""];
};

const onDelMainTask = (row) => {
  if (row.parentId) {
    const mainDelIdx = dataList.value.findIndex((el) => el.id === row.parentId);
    if (mainDelIdx >= 0) {
      const innerDelIdx = dataList.value[mainDelIdx].children?.findIndex((el) => el.id === row.id);

      if (innerDelIdx >= 0) {
        dataList.value[mainDelIdx].children?.splice(innerDelIdx, 1);
      }
    }
  } else {
    const mainDelIdx = dataList.value.findIndex((el) => el.id === row.id);
    if (mainDelIdx >= 0) {
      dataList.value.splice(mainDelIdx, 1);
    }
  }
};

const onAddMainTask = () => {
  dataList.value.push({
    taskName: "",
    id: uuidv4(),
    priority: undefined,
    assignUser: undefined,
    status: "待处理",
    endDate: dayjs().format("YYYY-MM-DD"),
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
  height: calc(100vh - 180px);
  .switch {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    span {
      font-size: 14px;
    }
  }

  .tb {
    margin-bottom: 8px;

    :deep(.el-input) {
      width: 90%;
    }

    :deep(.cell) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
