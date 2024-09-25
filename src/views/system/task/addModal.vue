<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { DeptInfoItemType } from "@/api/systemManage";
import { getDeptTreeData, getRoleInfoList, getDeptUserList, RoleInfoItemType, DeptUserItemType } from "@/api/systemManage";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";

interface DeptTreeDataType {
  id: string;
  parentId: string;
  name: string;
  title: string;
  director: string;
  displayOrder: number;
  children: DeptTreeDataType[];
}

const props = defineProps({
  addType: { type: String, default: "role" }
});

const maxHeight = 400;
const loading = ref<boolean>(true);
const tableLoading = ref<boolean>(false);
const dataSource = ref<DeptTreeDataType[]>([]);
const dataList = ref<Array<RoleInfoItemType | DeptUserItemType>>([]);
const roleRows = ref<RoleInfoItemType[]>([]);
const nameObj = { role: "角色", user: "用户" };
const addName = nameObj[props.addType];
const querCode = `${props.addType}Code`;
const querName = `${props.addType}Name`;
const tableRef = ref();

const searchOptions = reactive<SearchOptionType[]>([
  { label: `${addName}编号`, value: querCode },
  { label: `${addName}名称`, value: querName }
]);

const formData = reactive({ deptId: "", [querCode]: "", [querName]: "" });

const columns = ref<TableColumnList[]>([
  { type: "selection" }, //
  { label: `${addName}编号`, prop: querCode },
  { label: `${addName}名称`, prop: querName }
]);

onMounted(() => getDeptList());

/** 1.获取部门树形列表 */
const getDeptList = () => {
  loading.value = true;
  getDeptTreeData()
    .then((res) => {
      const data = JSON.parse(res.data);
      dataSource.value = data;
      loading.value = false;
    })
    .catch(() => (loading.value = false));
};

/** 2.获取角色/用户列表 */
const getTableList = () => {
  const API = { role: getRoleInfoList, user: getDeptUserList };
  tableLoading.value = true;
  API[props.addType](formData)
    .then((res) => {
      tableLoading.value = false;
      dataList.value = res.data;
    })
    .catch((err) => (tableLoading.value = false));
};

const onTagSearch = (values) => {
  formData[querCode] = values[querCode];
  formData[querName] = values[querName];
  getTableList();
};

// 点击树形菜单
const handleNodeClick = (data: DeptTreeDataType) => {
  formData.deptId = data.id;
  formData[querCode] = "";
  formData[querName] = "";
  getTableList();
};

// 多选行
const onSelectionChange = (rows: DeptInfoItemType[]) => {
  roleRows.value = rows;
};

const onRowClick = (row: DeptInfoItemType) => {
  // tableRef.value?.getTableRef()?.toggleRowSelection(row);
};

function getRef() {
  return roleRows.value;
}

defineExpose({ getRef });
</script>

<template>
  <div class="task-modal flex">
    <el-tree
      ref="treeRef"
      v-loading="loading"
      :data="dataSource"
      node-key="id"
      :check-strictly="false"
      :highlight-current="true"
      :props="{ label: 'title', children: 'children' }"
      :default-expand-all="false"
      :defaultExpandedKeys="['0']"
      :expand-on-click-node="false"
      @node-click="handleNodeClick"
      class="border-line"
      :style="{ width: '280px', maxHeight: `${maxHeight + 40}px`, overflowY: 'auto' }"
    />
    <PureTableBar :columns="columns" :show-icon="false">
      <template #title>
        <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" :placeholder="`请输入${addName}编号`" :searchField="`${addType}Code`" />
      </template>
      <template v-slot="{ size, dynamicColumns }">
        <pure-table
          border
          ref="tableRef"
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="id"
          :adaptive="true"
          align-whole="center"
          :loading="tableLoading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          :paginationSmall="size === 'small'"
          highlight-current-row
          :show-overflow-tooltip="true"
          @row-click="onRowClick"
          @selection-change="onSelectionChange"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss">
.task-modal {
  .bg-bg_color {
    padding-top: 0;
  }
}
</style>
