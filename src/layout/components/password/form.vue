<script setup lang="ts">
import { ref, reactive } from "vue";
import { PasswordType } from "@/api/user";
import type { FormRules } from "element-plus";

/** 表单规则校验(注释的为不做校验) */
const formRules = reactive<FormRules>({
  oldPassword: [{ required: true, message: "请填写旧密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请填写新密码", trigger: "blur" }]
});

const props = withDefaults(defineProps<{ formInline: Partial<PasswordType> }>(), {
  formInline: () => ({})
});

const ruleFormRef = ref();
const newFormInline = ref(props.formInline);

function getRef() {
  return ruleFormRef.value;
}
defineExpose({ getRef });
</script>

<template>
  <el-form ref="ruleFormRef" :model="newFormInline" :rules="formRules" label-width="100px" label-suffix=":">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="newFormInline.oldPassword" show-password placeholder="请输入旧密码" />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="newFormInline.newPassword" show-password placeholder="请输入旧密码" />
    </el-form-item>
  </el-form>
</template>
