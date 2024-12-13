<script setup lang="tsx">
import { Delete, Plus } from "@element-plus/icons-vue";

import { tableEditRender, setColumn } from "@/utils/table";
import { message, showMessageBox } from "@/utils/message";
import { ref, watch } from "vue";

const emits = defineEmits(["change"]);
const { editCellRender } = tableEditRender();
const cellRenderer = (data) => editCellRender({ data });

const rowsData = ref([]);

const dataList = ref([
  { place: "供方在制", materialCode: "", number: "", major: "", computer: "", method: "", duty: "" },
  { place: "供方库存", materialCode: "", number: "", major: "", computer: "", method: "", duty: "" },
  { place: "德龙料仓", materialCode: "", number: "", major: "", computer: "", method: "", duty: "" },
  { place: "德龙在制", materialCode: "", number: "", major: "", computer: "", method: "", duty: "" },
  { place: "德龙成品", materialCode: "", number: "", major: "", computer: "", method: "", duty: "" }
]);

/** 编辑表格 */
const columnData: TableColumnList[] = [
  {
    label: "场所",
    prop: "place",
    cellRenderer,
    width: 160,
    headerRenderer: () => (
      <div class="flex just-center align-center">
        <span class="pr-2">场所</span>
        <el-button icon={Plus} size="small" link type="primary" onClick={onAdd} title="新增" />
        <el-button icon={Delete} size="small" link type="primary" onClick={onDeleteAll} title="批量删除" />
      </div>
    )
  },
  { label: "物料编号", prop: "materialCode", cellRenderer, width: 120 },
  { label: "数量", prop: "number", cellRenderer, width: 90 },
  { label: "采购部计划与仓储", prop: "major", cellRenderer, width: 120 },
  { label: "经管核算", prop: "computer", cellRenderer, width: 100 },
  { label: "技术研发中心判定变更前旧物料处置方法", prop: "method", width: 200, cellRenderer },
  { label: "责任归属判断", prop: "duty", cellRenderer, width: 120 }
];

const columns = setColumn({
  columnData: columnData,
  radioColumn: false,
  operationColumn: false,
  indexColumn: { hide: true },
  selectionColumn: { hide: false, width: "30px" }
});

watch(dataList, () => emits("change", dataList.value), { deep: true });

function onAdd() {
  dataList.value.push({ place: "", materialCode: "", number: "", major: "", computer: "", method: "", duty: "" });
}

function onDeleteAll() {
  if (!rowsData.value.length) return message.error("请选择要删除的记录");
  showMessageBox("确认要删除所选记录吗?")
    .then(() => {
      dataList.value = dataList.value.filter((item) => !rowsData.value.includes(item));
    })
    .catch(console.log);
}

function onSelectionChange(rows) {
  rowsData.value = rows;
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  const len = dataList.value.length;
  if (columnIndex === 7) {
    if (rowIndex >= 0) {
      return { rowspan: len, colspan: 1 };
    } else {
      return { rowspan: 0, colspan: 0 };
    }
  }
};
</script>

<template>
  <div class="ui-h-100 flex-col flex-1 inner-table">
    <pure-table
      border
      row-key="id"
      :adaptive="true"
      align-whole="center"
      size="small"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :show-overflow-tooltip="true"
      :span-method="objectSpanMethod"
      @selection-change="onSelectionChange"
    />
  </div>
</template>
