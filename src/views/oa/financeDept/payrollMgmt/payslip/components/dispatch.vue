<script setup lang="ts">
import { getDispatchList } from "@/api/oaManage/financeDept";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const dataList = ref([]);
const route = useRoute();

const fetchFeedDispatchData = () => {
  const payslipIdStr = route.query.gzmbNo + (route.query.payslipId as string);
  getDispatchList({ payslipId: payslipIdStr }).then((res: any) => {
    if (res.data) {
      dataList.value = res.data;
      console.log(res.data, "分发列表");
    }
  });
};

onMounted(() => {
  fetchFeedDispatchData();
});
</script>

<template>
  <div>
    <el-table :data="dataList" style="width: 100%; height: calc(100vh - 214px)">
      <el-table-column type="index" label="序号" align="center" width="60" />
      <el-table-column prop="payslipId" label="工资条ID" width="180" />
      <el-table-column prop="userCode" label="工资条工号" />
      <el-table-column prop="errorMsg" label="异常信息" />
      <el-table-column prop="tducontent" label="推送信息" />
      <el-table-column prop="userName" label="操作人" />
      <el-table-column prop="inDate" label="分发时间" />
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-table__empty-text) {
  line-height: calc(100vh - 214px);
}
</style>
