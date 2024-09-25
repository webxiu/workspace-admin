<script setup lang="ts">
withDefaults(defineProps<{ name?: string; border?: boolean }>(), {
  name: "",
  border: true
});
</script>

<template>
  <div class="cate-title" :class="border ? 'border' : ''">
    <span>{{ name }}</span>
    <slot />
  </div>
</template>
<style lang="scss" scoped>
.cate-title {
  position: relative;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-left: 10px;
  font-size: 16px;
  font-weight: 700;
  color: var(--el-color-primary);
  white-space: nowrap;
  border: none;

  &.border {
    border-bottom: 1px solid var(--el-color-primary);
  }

  &::before {
    position: absolute;
    top: 10%;
    left: 0;
    display: block;
    width: 3px;
    height: 70%;
    content: "";
    background: var(--el-color-primary);
    border-radius: 6px;
  }
}
</style>
