<!-- /*
 * @Author: Hailen
 * @Date: 2023-07-05 11:45:27
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-08-31 11:45:27
 */ -->

<script setup lang="ts">
import { PureTableBar } from "@/components/RePureTableBar";
import { ref, onMounted, reactive } from "vue";
import { getDeptTreeData, DetartMenttemType, DeptUserItemType, getDeptUserList, queryUserDeptList } from "@/api/systemManage";
import { setColumn } from "@/utils/table";

const props = defineProps({
  userState: { type: String, default: "all" },
  initUserId: { type: Number, default: 0 },
  multiple: { type: Boolean, default: false }
});

const maxHeight = 450;
const curNodeKey = ref("0");
const treeLoading = ref<boolean>(false);
const tableLoading = ref<boolean>(false);
const dataList = ref<DeptUserItemType[]>([]);
const treeOptions = ref<DetartMenttemType[]>([]);
const rowData = ref<Array<DeptUserItemType> | DeptUserItemType>([]);
const formData = reactive({ userName: "", deptId: "", userCode: "", userState: props.userState });
const tableRef = ref();

const cols: TableColumnList[] = [
  { label: "序号", type: "index", width: 55 },
  { label: "用户编号", prop: "userCode" },
  { label: "用户名称", prop: "userName" }
];

const columns = ref<TableColumnList[]>([]);

const initChooseUserInfo = () => {
  if (props.initUserId) {
    queryUserDeptList({ userId: props.initUserId }).then((res: any) => {
      if (res.data) {
        const mainDeptId = res.data.find((item) => item.isMaster)?.deptId;
        if (mainDeptId) {
          formData.deptId = mainDeptId;
          setTimeout(() => {
            curNodeKey.value = mainDeptId + "";
          });
          getUserList();
        }
      }
    });
  }
};

onMounted(() => {
  if (props.multiple) {
    columns.value = [{ type: "selection", width: 55 }, ...cols];
  } else {
    columns.value = setColumn({ columnData: cols, operationColumn: false });
  }
  getDeptList();
});

// 获取部门菜单树
const getDeptList = () => {
  treeLoading.value = true;
  getDeptTreeData()
    .then((res) => {
      initChooseUserInfo();
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

const onSearch = () => {
  getUserList();
};

// 单选
const onCurrentChange = (row) => {
  if (props.multiple) return;
  rowData.value = row;
};

// 多选
const handleSelectionChange = (rows: DeptUserItemType[]) => {
  if (props.multiple) {
    rowData.value = rows;
  }
};

const onRowClick = (row: DeptUserItemType) => {
  // if (props.multiple) {
  //   tableRef.value?.getTableRef()?.toggleRowSelection(row);
  // }
};

// 获取列表
const getUserList = () => {
  tableLoading.value = true;
  getDeptUserList(formData)
    .then((res) => {
      tableLoading.value = false;
      dataList.value = res.data;
      const curUserRow = res.data.find((item) => item.id == props.initUserId);
      if (curUserRow) {
        tableRef.value?.getTableRef()?.setCurrentRow(curUserRow);
      }
    })
    .catch(() => (tableLoading.value = false));
};

function getRef() {
  return rowData.value;
}

defineExpose({ getRef });
</script>

<template>
  <div class="ui-w-100 ui-h-100 flex-col flex-1 main main-content">
    <div class="flex flex-1 ui-h-100 ui-w-100 ui-ov-h">
      <el-tree
        :data="treeOptions"
        node-key="id"
        v-loading="treeLoading"
        :expand-on-click-node="false"
        :current-node-key="curNodeKey"
        class="ui-ovy-a"
        :default-expand-all="true"
        @node-click="handleNodeClick"
        highlight-current
        :props="{ children: 'children', label: 'name' }"
        :style="{ minWidth: '220px', height: `${maxHeight - 30}px` }"
      />
      <PureTableBar :columns="columns" :showIcon="false" style="padding-top: 0">
        <template #title>
          <el-form :model="formData" :inline="true">
            <el-form-item>
              <el-input v-model.trim="formData.userCode" placeholder="请输入用户编号" clearable style="width: 200px" />
            </el-form-item>
            <el-form-item>
              <el-input v-model.trim="formData.userName" placeholder="请输入用户名称" clearable style="width: 200px" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">搜索</el-button>
            </el-form-item>
          </el-form>
        </template>
        <template v-slot="{ size, dynamicColumns }">
          <pure-table
            border
            ref="tableRef"
            :height="maxHeight - 88"
            :max-height="maxHeight - 88"
            row-key="id"
            :adaptive="true"
            align-whole="center"
            :loading="tableLoading"
            :size="size"
            :data="dataList"
            :columns="dynamicColumns"
            highlight-current-row
            :default-expand-all="true"
            :show-overflow-tooltip="true"
            @current-change="onCurrentChange"
            @row-click="onRowClick"
            @selection-change="handleSelectionChange"
          />
        </template>
      </PureTableBar>
    </div>
  </div>
</template>
