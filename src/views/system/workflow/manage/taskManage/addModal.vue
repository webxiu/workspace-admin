<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-08-21 11:45:27 
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { ref, onMounted, computed, PropType, reactive } from "vue";
import { getDeptRoleList, getDeptTreeData, DeptRoleItemType, DetartMenttemType, DeptUserItemType, getDeptUserList } from "@/api/systemManage";

const props = defineProps({
  personType: { type: String as PropType<"user" | "role">, default: "" },
  loading: { type: Boolean, default: false }
});

const maxHeight = 450;
const treeLoading = ref<boolean>(false);
const tableLoading = ref<boolean>(false);
const dataList = ref<DeptUserItemType[]>([]);
const treeOptions = ref<DetartMenttemType[]>([]);
const userRowsData = ref<Array<DeptUserItemType | DeptRoleItemType>>([]);
const formData = reactive({ userName: "", deptId: "", userCode: "" });
const tableRef = ref();
const tName = props.personType === "user" ? "用户" : "角色";

const columns = computed<TableColumnList[]>(() => {
  if (props.personType === "user") {
    return [
      { type: "selection" }, //
      { label: "序号", type: "index", width: 55 },
      { label: "用户名称", prop: "userName" },
      { label: "用户编号", prop: "userCode" }
    ];
  } else {
    return [
      { type: "selection" },
      { label: "序号", type: "index", width: 55 },
      { label: "角色名称", prop: "roleName" },
      { label: "角色编号", prop: "roleCode" },
      { label: "角色ID", prop: "id" },
      { label: "角色描述", prop: "remark" }
    ];
  }
});

onMounted(() => {
  if (props.personType === "user") {
    getDeptList();
  } else {
    getUserList();
  }
});

const onSearch = () => getUserList();

// 获取部门菜单树
const getDeptList = () => {
  treeLoading.value = true;
  getDeptTreeData()
    .then((res) => {
      treeLoading.value = false;
      const data = JSON.parse(res.data);
      treeOptions.value = data;
    })
    .catch(() => (treeLoading.value = false));
};

// 选择菜单树
const handleNodeClick = (data: DetartMenttemType) => {
  formData.deptId = data.id;
  getUserList();
};

// 获取列表
const getUserList = () => {
  tableLoading.value = true;
  const API = { user: getDeptUserList, role: getDeptRoleList };
  const params = props.personType === "user" ? formData : { page: 1, limit: 1000 };
  API[props.personType](params)
    .then((res) => {
      tableLoading.value = false;
      dataList.value = res.data;
    })
    .catch(() => (tableLoading.value = false));
};

const newDataList = computed(() => {
  const { userName, userCode } = formData;
  if (props.personType === "user") return dataList.value;
  return dataList.value
    .filter((item) => (userName ? item.roleName.indexOf(userName) > -1 : true))
    .filter((item) => (userCode ? item.roleCode.indexOf(userCode) > -1 : true));
});

// 多选
const handleSelectionChange = (rows) => {
  userRowsData.value = rows;
};

const onRowClick = (row) => {
  // tableRef.value?.getTableRef()?.toggleRowSelection(row);
};

function getRef() {
  return userRowsData.value;
}

defineExpose({ getRef });
</script>

<template>
  <div class="ui-w-100 ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <el-tree
        v-if="personType === 'user'"
        :data="treeOptions"
        node-key="id"
        v-loading="treeLoading"
        class="ui-ovy-a"
        :default-expand-all="true"
        @node-click="handleNodeClick"
        :props="{ children: 'children', label: 'name' }"
        :style="{ minWidth: '220px', height: `${maxHeight + 58}px` }"
      />
      <PureTableBar :columns="columns" :showIcon="false" style="padding-top: 0">
        <template #title>
          <el-form :model="formData" :inline="true">
            <el-form-item :label="personType === 'role' ? '搜索' : ''">
              <el-input v-model.trim="formData.userName" :placeholder="`请输入${tName}名称`" clearable style="width: 200px" />
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="formData.userCode" :placeholder="`请输入${tName}编号`" clearable style="width: 200px" />
            </el-form-item>
            <el-form-item>
              <el-button v-if="personType === 'user'" type="primary" @click="onSearch">搜索</el-button>
            </el-form-item>
          </el-form>
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
            :data="newDataList"
            :columns="dynamicColumns"
            highlight-current-row
            :default-expand-all="true"
            :show-overflow-tooltip="true"
            @row-click="onRowClick"
            @selection-change="handleSelectionChange"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
