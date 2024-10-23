<template>
  <div v-if="showTitle" :style="{ ...style, textAlign: showBg ? 'center' : 'left' }" :class="['bg-title', showBg ? 'bg-title_img' : '']">
    {{ title }}
  </div>
</template>

<script setup lang="ts">
import { CSSProperties } from "vue";

interface Props {
  /** 显示标题 */
  showTitle?: boolean;
  /** 显示背景图 */
  showBg?: boolean;
  /** 标题 */
  title?: string;
  /** 位置 */
  style?: CSSProperties;
}

withDefaults(defineProps<Props>(), {
  showTitle: true,
  showBg: true,
  title: "标题",
  style: () => ({ textAlign: "center" })
});
</script>

<style scoped lang="scss">
.bg-title {
  position: absolute;
  top: 2px;
  width: 100%;
  height: 26px;
  padding: 0 10px;
  font-size: 16px;
  line-height: 26px;
  text-align: center;
}

.bg-title_img {
  background-image: url("@/assets/dataScreen/title01.png");
  background-repeat: no-repeat;
  background-position: center -2px;
  background-size: 75% 100%;
}
</style>
