<template>
  <div class="list-page">
    <el-collapse v-model="activeNames" @change="handleChange">
      <el-collapse-item name="1" :icon="CaretRight">
        <div class="content-area">
          <list-table type="3" />
        </div>

        <template #title>
          <div class="title-slot">
            <div class="icon">
              <el-icon v-if="!activeNames.includes('1')"><CaretRight /></el-icon>
              <el-icon v-if="activeNames.includes('1')"><CaretBottom /></el-icon>
            </div>
            <div class="txt">
              <div class="status-btn">
                <el-button color="#299764" type="primary" size="small" :icon="CircleCheckFilled"><span>完成任务</span></el-button>
              </div>
              <div class="count">1</div>
            </div>
          </div>
        </template>
      </el-collapse-item>
      <el-collapse-item name="2" :icon="CaretRight">
        <div class="content-area">
          <list-table type="2" />
        </div>

        <template #title>
          <div class="title-slot">
            <div class="icon">
              <el-icon v-if="!activeNames.includes('2')"><CaretRight /></el-icon>
              <el-icon v-if="activeNames.includes('2')"><CaretBottom /></el-icon>
            </div>
            <div class="txt">
              <div class="status-btn">
                <el-button color="#0880ea" type="primary" size="small" :icon="Opportunity"><span>进行任务</span></el-button>
              </div>
              <div class="count">1</div>
            </div>
          </div>
        </template>
      </el-collapse-item>
      <el-collapse-item name="3" :icon="CaretRight">
        <div class="content-area">
          <list-table type="1" />
        </div>

        <template #title>
          <div class="title-slot">
            <div class="icon">
              <el-icon v-if="!activeNames.includes('3')"><CaretRight /></el-icon>
              <el-icon v-if="activeNames.includes('3')"><CaretBottom /></el-icon>
            </div>
            <div class="txt">
              <div class="status-btn">
                <el-button color="#ddd" type="primary" size="small" :icon="Opportunity"><span>待办任务</span></el-button>
              </div>
              <div class="count">1</div>
            </div>
          </div>
        </template>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup lang="ts">
import { CaretRight, CaretBottom, CircleCheckFilled, Opportunity } from "@element-plus/icons-vue";
import { ref } from "vue";
import listTable from "./listTable.vue";

const activeNames = ref(["1", "2", "3"]);
const handleChange = (val: string[]) => {
  activeNames.value = val;
};
</script>

<style scoped lang="scss">
.list-page {
  height: calc(100vh - 180px);
  :deep(.el-collapse-item__arrow) {
    display: none;
  }
  :deep(.el-collapse) {
    --el-collapse-border-color: #fff;
  }

  .content-area {
    padding-left: 25px;
  }

  .title-slot {
    font-size: 16px;
    display: flex;
    align-items: center;
  }

  .icon {
    font-size: 16px;
    display: flex;
    align-items: center;

    color: #8d8d8d;
  }

  .txt {
    display: flex;
    font-size: 12px;
    align-items: center;
    color: #8d8d8d;
    .count {
      margin-left: 14px;
    }

    .status-btn {
      :deep(.el-button--small) {
        border-radius: 6px;
      }
    }
  }
}
</style>
