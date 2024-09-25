<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { setColumn } from "@/utils/table";

const rowData = ref();
const dataList = ref([]);
const columns = ref<TableColumnList[]>([]);

const maxHeight = 400;
const columnData: TableColumnList[] = [
  { label: "部门编号", prop: "deptCode" },
  { label: "部门名称", prop: "deptName" },
  { label: "部门负责人", prop: "principalName" },
  { label: "部门文员", prop: "clerkName" }
];
columns.value = setColumn({ columnData, isCustomExpend: true, operationColumn: false });

const onCurrentChange = (row) => {
  if (!row) return;
  rowData.value = row;
};

function getRef() {
  return rowData.value;
}

defineExpose({ getRef, dataList });
</script>

<template>
  <div class="ui-w-100 ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" :showIcon="false">
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            :height="maxHeight"
            :max-height="maxHeight"
            row-key="itemId"
            class="user-manage"
            :adaptive="true"
            align-whole="center"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            :default-expand-all="true"
            :show-overflow-tooltip="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @current-change="onCurrentChange"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
