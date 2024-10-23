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
      row-key="id"
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
import { fetchAllTemplateList } from "@/api/plmManage";
import { message } from "@/utils/message";

const dataList = ref([]);
const columns = ref([]);
const tableRef = ref();
const curRow = ref();
const allDeliverTemplates = ref([]);

const props = defineProps(["currentTaskRow"]);

const getConfig = () => {
  const { editCellRender } = tableEditRender();

  const columnData: TableColumnList[] = [
    { label: "交付物名称", prop: "name", cellRenderer: (data) => editCellRender({ data }) },
    {
      label: "交付物模板",
      prop: "deliverableId",
      cellRenderer: (data) => {
        return editCellRender({ type: "select", data, options: allDeliverTemplates.value, cellStyle: { color: "#606266", textAlign: "left" } });
      }
    }
  ];

  columns.value = setColumn({
    columnData,
    operationColumn: false
  });
};

const tableRowClassName = ({ row, rowIndex }) => {
  //把每一行的索引放进row
  row.index = rowIndex;
};

const rowClick = (row) => {
  curRow.value = row;
};

const onAdd = () => {
  dataList.value.push({ name: "", deliverableId: "" });
};

const onDel = () => {
  if (curRow.value) {
    dataList.value.splice(curRow.value.index, 1);
    curRow.value = undefined;
  } else {
    message("请选择记录", { type: "warning" });
  }
};

const fetchOpts = () => {
  fetchAllTemplateList({}).then((res: any) => {
    if (res.data) {
      const resultData = res.data || [];
      allDeliverTemplates.value = resultData.map((item) => ({ optionName: item.name, optionValue: item.id }));
    }
  });
};

const initList = () => {
  if (props.currentTaskRow?.projectTaskDeliverableVOList?.length) {
    props.currentTaskRow?.projectTaskDeliverableVOList?.forEach((item) => {
      dataList.value.push({ name: item.deliverableName, deliverableId: +item.deliverableTemplateId, id: item.id });
    });
  }
};

onMounted(() => {
  fetchOpts();
  getConfig();
  initList();
});

defineExpose({ dataList });
</script>
