<!-- /*
 * @Author: Hailen 
 * @Date: 2023-07-05 11:45:27 
 * @Last Modified by:   Hailen 
 * @Last Modified time: 2023-07-05 11:45:27 
 */ -->

<script setup lang="tsx">
import { useConfig } from "./utils/hook";
import DataScreen from "@/components/DataScreen/index";
import Header from "@/components/DataScreen/component/Header2.vue";

defineOptions({ name: "BusinessCenterDataScreenApprovalMonitorIndex" });

const { loading, gridConfig, active, onRefresh, onChangeSystem } = useConfig();
</script>

<template>
  <DataScreen :loading="loading" :gridConfig="gridConfig" @refresh="onRefresh">
    <template #header>
      <Header :active="active" @refresh="onRefresh" @change="onChangeSystem" />
    </template>
  </DataScreen>
</template>
