<template>
  <Border class="tab-chart" :className="className" :title="props.title.value">
    <SwitchButton :buttonsConfig="buttonsConfig" @change="onChange" :active="active1" class="btn-right" />
  </Border>
</template>

<script setup lang="ts">
import { Ref, onMounted, onUnmounted, ref } from "vue";
import { Border, SwitchButton, ButtonOptionType } from "./index";
import { mouseInOut } from "./utils";

interface Props {
  title: Ref<string>;
  /** 图表挂载节点 */
  className: string;
  /** 默认选中 */
  active: string;
  /** 切换按钮 */
  buttonsConfig: ButtonOptionType[];
}

const props = defineProps<Props>();

const timer = ref();
const timerFlag = ref(false);
const active1 = ref(props.active);
const emits = defineEmits(["change"]);
const onChange = (v: string) => {
  active1.value = v;
  emits("change", v);
};

onMounted(() => {
  const list = props.buttonsConfig.map((m) => m.value);
  let i = 0;
  timer.value = setInterval(() => {
    if (timerFlag.value) return;
    i++;
    const v = list[i % list.length];
    active1.value = v;
    onChange(list[i % list.length]);
  }, 5000);
  // 鼠标进入禁止切换
  mouseInOut(`.${props.className}`, (bool) => (timerFlag.value = bool));
});

onUnmounted(() => {
  clearInterval(timer.value);
});
</script>

<style scoped lang="scss">
.tab-chart {
  display: flex;
  flex: 1;
  height: 100%;

  .btn-right {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 8;
    flex: 1;
  }
}
</style>
