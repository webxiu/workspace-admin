<template>
  <Container>
    <div class="flex flex-1 ui-ov-h" ref="signRef">
      <div id="signature" class="flex-1" />
      <div class="p-10">
        <ControlPanel @select="onSelect" @change="onChange" :defaultValue="defaultValue" />
        <el-image
          style="min-width: 100%; height: 200px"
          class="border-line flex justify-center align-center"
          :src="imgSrc"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="[imgSrc]"
          :initial-index="4"
          fit="cover"
        >
          <template #error><span class="color-999">暂无图片</span></template>
        </el-image>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { DrawBoard } from "./draw";
import { Container } from "@/layout/Layout";
import { nextTick, onMounted, ref } from "vue";
import ControlPanel, { ControlType } from "./ControlPanel.vue";

const signInstance = ref<DrawBoard>();
const signRef = ref<HTMLElement>();
const imgSrc = ref<string>("");

const defaultValue = {
  lineWidth: 3,
  lineStyle: "#000000",
  fillStyle: "#ffffff"
};

onMounted(() => {
  nextTick(createSign);
});

// 创建签名画布
function createSign() {
  if (signRef.value) {
    const { width, height } = signRef.value.getBoundingClientRect();
    const { lineWidth, lineStyle, fillStyle } = defaultValue;
    signInstance.value = new DrawBoard("#signature", {
      width: width,
      height: height - 100,
      lineWidth,
      lineStyle,
      fillStyle,
      lineCap: "round"
    });
  }
}

// 操作选项
function onSelect(type: ControlType) {
  const operateObj = {
    revoke: () => signInstance.value?.onRestore("revoke"),
    recover: () => signInstance.value?.onRestore("recover"),
    clear: () => signInstance.value?.onClear(),
    image: () => {
      // const history = instance?.getHistory();
      imgSrc.value = signInstance.value?.onExport();
    }
  };
  operateObj[type]();
}

// 修改配置
function onChange(values) {
  signInstance.value?.updateOption(values);
  signInstance.value?.onRestore();
}
</script>

<style lang="scss" scoped>
#signature {
  width: 100%;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
</style>
