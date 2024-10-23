<template>
  <div style="margin-bottom: 8px">
    <el-space :size="16">
      <el-button type="primary" size="small" @click="onAdd">新增</el-button>
      <el-button type="danger" size="small" @click="onDel">删除</el-button>
    </el-space>
  </div>
  <div>
    <pure-table
      border
      ref="tableRef"
      :height="300"
      row-key="beforeTaskId"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      @row-click="rowClick"
      :show-overflow-tooltip="true"
      :row-class-name="tableRowClassName"
    />
  </div>
</template>

<script setup lang="tsx">
import { onMounted, ref } from "vue";
import { setColumn, tableEditRender } from "@/utils/table";
import { getBOMTableRowSelectOptions } from "@/api/plmManage";
import { message } from "@/utils/message";

const dataList = ref([]);
const columns = ref([]);
const tableRef = ref();
const currentRow = ref();
const beforeTaskList = ref([]);
const beforeTaskModeList = ref([]);

const props = defineProps(["currentTaskRow", "dataTreeList"]);

const getConfig = () => {
  const editCell = tableEditRender();

  const columnData: TableColumnList[] = [
    {
      label: "前置任务",
      prop: "beforeTaskId",
      cellRenderer: (data) => {
        return editCell.editCellRender({ type: "select", data, options: beforeTaskList.value, cellStyle: { color: "#606266", textAlign: "left" } });
      }
    },
    {
      label: "前置模式",
      prop: "requireMode",
      cellRenderer: (data) => {
        if (data.row.requireMode == 1) data.row.delayDays = "";
        return editCell.editCellRender({
          type: "select",
          data,
          options: beforeTaskModeList.value,
          isEdit: data.row.beforeTaskId,
          cellStyle: { color: "#606266", textAlign: "left" }
        });
      }
    },
    {
      label: "延迟天数",
      prop: "delayDays",
      cellRenderer: (data) => editCell.editCellRender({ data, isEdit: data.row.requireMode && data.row.requireMode != 1 })
    }
  ];
  columns.value = setColumn({ columnData, operationColumn: false });
};

const tableRowClassName = ({ row, rowIndex }) => {
  row.index = rowIndex;
};

const rowClick = (row) => {
  currentRow.value = row;
};

const onAdd = () => {
  freshBeforeTask();
  dataList.value = dataList.value.concat({ beforeTaskId: "", requireMode: "", delayDays: "" });
};

const onDel = () => {
  if (currentRow.value) {
    dataList.value.splice(currentRow.value.index, 1);
    freshBeforeTask();
  } else {
    message("请选择记录", { type: "warning" });
  }
};

const freshBeforeTask = () => {
  const dataIds = dataList.value.map((item) => item.beforeTaskId);
  beforeTaskList.value = beforeTaskList.value.map((item) => ({ ...item, disabled: dataIds.includes(item.optionValue) }));
};

const getBeforeTaskOptions = () => {
  getBOMTableRowSelectOptions({ optioncode: "RequireMode" }).then((res) => {
    if (res.data) {
      const findRes = res.data.find((item) => item.optionCode === "RequireMode")?.optionList || [];
      beforeTaskModeList.value = findRes;
    }
  });
};

const initList = () => {
  if (props.currentTaskRow?.projectTaskRequireVOList?.length) {
    props.currentTaskRow?.projectTaskRequireVOList?.forEach((item) => {
      dataList.value.push({ beforeTaskId: item.requireProjectTaskId, requireMode: item.requireMode + "", delayDays: item.delayDays });
    });
  }

  if (props.dataTreeList) {
    const flatArr = props.dataTreeList
      .map((item) => item.taskVOList)
      .flat(Infinity)
      .map((item) => ({ optionName: item.name, optionValue: item.id.replaceAll("-", "") }));

    beforeTaskList.value = flatArr;
  }
};

const findTaskNameById = (taskId) => {
  const findName = beforeTaskList.value.find((item) => item.optionValue == taskId)?.optionName;
  console.log(findName, "findName===");
  return findName || "";
};

onMounted(() => {
  getBeforeTaskOptions();
  getConfig();
  initList();
});

defineExpose({ dataList, findTaskNameById });
</script>
