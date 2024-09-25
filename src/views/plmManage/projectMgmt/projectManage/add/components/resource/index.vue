<script setup lang="ts">
import { ref } from "vue";
import { columns, columns2 } from "./config";

const loading = ref(false);
const loading2 = ref(false);
const maxHeight = ref("58vh");

const dataList = ref([
  { taskRole: "项目工程师", taskUser: "" },
  { taskRole: "结构工程师", taskUser: "" },
  { taskRole: "电子工程师", taskUser: "" },
  { taskRole: "测试工程师", taskUser: "" }
]);
const dataList2 = ref([
  { taskRelateRole: "测试工程师", taskRelateUser: "" },
  { taskRelateRole: "电子工程师", taskRelateUser: "" },
  { taskRelateRole: "结构工程师", taskRelateUser: "" }
]);

const setHeight = (val) => {
  // console.log(val["0"], "collapse");
  if (!val["0"]) {
    maxHeight.value = "74.5vh";
  } else {
    maxHeight.value = "58vh";
  }
};

defineExpose({ setHeight, dataList, loading });
</script>

<template>
  <div class="two-table">
    <div class="left-table">
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="left"
        :loading="loading"
        size="small"
        :data="dataList"
        :columns="columns"
        highlight-current-row
        :show-overflow-tooltip="true"
      />
    </div>
    <div class="center-space" />
    <div class="right-table">
      <pure-table
        border
        :height="maxHeight"
        :max-height="maxHeight"
        row-key="id"
        :adaptive="true"
        align-whole="left"
        :loading="loading2"
        size="small"
        :data="dataList2"
        :columns="columns2"
        highlight-current-row
        :show-overflow-tooltip="true"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.two-table {
  display: flex;
  justify-content: space-between;

  .left-table,
  .right-table {
    flex: 0.45;
  }

  .center-space {
    flex: 0.1;
  }
}
</style>
