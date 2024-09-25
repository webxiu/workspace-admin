<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref, PropType } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { DeptInfoItemType } from "@/api/systemManage";
import { message } from "@/utils/message";
import { setColumn } from "@/utils/table";

defineProps({
  dataList: {
    type: Array as PropType<DeptInfoItemType[]>,
    default: () => []
  }
});

const maxHeight = 400;
const rowData = ref<DeptInfoItemType>();
const columns = ref<TableColumnList[]>([]);
const columnData: TableColumnList[] = [
  { label: "部门名称", prop: "deptName", align: "left" },
  { label: "角色编号", prop: "roleCode" },
  { label: "角色名称", prop: "roleName" },
  { label: "说明", prop: "remark" }
];

columns.value = setColumn({ columnData, isCustomExpend: true, operationColumn: false });

function getRef() {
  return rowData.value;
}

// 点击行
const onCurrentChange = (row: DeptInfoItemType) => {
  if (!row) return;
  if (!row.roleCode) {
    return message("请选择到子部门", { type: "error" });
  }
  rowData.value = row;
};

defineExpose({ getRef });
</script>

<template>
  <PureTableBar :columns="columns" :show-icon="false">
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="itemId"
        class="copy-authorty"
        :adaptive="true"
        align-whole="center"
        :size="size"
        :data="dataList"
        :columns="dynamicColumns"
        :paginationSmall="size === 'small'"
        highlight-current-row
        :default-expand-all="false"
        :show-overflow-tooltip="true"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        @current-change="onCurrentChange"
      />
    </template>
  </PureTableBar>
</template>
