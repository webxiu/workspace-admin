<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { DeptInfoItemType } from "@/api/systemManage";
import { getDeptTreeList } from "@/api/systemManage";
import { setColumn } from "@/utils/table";
import { handleTree } from "@/utils/tree";

const rowData = ref<DeptInfoItemType>();
const loading = ref<boolean>(false);
const columns = ref<TableColumnList[]>([]);
const dataList = ref<DeptInfoItemType[]>([]);

onMounted(() => getTableList());

const maxHeight = 400;
const getColumnConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "部门名称", prop: "deptName", minWidth: 160 },
    { label: "角色编号", prop: "roleCode", align: "right" },
    { label: "角色名称", prop: "roleName" },
    { label: "金蝶系统ID", prop: "k3RoleId" },
    { label: "金蝶系统编号", prop: "k3RoleCode" },
    { label: "说明", prop: "remark" },
    { label: "所属部门", prop: "deptName" }
  ];
  columns.value = setColumn({ columnData, operationColumn: false });
};

// 获取部门列表
const getTableList = () => {
  loading.value = true;
  getColumnConfig();
  getDeptTreeList()
    .then(({ data }) => {
      loading.value = false;
      const result = handleTree(data || [], "itemId", "parentId", "children");
      dataList.value = result;
    })
    .catch((err) => (loading.value = false));
};

const onCurrentChange = (row: DeptInfoItemType) => {
  rowData.value = row;
};

function getRef() {
  return rowData.value;
}
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
        class="user-manage"
        :adaptive="true"
        align-whole="center"
        :loading="loading"
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
