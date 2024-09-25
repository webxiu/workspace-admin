<template>
  <div class="data-screen-box">
    <slot name="header" />
    <div class="data-content" :style="{ flexDirection: direction }">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  direction: "row" | "column";
}

withDefaults(defineProps<Partial<Props>>(), { direction: "column" });
</script>

<style scoped>
.data-screen-box {
  position: relative;
  top: 50%;
  left: 50%;
  display: flex;
  flex: auto;
  flex-direction: column;
  min-width: 1920px;
  min-height: 919px;
  padding: 15px 0 15px 15px;
  overflow: hidden;
  translate: -50% -50%;
}

.data-content {
  z-index: 12;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
}
</style>
