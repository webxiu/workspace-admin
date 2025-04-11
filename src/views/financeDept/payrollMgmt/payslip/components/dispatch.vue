<script setup lang="ts">
import { getDispatchList } from "@/api/oaManage/financeDept";
import { setColumn } from "@/utils/table";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const dataList = ref([]);
const columns = ref<TableColumnList[]>([]);
const route = useRoute();

const fetchFeedDispatchData = () => {
  const payslipIdStr = route.query.gzmbNo + (route.query.payslipId as string);
  getDispatchList({ payslipId: payslipIdStr }).then((res: any) => {
    if (res.data) {
      dataList.value = res.data.map((item) => ({ ...item, staffId: item.staffId || route.query.staffId }));
      console.log(res.data, "分发列表");
    }
  });
};

const getConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "工资条ID", prop: "payslipId", width: 100 },
    { label: "工资条工号", prop: "staffId", width: 100 },
    { label: "异常信息", prop: "errorMsg", width: 100 },
    { label: "推送信息", prop: "tducontent", minWidth: 160 },
    { label: "操作人", prop: "userName", width: 100 },
    { label: "分发时间", prop: "inDate", width: 160 }
  ];

  columns.value = setColumn({ columnData, operationColumn: false });
};

onMounted(() => {
  getConfig();
  fetchFeedDispatchData();
});
</script>

<template>
  <div>
    <pure-table
      border
      :height="700"
      :max-height="700"
      row-key="id"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :show-overflow-tooltip="true"
    />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table__empty-text) {
  line-height: calc(100vh - 214px);
}
</style>
