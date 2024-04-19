<template>
  <el-col v-bind="$attrs" class="col-cc">
    <slot />
  </el-col>
</template>

<script setup lang="ts">
// import type { ColProps } from "element-plus";
// const props = defineProps<Partial<ColProps>>();
</script>

<style lang="scss" scoped>
.col-cc {
  flex-direction: column;
  flex: 1;
  display: flex;
}
</style>
