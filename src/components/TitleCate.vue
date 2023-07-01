<script setup lang="ts">
defineProps({
  name: { type: String, default: "" }
});
</script>

<template>
  <div class="cate-title">{{ name }}</div>
</template>
<style lang="scss" scoped>
.cate-title {
  position: relative;
  padding-left: 10px;
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 700;
  color: var(--el-color-primary);
  border-bottom: 1px solid var(--el-color-primary);

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
