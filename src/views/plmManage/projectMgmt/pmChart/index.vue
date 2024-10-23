<script setup lang="tsx">
import { useConfig } from "./utils/hook";
import DataScreen from "./DataScreen/index";
import Header from "./DataScreen/component/Header2.vue";

defineOptions({ name: "PlmManageProjectMgmtPmChartIndex" });

const { loading, gridConfig, onRefresh } = useConfig();
</script>

<template>
  <div style="background-color: transparent">
    <DataScreen :loading="loading" :gridConfig="gridConfig" @refresh="onRefresh">
      <template #header>
        <Header @refresh="onRefresh" />
      </template>
    </DataScreen>
  </div>
</template>
