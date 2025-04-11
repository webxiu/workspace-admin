<script setup lang="ts">
import { getFeedBackList } from "@/api/oaManage/financeDept";
import { setColumn } from "@/utils/table";
import { onMounted } from "vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

const dataList = ref([]);
const columns = ref([]);
const route = useRoute();

const fetchFeedBackData = () => {
  const payslipIdStr = route.query.gzmbNo + (route.query.payslipId as string);
  getFeedBackList({ payslipId: payslipIdStr }).then((res: any) => {
    if (res.data) {
      dataList.value = res.data;
      console.log(res.data, "反馈列表");
    }
  });
};

const getConfig = () => {
  const columnData: TableColumnList[] = [
    { label: "工资条ID", prop: "payslipId", width: 180 },
    { label: "反馈信息", prop: "content", width: 180 },
    { label: "反馈提交人", prop: "userName", width: 180 },
    { label: "反馈提交时间", prop: "inDate", width: 180 }
  ];
  columns.value = setColumn({ columnData, operationColumn: false });
};

onMounted(() => {
  getConfig();
  fetchFeedBackData();
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
