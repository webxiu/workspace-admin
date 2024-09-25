<script setup lang="ts">
import { onMounted, ref } from "vue";
import { setColumn } from "@/utils/table";
import { getInductionAuditRoleInfo } from "@/api/oaManage/humanResources";
import { roleUserList } from "@/api/systemManage";

const columns = ref([]);
const dataList = ref([]);
const currentRow = ref();
const resRole = ref("");
const resRoleList = ref([]);

const props: any = defineProps(["currentTaskRow"]);

const onSearch = () => {
  dataList.value = [];
};

const getColumnConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "姓名", prop: "userName" },
    { label: "工号", prop: "userCode", align: "right" },
    { label: "角色编码", prop: "roleCode", align: "right" },
    { label: "角色名称", prop: "roleName" }
  ];

  columns.value = setColumn({
    columnData,
    operationColumn: false
  });
};

const rowClick = (row) => {
  currentRow.value = row;
};

const fetchOpts = () => {
  getInductionAuditRoleInfo({}).then((res) => {
    if (res.data) {
      resRoleList.value = res.data.map((item) => ({ label: item.roleName, value: item.id }));
    }
  });
};

const changeResUsers = (val) => {
  roleUserList({ roleId: val }).then((res) => {
    if (res.data) {
      dataList.value = res.data;
    }
  });
};

const initRoleInfo = () => {
  const curRoleId = props.currentTaskRow.projectTaskResponsiblePersonnelVOList[0]?.roleId;
  if (curRoleId) {
    resRole.value = curRoleId;
    changeResUsers(curRoleId);
  }
};

onMounted(() => {
  initRoleInfo();
  fetchOpts();
  getColumnConfig();
  onSearch();
});
defineExpose({ currentRow });
</script>

<template>
  <div style="margin-bottom: 8px">
    <el-select v-model="resRole" placeholder="选择负责人岗位" size="small" style="width: 240px" filterable @change="changeResUsers">
      <el-option v-for="item in resRoleList" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
  </div>
  <div>
    <pure-table
      border
      :height="300"
      row-key="id"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :show-overflow-tooltip="true"
      @row-click="rowClick"
    />
  </div>
</template>
