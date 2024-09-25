<template>
  <Border class="number-title" :style="style" v-bind="$attrs" :className="''">
    <Counter :key="random" :number="dataInfo.number || 0" :style="{ color: dataInfo.color }" class="number" />
    <div class="title">{{ dataInfo.title }}</div>
  </Border>
</template>

<script setup lang="ts">
import { watch, Ref, ref, CSSProperties } from "vue";
import Counter from "./Counter.vue";
import Border from "./Border.vue";

export interface NumTitleType {
  color?: string;
  number: number;
  title: string;
}

const props = defineProps<{ data: Ref<NumTitleType>; style?: CSSProperties }>();
const dataInfo = ref<Partial<NumTitleType>>({});
const random = ref(0);

watch(props, setNumber, { immediate: true });

function setNumber({ data }) {
  random.value = Math.random();
  dataInfo.value = data.value;
}
</script>

<style scoped lang="scss">
.number-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;

  .number {
    font-family: digitFont, Arial, sans-serif;
    font-size: 64px;
    font-weight: 700;
  }

  .title {
    font-size: 14px;
  }
}
</style>
