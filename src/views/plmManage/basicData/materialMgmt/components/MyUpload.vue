<template>
  <div>
    <el-upload
      action="#"
      :class="fileList.length ? 'has-upload-length' : ''"
      list-type="picture-card"
      :auto-upload="false"
      :limit="1"
      @change="changeFile"
      v-model:file-list="fileList"
      :disabled="uploadDisabled"
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
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { Delete, Plus, ZoomIn } from "@element-plus/icons-vue";
import { ElMessageBox, type UploadFile } from "element-plus";
import { useRoute } from "vue-router";
import { deleteMaterialPicture } from "@/api/plmManage";
import { message } from "@/utils/message";

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const disabled = ref(false);
const fileList = ref([]);
const fileModel = defineModel();
const route = useRoute();

const props = defineProps(["formData", "uploadDisabled"]);
const { VITE_BASE_API } = import.meta.env;

watchEffect(() => {
  if (props.formData.imageUrl) {
    fileList.value = [{ name: props.formData.imageName, url: VITE_BASE_API + props.formData.imageUrl }];
  }
});

const changeFile = (file) => {
  fileList.value = [{ name: file.name, url: file.url }];
  fileModel.value = file.raw;
};

const handleRemove = () => {
  console.log(route.query, "route");
  if (route.query.id && route.query.type === "edit") {
    ElMessageBox.confirm(`确认要删除该图片吗?`, "系统提示", {
      type: "warning",
      draggable: true,
      cancelButtonText: "取消",
      confirmButtonText: "确定",
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        deleteMaterialPicture({ id: route.query.id })
          .then((res) => {
            if (res.data) {
              message(`删除成功`, { type: "success" });
              fileList.value = [];
            }
          })
          .catch(console.log);
      })
      .catch(() => {});
  } else {
    fileList.value = [];
  }
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};
</script>

<style scoped>
.avatar-uploader .avatar {
  display: block;
  width: 178px;
  height: 178px;
}
</style>

<style>
.avatar-uploader .el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  width: 100px;
  height: 100px;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
