<template>
  <div class="flex-1 message" id="typing-msg" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import Typed from "typed.js";

const props = defineProps<{ message: string }>();
const emits = defineEmits(["finish"]);
const typed = ref();

onMounted(() => onType());
onUnmounted(() => typed.value?.destroy());

function onType() {
  typed.value = new Typed("#typing-msg", {
    strings: [props.message],
    typeSpeed: 20, // 打印速度
    startDelay: 300, // 开始之前的延迟300毫秒
    loop: false, // 是否循环
    smartBackspace: true, // 开启智能退格 默认false
    backSpeed: 50, //后退速度
    backDelay: 500, //后退延迟
    fadeOut: true, //淡出效果
    fadeOutClass: "typed-fade-out", //fadeOutClass 用于淡入淡出动画的css类
    fadeOutDelay: 500, //以毫秒为单位淡出延迟
    showCursor: false,
    onComplete: (self) => emits("finish", self)
  });
}
</script>
