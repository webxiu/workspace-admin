<template>
  <div style="width: 100%">
    <div style="margin-bottom: 10px">
      <el-button type="primary" plain size="small" @click="addRow" :disabled="disabled">增行</el-button>
      <el-button type="danger" plain size="small" @click="delRow" :disabled="disabled">删行</el-button>
    </div>
    <pure-table
      border
      :height="270"
      row-key="beforeTaskId"
      class="bill-manage"
      adaptive
      align-whole="left"
      :row-class-name="tableRowClassName"
      size="small"
      :data="dataList"
      :columns="columns"
      @row-click="handleClickRow"
      highlight-current-row
      show-overflow-tooltip
    />
  </div>
</template>

<script setup lang="tsx">
import { setColumn, tableEditRender } from "@/utils/table";

import { ElMessage } from "element-plus";
import { ref } from "vue";

const columns = ref([]);
const curRow: any = ref({});
const dataList: any = defineModel();
const beforeTaskList: any = ref([]);
const beforeTaskModeList: any = ref([]);
const taskName = ref("");

const props = defineProps(["disabled"]);

// 编辑表格
const { editCellRender } = tableEditRender();

const columnData: TableColumnList[] = [
  {
    label: "前置任务",
    prop: "beforeTaskId",
    cellRenderer: (data) => {
      return editCellRender({
        type: "treeSelect",
        data,
        options: beforeTaskList.value,
        isEdit: !props.disabled,
        cellStyle: { color: "#606266", textAlign: "left" }
      });
    }
  },
  {
    label: "前置模式",
    prop: "requireMode",
    cellRenderer: (data) => {
      if (data.row.requireMode == 1) data.row.delayDays = "";
      return editCellRender({
        type: "select",
        data,
        options: beforeTaskModeList.value,
        isEdit: !props.disabled && data.row.beforeTaskId,
        cellStyle: { color: "#606266", textAlign: "left" }
      });
    }
  },
  {
    label: "延迟天数",
    prop: "delayDays",
    cellRenderer: (data) => editCellRender({ data, isEdit: data.row.requireMode && data.row.requireMode != 1 && !props.disabled })
  }
];

columns.value = setColumn({ columnData, operationColumn: false, indexColumn: false });

const freshSelectOpts = () => {
  const selectedArr = dataList.value.map((item) => item.beforeTaskId);
  const filterOpts = beforeTaskList.value?.map((item) => {
    if (item.optionName === taskName.value || selectedArr.includes(item.optionValue)) {
      item.disabled = true;
    } else {
      item.disabled = false;
    }
    return item;
  });
  beforeTaskList.value = filterOpts;
};

const addRow = () => {
  freshSelectOpts();
  dataList.value.push({ beforeTaskId: "", requireMode: "", delayDays: "" });
};

const delRow = () => {
  if (JSON.stringify(curRow.value) !== "{}") {
    dataList.value.splice(curRow.value.index, 1);
  } else {
    ElMessage({ message: "请选择记录", type: "warning" });
  }
  freshSelectOpts();
};

const tableRowClassName = ({ row, rowIndex }) => {
  //把每一行的索引放进row
  row.index = rowIndex;
  return "";
};

const handleClickRow = (row, column) => {
  curRow.value = row;
};

defineExpose({ beforeTaskModeList, beforeTaskList, dataList, taskName });
</script>
