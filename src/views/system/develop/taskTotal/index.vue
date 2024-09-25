<template>
  <div>
    <div>
      <el-date-picker v-model="searchDate" value-format="YYYY-MM" type="month" placeholder="选择年月" />
    </div>
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="任务分配看板" name="taskBoard"><TaskBord :searchDate="searchDate" /></el-tab-pane>
      <el-tab-pane label="任务绩效" name="taskPerformance"><TaskPerformance :searchDate="searchDate" /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import TaskBord from "./components/taskBord.vue";
import TaskPerformance from "./components/taskPerformance.vue";
import dayjs from "dayjs";

const activeName = ref("taskBoard");
const searchDate = ref(dayjs().format("YYYY-MM"));

const handleClick = ({ paneName }) => {
  activeName.value = paneName;
};
</script>
