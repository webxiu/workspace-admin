<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { DeptInfoItemType, getRoleInfoList } from "@/api/systemManage";
import { setColumn } from "@/utils/table";
import { reactive } from "vue";
import { SearchOptionType } from "@/components/BlendedSearch/index.vue";
import { onMounted } from "vue";

const rowData = ref<DeptInfoItemType>();
const columns = ref<TableColumnList[]>([]);
const dataList = ref([]);

const formData = reactive({
  deptId: "",
  roleCode: "",
  roleName: ""
});

const maxHeight = 400;
const columnData: TableColumnList[] = [
  { label: "角色编号", prop: "roleCode", align: "right", width: 80 },
  { label: "角色名称", prop: "roleName" },
  { label: "所属部门", prop: "deptName", align: "left", headerAlign: "center" },
  { label: "备注", prop: "remark" }
];
columns.value = setColumn({ columnData, operationColumn: false });

const onCurrentChange = (row: DeptInfoItemType) => {
  if (!row) return;
  rowData.value = row;
};

const searchOptions = reactive<SearchOptionType[]>([{ label: "角色编号", value: "roleCode" }]);

const onTagSearch = (values) => {
  formData.roleCode = values.roleCode ?? "";
  formData.roleName = values.roleName ?? "";

  getDataList();
};

function getRef() {
  return rowData.value;
}

const getDataList = () => {
  getRoleInfoList({ ...formData }).then((res: any) => {
    if (res.data) {
      dataList.value = res.data;
    }
  });
};

onMounted(() => {
  getDataList();
});

defineExpose({ getRef });
</script>

<template>
  <div class="ui-w-100 ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <PureTableBar :columns="columns" :showIcon="false">
        <template #title>
          <BlendedSearch @tagSearch="onTagSearch" :searchOptions="searchOptions" placeholder="角色名称" searchField="roleName" />
        </template>
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
            @current-change="onCurrentChange"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
