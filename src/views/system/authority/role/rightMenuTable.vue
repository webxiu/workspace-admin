<template>
  <div>
    <pure-table
      ref="menuBtnRef"
      border
      :max-height="maxHeight"
      :height="maxHeight"
      row-key="id"
      class="role-button-table"
      :adaptive="true"
      align-whole="center"
      :loading="loading"
      size="small"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :show-overflow-tooltip="true"
      @row-click="onRowClick"
      @selection-change="handleSelectionChange"
    />
  </div>
</template>

<script setup lang="ts">
import { useEleHeight } from "@/hooks";
import { setColumn } from "@/utils/table";
import { ref } from "vue";
const maxHeight = useEleHeight(".app-main > .el-scrollbar", 55);

const menuBtnRef = ref();
// const maxHeight = ref(627);
const loading = ref(false);
const dataList = ref([]);
const columns = ref([]);
const selectedRows = ref([]);

const columnData: TableColumnList[] = [
  { label: "按钮分组", prop: "groupName", minWidth: 80 },
  { label: "按钮名称", prop: "btnName", minWidth: 90 }
];

columns.value = setColumn({ columnData, operationColumn: false, selectionColumn: { hide: false }, radioColumn: false });

const onRowClick = (row) => {
  // menuBtnRef.value?.getTableRef()?.toggleRowSelection(row);
};

const handleSelectionChange = (val) => {
  console.log(val, "select val");
  selectedRows.value = val;
};

defineExpose({ dataList, loading, selectedRows, menuBtnRef });
</script>
