<template>
  <el-row v-bind="$attrs" class="row-rr" :style="{ flexDirection: direction, ...style }">
    <slot />
  </el-row>
</template>

<script setup lang="ts">
import { CSSProperties } from "vue";
interface Props {
  direction: "row" | "column";
  style?: CSSProperties;
}

withDefaults(defineProps<Partial<Props>>(), {
  direction: "row",
  style: () => ({})
});
</script>

<style lang="scss" scoped>
.row-rr {
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
  width: 100%;
}
</style>
