<template>
  <!-- <div style="display: flex; height: calc(100vh - 180px)"> -->
  <div style="display: flex; min-height: calc(100vh - 180px)">
    <div style="width: 350px"><group type="1" /></div>
    <div style="width: 350px; margin: 0 64px"><group type="2" /></div>
    <div style="width: 350px"><group type="3" /></div>
  </div>
</template>

<script setup lang="ts">
import group from "./group.vue";
</script>

<style scoped></style>
