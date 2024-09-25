<template>
  <el-image
    :src="src"
    fit="contain"
    :zoom-rate="1.2"
    :preview-src-list="srcList"
    :hide-on-click-modal="true"
    :initial-index="initialIindex"
    :style="{ width: '100%', height: '500px' }"
  >
    <template #error>
      <div class="el-image__error" style="font-size: 22px">暂无图片</div>
    </template>
  </el-image>
</template>

<script setup lang="ts">
import { StaffInfoPhotoVOSItemType } from "@/api/oaManage/humanResources";
import { computed } from "vue";
const props = withDefaults(defineProps<{ src: string; initialIindex?: number; photoList: StaffInfoPhotoVOSItemType[] }>(), {
  src: () => "",
  initialIindex: () => 0,
  photoList: () => []
});

const srcList = computed(() => props.photoList.map((item) => item.resourceUrl));
</script>
