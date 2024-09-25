<template>
  <el-col v-bind="$attrs" class="col-cc">
    <slot />
  </el-col>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.col-cc {
  position: relative;
  display: flex;
  flex: 1;
  flex-direction: column;
}
</style>
