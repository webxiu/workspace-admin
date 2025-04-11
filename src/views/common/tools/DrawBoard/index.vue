<template>
  <Container :offset="4">
    <div class="flex flex-1 ui-h-100" ref="signRef">
      <div class="draw-area">
        <div id="signature" />
      </div>
      <div class="draw-tool">
        <ControlPanel @select="onSelect" @change="onChange" :defaultValue="defaultValue" :option="option" />
        <title-cate :name="`截图(${imgList.length})`" />
        <div class="flex-1 ui-ovy-a">
          <div v-for="(item, index) in imgList" :key="item.id" class="img-item">
            <div class="item-header">
              <span>{{ index + 1 }}</span>
              <span style="line-height: 1em">
                <HxIcon @click="onEdit(item)" class="opt-icon mr-4" icon="Edit" />
                <HxIcon @click="onDownloadImg(item)" class="opt-icon mr-4" icon="Download" />
                <HxIcon @click="onDelete(item)" class="opt-icon" icon="CircleClose" />
              </span>
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
import { nextTick, onMounted, onUnmounted, ref, reactive } from "vue";
import ControlPanel, { ControlType } from "./ControlPanel.vue";
import { v4 as uuidv4 } from "uuid";
import { onDownload, base64ToBlob } from "@/utils/common";

const signInstance = ref<DrawBoard>();
const signRef = ref<HTMLElement>();
const imgList = ref<any[]>([]);
const option = reactive({ brushStatus: false });

const defaultValue = {
  lineWidth: 3,
  lineStyle: "#000000",
  fillStyle: "#ffffff",
  brushSize: 10
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
  nextTick(createSign);
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
});

// 创建签名画布
function createSign() {
  signInstance.value = new DrawBoard("#signature");
}

function handleResize() {
  signInstance.value.resize();
}

// 操作选项
function onSelect(type: ControlType) {
  const operateObj = {
    revoke: () => signInstance.value?.onRestore("revoke"),
    recover: () => signInstance.value?.onRestore("recover"),
    clear: () => signInstance.value?.onClear(),
    eraser: () => (option.brushStatus = signInstance.value?.onEraser()),
    image: () => {
      const { imgData: img, ...reset } = signInstance.value?.onExport();
      if (img) imgList.value.unshift({ img: img, id: uuidv4(), ...reset });
    }
  };
  operateObj[type]();
}

// 修改配置
function onChange(values) {
  signInstance.value?.updateOption(values);
  signInstance.value?.onRestore();
}

// 查看
function onEdit(item) {
  signInstance.value?.onRestore("edit", item);
}

// 下载
function onDownloadImg(item) {
  const blob = base64ToBlob(item.img, item.mime);
  onDownload(blob, "截图.png");
}

// 删除
function onDelete(item) {
  imgList.value = imgList.value.filter((f) => f.id !== item.id);
}
</script>

<style lang="scss" scoped>
.draw-area {
  flex: 1;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  border: 1px solid #ccc;

  #signature {
    position: absolute;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
}
.draw-tool {
  padding: 10px;
  display: flex;
  flex-direction: column;
  .img-item {
    position: relative;
    margin-right: 8px;

    .item-header {
      position: absolute;
      top: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 2px 6px;
      color: #393e65;
      background: #8ea7d780;
      cursor: pointer;

      .opt-icon {
        color: #2bff3d;

        &:hover {
          color: #409efc;
        }
      }
    }
  }
}
</style>
