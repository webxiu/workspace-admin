<template>
  <div class="top-tb">
    <el-table
      class="fileTable"
      :data="tableData"
      style="width: 100%"
      :header-cell-style="{ background: '#fff !important', borderColor: 'black' }"
      :cell-style="{ borderColor: 'black' }"
      :style="{ borderColor: 'black' }"
    >
      <el-table-column label="外观设计图" prop="pictorue" align="left">
        <div v-if="route.query.id">
          <!-- VITE_VIRTUAL_PATH -->
          <el-image
            :key="item.id"
            v-for="item in viewPhotoList"
            style="width: 148px; height: 148px; margin-right: 10px"
            :src="VITE_BASE_API + item.imageUrl"
            fit="cover"
          />
        </div>
        <el-upload
          v-else
          action="#"
          list-type="picture-card"
          :disabled="!!infoId"
          multiple
          :auto-upload="false"
          @change="changeFile"
          v-model:file-list="fileList"
        >
          <el-icon><Plus /></el-icon>
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="加载失败" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <el-icon><zoom-in /></el-icon>
                </span>
                <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove()">
                  <el-icon><Delete /></el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="预览图片" />
        </el-dialog>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" setup>
const tableData = [{ pictorue: [] }];
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import { ref } from "vue";

import { uploadProductsDevApplayImage } from "@/api/plmManage";
import type { UploadFile } from "element-plus";
import { useRoute } from "vue-router";

/** 接收信息中心单据处理引入传递的参数 */
withDefaults(defineProps<{ infoId: string }>(), {
  infoId: () => ""
});

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const disabled = ref(false);
const fileList = ref([]);
const imageNumber = ref(0);
const postFileList = ref([]);
const viewPhotoList = ref([]);
const route = useRoute();
const { VITE_BASE_API } = import.meta.env;

const changeFile = (file) => {
  console.log(file, "file");
  fileList.value.push(file.raw);
  const formData = new FormData();
  formData.append("file", file.raw);
  uploadProductsDevApplayImage(formData).then((res) => {
    if (res.data) {
      postFileList.value.push({ imageNumber: imageNumber.value, imageUrl: res.data });
      imageNumber.value += 1;
    }
  });
};

const handleRemove = () => (fileList.value = []);

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};

const initImages = (imageNameList) => {
  viewPhotoList.value = imageNameList;
};

defineExpose({ postFileList, initImages });
</script>

<style scope lang="scss">
.top-tb {
  :deep(.el-date-editor.el-input, .el-date-editor.el-input__wrapper) {
    width: 60px !important;
  }
}

.fileTable {
  border: 1px solid black;
  border-top: none;
}

.el-upload--picture-card {
  background-color: #fff;
}
</style>
