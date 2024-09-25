<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-20 10:42:47 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-20 10:42:47 
 */ -->

<script setup lang="ts">
import { ref } from "vue";
import DealPhase from "./dealPhase.vue";
import BillDeal from "./billDeal.vue";
import FlowGraph from "./flowGraph.vue";

const activeName = ref("first");
</script>
<template>
  <div class="ui-h-100 flex flex-1 main main-content">
    <el-tabs v-model="activeName" class="tabs-fill_content">
      <el-tab-pane label="单据处理" name="first"><BillDeal v-bind="$attrs" /></el-tab-pane>
      <el-tab-pane label="已处理环节" name="second"><DealPhase v-bind="$attrs" /></el-tab-pane>
      <el-tab-pane label="查看流程图" name="third"><FlowGraph v-bind="$attrs" /></el-tab-pane>
    </el-tabs>
  </div>
</template>
