<template>
  <div>
    <el-upload action="#" :auto-upload="false" :limit="1" @change="changeFile" v-model:file-list="fileList">
      <el-button type="primary" plain>上传excel文件</el-button></el-upload
    >
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const fileList = ref([]);
const fileModel = defineModel({ local: true, default: null });

const changeFile = (file) => {
  fileList.value.push(file);
  fileModel.value = fileList.value[0].raw;
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
