<template>
  <div class="task-container">
    <div v-for="item in taskPendingList" :key="item.field" @click="onTaskClick(item)" class="task-item">
      <h3>{{ item.title }}</h3>
      <div class="flex align-center">
        <el-tag effect="dark" :type="item.task_state === '1' ? 'success' : 'danger'" size="large">{{ statusText[item.task_state] }}</el-tag>
        <el-text class="task-num" :type="item.task_state === '1' ? 'success' : 'danger'">{{ item.value }}</el-text>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { TaskStatusType, statusText } from "../hooks";

withDefaults(defineProps<{ taskPendingList: TaskStatusType[] }>(), {
  taskPendingList: () => []
});

const emits = defineEmits(["click"]);

const onTaskClick = (item: TaskStatusType) => {
  emits("click", item);
};
</script>
<style lang="scss" scoped>
.task-container {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 15px;
  height: 100%;

  .task-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 8px;
    cursor: pointer;
    background: var(--el-fill-color-light);

    .task-num {
      margin-left: 10px;
      font-size: 32px;
    }
  }

  :deep(.el-statistic__head) {
    font-size: 16px;
  }

  :deep(.el-statistic__content) {
    font-size: 22px;
  }

  :deep(.el-tag--dark) {
    padding: 2px !important;
  }
}
</style>
