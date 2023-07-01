<!-- /*
 * @Author: lixiuhai 
 * @Date: 2023-06-29 16:50:34 
 * @Last Modified by:   lixiuhai 
 * @Last Modified time: 2023-06-29 16:50:34 
 */ -->
<script setup lang="ts">
import { ref } from "vue";
import { formRules } from "./utils/config";
import { FormProps } from "./utils/types";
import TitleCate from "@/components/TitleCate.vue";
import { ElMessage } from "element-plus";
import type { UploadProps } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({}),
  formConfigs: () => []
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);
const formConfigs = ref(props.formConfigs);
const baseApi = import.meta.env.VITE_BASE_API;

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  if (!["image/jpeg", "image/png", "image/bmp", "image/gif"].includes(rawFile.type)) {
    ElMessage.error("Logo必须为JPG、PNG、BMP或GIF格式!");
    return false;
  }

  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Logo图片大小不能超过2MB！");
    return false;
  }
  return true;
};
function handleAvatarSuccess(response) {
  newFormInline.value.logo = response.data;
}

function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="formRules" label-width="180px" label-suffix=":">
    <el-row :gutter="20">
      <template :key="item.prop" v-for="item in formConfigs">
        <el-col :span="item.span">
          <TitleCate v-if="item.hide" :name="item.label" />
          <el-form-item v-else :label="item.label" :prop="item.prop">
            <el-upload
              v-if="item.prop === 'logo'"
              class="avatar-uploader"
              accept=".jpg,.png,.jpeg,.bmp,.gif"
              :action="`${baseApi}/config/common/uploadfile`"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="newFormInline[item.prop]" :src="`${baseApi}/config/common/down?resource=${newFormInline.logo}`" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>

            <el-select v-else-if="item.options" v-model="newFormInline[item.prop]" :disabled="item.disabled" placeholder="请选择" :style="{ width: '100%', minWidth: '100px' }">
              <el-option v-for="cell in item.options" :key="cell.value" :label="cell.label" :value="cell.value" />
            </el-select>
            <el-input v-else v-model="newFormInline[item.prop]" :disabled="item.disabled" clearable placeholder="请输入" :style="{ width: '100%', minWidth: '100px' }" />
          </el-form-item>
        </el-col>
      </template>
    </el-row>
  </el-form>
</template>

<style lang="scss" scoped>
$size: 100px;

.avatar-uploader .avatar {
  display: block;
  min-width: $size;
  min-height: $size;
}

:deep(.avatar-uploader .el-upload) {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed #9e9e9e;
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: #927e7e;
}

.el-icon.avatar-uploader-icon {
  width: $size;
  height: $size;
  font-size: 28px;
  color: #8c939d;
  text-align: center;
}
</style>
