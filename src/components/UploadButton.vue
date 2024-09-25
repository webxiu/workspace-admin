<template>
  <el-upload
    ref="uploadRef"
    :multiple="true"
    :auto-upload="false"
    :show-file-list="true"
    :limit="limit"
    :on-change="onChange"
    :on-exceed="handleExceed"
    v-bind="$attrs"
    :file-list="fileList"
    style="width: 100%"
  >
    <slot name="default">
      <el-button type="primary" :disabled="fileList.length >= limit" :icon="UploadFilled">{{ title }}</el-button>
    </slot>
  </el-upload>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { UploadFiles, UploadInstance, UploadProps, UploadUserFile } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { message } from "@/utils/message";

interface Props {
  modelValue: UploadUserFile[];
  limit?: number;
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  limit: 1,
  title: "选择文件"
});

const emits = defineEmits<{
  (e: "update:modelValue", value: UploadFiles): void;
  (e: "change", files: UploadFiles): void;
}>();
const uploadRef = ref<UploadInstance>();

const fileList = computed(() => {
  if (!props.modelValue) return [];
  if (Array.isArray(props.modelValue)) return props.modelValue;
  return [{ name: props.modelValue as string, raw: {} }] as UploadUserFile[];
});

/** 当超出限制时，执行的钩子函数 */
const handleExceed: UploadProps["onExceed"] = (uploadFile, uploadFiles) => {
  if (props.limit > 1) {
    message("最多只能上传" + props.limit + "个文件", { type: "warning" });
  }
  uploadRef.value?.clearFiles();
  const file = uploadFile[0] as any;
  file.uid = Date.now();
  uploadRef.value!.handleStart(file);
};

// 上传多个执行多次, uploadFiles依次累加
const onChange: UploadProps["onChange"] = (uploadFile, uploadFiles) => {
  emits("update:modelValue", uploadFiles);
  emits("change", uploadFiles);
};
</script>
