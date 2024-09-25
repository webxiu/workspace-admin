<script setup lang="ts">
import { ref, reactive } from "vue";
import { FormRules } from "element-plus";
import { HandleType } from "./config";

export interface FormDataItem {
  name: string;
}
interface FormProps {
  formInline: Partial<FormDataItem>;
  type: HandleType;
}

const props = withDefaults(defineProps<FormProps>(), {
  formInline: () => ({}),
  type: "add"
});

const ruleFormRef = ref();
const loading = ref<boolean>(false);
const formData = reactive<Partial<FormDataItem>>(props.formInline);

const formRules = reactive<FormRules>({
  name: [{ required: true, message: "文件夹名称为必填项", trigger: "blur" }]
});

function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="formData" :rules="formRules" v-loading="loading" label-width="140px" class="pr-10">
    <el-form-item label="文件夹名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入文件夹名称" clearable />
    </el-form-item>
  </el-form>
</template>
