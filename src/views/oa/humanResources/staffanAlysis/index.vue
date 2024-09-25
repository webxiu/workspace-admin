<script setup lang="ts">
import { useConfig } from "./utils/hooks";

defineOptions({ name: "OaHumanResourcesStaffanAlysis" });

const { loading, chartRef1, chartRef2, chartRef3, chartRef4, chartRef5, chartRef6, chartRef7 } = useConfig();
</script>

<template>
  <div class="flex-1 main main-content welcome" v-loading="loading">
    <el-row :gutter="20">
      <el-col class="mb-5" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card class="box-card">
          <template #header>
            <span class="flex align-center">性别</span>
          </template>
          <div ref="chartRef1" style="height: 320px" />
        </el-card>
      </el-col>
      <el-col class="mb-5" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card class="box-card">
          <template #header>
            <span class="flex align-center">婚姻状态</span>
          </template>
          <div ref="chartRef2" style="height: 320px" />
        </el-card>
      </el-col>
      <el-col class="mb-5" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card class="box-card">
          <template #header>
            <span class="flex align-center">学历</span>
          </template>
          <div ref="chartRef3" style="height: 320px" />
        </el-card>
      </el-col>
      <el-col class="mb-5" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card class="box-card">
          <template #header>
            <span class="flex align-center">年龄</span>
          </template>
          <div ref="chartRef4" style="height: 320px" />
        </el-card>
      </el-col>
      <el-col class="mb-5" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card class="box-card">
          <template #header>
            <span class="flex align-center">民族</span>
          </template>
          <div ref="chartRef5" style="height: 320px" />
        </el-card>
      </el-col>
      <el-col class="mb-5" :xs="24" :sm="24" :md="12" :lg="8" :xl="8">
        <el-card class="box-card">
          <template #header>
            <span class="flex align-center">工龄</span>
          </template>
          <div ref="chartRef6" style="height: 320px" />
        </el-card>
      </el-col>
      <el-col class="mb-5" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-card class="box-card">
          <template #header>
            <span class="flex align-center">户口</span>
          </template>
          <div ref="chartRef7" style="height: 320px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<style lang="scss" scoped>
.box-card {
  height: 100%;
}
</style>
