<script setup lang="ts">
import { useColorTable } from "./colorTableConfig";

const props = defineProps(["formData", "resultDialog"]);

const { columns, colorList, rowClick, dbClick, loading, getCurRow, onAdd, handleTagSearch, searchOptions, onDel, onSave } = useColorTable(props);

defineExpose({ getCurRow });
</script>

<template>
  <div style="width: 100%">
    <div style="display: flex; justify-content: space-between; margin-bottom: 8px">
      <div>
        <BlendedSearch @tagSearch="handleTagSearch" :searchOptions="searchOptions" placeholder="颜色名称" searchField="goodColor" />
      </div>
      <div>
        <el-button type="primary" plain @click="onAdd">新增</el-button>
        <el-button type="danger" @click="onDel">删除</el-button>
        <el-button type="warning" @click="onSave">保存</el-button>
      </div>
    </div>
    <pure-table
      border
      :loading="loading"
      :height="300"
      row-key="id"
      class="bill-manage"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="colorList"
      :columns="columns"
      highlight-current-row
      @row-click="rowClick"
      @row-dblclick="dbClick"
      :show-overflow-tooltip="true"
    />
  </div>
</template>
