<template>
  <div class="pm-workspace flex ui-h-100">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane name="Board">
        <template #default>
          <div><board /></div>
        </template>
        <template #label>
          <div style="display: flex; align-items: center">
            <el-icon style="margin-right: 4px"><Menu /></el-icon>看板
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane name="List">
        <template #default>
          <div><listGroup /></div>
        </template>
        <template #label>
          <div style="display: flex; align-items: center">
            <el-icon style="margin-right: 4px"><List /></el-icon>列表
          </div>
        </template>
      </el-tab-pane>
      <el-tab-pane name="Table"
        ><template #default>
          <div><tableTab /></div>
        </template>
        <template #label>
          <div style="display: flex; align-items: center">
            <el-icon style="margin-right: 4px"><Document /></el-icon>表格
          </div>
        </template></el-tab-pane
      >
      <el-tab-pane name="Calendar">
        <template #default>
          <div style="flex: 1"><calendarTab /></div>
        </template>
        <template #label>
          <div style="display: flex; align-items: center">
            <el-icon style="margin-right: 4px"><Calendar /></el-icon>日历
          </div>
        </template>
      </el-tab-pane>
      <!-- <el-tab-pane label="Gantt" name="Gantt"
        ><template #default>
          <div><ganttTab /></div>
        </template>
        <template #label>
          <div style="display: flex; align-items: center">
            <el-icon style="margin-right: 4px"><Operation /></el-icon>甘特图
          </div>
        </template></el-tab-pane
      > -->
    </el-tabs>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import { Menu, List, Document, Calendar, Operation } from "@element-plus/icons-vue";
import board from "./components/board.vue";
import listGroup from "./components/listGroup.vue";
import tableTab from "./components/tableTab.vue";
import calendarTab from "./components/calendarTab.vue";
import ganttTab from "./components/ganttTab.vue";

const activeName = ref("Board");
defineOptions({ name: "PlmManageProjectMgmtPmWorkbenchIndex" });

const handleClick = (tab) => {
  console.log(tab, "tab==");
};
</script>

<style scoped></style>
