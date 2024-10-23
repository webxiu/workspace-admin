<template>
  <div>{{ value }}</div>
</template>

<script setup lang="ts">
import { watch, ref } from "vue";

const props = defineProps<{ number: number }>();
const value = ref("0");

watch(props, initFunc, { immediate: true });

function initFunc({ number }) {
  number = +parseFloat(number).toFixed(0);
  let count = 0;
  const step = number / 30;
  const timer = setInterval(function () {
    count += step;
    if (count >= number) {
      clearInterval(timer);
      count = number;
    }
    const num = parseInt(count).toString();
    const val = num.padStart(number.toString().length, "0");
    value.value = val;
  }, 30);
}
</script>
