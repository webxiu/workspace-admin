<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref, PropType, reactive, computed } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { OptAuthDeptTreeItemType } from "@/api/systemManage";
import { message } from "@/utils/message";
import { setColumn } from "@/utils/table";

const props = defineProps({
  dataList: {
    type: Array as PropType<OptAuthDeptTreeItemType[]>,
    default: () => []
  },
  loading: { type: Boolean, default: false }
});

const tableRef = ref();
const maxHeight = 400;
const deptIDs = ref<number[]>([]);
const columns = ref<TableColumnList[]>([]);
const formData = reactive({
  deptName: "",
  roleName: "",
  roleCode: ""
});

const columnData: TableColumnList[] = [
  { label: "部门名称", prop: "deptName", align: "left" },
  { label: "角色名称", prop: "roleName" },
  { label: "角色编号", prop: "roleCode" }
];
columns.value = setColumn({ columnData, selectionColumn: { hide: false }, radioColumn: false, operationColumn: false });

const filterFn = (item: OptAuthDeptTreeItemType, name: string) => {
  return formData[name] ? item[name].indexOf(formData[name]) > -1 : true;
};
const newList = computed(() => {
  return props.dataList
    .filter((item) => filterFn(item, "deptName"))
    .filter((item) => filterFn(item, "roleName"))
    .filter((item) => filterFn(item, "roleCode"));
});

// 点击行
const handleSelectionChange = (rows: OptAuthDeptTreeItemType[]) => {
  if (!rows.length) return;
  const filterRows = rows.filter((item) => !item.id);
  if (filterRows.length > 0) {
    return message("目录不能更新角色权限，请选择菜单或者按钮", { type: "error" });
  }
  const deptID = rows.filter((item) => item.roleCode).map((item) => item.id);
  deptIDs.value = deptID;
};

const onRowClick = (row: OptAuthDeptTreeItemType) => {
  // tableRef.value?.getTableRef()?.toggleRowSelection(row);
};

function getRef() {
  return deptIDs.value;
}
defineExpose({ getRef });
</script>

<template>
  <PureTableBar :columns="columns" :show-icon="false">
    <template #title>
      <el-form :model="formData" :inline="true">
        <el-form-item label="搜索">
          <el-input v-model.trim="formData.deptName" placeholder="部门名称" clearable style="width: 200px" />
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="formData.roleName" placeholder="角色名称" clearable style="width: 140px" />
        </el-form-item>
        <el-form-item>
          <el-input v-model.trim="formData.roleCode" placeholder="角色编号" clearable style="width: 140px" />
        </el-form-item>
      </el-form>
    </template>
    <template v-slot="{ size, dynamicColumns }">
      <pure-table
        border
        ref="tableRef"
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="itemId"
        class="user-manage"
        :adaptive="true"
        align-whole="center"
        :loading="loading"
        :size="size"
        :data="newList"
        :columns="dynamicColumns"
        :paginationSmall="size === 'small'"
        highlight-current-row
        :select-on-indeterminate="false"
        :default-expand-all="false"
        :show-overflow-tooltip="true"
        @row-click="onRowClick"
        @selection-change="handleSelectionChange"
      />
    </template>
  </PureTableBar>
</template>
