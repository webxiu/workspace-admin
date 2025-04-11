<template>
  <el-upload
    ref="uploadRef"
    v-model:file-list="fileList"
    :on-preview="onPreview"
    :on-remove="onChange.bind(null, 'remove')"
    :on-change="onChange.bind(null, 'change')"
    :on-exceed="handleExceed"
    :limit="limit"
    :drag="drag"
    :accept="accept"
    :showFileList="showFileList"
    :multiple="multiple"
    :listType="listType"
    :disabled="disabled"
    :class="{ 'hx-upload': true, 'img-square': props.listType === 'picture-card' }"
    style="width: 100%"
    v-bind="$attrs"
    :autoUpload="false"
  >
    <slot>
      <HxIcon v-if="isPicture" icon="Plus" class="hx-upload-icon" />
      <el-button v-else type="primary" :icon="UploadFilled" v-bind="props.buttonProps">选择文件</el-button>
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
import { reactive, ref } from "vue";
import type { UploadInstance, UploadProps, UploadFile, UploadFiles, ButtonProps } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { message } from "@/utils/message";
import { uploadFileByUrl } from "@/api/routes";

interface Props extends Partial<UploadProps> {
  disabled?: boolean;
  iconSize?: number;
  listType?: any;
  /** 自动上传文件名字段 */
  fileNameField?: string;
  uploadURL?: string;
  fileSize?: number;
  buttonProps?: Partial<ButtonProps>;
}

const props = withDefaults(defineProps<Props>(), {
  iconSize: 140,
  showFileList: true,
  fileNameField: "fileName",
  listType: "text"
});

const previewUrl = ref("");
const dialogShow = ref(false);
const uploadRef = ref<UploadInstance>();
const fileList = ref(props.fileList || []);
const _iconSize = (props.iconSize || 140) + "px";
const isPicture = props.listType !== "text";
const tempNames = reactive<Record<string, any>>({});
const tempUploadFiles = ref<UploadFiles>([]);

const emits = defineEmits<{
  (e: "update:modelValue", value: UploadFiles): void;
  (e: "update:fileList", value: UploadFiles): void;
  /** 在多选情况下, files:当前文件，uploadFiles:所有文件  */
  (e: "change", files: UploadFile, uploadFiles: UploadFiles): void;
}>();

// 选择文件与删除文件,执行的钩子函数
const onChange = (type, uploadFile, uploadFiles) => {
  if (tempUploadFiles.value.length < uploadFiles.length) {
    tempUploadFiles.value = uploadFiles;
  }
  // 文件校验
  const { errorList } = uploadFiles.reduce(
    (acc, cur) => {
      const file = cur.raw || {};
      const _fileSize = props.fileSize || 0;
      const ext = file.name?.split(".")?.pop();
      const size = 1024 * 1024 * (_fileSize || 0);
      if (_fileSize && file.size > size) {
        acc.errorList.push(`上传文件不能超过${_fileSize}M`);
      }
      if (ext && !(props.accept as string).includes(`.${ext}`)) {
        acc.errorList.push("文件格式不正确");
      }
      return acc;
    },
    { errorList: [] }
  );
  const errorMsg = errorList.find((item) => item);
  if (errorMsg) {
    uploadRef.value.handleRemove(uploadFile);
    return message.error(errorMsg);
  }
  if (props.autoUpload && type === "change" && isPicture) {
    onUploadFile(uploadFile.raw).then((data) => {
      tempNames[uploadFile.uid] = data;
      const _uploadFiles = tempUploadFiles.value.map((f) => ({ ...f, [props.fileNameField]: tempNames[f.uid] }));
      onUpdateFile(uploadFile, _uploadFiles);
    });
  } else {
    onUpdateFile(uploadFile, uploadFiles);
  }
};

// 更新文件
function onUpdateFile(uploadFile, uploadFiles) {
  fileList.value = uploadFiles;
  emits("update:modelValue", uploadFiles);
  emits("update:fileList", uploadFiles);
  emits("change", uploadFile, uploadFiles);
}

// 预览图片
const onPreview: UploadProps["onPreview"] = (uploadFile) => {
  if (!isPicture) return;
  previewUrl.value = uploadFile.url!;
  dialogShow.value = true;
};

/** 当超出限制时，执行的钩子函数 */
const handleExceed: UploadProps["onExceed"] = (uploadFile, uploadFiles) => {
  message.warning("最多只能上传" + props.limit + "个文件");
};

// 上传文件
function onUploadFile(file: File) {
  return new Promise<string>((resolve) => {
    if (!uploadRef.value) return resolve("");
    const fd = new FormData();
    fd.append("file", file);
    uploadFileByUrl(props.uploadURL, fd)
      .then(({ data }) => resolve(data))
      .catch((err) => resolve(""));
  });
}
</script>

<style lang="scss" scoped>
.hx-upload {
  :deep(.el-upload) {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
  }
  :deep(.el-upload:hover) {
    border-color: var(--el-color-primary);
  }
  :deep(.el-icon.hx-upload-icon) {
    font-size: 28px;
    color: #8c939d;
    width: v-bind(_iconSize);
    height: v-bind(_iconSize);
    min-width: v-bind(_iconSize);
    text-align: center;
    border: 1px dashed var(--el-border-color);
  }

  &.img-square {
    :deep(.el-upload-list__item),
    :deep(.el-upload--picture-card) {
      width: v-bind(_iconSize);
      height: v-bind(_iconSize);
    }
  }
}
</style>
