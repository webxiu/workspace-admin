<template>
  <div class="flex-1 sop-images">
    <div class="flex flex-1 align-center mb-20 pr-10 sort-item" v-for="(item, index) in dataList" :key="item.id">
      <div class="sop-index">{{ index + 1 }}</div>
      <el-form-item :prop="'imgList.' + index + '.file'" :rules="[{ required: true, message: '请上传图片', trigger: 'blur' }]">
        <el-upload
          v-model:file-list="item.file"
          :auto-upload="false"
          :accept="accept"
          :disabled="disabled"
          :action="'#'"
          :limit="1"
          :on-change="(uploadFile) => handleChange('upload', item, uploadFile)"
          :on-preview="onPreview"
          list-type="picture-card"
          class="upload-sop-step"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
      </el-form-item>
      <el-form-item
        class="flex-1 mr-15 ml-15"
        :prop="'imgList.' + index + '.description'"
        :rules="{ required: true, message: '请输入图片描述', trigger: 'blur' }"
      >
        <el-input
          type="textarea"
          v-model="item.description"
          resize="none"
          :rows="3"
          placeholder="请输入图片描述"
          :disabled="disabled"
          @change="(value) => handleChange('input', item, value)"
          clearable
          style="min-width: 120px"
        />
      </el-form-item>
      <el-form-item>
        <div class="no-wrap">
          <el-button type="default" class="move-handle" size="small" :disabled="disabled" :icon="Rank">排序</el-button>
          <el-button @click.prevent="removeAction(item)" type="danger" :disabled="disabled" size="small">删除</el-button>
        </div>
      </el-form-item>
    </div>
    <el-form-item>
      <el-button @click="addAction" :icon="Plus" type="primary" :disabled="disabled" class="ml-20">新增图片</el-button>
    </el-form-item>
    <el-dialog v-model="visible" title="图片预览">
      <div class="ui-w-100 ui-ta-c">
        <el-image :src="previewUrl" :initial-index="1" :preview-src-list="[previewUrl]" fit="contain" class="border-line p-10" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { message } from "@/utils/message";
import { moveEleSort } from "@/utils/table";
import type { UploadUserFile } from "element-plus";
import { Plus, Rank } from "@element-plus/icons-vue";
import { v4 as uuidv4 } from "uuid";
import { ImgEvent } from "../utils/hook";

interface Props {
  accept?: string;
  disabled?: boolean;
  modelValue: DomainItem[];
}

export interface DomainItem {
  description: string;
  filePath?: string;
  tempPath?: string;
  multipartFile?: File;
  id: string;
  sort: number;
  workStationId: string;
  isNew?: boolean;
  file: Array<UploadUserFile>;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  accept: ".jpg,.png,.jpeg,.bmp,.gif"
});

const previewUrl = ref("");
const visible = ref(false);
const emits = defineEmits(["update:modelValue", "handleImg"]);
const dataList = ref<DomainItem[]>(props.modelValue || []);

onMounted(() => {
  moveEleSort<DomainItem>({
    dataList,
    selector: ".sop-images",
    handle: ".move-handle",
    callback(data) {
      dataList.value.forEach((item, index) => (item.sort = index + 1));
      emits("handleImg", ImgEvent.sort, { data, imageList: dataList.value });
    }
  });
});

watch(props, (val) => {
  dataList.value = val.modelValue || [];
});

function addAction() {
  if (dataList.value.length >= 6) return message("最多添加6张图片, 数量超出请合并成6张", { type: "error" });
  const nItem = { isNew: true, id: uuidv4(), description: "", workStationId: "", sort: 0, file: [] };
  emits("handleImg", ImgEvent.add, { data: nItem });
}

function removeAction(item: DomainItem) {
  emits("handleImg", ImgEvent.delete, { data: item });
}

function handleChange(type: "upload" | "input", item: DomainItem, value) {
  dataList.value.forEach((f) => {
    if (f.id === item.id) {
      if (type === "upload") f.file = [value];
      else f.description = value.trim();
    }
  });
  emits("handleImg", ImgEvent.upload, { imageList: dataList.value });
}

function onPreview(uploadFile) {
  previewUrl.value = uploadFile.url!;
  visible.value = true;
}
</script>
<style lang="scss">
.sop-images {
  .sop-index {
    width: 20px;
    height: 20px;
    line-height: 20px;
    border-radius: 50%;
    text-align: center;
    margin-right: 10px;
    color: #fff;
    background: #173e5b80;
  }
  .upload-sop-step {
    min-width: 140px;
    height: 73px;
  }

  .upload-sop-step .el-upload--picture-card,
  .upload-sop-step .el-upload-list__item {
    width: 140px;
    height: 73px;
    margin: 0;
    transition: none !important;
  }

  .el-upload-list--picture-card > :nth-child(2) {
    display: none;
  }
}
</style>
