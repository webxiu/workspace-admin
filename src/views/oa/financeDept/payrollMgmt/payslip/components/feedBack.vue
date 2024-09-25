<script setup lang="ts">
import { getFeedBackList } from "@/api/oaManage/financeDept";
import { onMounted } from "vue";
import { ref } from "vue";
import { useRoute } from "vue-router";

const dataList = ref([]);
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

onMounted(() => {
  fetchFeedBackData();
});
</script>

<template>
  <div>
    <el-table :data="dataList" style="width: 100%; height: calc(100vh - 214px)">
      <el-table-column type="index" label="序号" align="center" width="60" />
      <el-table-column prop="payslipId" label="工资条ID" width="180" />
      <el-table-column prop="content" label="反馈信息" />
      <el-table-column prop="userName" label="反馈提交人" />
      <el-table-column prop="inDate" label="反馈提交时间" />
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table__empty-text) {
  line-height: calc(100vh - 214px);
}
</style>
