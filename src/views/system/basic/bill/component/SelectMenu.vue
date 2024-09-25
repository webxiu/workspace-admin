<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-08-21 11:45:27 
 */ -->

<script setup lang="tsx">
import { MenuListItemType, billMenuList } from "@/api/systemManage";
import { PureTableBar } from "@/components/RePureTableBar";
import { DeptUserItemType } from "@/api/systemManage";
import { ref, onMounted, reactive } from "vue";
import { handleTree } from "@/utils/tree";
import { setColumn } from "@/utils/table";

const maxHeight = 450;
const loading = ref<boolean>(false);
const columns = ref<TableColumnList[]>([]);
const dataList = ref<MenuListItemType[]>([]);
const rowData = ref<DeptUserItemType>();
const queryForm = reactive({ menuName: "" });
const tableRef = ref();

onMounted(() => {
  getColumnConfig();
  getTableList();
});

const getColumnConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "菜单名称", prop: "menuName", align: "left", minWidth: 200 },
    { label: "类型", prop: "menuType" },
    { label: "是否启用", prop: "isEnable", cellRenderer: ({ row }) => <span>{row.isEnable ? "启用" : "禁用"}</span> },
    { label: "创建时间", prop: "createDate", minWidth: 160 }
  ];
  columns.value = setColumn({ columnData, isCustomExpend: true, operationColumn: { hide: true } });
};

const getTableList = () => {
  loading.value = true;
  dataList.value = [];
  billMenuList(queryForm)
    .then((res) => {
      loading.value = false;
      dataList.value = handleTree(res.data, "menuCode", "parentCode", "children");
    })
    .catch((err) => (loading.value = false));
};

const onChange = (value) => {
  queryForm.menuName = value;
  getTableList();
};

const onRowClick = (row) => {
  rowData.value = row;
  // tableRef.value?.getTableRef()?.toggleRowSelection(row);
};

function getRef() {
  return rowData.value;
}

defineExpose({ getRef });
</script>

<template>
  <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
    <PureTableBar :columns="columns" :showIcon="false" style="padding-top: 0">
      <template #title>
        <el-input v-model.trim="queryForm.menuName" @change="onChange" placeholder="请输入菜单名称" clearable style="width: 220px" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="itemId"
          :adaptive="true"
          align-whole="center"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
          :show-overflow-tooltip="true"
          @row-click="onRowClick"
        />
      </template>
    </PureTableBar>
  </div>
</template>
