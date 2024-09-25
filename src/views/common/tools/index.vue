<template>
  <Container>
    <div class="flex flex-1 ui-ov-h">
      <!-- <div class="infinite-list" style="overflow: auto; height: calc(100vh - 140px)">
        <div v-for="item in toolList" :key="item.value" class="infinite-list-item" @click="onclick(item)">{{ item.name }}</div>
      </div> -->
      <div class="flex-1">
        <!-- <component :is="comp" /> -->
        <DrawBoard />
      </div>
    </div>
  </Container>
</template>

<script setup lang="ts">
import { computed, h, reactive, ref } from "vue";
import DrawBoard from "./DrawBoard/index.vue";
import CropImage from "./CropImage/index.vue";
import { Container } from "@/layout/Layout";

const active = ref("drawBoard");
const toolList = reactive([
  { name: "画图工具", value: "drawBoard", comp: h(DrawBoard) },
  { name: "裁剪工具", value: "cropImage", comp: h(CropImage, { multiple: false, limit: 1, showFileList: false }) }
]);
const comp = computed(() => toolList.find((f) => f.value === active.value).comp);
console.log("comp", comp);

function onclick(item) {
  active.value = item.value;
}
</script>
