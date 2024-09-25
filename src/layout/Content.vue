<template>
  <div class="flex-col main-content" :style="boxStyle">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { useEleHeight } from "@/hooks";
import { CSSProperties, computed } from "vue";

interface Props {
  direction?: "row" | "column";
}
const props = withDefaults(defineProps<Props>(), { direction: "column" });
const maxHeight = useEleHeight(".app-main > .el-scrollbar", -20);
const boxStyle = computed<CSSProperties>(() => {
  return { minHeight: maxHeight.value + "px", flexDirection: props.direction, overflow: "auto" } as CSSProperties;
});
</script>
