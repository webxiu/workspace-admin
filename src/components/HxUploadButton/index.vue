<template>
  <el-upload
    ref="uploadRef"
    v-model:file-list="fileList"
    :auto-upload="false"
    :on-preview="onPreview"
    :on-remove="onChange"
    :on-change="onChange"
    :on-exceed="handleExceed"
    class="hx-upload"
    style="width: 100%"
    v-bind="$attrs"
  >
    <slot>
      <HxIcon v-if="['picture-card', 'picture'].includes(attrs['list-type'] as string)" icon="Plus" />
      <el-button v-else type="primary" :icon="UploadFilled">选择文件</el-button>
    </slot>
  </el-upload>
  <el-dialog v-model="dialogShow" title="预览">
    <el-image :src="previewUrl" fit="contain" :zoom-rate="1.2" :preview-src-list="[previewUrl]" :hide-on-click-modal="true">
      <template #error>
        <div class="el-image__error">暂无图片</div>
      </template>
    </el-image>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, useAttrs, watch } from "vue";
import type { UploadInstance, UploadProps, UploadFile, UploadFiles } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { message } from "@/utils/message";

// defineProps<Partial<UploadProps>>();

const attrs = useAttrs();
const fileList = ref([]);
const previewUrl = ref("");
const dialogShow = ref(false);
const uploadRef = ref<UploadInstance>();

const emits = defineEmits<{
  (e: "update:modelValue", value: UploadFiles): void;
  /** 在多选情况下, files:当前文件，uploadFiles:所有文件  */
  (e: "change", files: UploadFile, uploadFiles: UploadFiles): void;
}>();

// 选择文件与删除文件,执行的钩子函数
const onChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  fileList.value = uploadFiles;
  emits("update:modelValue", uploadFiles);
  emits("change", uploadFile, uploadFiles);
};

// 预览图片
const onPreview: UploadProps["onPreview"] = (uploadFile) => {
  previewUrl.value = uploadFile.url!;
  dialogShow.value = true;
};

/** 当超出限制时，执行的钩子函数 */
const handleExceed: UploadProps["onExceed"] = (uploadFile, uploadFiles) => {
  message.warning("最多只能上传" + attrs.limit + "个文件");
};
</script>
