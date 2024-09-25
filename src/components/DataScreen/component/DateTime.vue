<template>
  <div style="color: #ccc" class="no-wrap">
    <span style="width: 168px" class="ui-d-ib">{{ dateTime }}</span>
    <span>星期{{ week }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { dayjs } from "element-plus";

const timer = ref();
const weeks = ["日", "一", "二", "三", "四", "五", "六"];
const dateTime = ref(dayjs().format("YYYY年MM月DD日 HH:mm:ss"));
const week = ref(weeks[dayjs().day()]);

onMounted(() => genTime());
onUnmounted(() => clearInterval(timer.value));

function genTime() {
  timer.value = setInterval(() => {
    week.value = weeks[dayjs().day()];
    dateTime.value = dayjs().format("YYYY年MM月DD日 HH:mm:ss");
  }, 1000);
}
</script>
