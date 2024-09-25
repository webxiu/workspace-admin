<template>
  <div class="cropper-container">
    <div>
      <el-upload class="upload-demo" drag :auto-upload="false" :limit="1" @change="onChange">
        <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
        <div class="el-upload__text">拖拽文件到此处 或<em>点击上传</em></div>
        <template #tip>
          <div class="el-upload__tip">小于500kb的jpg/png文件</div>
        </template>
      </el-upload>
      <el-image
        style="min-width: 100%; height: 200px"
        class="border-line flex justify-center align-center"
        :src="resultUrl"
        :zoom-rate="1.2"
        :max-scale="7"
        :min-scale="0.2"
        :preview-src-list="[resultUrl]"
        :initial-index="4"
        fit="cover"
      >
        <template #error><span class="color-999">暂无图片</span></template>
      </el-image>
    </div>
    <div class="cropper-image">
      <img ref="imageRef" :src="imageUrl" alt="图片加载失败" @load="onLoad" @error="onError" width="300" height="300" />
      <div class="cropper-footer">
        <el-button type="primary" icon="passed" @click="getCroppedImage">确定</el-button>
        <el-button type="warning" icon="close" @click="emits('cancel')" style="margin-left: 20%">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { UploadFilled } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import { onBeforeUnmount, ref } from "vue";

const emits = defineEmits<{
  (e: "cancel"): void;
  (e: "submit", blob: Blob | null): void;
}>();
const imageUrl = ref("");
const resultUrl = ref("");
const cropper = ref<Cropper>();
const imageRef = ref<HTMLImageElement>();

onBeforeUnmount(onError);

function onChange(file) {
  console.log("file", file);

  const reader = new FileReader();
  reader.onload = (e: any) => {
    const arrayBuffer = reader.result as ArrayBuffer;
    const blob = new Blob([arrayBuffer], { type: file.type });
    // showCrop.value = true;
    // fileBlob.value = blob; // 裁剪图片返回Blob, 保持一致使用Blob
    imageUrl.value = URL.createObjectURL(blob);
  };
  reader.readAsArrayBuffer(file.raw);
}

function onLoad() {
  if (imageRef.value) {
    cropper.value = new Cropper(imageRef.value, {
      viewMode: 1,
      zoomable: true,
      scalable: true,
      autoCropArea: 0.5, // 设置自动裁剪区域的大小
      minCropBoxWidth: 100, // 设置裁剪框的最小宽度
      minCropBoxHeight: 100 // 设置裁剪框的最小高度
      // aspectRatio: 1,
      // crop: (event) => console.log(event.detail)
    });
  }
}

function onError() {
  cropper.value?.destroy();
}

const getCroppedImage = () => {
  const cropCanvas = cropper.value?.getCroppedCanvas();
  if (!cropCanvas) return message("图片裁剪失败", { type: "error" });
  cropCanvas?.toBlob((blob) => {
    resultUrl.value = URL.createObjectURL(blob);
    console.log("imageUrl.value", imageUrl.value);
  }, "image/jpeg");
};
</script>

<style lang="scss" scoped>
.cropper-container {
  display: flex;
  .cropper-image {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
    max-width: 600px; /* 设置最大宽度 */
    .cropper-footer {
      position: absolute;
      left: 0;
      bottom: 4%;
      width: 100%;
      display: flex;
      justify-content: center;
    }
  }
}
</style>
