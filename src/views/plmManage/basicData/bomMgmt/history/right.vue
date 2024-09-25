<template>
  <div>
    <!-- <el-table :data="dataList" size="small" v-loading="loading">
      <el-table-column type="index" label="顺序" width="60" />
      <el-table-column prop="number" label="子项物料编号" width="120" />
      <el-table-column prop="name" label="子项物料名称" width="120" />
      <el-table-column prop="specification" label="子项物料规格" width="350" />
      <el-table-column prop="model" label="子项物料模号" width="150" />
      <el-table-column prop="erpClsName" label="子项物料属性" width="120" />
      <el-table-column prop="numerator" label="分子" />
      <el-table-column prop="denominator" label="分母" />
      <el-table-column prop="scraprate" label="变动损耗率" width="120" />
      <el-table-column prop="itemUnitName" label="子项单位" />
      <el-table-column prop="remark" label="备注" />
      <el-table-column prop="ecnbillNo" label="子项ECN编号" width="120" />
      <el-table-column prop="dosageTypeName" label="用量类型" />
      <el-table-column prop="issueTypeName" label="发料方式" />
      <el-table-column prop="baseUnitName" label="基本单位" />
      <el-table-column prop="childBomName" label="子项BOM名称" width="120" />
    </el-table> -->
    <pure-table
      border
      :height="maxHeight - 220"
      :loading="loading"
      row-key="id"
      class="bill-manage"
      :adaptive="true"
      align-whole="left"
      size="small"
      :data="dataList"
      :columns="columns2"
      show-overflow-tooltip
      highlight-current-row
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useHistoryConfig } from "./hook";

const { columns2, maxHeight, setHeight } = useHistoryConfig();

const loading = ref(false);
const dataList = ref([]);

defineExpose({ loading, setHeight, dataList });
</script>
