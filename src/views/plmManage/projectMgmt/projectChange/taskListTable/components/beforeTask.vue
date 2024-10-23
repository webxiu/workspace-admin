<template>
  <div style="width: 100%">
    <div style="margin-bottom: 10px">
      <el-button type="primary" plain size="small" @click="addRow"> 增行 </el-button>
      <el-button type="danger" plain size="small" @click="delRow"> 删行 </el-button>
    </div>
    <pure-table
      border
      :height="maxHeight"
      row-key="beforeTaskId"
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
import { onMounted, ref } from "vue";
import { tableEditRender, setColumn } from "@/utils/table";
import { message } from "@/utils/message";
import { fetchEditProjectBeforeTaskOptionList, getBOMTableRowSelectOptions } from "@/api/plmManage";

const maxHeight = ref(275);
const dataList = defineModel({ type: Array<any>, default: [] });
const columns = ref([]);
const currentRow = ref();
const beforeTaskList = ref([]);
const beforeTaskModeList = ref([]);

const editCell = tableEditRender();

const props = defineProps(["topFormData"]);

const getConfig = () => {
  const columnsData: TableColumnList[] = [
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
  columns.value = setColumn({ columnData: columnsData, operationColumn: false, indexColumn: false });
};

const addRow = () => {
  freshBeforeTask();
  dataList.value = dataList.value.concat({ beforeTaskId: "", requireMode: "", delayDays: "" });
};
const delRow = () => {
  if (currentRow.value) {
    dataList.value.splice(currentRow.value.index, 1);
    freshBeforeTask();
  } else {
    message("请选择记录", { type: "warning" });
  }
};
const handleClickRow = (row) => {
  currentRow.value = row;
};

const freshBeforeTask = () => {
  const dataIds = dataList.value.map((item) => item.beforeTaskId);
  beforeTaskList.value = beforeTaskList.value.map((item) => ({ ...item, disabled: dataIds.includes(item.optionValue) }));
};

const tableRowClassName = ({ row, rowIndex }) => {
  //把每一行的索引放进row
  row.index = rowIndex;
};

const getBeforeTaskOptions = () => {
  if (props.topFormData.projectId) {
    fetchEditProjectBeforeTaskOptionList({ projectId: props.topFormData.projectId }).then((res: any) => {
      if (res.data) {
        beforeTaskList.value = res.data.map((item) => ({ optionValue: item.id, optionName: item.name }));
      }
    });
  }

  getBOMTableRowSelectOptions({ optioncode: "RequireMode" }).then((res) => {
    if (res.data) {
      const findRes = res.data.find((item) => item.optionCode === "RequireMode")?.optionList || [];
      beforeTaskModeList.value = findRes;
    }
  });
};

onMounted(() => {
  getConfig();
  getBeforeTaskOptions();
});

defineExpose({ beforeTaskList });
</script>
