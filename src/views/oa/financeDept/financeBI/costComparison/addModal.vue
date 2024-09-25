<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref, PropType, reactive } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import { DeptInfoItemType, DetartMenttemType, DeptUserItemType, getDeptUserList } from "@/api/systemManage";

defineProps({
  deptOptions: {
    type: Array as PropType<DetartMenttemType[]>,
    default: () => []
  },
  loading: { type: Boolean, default: false }
});

const userIdList = ref([]);
const dataList = ref<DeptUserItemType[]>([]);
const tableRef = ref();

const formData = reactive({
  userName: "",
  deptId: 0,
  userCode: ""
});

const maxHeight = 400;
const columns = ref<TableColumnList[]>([
  { type: "index" },
  { type: "selection" },
  { label: "用户编号", prop: "wxOpenid", align: "left" },
  { label: "用户名称", prop: "userName" }
]);

const handleSelectionChange = (rows: DeptUserItemType[]) => {
  userIdList.value = rows.map((item) => item.id);
};

const onRowClick = (row: DeptUserItemType) => {
  // tableRef.value?.getTableRef()?.toggleRowSelection(row);
};

const onSubmit = () => {
  getUserList();
};

function getRef() {
  return userIdList.value;
}

const handleNodeClick = (data: DetartMenttemType) => {
  formData.deptId = data.itemId;
  getUserList();
};
const getUserList = () => {
  getDeptUserList(formData).then((res) => {
    dataList.value = res.data;
  });
};

defineExpose({ getRef });
</script>

<template>
  <div class="ui-w-100 ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <el-tree
        :data="deptOptions"
        node-key="deptId"
        class="ui-ovy-a"
        :highlight-current="true"
        :default-expand-all="true"
        @node-click="handleNodeClick"
        :props="{ children: 'children', label: 'deptName' }"
        :style="{ minWidth: '220px', height: `${maxHeight}px` }"
      />
      <PureTableBar :columns="columns" :showIcon="false">
        <template #title>
          <el-form :inline="true" :model="formData" class="demo-form-inline">
            <el-form-item>
              <el-input v-model="formData.userCode" @keyup.enter="onSubmit" placeholder="请输入工号" style="width: 140px" clearable />
            </el-form-item>
            <el-form-item>
              <el-input v-model="formData.userName" @keyup.enter="onSubmit" placeholder="请输入姓名" style="width: 140px" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">查询</el-button>
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
            align-whole="left"
            :loading="loading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            :default-expand-all="true"
            :show-overflow-tooltip="true"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @row-click="onRowClick"
            @selection-change="handleSelectionChange"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
