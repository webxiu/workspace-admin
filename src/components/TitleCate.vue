<script setup lang="ts">
export interface TitleCateProps {
  name?: string;
  border?: boolean;
}
withDefaults(defineProps<TitleCateProps>(), {
  name: "",
  border: true
});
</script>

<template>
  <div class="cate-title" :class="border ? 'border' : ''">
    <span class="name">{{ name }}</span>
    <div>
      <slot />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.cate-title {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-left: 10px;
  font-size: 16px;
  font-weight: 700;
  color: var(--el-color-primary);
  white-space: nowrap;
  border: none;
  padding-bottom: 2px;
  .name {
    line-height: normal;
  }
  &.border {
    border-bottom: 1px solid var(--el-color-primary);
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    display: block;
    width: 3px;
    height: 16px;
    background: var(--el-color-primary);
    border-radius: 6px;
    transform: translateY(-55%);
  }
}
</style>
