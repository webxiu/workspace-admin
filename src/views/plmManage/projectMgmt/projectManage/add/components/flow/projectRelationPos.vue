<template>
  <div>
    <div style="margin: 0 0 10px">
      <el-select
        :disabled="disabled"
        v-model="multipleSelect"
        filterable
        multiple
        placeholder="输入姓名进行搜索"
        :collapse-tags="multipleSelect.length > 2"
        @change="changeMultipleList"
      >
        <el-option v-for="item in dataList" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
    </div>
    <pure-table
      ref="tableRef"
      border
      :height="275"
      row-key="key"
      class="bill-manage"
      adaptive
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns"
      @row-click="handleClickRow"
      highlight-current-row
      show-overflow-tooltip
      @selection-change="changeSelection"
    />
  </div>
</template>

<script setup lang="ts">
import { setColumn } from "@/utils/table";
import { ref } from "vue";

const dataList: any = ref();
const columns = ref([]);
const tableRef = ref();
const multipleSelect = ref([]);

const selectRows = defineModel();
const props = defineProps(["disabled"]);

const changeMultipleList = (selectedRows) => {
  const tableIns = tableRef.value?.getTableRef();

  if (!selectedRows.length) {
    tableIns.clearSelection();
    return;
  }
  checkRows(selectedRows);
};

const columnData: TableColumnList[] = [{ label: "任务相关人", prop: "label", minWidth: 160 }];

columns.value = setColumn({
  columnData,
  operationColumn: false,
  indexColumn: false,
  selectionColumn: { hide: false, selectable: () => !props.disabled },
  radioColumn: false
});

const handleClickRow = (row) => {
  console.log(row, "click row");
};

const changeSelection = (rows) => {
  selectRows.value = rows;
  multipleSelect.value = rows.map((item) => item.key);
};

const checkRows = (keys) => {
  const tableIns = tableRef.value?.getTableRef();
  dataList.value.forEach((rowItem) => {
    if (keys.length) {
      tableIns.toggleRowSelection(rowItem, keys.includes(rowItem.key));
    }
  });
};

defineExpose({ checkRows, dataList, multipleSelect });
</script>
