<template>
  <div class="control-list">
    <div class="no-wrap">
      <el-button type="primary" :icon="RefreshLeft" @click="onControl('revoke')">撤销</el-button>
      <el-button type="success" :icon="RefreshRight" @click="onControl('recover')"> 恢复</el-button>
      <el-button type="warning" :icon="Delete" @click="onControl('clear')">清空</el-button>
      <el-button type="danger" :icon="Camera" @click="onControl('image')"> 截图 </el-button>
      <el-tooltip class="box-item" effect="light" placement="top">
        <template #content>
          <div style="width: 200px; height: 40px">
            <el-slider v-model="formData.brushSize" />
          </div>
        </template>
        <el-button :type="option.brushStatus ? 'success' : 'info'" :icon="Brush" @click="onControl('eraser')">擦除</el-button>
      </el-tooltip>
    </div>
    <el-form class="mt-20">
      <el-form-item label="画笔颜色">
        <el-color-picker v-model="formData.lineStyle" show-alpha :predefine="predefineColors" />
      </el-form-item>
      <el-form-item label="背景颜色">
        <el-color-picker v-model="formData.fillStyle" show-alpha :predefine="predefineColors" />
      </el-form-item>
      <el-form-item label="画笔大小">
        <el-input-number v-model="formData.lineWidth" placeholder="请输入" controls-position="right" :min="1" :max="6" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { predefineColors } from "@/config/constant";
import { RefreshLeft, RefreshRight, Delete, Camera, Brush } from "@element-plus/icons-vue";

export type ControlType = "revoke" | "recover" | "clear" | "image" | "eraser";
export type Props = {
  defaultValue: {
    lineWidth: number;
    lineStyle: string;
    fillStyle: string;
    brushSize: number;
  };
  option: Record<string, any>;
};

const props = defineProps<Props>();
const emits = defineEmits(["select", "change"]);
const formData = reactive({ ...props.defaultValue });
watch(formData, () => emits("change", formData), { immediate: true });

function onControl(type: ControlType) {
  emits("select", type);
}
</script>
