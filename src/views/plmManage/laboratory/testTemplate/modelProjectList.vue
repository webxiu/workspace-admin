<script setup lang="ts">
import { useModalTableProject } from "./modalTableConfig";
const modelProjectList = defineModel({ local: true, default: [] });

const { columns, dataList, rowClick, onAdd, onDel, rowClassName } = useModalTableProject(modelProjectList);
</script>

<template>
  <div style="width: 100%">
    <div style="margin-bottom: 10px">
      <el-button type="primary" plain size="small" @click="onAdd">新增</el-button>
      <el-button type="danger" size="small" @click="onDel">删除</el-button>
    </div>
    <pure-table
      border
      :height="300"
      row-key="projectName"
      class="modal_table"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns"
      highlight-current-row
      :row-class-name="rowClassName"
      @row-click="rowClick"
      :show-overflow-tooltip="true"
    />
  </div>
</template>
