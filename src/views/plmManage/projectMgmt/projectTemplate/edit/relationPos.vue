<template>
  <div style="margin-top: 40px">
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
import { watch } from "vue";
import { ref } from "vue";

const dataList = ref([]);
const columns = ref([]);
const tableRef = ref();

const selectRows = defineModel();

// const props = defineProps(["transData", "defaultSelectedKeys"]);
// console.log(props.transData, "props list");
// console.log(props.defaultSelectedKeys, "props defaultSelectedKeys");

const columnData: TableColumnList[] = [{ label: "任务相关岗位", prop: "label", minWidth: 160 }];

columns.value = setColumn({ columnData, operationColumn: false, indexColumn: false, selectionColumn: { hide: false }, radioColumn: false });

const handleClickRow = (row) => {
  console.log(row, "click row");
};

const changeSelection = (rows) => {
  selectRows.value = rows;
};

const setSelectedPos = (keys) => {
  setTimeout(() => {
    const tableIns = tableRef.value?.getTableRef();
    dataList.value.forEach((rowItem) => {
      if (keys.length && keys.includes(rowItem.key)) {
        tableIns.toggleRowSelection(rowItem, true);
      }
    });
  });
};

// watch(
//   () => props.defaultSelectedKeys,
//   (newVal) => {
//     if (newVal) {
//       setTimeout(() => {
//         const tableIns = tableRef.value?.getTableRef();
//         dataList.value.forEach((rowItem) => {
//           if (newVal.includes(rowItem.key)) {
//             tableIns.toggleRowSelection(rowItem, true);
//           }
//         });
//       });
//     }
//   },
//   { immediate: true }
// );

// watch(
//   () => props.transData,
//   (newVal) => {
//     if (newVal) {
//       dataList.value = newVal;
//     }
//   },
//   { immediate: true }
// );
defineExpose({ dataList, setSelectedPos });
</script>
