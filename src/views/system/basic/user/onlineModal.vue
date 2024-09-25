<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";
import { setColumn } from "@/utils/table";
import { PureTableBar } from "@/components/RePureTableBar";
import { onlineUserInfoDetail, UserinfoOnlineItemType } from "@/api/systemManage";

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
    { label: "员工工号", prop: "userCode" },
    { label: "员工姓名", prop: "userName" },
    { label: "部门", prop: "deptName" }
  ];
  columns.value = setColumn({ columnData, operationColumn: false });
};

const getDetailData = () => {
  loading.value = true;
  onlineUserInfoDetail()
    .then((res) => {
      loading.value = false;
      const data = res.data;
      if (data) dataList.value = data;
    })
    .catch(() => (loading.value = false));
};
</script>

<template>
  <div class="ui-w-100 ui-h-100">
    <PureTableBar :columns="columns" :showIcon="false">
      <template v-slot="{ size, dynamicColumns }">
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
