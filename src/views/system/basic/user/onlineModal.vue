<!-- /*
 * @Author: Hailen
 * @Date: 2023-07-05 11:45:27
 * @Last Modified by:   Hailen
 * @Last Modified time: 2023-07-05 11:45:27
 */ -->

<script setup lang="tsx">
import { ref } from "vue";
import { onMounted } from "vue";
import { setColumn } from "@/utils/table";
import { onlineUserInfoDetail, UserinfoOnlineItemType } from "@/api/systemManage";
import { Refresh } from "@element-plus/icons-vue";

const columns = ref<TableColumnList[]>([]);
const dataList = ref<UserinfoOnlineItemType[]>([]);
const loading = ref<boolean>(false);
const maxHeight = 400;

onMounted(() => {
  getColumnConfig();
  getDetailData();
});

const getColumnConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "员工工号", prop: "userCode", width: 120, sortable: true },
    { label: "员工姓名", prop: "userName", width: 140, sortable: true },
    {
      label: "设备状态",
      prop: "loginType",
      width: 140,
      sortable: true,
      cellRenderer: ({ row }) => {
        const isPc = row?.loginType === "PC端登录";
        return (
          <div>
            <span class="online-status" style={{ background: isPc ? "green" : "blue" }} />
            {row?.loginType}
          </div>
        );
      }
    },
    { label: "部门", prop: "deptName", width: 140, sortable: true },
    { label: "设备标识", prop: "devType", sortable: true }
  ];
  columns.value = setColumn({ columnData, operationColumn: false });
};

const getDetailData = () => {
  loading.value = true;
  onlineUserInfoDetail()
    .then(({ data }) => {
      loading.value = false;
      if (data) dataList.value = data;
    })
    .catch(() => (loading.value = false));
};
</script>
<template>
  <div class="ui-w-100 ui-h-100">
    <PureTableBar :columns="columns" :showIcon="false">
      <template v-slot="{ size, dynamicColumns }">
        <el-button size="small" :icon="Refresh" style="margin-bottom: 8px" type="primary" @click="getDetailData">刷新</el-button>

        <pure-table
          border
          :height="maxHeight"
          :max-height="maxHeight"
          row-key="itemId"
          class="user-online"
          :adaptive="true"
          align-whole="center"
          :loading="loading"
          :size="size"
          :data="dataList"
          :columns="dynamicColumns"
          highlight-current-row
          :show-overflow-tooltip="true"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<style lang="scss" scoped>
:deep(.online-status) {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
}
</style>
