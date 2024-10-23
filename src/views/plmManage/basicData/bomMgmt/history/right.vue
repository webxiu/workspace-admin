<template>
  <div>
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
