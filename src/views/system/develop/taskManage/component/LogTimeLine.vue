<template>
  <div style="margin: 0 10px 0 15px">
    <el-divider><h2>操作日志</h2></el-divider>
    <el-timeline v-if="taskLogList?.length > 0">
      <el-timeline-item v-for="(item, index) in taskLogList" :key="index" type="primary" size="large" :hollow="true">
        <el-card body-style="padding:8px 10px">
          <div style="font-weight: bold">{{ item.createDate }} {{ item.userName }}</div>
          <div style="margin-top: 10px; line-height: 22px">{{ item.content }}</div>
        </el-card>
      </el-timeline-item>
    </el-timeline>
    <el-empty v-else description="暂无数据" />
  </div>
</template>

<script lang="ts" setup>
import { TaskLogItemType } from "@/api/systemManage";

defineProps<{ taskLogList: TaskLogItemType[] }>();
</script>
