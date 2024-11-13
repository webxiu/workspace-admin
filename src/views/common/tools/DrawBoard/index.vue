<template>
  <Container :height="'100%'" :offset="0">
    <div class="flex flex-1 ui-ov-h" ref="signRef">
      <div id="signature" class="flex-1" />
      <div class="p-10 flex-col ui-ov-h">
        <ControlPanel @select="onSelect" @change="onChange" :defaultValue="defaultValue" />
        <title-cate :name="`截图(${imgList.length})`" />
        <div class="flex-1 ui-ovy-a">
          <div v-for="(item, index) in imgList" :key="item.id" class="img-item">
            <div class="item-header">
              <span>{{ index + 1 }}</span>
              <el-icon @click="onDelete(item)" class="close">
                <CircleClose />
              </el-icon>
            </div>
            <el-image
              style="min-width: 100%; height: 200px; margin-top: 10px"
              class="border-line flex justify-center align-center no-select"
              :src="item.img"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-src-list="[item.img]"
              :initial-index="4"
              fit="cover"
            >
              <template #error><span class="color-999">暂无图片</span></template>
            </el-image>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { DrawBoard } from "./draw";
import { Container } from "@/layout/Layout";
import { nextTick, onMounted, ref } from "vue";
import { CircleClose } from "@element-plus/icons-vue";
import ControlPanel, { ControlType } from "./ControlPanel.vue";
import { v4 as uuidv4 } from "uuid";

const signInstance = ref<DrawBoard>();
const signRef = ref<HTMLElement>();
const imgList = ref<any[]>([]);

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
      height: height,
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
      const img = signInstance.value?.onExport();
      img && imgList.value.push({ img: img, id: uuidv4() });
    }
  };
  operateObj[type]();
}

// 修改配置
function onChange(values) {
  signInstance.value?.updateOption(values);
  signInstance.value?.onRestore();
}
// 删除
function onDelete(item) {
  imgList.value = imgList.value.filter((f) => f.id !== item.id);
}
</script>

<style lang="scss" scoped>
#signature {
  width: 100%;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
.img-item {
  position: relative;
  margin-right: 8px;
  .item-header {
    width: 100%;
    padding: 0 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    color: #777;
    top: 0px;
    cursor: pointer;
    z-index: 2;
    .close {
      color: #4775a3;
      &:hover {
        color: #409efc;
      }
    }
  }
}
</style>
