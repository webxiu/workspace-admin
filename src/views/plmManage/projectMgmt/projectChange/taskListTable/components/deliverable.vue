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
import { fetchAllTemplateList } from "@/api/plmManage";

const maxHeight = ref(275);
// const dataList = ref<any>([]);
const dataList = defineModel({ type: Array<any>, default: [] });
const columns = ref([]);
const currentRow = ref();
const allDeliverTemplates = ref([]);

const editCell = tableEditRender();

const getConfig = () => {
  const columnsData: TableColumnList[] = [
    { label: "交付物名称", prop: "name", cellRenderer: (data) => editCell.editCellRender({ data }) },
    {
      label: "交付物模板",
      prop: "deliverableId",
      cellRenderer: (data) => {
        return editCell.editCellRender({ type: "select", data, options: allDeliverTemplates.value, cellStyle: { color: "#606266", textAlign: "left" } });
      }
    }
  ];
  columns.value = setColumn({ columnData: columnsData, operationColumn: false, indexColumn: false });
};

const addRow = () => {
  dataList.value = dataList.value.concat({ name: "", deliverableId: "" });
};
const delRow = () => {
  if (currentRow.value) {
    dataList.value.splice(currentRow.value.index, 1);
  } else {
    message("请选择记录", { type: "warning" });
  }
};
const handleClickRow = (row) => {
  currentRow.value = row;
};

const tableRowClassName = ({ row, rowIndex }) => {
  //把每一行的索引放进row
  row.index = rowIndex;
};

const getDeliverableOptions = () => {
  fetchAllTemplateList({}).then((res: any) => {
    if (res.data) {
      allDeliverTemplates.value = res.data.map((item) => ({ optionName: item.name, optionValue: item.id }));
    }
  });
};

onMounted(() => {
  getConfig();
  getDeliverableOptions();
});
</script>
